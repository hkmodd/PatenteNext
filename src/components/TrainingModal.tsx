import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Brain, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';
import { useAppStore } from '../store/useAppStore';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCategory: (category: string) => void;
  onStartWeaknesses: () => void;
  weaknessCount: number;
}

export function TrainingModal({ isOpen, onClose, onStartCategory, onStartWeaknesses, weaknessCount }: TrainingModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const theoryManifest = useAppStore((state) => state.theoryManifest);
  const chaptersList = theoryManifest?.chapters || [];
  const categories = chaptersList.map((c: any) => c.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-surface border border-surface-border shadow-2xl z-50 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-surface-border bg-surface/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 text-accent">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider">
                    Training Mirato
                  </h2>
                  <p className="text-xs font-mono text-secondary">
                    Configura la sessione di allenamento
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none shrink-0">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
              
              {/* Weaknesses Section */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-primary flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent" />
                  Ripasso Errori (Leitner System)
                </h3>
                <div className="p-4 border border-surface-border bg-background/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-secondary font-sans">
                      Genera una scheda utilizzando unicamente le domande che hai sbagliato in passato.
                    </p>
                    <p className="text-xs font-mono text-accent">
                      Domande nel pool errori: {weaknessCount}
                    </p>
                  </div>
                  <Button 
                    onClick={onStartWeaknesses} 
                    disabled={weaknessCount === 0}
                    className="shrink-0 w-full sm:w-auto"
                  >
                    Avvia Ripasso
                  </Button>
                </div>
                {weaknessCount === 0 && (
                  <p className="text-xs text-emerald-500 font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Nessun errore registrato. Ottimo lavoro!
                  </p>
                )}
              </div>

              {/* Category Focus Section */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-primary flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Focus Categoria
                </h3>
                <p className="text-sm text-secondary font-sans">
                  Seleziona un argomento specifico per generare una scheda tematica di 20 domande.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chaptersList.map((chapter: any) => {
                    const isSelected = selectedCategory === chapter.id;
                    return (
                      <button
                        key={chapter.id}
                        onClick={() => setSelectedCategory(chapter.id)}
                        className={`text-left p-3 border transition-colors flex flex-col gap-1 ${
                          isSelected 
                            ? 'border-accent bg-accent/10' 
                            : 'border-surface-border bg-background/50 hover:border-accent/50'
                        }`}
                      >
                        <span className={`font-display font-bold text-sm ${isSelected ? 'text-accent' : 'text-primary'}`}>
                          {chapter.title}
                        </span>
                        <span className="text-[10px] font-mono text-secondary uppercase">
                          Difficoltà: {chapter.difficulty}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={() => selectedCategory && onStartCategory(selectedCategory)}
                    disabled={!selectedCategory}
                    className="w-full sm:w-auto"
                  >
                    Avvia Focus Categoria
                  </Button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
