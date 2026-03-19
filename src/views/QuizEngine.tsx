import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Check, Cpu, Zap } from 'lucide-react';
import { matrixRules, wordAssociations } from '../data/matrix';

export function QuizEngine({ onFinish }: { onFinish: () => void }) {
  const { currentExam, currentAnswers, answerQuestion, finishExam, examStartTime } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes for Patente B

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMatrixHint, setShowMatrixHint] = useState(false);

  useEffect(() => {
    if (!examStartTime) return;
    
    let timer: NodeJS.Timeout;
    const calculateTimeLeft = () => {
      const elapsedSeconds = Math.floor((Date.now() - examStartTime) / 1000);
      const remaining = Math.max(0, (20 * 60) - elapsedSeconds);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        handleFinish(true);
      }
    };

    calculateTimeLeft(); // Initial calculation
    timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [examStartTime]);

  if (!currentExam || currentExam.length === 0) return null;

  const question = currentExam[currentIndex];
  const currentAnswer = currentAnswers[question.id];

  const handleAnswer = (val: boolean) => {
    answerQuestion(question.id, val);
    // Auto-advance to the next unanswered question, or just the next one
    setTimeout(() => {
      if (currentIndex < currentExam.length - 1) {
        setCurrentIndex(i => i + 1);
        setShowMatrixHint(false);
      }
    }, 150);
  };

  const attemptFinish = () => {
    if (Object.keys(currentAnswers).length < currentExam.length) {
      setShowConfirmModal(true);
    } else {
      handleFinish(false);
    }
  };

  const handleFinish = async (force: boolean = false) => {
    setShowConfirmModal(false);
    await finishExam();
    onFinish();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (Object.keys(currentAnswers).length / currentExam.length) * 100;

  // Matrix Analysis for current question
  const getMatrixAnalysis = () => {
    if (!question) return { matchedRules: [], matchedAssoc: [] };
    const text = question.text.toLowerCase();
    const matchedRules = matrixRules.filter(rule => text.includes(rule.keyword.toLowerCase()));
    
    // Find word associations
    const matchedAssoc = wordAssociations.filter(assoc => 
      assoc.words.some(w => text.includes(w.toLowerCase()))
    );

    return { matchedRules, matchedAssoc };
  };

  const { matchedRules, matchedAssoc } = getMatrixAnalysis();
  const hasMatrixHints = matchedRules.length > 0 || matchedAssoc.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-grid-pattern pb-safe"
    >
      {/* Top Bar */}
      <header className="border-b border-surface-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-50 pt-safe">
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs sm:text-sm text-secondary font-bold uppercase tracking-widest">
            SEQ // <span className="text-primary">{String(currentIndex + 1).padStart(2, '0')}</span><span className="opacity-50">/{String(currentExam.length).padStart(2, '0')}</span>
          </div>
          {useAppStore.getState().isCustomExam && (
            <div className="hidden sm:flex font-mono text-[10px] text-accent font-bold uppercase tracking-widest items-center gap-1 bg-accent/10 px-2 py-1 rounded-sm">
              TRAINING MIRATO
            </div>
          )}
        </div>
        <div className={`font-mono text-xl sm:text-2xl font-bold tracking-tighter ${timeLeft < 300 ? 'text-danger animate-pulse' : 'text-accent'}`}>
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Progress Bar (based on answered questions) */}
      <div className="w-full bg-surface h-1 sm:h-1.5">
        <motion.div 
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "circOut" }}
        />
      </div>

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="flex-1 flex flex-col justify-center"
          >
            <div className="border border-surface-border bg-surface/80 backdrop-blur-sm p-6 sm:p-12 flex flex-col items-center text-center gap-6 sm:gap-8 relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-accent opacity-50 m-3 sm:m-4" />
              <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-r-2 border-accent opacity-50 m-3 sm:m-4" />

              {hasMatrixHints && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMatrixHint(!showMatrixHint)}
                    className={`transition-colors ${showMatrixHint ? 'text-accent bg-accent/10' : 'text-secondary hover:text-accent'}`}
                    aria-label="Mostra suggerimento Matrix"
                  >
                    <Cpu className="w-5 h-5" />
                  </Button>
                </div>
              )}

              {question.imageUrl && (
                <div className="w-full max-w-[200px] sm:max-w-xs aspect-square bg-white flex items-center justify-center p-3 sm:p-4 border-2 sm:border-4 border-surface-border">
                  <img 
                    src={question.imageUrl} 
                    alt="Segnale stradale" 
                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              )}
              
              <h2 className="text-fluid-h2 font-sans font-semibold leading-tight tracking-tight max-w-3xl text-primary mt-4">
                {question.text}
              </h2>
            </div>

            {/* Matrix Hint Panel */}
            <AnimatePresence>
              {showMatrixHint && hasMatrixHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-x border-b border-accent/20 bg-accent/5 overflow-hidden"
                >
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2 text-accent font-mono text-sm font-bold uppercase tracking-widest mb-2">
                      <Cpu className="w-4 h-4" />
                      <span>Matrix Analysis</span>
                    </div>
                    
                    {matchedRules.map(rule => (
                      <div key={rule.id} className="flex items-start gap-3 p-3 border border-accent/20 bg-background/50">
                        <div className={`shrink-0 px-2 py-1 text-xs font-mono font-bold border ${rule.probabilityTrue > 50 ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'}`}>
                          {rule.probabilityTrue}% VERO
                        </div>
                        <div>
                          <span className="font-bold text-primary">"{rule.keyword}"</span>
                          <p className="text-sm text-secondary mt-1">{rule.explanation}</p>
                        </div>
                      </div>
                    ))}

                    {matchedAssoc.map((assoc, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 border border-accent/20 bg-background/50">
                        <div className="shrink-0 px-2 py-1 text-xs font-mono font-bold border bg-accent/10 text-accent border-accent/30 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> ASSOCIAZIONE
                        </div>
                        <div>
                          <span className="font-bold text-primary">{assoc.words.join(', ')}</span>
                          <p className="text-sm text-secondary mt-1">→ {assoc.association}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <Button
                size="lg"
                variant={currentAnswer === true ? "default" : "outline"}
                className={`h-20 sm:h-24 text-2xl sm:text-3xl font-display transition-all ${currentAnswer === true ? 'bg-success text-black hover:bg-success/90 shadow-[4px_4px_0px_0px_rgba(0,230,118,0.3)]' : 'hover:border-success hover:text-success bg-surface/50 backdrop-blur-sm'}`}
                onClick={() => handleAnswer(true)}
                aria-label="Rispondi Vero"
              >
                VERO
              </Button>
              <Button
                size="lg"
                variant={currentAnswer === false ? "default" : "outline"}
                className={`h-20 sm:h-24 text-2xl sm:text-3xl font-display transition-all ${currentAnswer === false ? 'bg-danger text-white hover:bg-danger/90 shadow-[4px_4px_0px_0px_rgba(255,51,102,0.3)]' : 'hover:border-danger hover:text-danger bg-surface/50 backdrop-blur-sm'}`}
                onClick={() => handleAnswer(false)}
                aria-label="Rispondi Falso"
              >
                FALSO
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question Grid Navigation */}
        <div className="mt-8 sm:mt-12">
          <div className="font-mono text-xs text-secondary mb-2 uppercase tracking-widest">Mappa Domande</div>
          <div className="grid grid-cols-10 gap-1 sm:gap-2">
            {currentExam.map((q, idx) => {
              const isAnswered = currentAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowMatrixHint(false);
                  }}
                  className={`
                    h-8 sm:h-10 font-mono text-[10px] sm:text-xs font-bold transition-all border
                    ${isCurrent ? 'border-accent text-accent shadow-[0_0_10px_rgba(255,79,0,0.5)]' : 'border-surface-border'}
                    ${isAnswered && !isCurrent ? 'bg-surface-border text-primary' : ''}
                    ${!isAnswered && !isCurrent ? 'bg-surface/50 text-secondary hover:border-primary' : ''}
                  `}
                  aria-label={`Vai alla domanda ${idx + 1}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <footer className="mt-6 sm:mt-8 flex items-center justify-between border-t border-surface-border pt-4 sm:pt-6">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentIndex(i => Math.max(0, i - 1));
              setShowMatrixHint(false);
            }}
            disabled={currentIndex === 0}
            className="gap-2 font-mono text-xs sm:text-sm"
            aria-label="Domanda precedente"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            PREV
          </Button>

          <Button onClick={attemptFinish} className="gap-2 bg-primary text-background hover:bg-primary/90 font-display tracking-widest text-sm sm:text-base" aria-label="Consegna esame">
            CONSEGNA
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setCurrentIndex(i => Math.min(currentExam.length - 1, i + 1));
              setShowMatrixHint(false);
            }}
            disabled={currentIndex === currentExam.length - 1}
            className="gap-2 font-mono text-xs sm:text-sm"
            aria-label="Domanda successiva"
          >
            NEXT
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </footer>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface border border-accent p-6 sm:p-8 max-w-md w-full shadow-[0_0_30px_rgba(255,79,0,0.15)]"
            >
              <h3 id="modal-title" className="text-xl font-display font-bold uppercase text-accent mb-4">Attenzione</h3>
              <p id="modal-description" className="font-mono text-sm text-secondary mb-8">
                Non hai risposto a tutte le domande. Le domande non risposte verranno considerate come <span className="text-danger font-bold">ERRORI</span>. Vuoi consegnare comunque?
              </p>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setShowConfirmModal(false)} aria-label="Annulla consegna">
                  ANNULLA
                </Button>
                <Button variant="destructive" onClick={() => handleFinish(false)} aria-label="Conferma consegna">
                  CONSEGNA
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
