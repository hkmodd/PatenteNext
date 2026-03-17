import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '../data/questions';

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
  
  // Current Session
  currentExam: Question[] | null;
  currentAnswers: Record<string, boolean>;
  isExamActive: boolean;
  examStartTime: number | null;
  
  // Actions
  startExam: (questions: Question[]) => void;
  answerQuestion: (questionId: string, answer: boolean) => void;
  finishExam: () => void;
  clearHistory: () => void;
  importData: (data: string) => void;
  exportData: () => string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      totalExamsTaken: 0,
      examsPassed: 0,
      currentStreak: 0,
      maxStreak: 0,
      history: [],
      
      currentExam: null,
      currentAnswers: {},
      isExamActive: false,
      examStartTime: null,
      
      startExam: (questions) => set({
        currentExam: questions,
        currentAnswers: {},
        isExamActive: true,
        examStartTime: Date.now()
      }),
      
      answerQuestion: (questionId, answer) => set((state) => ({
        currentAnswers: {
          ...state.currentAnswers,
          [questionId]: answer
        }
      })),
      
      finishExam: () => {
        const { currentExam, currentAnswers, history, totalExamsTaken, examsPassed, currentStreak, maxStreak } = get();
        if (!currentExam) return;

        let correctCount = 0;
        currentExam.forEach(q => {
          if (currentAnswers[q.id] === q.answer) {
            correctCount++;
          }
        });

        const errors = currentExam.length - correctCount;
        // Patente B rule: max 3 errors to pass (out of 30)
        const maxAllowedErrors = 3;
        const passed = errors <= maxAllowedErrors;

        const newStreak = passed ? currentStreak + 1 : 0;
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
          totalExamsTaken: totalExamsTaken + 1,
          examsPassed: passed ? examsPassed + 1 : examsPassed,
          currentStreak: newStreak,
          maxStreak: newMaxStreak,
          isExamActive: false,
          // Keep currentExam and currentAnswers to show results
        });
      },
      
      clearHistory: () => set({ history: [], totalExamsTaken: 0, examsPassed: 0, currentStreak: 0, maxStreak: 0 }),
      
      importData: (dataStr) => {
        try {
          const data = JSON.parse(dataStr);
          if (data.history) {
            set({
              history: data.history,
              totalExamsTaken: data.totalExamsTaken || 0,
              examsPassed: data.examsPassed || 0,
              currentStreak: data.currentStreak || 0,
              maxStreak: data.maxStreak || 0
            });
          }
        } catch (e) {
          console.error("Failed to import data", e);
        }
      },
      
      exportData: () => {
        const { history, totalExamsTaken, examsPassed, currentStreak, maxStreak } = get();
        return JSON.stringify({ history, totalExamsTaken, examsPassed, currentStreak, maxStreak });
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
        currentExam: state.currentExam,
        currentAnswers: state.currentAnswers,
        isExamActive: state.isExamActive,
        examStartTime: state.examStartTime
      }),
    }
  )
);
