"use client";

import { useState } from "react";
import { BrainCircuit, CheckCircle2, XCircle, RotateCcw, Loader2, Layers } from "lucide-react";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { useAppStore } from "@/lib/stores/app-store";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function QuizPage() {
  const {
    questions, flashcards, currentIndex, score, isLoading, mode,
    setQuestions, setFlashcards, nextQuestion, incrementScore,
    setMode, setLoading, reviewCard, reset,
  } = useQuizStore();
  const { currentLanguage } = useAppStore();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    reset();
    try {
      const result = await api.generateQuiz(topic, currentLanguage, difficulty);
      setQuestions(result.questions);
    } catch {
      // error handled by empty state
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    reset();
    setMode("flashcard");
    try {
      const result = await api.generateFlashcards(topic, currentLanguage, 10);
      setFlashcards(result.cards);
    } catch {
      // error handled by empty state
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correct_answer) {
      incrementScore();
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    nextQuestion();
  };

  const currentQ = questions[currentIndex];
  const currentCard = flashcards[currentIndex];
  const quizComplete = mode === "quiz" && questions.length > 0 && currentIndex >= questions.length;
  const cardsComplete = mode === "flashcard" && flashcards.length > 0 && currentIndex >= flashcards.length;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <BrainCircuit size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Quiz & Flashcards</h1>
          <p className="text-xs text-zinc-400">Test your knowledge with AI-generated content</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {!questions.length && !flashcards.length && !isLoading && (
            <>
              <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., Japanese N5 vocabulary, World War II)"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
                />
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "rounded-lg px-4 py-2 text-xs font-medium capitalize transition-colors",
                        difficulty === d
                          ? "bg-indigo-600 text-white"
                          : "border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={!topic.trim()}
                    className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
                  >
                    <BrainCircuit size={16} className="mr-2 inline" />
                    Generate Quiz
                  </button>
                  <button
                    onClick={handleGenerateFlashcards}
                    disabled={!topic.trim()}
                    className="flex-1 rounded-xl border border-indigo-600 px-6 py-3 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-600/10 disabled:opacity-40"
                  >
                    <Layers size={16} className="mr-2 inline" />
                    Flashcards
                  </button>
                </div>
              </div>
            </>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-indigo-400" />
              <p className="text-sm text-zinc-400">Generating {mode === "quiz" ? "quiz" : "flashcards"}...</p>
            </div>
          )}

          {mode === "quiz" && currentQ && !quizComplete && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>Question {currentIndex + 1} / {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6">
                <h2 className="mb-6 text-lg font-semibold text-white">{currentQ.question}</h2>
                <div className="space-y-3">
                  {currentQ.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left text-sm transition-all",
                        selectedAnswer === null
                          ? "border-zinc-700 text-zinc-300 hover:border-indigo-500 hover:bg-zinc-800"
                          : i === currentQ.correct_answer
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : selectedAnswer === i
                              ? "border-red-500 bg-red-500/10 text-red-400"
                              : "border-zinc-700 text-zinc-500"
                      )}
                    >
                      <span className="mr-2 font-medium">{String.fromCharCode(65 + i)}.</span>
                      {option}
                      {selectedAnswer !== null && i === currentQ.correct_answer && (
                        <CheckCircle2 size={16} className="float-right mt-0.5 text-emerald-400" />
                      )}
                      {selectedAnswer === i && i !== currentQ.correct_answer && (
                        <XCircle size={16} className="float-right mt-0.5 text-red-400" />
                      )}
                    </button>
                  ))}
                </div>
                {showExplanation && (
                  <div className="mt-4 rounded-xl bg-zinc-800 p-4 text-sm text-zinc-300">
                    <span className="font-semibold text-indigo-400">Explanation:</span>{" "}
                    {currentQ.explanation}
                  </div>
                )}
                {selectedAnswer !== null && (
                  <button
                    onClick={handleNext}
                    className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    {currentIndex + 1 < questions.length ? "Next Question" : "See Results"}
                  </button>
                )}
              </div>
            </div>
          )}

          {mode === "flashcard" && currentCard && !cardsComplete && (
            <div className="space-y-6">
              <div className="text-center text-sm text-zinc-400">
                Card {currentIndex + 1} / {flashcards.length}
              </div>
              <button
                onClick={() => setFlipped(!flipped)}
                className="mx-auto flex h-64 w-full max-w-md flex-col items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900/50 p-8 text-center transition-all hover:border-indigo-500"
              >
                <p className="text-xl font-semibold text-white">
                  {flipped ? currentCard.back : currentCard.front}
                </p>
                {flipped && currentCard.example && (
                  <p className="mt-4 text-sm italic text-zinc-400">{currentCard.example}</p>
                )}
                <p className="mt-6 text-xs text-zinc-500">
                  {flipped ? "Click to see front" : "Click to reveal answer"}
                </p>
              </button>
              {flipped && (
                <div className="flex justify-center gap-2">
                  {[
                    { q: 1, label: "Again", color: "text-red-400 border-red-500/50 hover:bg-red-500/10" },
                    { q: 3, label: "Hard", color: "text-amber-400 border-amber-500/50 hover:bg-amber-500/10" },
                    { q: 4, label: "Good", color: "text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/10" },
                    { q: 5, label: "Easy", color: "text-blue-400 border-blue-500/50 hover:bg-blue-500/10" },
                  ].map((btn) => (
                    <button
                      key={btn.q}
                      onClick={() => {
                        reviewCard(currentCard.id, btn.q);
                        setFlipped(false);
                        nextQuestion();
                      }}
                      className={cn("rounded-xl border px-6 py-2 text-sm font-medium transition-colors", btn.color)}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {(quizComplete || cardsComplete) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 size={48} className="mb-4 text-emerald-400" />
              <h2 className="mb-2 text-2xl font-bold text-white">
                {mode === "quiz" ? "Quiz Complete!" : "Cards Complete!"}
              </h2>
              {mode === "quiz" && (
                <p className="mb-6 text-lg text-zinc-400">
                  Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
                </p>
              )}
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <RotateCcw size={16} />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
