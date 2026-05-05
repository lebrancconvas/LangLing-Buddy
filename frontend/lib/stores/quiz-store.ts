import { create } from "zustand";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  example: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
}

interface QuizState {
  questions: QuizQuestion[];
  flashcards: Flashcard[];
  currentIndex: number;
  score: number;
  isLoading: boolean;
  mode: "quiz" | "flashcard";
  setQuestions: (questions: QuizQuestion[]) => void;
  setFlashcards: (cards: Omit<Flashcard, "id" | "easeFactor" | "interval" | "repetitions" | "nextReview">[]) => void;
  nextQuestion: () => void;
  incrementScore: () => void;
  setMode: (mode: "quiz" | "flashcard") => void;
  setLoading: (loading: boolean) => void;
  reviewCard: (cardId: string, quality: number) => void;
  reset: () => void;
}

function sm2(card: Flashcard, quality: number): Partial<Flashcard> {
  let { easeFactor, interval, repetitions } = card;
  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  return {
    easeFactor,
    interval,
    repetitions,
    nextReview: Date.now() + interval * 86_400_000,
  };
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  flashcards: [],
  currentIndex: 0,
  score: 0,
  isLoading: false,
  mode: "quiz",
  setQuestions: (questions) => set({ questions, currentIndex: 0, score: 0 }),
  setFlashcards: (cards) =>
    set({
      flashcards: cards.map((c) => ({
        ...c,
        id: crypto.randomUUID(),
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReview: Date.now(),
      })),
      currentIndex: 0,
    }),
  nextQuestion: () => set((s) => ({ currentIndex: s.currentIndex + 1 })),
  incrementScore: () => set((s) => ({ score: s.score + 1 })),
  setMode: (mode) => set({ mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  reviewCard: (cardId, quality) =>
    set((s) => ({
      flashcards: s.flashcards.map((c) =>
        c.id === cardId ? { ...c, ...sm2(c, quality) } : c
      ),
    })),
  reset: () => set({ questions: [], flashcards: [], currentIndex: 0, score: 0 }),
}));
