import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, ChevronLeft, Brain, ShieldAlert, Target, Zap, AlertTriangle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { theoryManual, DifficultyLevel } from '../data/theory';
import { quizDatabase } from '../data/questions';
import { Button } from './ui/Button';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
}

const DifficultyBadge = ({ level }: { level: DifficultyLevel }) => {
  const colors = {
    EASY: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    HARD: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    CRITICAL: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border rounded-sm ${colors[level]}`}>
      {level}
    </span>
  );
};

export function TheoryModal({ isOpen, onClose, categoryId: initialCategoryId }: TheoryModalProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(initialCategoryId);

  // Reset state when modal opens/closes or initial category changes
  useEffect(() => {
    setActiveCategoryId(initialCategoryId);
  }, [isOpen, initialCategoryId]);

  const chapter = activeCategoryId ? theoryManual[activeCategoryId] : null;
  const chaptersList = Object.values(theoryManual);

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-surface border border-surface-border shadow-2xl z-50 h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-surface-border bg-surface/50 shrink-0">
              <div className="flex items-center gap-3">
                {activeCategoryId && !initialCategoryId ? (
                  <Button variant="ghost" size="icon" onClick={() => setActiveCategoryId(null)} className="mr-2">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                ) : (
                  <div className="p-2 bg-accent/10 text-accent">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider">
                    {chapter ? chapter.title : 'Manuale di Teoria'}
                  </h2>
                  <p className="text-xs font-mono text-secondary">
                    {chapter ? `CAPITOLO: ${activeCategoryId}` : 'Indice Generale'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none shrink-0">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
              {chapter ? (
                <div className="space-y-8">
                  <div className="p-4 bg-accent/5 border border-accent/20 text-primary/90 text-sm sm:text-base leading-relaxed font-sans flex flex-col gap-3">
                    <p>{chapter.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <DifficultyBadge level={chapter.difficulty} />
                      {chapter.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-mono text-secondary bg-surface border border-surface-border rounded-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-12">
                    {chapter.sections.map((section, idx) => (
                      <div key={idx} className="space-y-5">
                        <h3 className="font-display font-bold text-accent text-lg sm:text-xl flex items-center gap-3 border-b border-surface-border pb-2">
                          <span className="w-2 h-2 bg-accent inline-block rounded-full" />
                          {section.subtitle}
                        </h3>
                        
                        <div className="space-y-3 text-secondary font-sans text-sm sm:text-base leading-relaxed">
                          {section.paragraphs.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}
                        </div>

                        {section.alerts && section.alerts.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {section.alerts.map((alert, aIdx) => (
                              <div key={aIdx} className="p-4 border-l-4 border-danger bg-danger/10 text-danger-foreground font-mono text-sm flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="leading-relaxed">{alert}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.mnemonics && section.mnemonics.length > 0 && (
                          <div className="mt-4 p-4 border border-accent/30 bg-accent/5 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-accent font-display font-bold text-sm uppercase tracking-wider">
                              <Brain className="w-4 h-4" />
                              <h3>Regole Mnemoniche (Hack)</h3>
                            </div>
                            <ul className="space-y-2">
                              {section.mnemonics.map((mnem, mIdx) => (
                                <li key={mIdx} className="text-sm font-sans text-primary/90 flex items-start gap-2">
                                  <Zap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                  <span>{mnem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.trickQuestions && section.trickQuestions.length > 0 && (
                          <div className="mt-6 border border-surface-border bg-surface/30 rounded-lg overflow-hidden">
                            <div className="bg-surface border-b border-surface-border p-3 flex items-center gap-2">
                              <Target className="w-4 h-4 text-danger" />
                              <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
                                Trabocchetti Ministeriali
                              </h3>
                            </div>
                            <div className="divide-y divide-surface-border">
                              {section.trickQuestions.map((trick, tIdx) => (
                                <div key={tIdx} className="p-4 space-y-3">
                                  <p className="text-sm font-medium text-primary leading-relaxed">
                                    "{trick.question}"
                                  </p>
                                  <div className="flex items-start gap-3 text-xs sm:text-sm">
                                    <div className={`flex items-center gap-1 font-bold shrink-0 mt-0.5 ${trick.isTrue ? 'text-emerald-500' : 'text-danger'}`}>
                                      {trick.isTrue ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                      {trick.isTrue ? 'VERO' : 'FALSO'}
                                    </div>
                                    <p className="text-secondary font-sans leading-relaxed">
                                      {trick.explanation}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.relatedQuizIds && section.relatedQuizIds.length > 0 && (
                          <div className="mt-6 border border-accent/20 bg-accent/5 rounded-lg overflow-hidden">
                            <div className="bg-accent/10 border-b border-accent/20 p-3 flex items-center gap-2">
                              <HelpCircle className="w-4 h-4 text-accent" />
                              <h3 className="font-display font-bold text-sm text-accent uppercase tracking-wider">
                                Quiz Correlati
                              </h3>
                            </div>
                            <div className="divide-y divide-accent/10">
                              {section.relatedQuizIds.map(quizId => {
                                const quiz = quizDatabase.find(q => q.id === quizId);
                                if (!quiz) return null;
                                return (
                                  <div key={quizId} className="p-4 space-y-2">
                                    <p className="text-sm font-medium text-primary leading-relaxed">
                                      {quiz.text}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-secondary">Risposta:</span>
                                      <span className={`font-bold ${quiz.answer ? 'text-emerald-500' : 'text-danger'}`}>
                                        {quiz.answer ? 'VERO' : 'FALSO'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 p-4 border border-surface-border bg-background/50 text-xs font-mono text-secondary flex items-start gap-2">
                    <div className="text-accent mt-0.5">INFO:</div>
                    <p>
                      Questo estratto fa parte del manuale di teoria ufficiale aggiornato alle normative vigenti. 
                      L'architettura del sistema è predisposta per il caricamento dinamico (headless CMS) dell'intero volume ministeriale.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {chaptersList.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setActiveCategoryId(ch.id)}
                      className="text-left p-4 border border-surface-border bg-background/50 hover:bg-surface hover:border-accent/50 transition-colors group flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-bold text-primary group-hover:text-accent transition-colors">
                          {ch.title}
                        </h4>
                        <DifficultyBadge level={ch.difficulty} />
                      </div>
                      <p className="text-xs font-sans text-secondary line-clamp-2">
                        {ch.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto pt-2">
                        {ch.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] font-mono text-secondary/70 uppercase">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-surface-border bg-surface/50 flex justify-end shrink-0">
              <Button onClick={onClose} variant="outline">Chiudi Manuale</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
