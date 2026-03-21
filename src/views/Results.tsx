import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, Home, AlertTriangle, Flame, BookOpen, Brain, Cpu, Zap } from 'lucide-react';
import { TheoryModal } from '../components/TheoryModal';
import { matrixRules, wordAssociations } from '../data/matrix';

export function Results({ onHome }: { onHome: () => void }) {
  const { history, currentExam, currentStreak, weaknesses } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedMatrix, setExpandedMatrix] = useState<string | null>(null);
  
  if (history.length === 0 || !currentExam) return null;

  const lastSession = history[0];
  const errors = lastSession.total - lastSession.score;

  const getMatrixAnalysis = (text: string) => {
    const lowerText = text.toLowerCase();
    const matchedRules = matrixRules.filter(rule => lowerText.includes(rule.keyword.toLowerCase()));
    const matchedAssoc = wordAssociations.filter(assoc => 
      assoc.words.some(w => lowerText.includes(w.toLowerCase()))
    );
    return { matchedRules, matchedAssoc };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-grid-pattern pb-safe"
    >
      {/* Top Bar */}
      <header className="border-b border-surface-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-50 pt-safe">
        <div className="font-mono text-xs sm:text-sm text-secondary font-bold uppercase tracking-widest">
          ANALISI // <span className="text-primary">RISULTATI</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onHome} className="gap-2 font-mono text-xs sm:text-sm" aria-label="Torna alla Home">
          <Home className="w-4 h-4" />
          HOME
        </Button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-8 sm:space-y-12">
        {/* Hero Result */}
        <div className={`border-2 p-6 sm:p-12 flex flex-col items-center text-center gap-4 sm:gap-6 relative overflow-hidden bg-surface/80 backdrop-blur-sm ${lastSession.passed ? 'border-success' : 'border-danger'}`}>
          <div className={`absolute inset-0 opacity-5 ${lastSession.passed ? 'bg-success' : 'bg-danger'}`} />
          
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="z-10"
          >
            {lastSession.passed ? (
              <CheckCircle2 className="w-16 h-16 sm:w-24 sm:h-24 text-success" />
            ) : (
              <XCircle className="w-16 h-16 sm:w-24 sm:h-24 text-danger" />
            )}
          </motion.div>
          
          <h1 className={`text-fluid-hero font-display font-bold uppercase tracking-tighter z-10 glitch ${lastSession.passed ? 'text-success' : 'text-danger'}`} data-text={lastSession.passed ? 'IDONEO' : 'RESPINTO'}>
            {lastSession.passed ? 'IDONEO' : 'RESPINTO'}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10 mt-2">
            <p className="text-base sm:text-xl font-mono text-secondary uppercase tracking-widest">
              ERRORI: <span className={`font-bold ${errors > 0 ? 'text-danger' : 'text-success'}`}>{errors}</span> / {lastSession.total}
            </p>
            
            <div className={`flex items-center gap-2 px-4 py-2 border ${lastSession.passed ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'} font-mono font-bold uppercase tracking-widest text-sm sm:text-base`}>
              <Flame className="w-5 h-5" />
              {lastSession.passed ? `STREAK: ${currentStreak}` : 'STREAK RESET'}
            </div>
          </div>
        </div>

        {/* Error Breakdown */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-widest border-b border-surface-border pb-3 sm:pb-4 text-primary">
            Rapporto Anomalie
          </h2>
          
          {errors === 0 ? (
            <div className="p-8 sm:p-12 border border-surface-border bg-surface/50 backdrop-blur-sm text-center font-mono text-sm sm:text-base text-secondary uppercase tracking-widest">
              Nessuna anomalia rilevata. Esecuzione perfetta.
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {currentExam.map((q, idx) => {
                const userAnswer = lastSession.answers[q.id];
                const isCorrect = userAnswer === q.answer;
                
                if (isCorrect) return null;

                const { matchedRules, matchedAssoc } = getMatrixAnalysis(q.text);
                const hasMatrixHints = matchedRules.length > 0 || matchedAssoc.length > 0;
                const isMatrixExpanded = expandedMatrix === q.id;
                
                return (
                  <div key={q.id} className="border border-danger/30 bg-surface/80 backdrop-blur-sm p-4 sm:p-8 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-danger" />
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-mono text-[10px] sm:text-xs text-danger font-bold uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                            Errore // Domanda {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div className="flex items-center gap-2">
                            {weaknesses[q.id] > 0 && (
                              <div className="font-mono text-[10px] sm:text-xs text-accent font-bold uppercase tracking-widest flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-sm">
                                <Brain className="w-3 h-3" />
                                Livello Debolezza: {weaknesses[q.id]}
                              </div>
                            )}
                            {hasMatrixHints && (
                              <button
                                onClick={() => setExpandedMatrix(isMatrixExpanded ? null : q.id)}
                                className={`font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1 px-2 py-1 rounded-sm transition-colors ${isMatrixExpanded ? 'bg-accent/20 text-accent border border-accent/50' : 'bg-accent/5 text-accent/70 border border-accent/20 hover:bg-accent/10 hover:text-accent'}`}
                              >
                                <Cpu className="w-3 h-3" />
                                Matrix Analysis
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-lg sm:text-xl font-sans font-medium leading-snug text-primary">{q.text}</p>
                        
                        <AnimatePresence>
                          {isMatrixExpanded && hasMatrixHints && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 sm:p-4 border border-accent/20 bg-accent/5 space-y-3 mt-2">
                                {matchedRules.map(rule => (
                                  <div key={rule.id} className="flex items-start gap-3">
                                    <div className={`shrink-0 px-2 py-1 text-[10px] font-mono font-bold border ${rule.probabilityTrue > 50 ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'}`}>
                                      {rule.probabilityTrue}% VERO
                                    </div>
                                    <div>
                                      <span className="font-bold text-primary text-sm">"{rule.keyword}"</span>
                                      <p className="text-xs text-secondary mt-0.5">{rule.explanation}</p>
                                    </div>
                                  </div>
                                ))}
                                {matchedAssoc.map((assoc, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                    <div className="shrink-0 px-2 py-1 text-[10px] font-mono font-bold border bg-accent/10 text-accent border-accent/30 flex items-center gap-1">
                                      <Zap className="w-3 h-3" /> ASSOCIAZIONE
                                    </div>
                                    <div>
                                      <span className="font-bold text-primary text-sm">{assoc.words.join(', ')}</span>
                                      <p className="text-xs text-secondary mt-0.5">→ {assoc.association}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 sm:pt-4 font-mono text-xs sm:text-sm">
                          <div className="flex flex-col">
                            <span className="text-secondary mb-1">Tua risposta</span>
                            <span className="text-danger font-bold text-base sm:text-lg">
                              {userAnswer === undefined ? 'NON DATA' : (userAnswer ? 'VERO' : 'FALSO')}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-secondary mb-1">Risposta corretta</span>
                            <span className="text-success font-bold text-base sm:text-lg">{q.answer ? 'VERO' : 'FALSO'}</span>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
                          {q.explanation && (
                            <div className="flex-1 p-3 sm:p-4 border border-surface-border bg-background/50 font-sans text-sm text-secondary leading-relaxed">
                              <span className="text-accent font-mono font-bold block mb-1 sm:mb-2 uppercase tracking-wider text-xs">Spiegazione</span>
                              {q.explanation}
                            </div>
                          )}
                          <Button 
                            variant="secondary" 
                            className="shrink-0 gap-2 h-auto py-3 sm:py-4"
                            onClick={() => setSelectedCategory(q.category)}
                          >
                            <BookOpen className="w-4 h-4 text-accent" />
                            STUDIA TEORIA
                          </Button>
                        </div>
                      </div>

                      {q.imageUrl && (
                        <div className="w-full sm:w-48 aspect-square bg-white flex items-center justify-center p-2 border-2 border-surface-border shrink-0 mt-4 sm:mt-0">
                          <img src={`${q.imageUrl}?v=2`} alt="Segnale" className="max-w-full max-h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <TheoryModal 
        isOpen={selectedCategory !== null} 
        onClose={() => setSelectedCategory(null)} 
        categoryId={selectedCategory} 
      />
    </motion.div>
  );
}
