"use client";

import { useCallback, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Library,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { LANGUAGES, getLanguageByCode } from "@/lib/languages";
import { useAppStore } from "@/lib/stores/app-store";
import { useHydrated } from "@/lib/hooks/use-hydration";
import { cn } from "@/lib/utils";
import {
  buildVocabQuizQuestions,
  getPhonologyLabel,
  getVocabForLanguage,
  type QuizQuestion,
} from "@/lib/vocab-data";

const QUIZ_SIZE = 6;

export default function VocabPage() {
  const hydrated = useHydrated();
  const { currentLanguage } = useAppStore();
  const [targetLang, setTargetLang] = useState<string | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const effectiveLang =
    targetLang ?? (hydrated && currentLanguage !== "en" ? currentLanguage : "th");

  const deck = useMemo(() => getVocabForLanguage(effectiveLang), [effectiveLang]);
  const phonologyLabel = getPhonologyLabel(effectiveLang);
  const langMeta = getLanguageByCode(effectiveLang);

  const [activeTab, setActiveTab] = useState<"learn" | "quiz">("learn");
  const [quizGloss, setQuizGloss] = useState<"en" | "th">("en");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const startQuiz = useCallback(() => {
    if (deck.length < 2) return;
    setQuizQuestions(buildVocabQuizQuestions(deck, QUIZ_SIZE, quizGloss));
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setQuizDone(false);
    setActiveTab("quiz");
  }, [deck, quizGloss]);

  const currentQ = quizQuestions[qIndex];

  const onPick = (idx: number) => {
    if (picked !== null || !currentQ) return;
    setPicked(idx);
    if (idx === currentQ.correctIndex) setScore((s) => s + 1);
  };

  const nextQ = () => {
    if (qIndex + 1 >= quizQuestions.length) {
      setQuizDone(true);
      return;
    }
    setQIndex((i) => i + 1);
    setPicked(null);
  };

  const resetQuiz = () => {
    setQuizQuestions([]);
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setQuizDone(false);
    setActiveTab("learn");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-zinc-100">
      <div className="border-b border-zinc-800/80 bg-gradient-to-r from-teal-500/10 via-transparent to-emerald-500/10">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
              <Library size={28} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Learning Vocab
              </h1>
              <p className="mt-2 max-w-2xl text-zinc-400">
                Core words for every language in LangLing: pronunciation in the usual system for
                that language, glosses in English and Thai, short examples, and a multiple-choice
                quiz to reinforce recall.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-zinc-500">Learning</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/80"
              >
                {langMeta ? (
                  <>
                    <span className="text-base">{langMeta.flag}</span>
                    <span>{langMeta.label}</span>
                  </>
                ) : (
                  <span>Select language</span>
                )}
                <ChevronDown
                  size={16}
                  className={cn("text-zinc-500 transition-transform", langMenuOpen && "rotate-180")}
                />
              </button>
              {langMenuOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default bg-transparent"
                    aria-label="Close menu"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-64 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-2xl">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setTargetLang(l.code);
                          setLangMenuOpen(false);
                          resetQuiz();
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                          effectiveLang === l.code
                            ? "bg-teal-500/15 text-teal-300"
                            : "text-zinc-300 hover:bg-zinc-800"
                        )}
                      >
                        <span>{l.flag}</span>
                        <span className="flex-1 truncate">{l.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="rounded-lg bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-400">
              {phonologyLabel}
            </span>
          </div>

          <div className="mt-6 flex gap-2 border-b border-zinc-800 pb-px">
            <button
              type="button"
              onClick={() => setActiveTab("learn")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === "learn"
                  ? "border-teal-400 text-teal-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              <BookOpen size={18} />
              Words & examples
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("quiz");
                if (quizQuestions.length === 0) startQuiz();
              }}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === "quiz"
                  ? "border-teal-400 text-teal-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Sparkles size={18} />
              Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {activeTab === "learn" && (
          <div className="space-y-6">
            {deck.length === 0 ? (
              <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-400">
                No vocabulary deck for this code yet.
              </p>
            ) : (
              deck.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-6 shadow-sm shadow-black/20"
                >
                  <div className="flex flex-wrap items-baseline gap-3 gap-y-1">
                    <h2 className="text-2xl font-semibold text-white">{entry.word}</h2>
                    <span className="font-mono text-sm text-teal-400/95">{entry.phonology}</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        English
                      </p>
                      <p className="mt-1 text-zinc-200">{entry.meaningEn}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Thai
                      </p>
                      <p className="mt-1 text-zinc-200">{entry.meaningTh}</p>
                    </div>
                  </div>
                  {entry.examples.length > 0 && (
                    <div className="mt-5 border-t border-zinc-800/80 pt-4">
                      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <HelpCircle size={14} />
                        Examples
                      </p>
                      <ul className="space-y-3">
                        {entry.examples.map((ex, i) => (
                          <li
                            key={i}
                            className="rounded-xl bg-zinc-950/50 px-4 py-3 text-sm leading-relaxed"
                          >
                            <p className="font-medium text-zinc-100">{ex.text}</p>
                            <p className="mt-1 text-zinc-500">{ex.translationEn}</p>
                            <p className="mt-0.5 text-zinc-600">{ex.translationTh}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))
            )}

            {deck.length >= 2 && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={startQuiz}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-teal-500 hover:to-emerald-500"
                >
                  <Sparkles size={18} />
                  Start vocab quiz
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-6">
            {deck.length < 2 ? (
              <p className="text-zinc-400">Need at least two entries to run a quiz.</p>
            ) : quizDone ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <p className="text-lg font-semibold text-white">Quiz complete</p>
                <p className="mt-2 text-3xl font-bold text-teal-400">
                  {score} / {quizQuestions.length}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {quizGloss === "en"
                    ? "Prompts used English glosses — switch to Thai glosses or another language for more practice."
                    : "Prompts used Thai glosses — try English glosses or another deck when you are ready."}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-500"
                  >
                    <RotateCcw size={16} />
                    New quiz
                  </button>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Back to words
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Question {qIndex + 1} of {quizQuestions.length}
                  </p>
                  <div className="flex rounded-lg border border-zinc-700 bg-zinc-950/50 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        if (quizGloss === "en") return;
                        setQuizGloss("en");
                        if (quizQuestions.length > 0 && !quizDone)
                          setQuizQuestions(buildVocabQuizQuestions(deck, QUIZ_SIZE, "en"));
                        setQIndex(0);
                        setPicked(null);
                        setScore(0);
                        setQuizDone(false);
                      }}
                      className={cn(
                        "rounded-md px-3 py-1.5 font-medium transition-colors",
                        quizGloss === "en"
                          ? "bg-teal-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      English gloss
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (quizGloss === "th") return;
                        setQuizGloss("th");
                        if (quizQuestions.length > 0 && !quizDone)
                          setQuizQuestions(buildVocabQuizQuestions(deck, QUIZ_SIZE, "th"));
                        setQIndex(0);
                        setPicked(null);
                        setScore(0);
                        setQuizDone(false);
                      }}
                      className={cn(
                        "rounded-md px-3 py-1.5 font-medium transition-colors",
                        quizGloss === "th"
                          ? "bg-teal-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      Thai gloss
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  {quizGloss === "en"
                    ? "Pick the English meaning that matches the word."
                    : "Pick the Thai gloss that matches the word."}
                </p>
                <div className="mt-4 rounded-xl border border-teal-500/25 bg-teal-500/5 px-5 py-5">
                  <p className="text-center text-3xl font-semibold text-white">
                    {currentQ.promptWord}
                  </p>
                  <p className="mt-2 text-center font-mono text-sm text-teal-400/90">
                    {currentQ.promptPhonology}
                  </p>
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {currentQ.optionLabels.map((opt, idx) => {
                    const show = picked !== null;
                    const correct = idx === currentQ.correctIndex;
                    const wrong = picked === idx && idx !== currentQ.correctIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={picked !== null}
                        onClick={() => onPick(idx)}
                        className={cn(
                          "flex items-start gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                          !show && "border-zinc-700 bg-zinc-950/40 hover:border-teal-500/40 hover:bg-zinc-800/40",
                          show && correct && "border-emerald-500/60 bg-emerald-500/10 text-emerald-200",
                          show && wrong && "border-red-500/50 bg-red-500/10 text-red-200",
                          show && !correct && !wrong && "border-zinc-800 opacity-50"
                        )}
                      >
                        {show && correct && <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={18} />}
                        {show && wrong && <XCircle className="mt-0.5 shrink-0 text-red-400" size={18} />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={nextQ}
                      className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-white"
                    >
                      {qIndex + 1 >= quizQuestions.length ? "Finish" : "Next"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-400">Loading quiz…</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
