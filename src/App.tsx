import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Dashboard } from './views/Dashboard';
import { QuizEngine } from './views/QuizEngine';
import { Results } from './views/Results';
import { useAppStore } from './store/useAppStore';
import { PWAInstallBanner } from './components/PWAInstallBanner';

type ViewState = 'dashboard' | 'quiz' | 'results';

export default function App() {
  const isExamActive = useAppStore((state) => state.isExamActive);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  useEffect(() => {
    if (isExamActive) {
      setCurrentView('quiz');
    }
  }, [isExamActive]);

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-white/20 overflow-x-hidden scanlines">
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard onStartQuiz={() => setCurrentView('quiz')} />
          </motion.div>
        )}
        {currentView === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizEngine onFinish={() => setCurrentView('results')} onCancel={() => setCurrentView('dashboard')} />
          </motion.div>
        )}
        {currentView === 'results' && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Results onHome={() => setCurrentView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
      <PWAInstallBanner />
    </div>
  );
}
