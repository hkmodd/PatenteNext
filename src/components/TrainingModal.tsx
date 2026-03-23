import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Brain, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from './ui/Button';
import { useAppStore } from '../store/useAppStore';
import { quizDatabase } from '../data/questions';

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
  const history = useAppStore((state) => state.history);
  const chaptersList = theoryManifest?.chapters || [];

  // Compute per-category accuracy from exam history
  const categoryAccuracy = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    const recentHistory = history.slice(0, 50);

    recentHistory.forEach(session => {
      const examQuestions = session.exam || quizDatabase;
      Object.entries(session.answers).forEach(([qId, userAnswer]) => {
        const question = examQuestions.find(q => q.id === qId);
        if (question) {
          const cat = question.category;
          if (!stats[cat]) stats[cat] = { total: 0, correct: 0 };
          stats[cat].total += 1;
          if (userAnswer === question.answer) {
            stats[cat].correct += 1;
          }
        }
      });
    });

    return stats;
  }, [history]);

  const getAccuracyColor = (pct: number) => {
    if (pct >= 85) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getAccuracyTextColor = (pct: number) => {
    if (pct >= 85) return 'text-emerald-500';
    if (pct >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getAccuracyIcon = (pct: number) => {
    if (pct >= 85) return <TrendingUp className="w-3 h-3" />;
    if (pct >= 60) return <Minus className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  };

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
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-accent">
                        Domande nel pool errori: {weaknessCount}
                      </p>
                      {weaknessCount > 10 && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded-sm uppercase">
                          Critico
                        </span>
                      )}
                      {weaknessCount > 0 && weaknessCount <= 10 && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-sm uppercase">
                          Da rivedere
                        </span>
                      )}
                    </div>
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
                    const stats = categoryAccuracy[chapter.id];
                    const accuracy = stats ? Math.round((stats.correct / stats.total) * 100) : -1;
                    const hasData = accuracy >= 0;

                    return (
                      <button
                        key={chapter.id}
                        onClick={() => setSelectedCategory(chapter.id)}
                        className={`text-left p-3 border transition-colors flex flex-col gap-2 ${
                          isSelected 
                            ? 'border-accent bg-accent/10' 
                            : 'border-surface-border bg-background/50 hover:border-accent/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-display font-bold text-sm ${isSelected ? 'text-accent' : 'text-primary'}`}>
                            {chapter.title}
                          </span>
                          {hasData && (
                            <span className={`flex items-center gap-1 text-[10px] font-mono font-bold shrink-0 ${getAccuracyTextColor(accuracy)}`}>
                              {getAccuracyIcon(accuracy)}
                              {accuracy}%
                            </span>
                          )}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${hasData ? getAccuracyColor(accuracy) : 'bg-surface-border'}`}
                            style={{ width: hasData ? `${accuracy}%` : '0%' }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-secondary uppercase">
                            Difficoltà: {chapter.difficulty}
                          </span>
                          {hasData && (
                            <span className="text-[9px] font-mono text-secondary">
                              {stats!.total} risposte
                            </span>
                          )}
                          {!hasData && (
                            <span className="text-[9px] font-mono text-secondary/50 italic">
                              Nessun dato
                            </span>
                          )}
                        </div>
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
