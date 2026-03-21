import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '../data/questions';
import { TheoryChapter } from '../data/theory';
import { updateQuestionStats } from '../lib/db';

export interface QuizSession {
  id: string;
  date: number;
  score: number;
  total: number;
  passed: boolean;
  answers: Record<string, boolean>; // questionId -> user's answer
  exam: Question[]; // The questions that were asked
}

interface AppState {
  // User Stats
  totalExamsTaken: number;
  examsPassed: number;
  currentStreak: number;
  maxStreak: number;
  history: QuizSession[];
  weaknesses: Record<string, number>; // questionId -> number of times failed
  
  // Current Session
  currentExam: Question[] | null;
  currentAnswers: Record<string, boolean>;
  isExamActive: boolean;
  examStartTime: number | null;
  isCustomExam: boolean; // True if it's a targeted training or error review
  
  // Theory Database
  theory: Record<string, TheoryChapter>;
  
  // Actions
  startExam: (questions: Question[], isCustom?: boolean) => void;
  answerQuestion: (questionId: string, answer: boolean) => void;
  finishExam: () => Promise<void>;
  abortExam: () => void;
  clearHistory: () => void;
  importData: (data: string) => void;
  exportData: () => string;
  setTheory: (theory: Record<string, TheoryChapter>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      totalExamsTaken: 0,
      examsPassed: 0,
      currentStreak: 0,
      maxStreak: 0,
      history: [],
      weaknesses: {},
      
      currentExam: null,
      currentAnswers: {},
      isExamActive: false,
      examStartTime: null,
      isCustomExam: false,
      
      theory: {},
      
      setTheory: (theory) => set({ theory }),

      startExam: (questions, isCustom = false) => set({
        currentExam: questions,
        currentAnswers: {},
        isExamActive: true,
        examStartTime: Date.now(),
        isCustomExam: isCustom
      }),
      
      answerQuestion: (questionId, answer) => set((state) => ({
        currentAnswers: {
          ...state.currentAnswers,
          [questionId]: answer
        }
      })),

      abortExam: () => set({
        currentExam: null,
        currentAnswers: {},
        isExamActive: false,
        examStartTime: null,
        isCustomExam: false
      }),
      
      finishExam: async () => {
        const { currentExam, currentAnswers, history, totalExamsTaken, examsPassed, currentStreak, maxStreak, weaknesses, isCustomExam } = get();
        if (!currentExam) return;

        let correctCount = 0;
        const statsPromises: Promise<void>[] = [];
        const newWeaknesses = { ...weaknesses };

        currentExam.forEach(q => {
          const isCorrect = currentAnswers[q.id] === q.answer;
          if (isCorrect) {
            correctCount++;
            // If answered correctly, reduce weakness score (min 0)
            if (newWeaknesses[q.id]) {
              newWeaknesses[q.id] = Math.max(0, newWeaknesses[q.id] - 1);
              if (newWeaknesses[q.id] === 0) delete newWeaknesses[q.id];
            }
          } else {
            // If answered incorrectly, increase weakness score
            newWeaknesses[q.id] = (newWeaknesses[q.id] || 0) + 1;
          }
          statsPromises.push(updateQuestionStats(q.id, isCorrect));
        });

        // Wait for all stats to be updated
        await Promise.all(statsPromises).catch(e => console.error("Failed to update stats", e));

        const errors = currentExam.length - correctCount;
        // Patente B rule: max 3 errors to pass (out of 30)
        const maxAllowedErrors = Math.floor(currentExam.length * 0.1); // 10% error margin for custom exams
        const passed = errors <= (isCustomExam ? maxAllowedErrors : 3);

        // Only update streaks and total counts if it's an official exam simulation (not custom)
        const newStreak = (!isCustomExam && passed) ? currentStreak + 1 : (!isCustomExam ? 0 : currentStreak);
        const newMaxStreak = Math.max(maxStreak, newStreak);

        const session: QuizSession = {
          id: Date.now().toString(),
          date: Date.now(),
          score: correctCount,
          total: currentExam.length,
          passed,
          answers: currentAnswers,
          exam: currentExam
        };

        set({
          history: [session, ...history],
          totalExamsTaken: isCustomExam ? totalExamsTaken : totalExamsTaken + 1,
          examsPassed: (passed && !isCustomExam) ? examsPassed + 1 : examsPassed,
          currentStreak: newStreak,
          maxStreak: newMaxStreak,
          weaknesses: newWeaknesses,
          isExamActive: false,
          // Keep currentExam and currentAnswers to show results
        });
      },
      
      clearHistory: () => set({ history: [], totalExamsTaken: 0, examsPassed: 0, currentStreak: 0, maxStreak: 0, weaknesses: {} }),
      
      importData: (dataStr) => {
        try {
          const data = JSON.parse(dataStr);
          if (data && typeof data === 'object' && Array.isArray(data.history)) {
            // Basic validation to ensure it's a valid export
            set({
              history: data.history.slice(0, 100), // Keep max 100 history items to prevent performance issues
              totalExamsTaken: typeof data.totalExamsTaken === 'number' ? data.totalExamsTaken : 0,
              examsPassed: typeof data.examsPassed === 'number' ? data.examsPassed : 0,
              currentStreak: typeof data.currentStreak === 'number' ? data.currentStreak : 0,
              maxStreak: typeof data.maxStreak === 'number' ? data.maxStreak : 0,
              weaknesses: typeof data.weaknesses === 'object' ? data.weaknesses : {}
            });
            alert('Dati importati con successo!');
          } else {
            throw new Error('Formato dati non valido');
          }
        } catch (e) {
          console.error("Failed to import data", e);
          alert('Errore durante l\'importazione dei dati. Il file potrebbe essere corrotto o in un formato non valido.');
        }
      },
      
      exportData: () => {
        const { history, totalExamsTaken, examsPassed, currentStreak, maxStreak, weaknesses } = get();
        return JSON.stringify({ history, totalExamsTaken, examsPassed, currentStreak, maxStreak, weaknesses });
      }
    }),
    {
      name: 'patente-next-storage',
      partialize: (state) => ({ 
        history: state.history,
        totalExamsTaken: state.totalExamsTaken,
        examsPassed: state.examsPassed,
        currentStreak: state.currentStreak,
        maxStreak: state.maxStreak,
        weaknesses: state.weaknesses,
        currentExam: state.currentExam,
        currentAnswers: state.currentAnswers,
        isExamActive: state.isExamActive,
        examStartTime: state.examStartTime,
        isCustomExam: state.isCustomExam
      }),
    }
  )
);
