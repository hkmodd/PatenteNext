import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { matrixRules, wordAssociations } from '../data/matrix';

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MatrixModal({ isOpen, onClose }: MatrixModalProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'associations'>('rules');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-surface border-2 border-accent shadow-[0_0_50px_rgba(255,79,0,0.15)] z-50 h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-surface-border bg-surface/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 text-accent border border-accent/50 shadow-[0_0_15px_rgba(255,79,0,0.4)]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-widest text-primary glitch" data-text="THE MATRIX">
                    THE <span className="text-accent">MATRIX</span>
                  </h2>
                  <p className="text-xs font-mono text-secondary uppercase tracking-widest">
                    Algoritmi di decodifica esame
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none shrink-0 hover:bg-danger/20 hover:text-danger">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-border bg-surface/50 shrink-0">
              <button
                onClick={() => setActiveTab('rules')}
                className={`flex-1 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'rules' ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-secondary hover:text-primary'}`}
              >
                Analisi Statistica Parole
              </button>
              <button
                onClick={() => setActiveTab('associations')}
                className={`flex-1 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'associations' ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-secondary hover:text-primary'}`}
              >
                Associazioni Neurali
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar bg-background/50">
              {activeTab === 'rules' && (
                <div className="space-y-6">
                  <div className="p-4 border border-accent/30 bg-accent/5 text-sm font-mono text-primary/90 leading-relaxed">
                    <span className="text-accent font-bold mr-2">{'>'}</span>
                    Il database ministeriale segue pattern linguistici precisi. Conoscere la probabilità statistica di verità associata a determinate parole chiave permette di "indovinare" la risposta corretta anche in caso di dubbio.
                  </div>

                  <div className="grid gap-4">
                    {matrixRules.map(rule => (
                      <div key={rule.id} className="border border-surface-border bg-surface/80 p-4 sm:p-6 relative overflow-hidden group hover:border-accent/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-bold text-6xl pointer-events-none">
                          {rule.probabilityTrue}%
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <h3 className="font-display font-bold text-xl text-primary uppercase tracking-wider">
                                "{rule.keyword}"
                              </h3>
                              <div className={`px-2 py-1 text-xs font-mono font-bold border ${rule.probabilityTrue > 50 ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'}`}>
                                {rule.probabilityTrue > 50 ? 'SPESSO VERO' : 'QUASI SEMPRE FALSO'}
                              </div>
                            </div>
                            
                            <p className="text-sm font-sans text-secondary leading-relaxed">
                              {rule.explanation}
                            </p>

                            <div className="space-y-2 mt-4">
                              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Esempi dal Database:</div>
                              {rule.examples.map((ex, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 border border-surface-border bg-background/50 text-sm">
                                  <div className="mt-0.5 shrink-0">
                                    {ex.isTrue ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}
                                  </div>
                                  <div className="font-sans text-primary/90">
                                    {ex.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="shrink-0 w-full sm:w-32 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-surface-border pt-4 sm:pt-0 sm:pl-6">
                            <div className="text-xs font-mono text-secondary uppercase tracking-widest mb-1">Probabilità</div>
                            <div className={`text-4xl font-display font-bold ${rule.probabilityTrue > 50 ? 'text-success' : 'text-danger'}`}>
                              {rule.probabilityTrue}%
                            </div>
                            <div className="text-[10px] font-mono text-secondary mt-1">di essere VERO</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'associations' && (
                <div className="space-y-6">
                  <div className="p-4 border border-accent/30 bg-accent/5 text-sm font-mono text-primary/90 leading-relaxed">
                    <span className="text-accent font-bold mr-2">{'>'}</span>
                    Associazioni dirette per bypassare il ragionamento complesso. Memorizza questi collegamenti per risposte istantanee.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wordAssociations.map((assoc, idx) => (
                      <div key={idx} className="border border-surface-border bg-surface/80 p-4 sm:p-5 flex flex-col gap-3 hover:border-accent/50 transition-colors">
                        <div className="flex items-center gap-2 text-accent">
                          <Zap className="w-4 h-4" />
                          <span className="font-mono text-xs uppercase tracking-widest font-bold">Trigger</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {assoc.words.map(w => (
                            <span key={w} className="px-2 py-1 bg-background border border-surface-border text-primary font-sans text-sm font-medium">
                              {w}
                            </span>
                          ))}
                        </div>
                        
                        <div className="mt-2 pt-3 border-t border-surface-border">
                          <div className="flex items-center gap-2 text-success mb-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-mono text-xs uppercase tracking-widest font-bold">Associazione Corretta</span>
                          </div>
                          <div className="font-display font-bold text-lg text-primary">
                            {assoc.association}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
