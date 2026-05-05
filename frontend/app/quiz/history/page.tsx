"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trophy,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface QuizSummary {
  score_summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  resources: Array<{ title: string; url: string; description: string }>;
}

interface QuizAttempt {
  id: string;
  topic: string;
  language: string;
  difficulty: string;
  score: number;
  total: number;
  questions: Array<{
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
    option_explanations: string[];
  }>;
  answers: Array<{ question_index: number; selected_answer: number }>;
  summary?: QuizSummary | null;
  timestamp: string;
}

export default function QuizHistoryPage() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const result = await api.getQuizHistory();
      setAttempts(result.attempts);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getScoreColor = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 80) return "text-emerald-400";
    if (pct >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "medium": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "hard": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <Link
          href="/quiz"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <History size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Quiz History</h1>
          <p className="text-xs text-zinc-400">Review your past quiz attempts and track progress</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-indigo-400" />
              <p className="text-sm text-zinc-400">Loading history...</p>
            </div>
          )}

          {!loading && attempts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BrainCircuit size={48} className="mb-4 text-zinc-600" />
              <h2 className="mb-2 text-xl font-semibold text-zinc-400">No Quiz History Yet</h2>
              <p className="mb-6 text-sm text-zinc-500">
                Complete a quiz to see your history here.
              </p>
              <Link
                href="/quiz"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Take a Quiz
              </Link>
            </div>
          )}

          {attempts.map((attempt) => {
            const isExpanded = expandedId === attempt.id;
            const answerMap = new Map(
              attempt.answers.map((a) => [a.question_index, a.selected_answer])
            );

            return (
              <div
                key={attempt.id}
                className="rounded-2xl border border-zinc-700 bg-zinc-900/50 transition-colors"
              >
                <button
                  onClick={() => toggleExpand(attempt.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
                      <Trophy size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{attempt.topic}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize",
                            getDifficultyColor(attempt.difficulty)
                          )}
                        >
                          {attempt.difficulty}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(attempt.timestamp).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-lg font-bold", getScoreColor(attempt.score, attempt.total))}>
                      {attempt.score}/{attempt.total}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-zinc-500" />
                    ) : (
                      <ChevronDown size={18} className="text-zinc-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-zinc-800 px-5 pb-5 pt-4">
                    {attempt.summary && (
                      <div className="mb-5 space-y-3">
                        <div className="rounded-xl bg-zinc-800/60 p-4">
                          <p className="text-sm leading-relaxed text-zinc-300">{attempt.summary.score_summary}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {attempt.summary.strengths.length > 0 && (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                <TrendingUp size={12} />
                                Strengths
                              </h4>
                              <ul className="space-y-1">
                                {attempt.summary.strengths.map((s, i) => (
                                  <li key={i} className="text-xs text-zinc-300">• {s}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {attempt.summary.weaknesses.length > 0 && (
                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                                <AlertTriangle size={12} />
                                Areas to Improve
                              </h4>
                              <ul className="space-y-1">
                                {attempt.summary.weaknesses.map((w, i) => (
                                  <li key={i} className="text-xs text-zinc-300">• {w}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {attempt.summary.recommendations.length > 0 && (
                          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
                            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                              <Lightbulb size={12} />
                              What to Learn Next
                            </h4>
                            <ul className="space-y-1">
                              {attempt.summary.recommendations.map((r, i) => (
                                <li key={i} className="text-xs text-zinc-300">• {r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {attempt.summary.resources.length > 0 && (
                          <div className="rounded-xl border border-zinc-700 bg-zinc-800/30 p-3">
                            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                              <BookOpen size={12} />
                              Recommended Resources
                            </h4>
                            <div className="space-y-2">
                              {attempt.summary.resources.map((res, i) => (
                                <a
                                  key={i}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-start justify-between gap-2 rounded-lg border border-zinc-700 p-2 transition-colors hover:border-indigo-500 hover:bg-zinc-800"
                                >
                                  <div>
                                    <p className="text-xs font-medium text-indigo-400">{res.title}</p>
                                    <p className="mt-0.5 text-[11px] text-zinc-500">{res.description}</p>
                                  </div>
                                  <ExternalLink size={12} className="mt-0.5 shrink-0 text-zinc-600" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Questions & Answers</h4>
                      {attempt.questions.map((q, qi) => {
                        const selected = answerMap.get(qi) ?? -1;
                        const isCorrect = selected === q.correct_answer;

                        return (
                          <div
                            key={qi}
                            className={cn(
                              "rounded-xl border p-4",
                              isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"
                            )}
                          >
                            <div className="mb-3 flex items-start gap-2">
                              {isCorrect ? (
                                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                              ) : (
                                <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                              )}
                              <p className="text-sm font-medium text-white">
                                Q{qi + 1}. {q.question}
                              </p>
                            </div>
                            <div className="ml-6 space-y-1.5">
                              {q.options.map((opt, oi) => (
                                <div
                                  key={oi}
                                  className={cn(
                                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs",
                                    oi === q.correct_answer
                                      ? "bg-emerald-500/10 text-emerald-300"
                                      : oi === selected
                                        ? "bg-red-500/10 text-red-300"
                                        : "text-zinc-400"
                                  )}
                                >
                                  <span className="font-medium">{String.fromCharCode(65 + oi)}.</span>
                                  <span>{opt}</span>
                                  {oi === q.correct_answer && (
                                    <CheckCircle2 size={12} className="ml-auto text-emerald-400" />
                                  )}
                                  {oi === selected && oi !== q.correct_answer && (
                                    <XCircle size={12} className="ml-auto text-red-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                            {q.option_explanations?.length > 0 && (
                              <div className="ml-6 mt-3 space-y-1">
                                {q.option_explanations.map((exp, ei) => (
                                  <p
                                    key={ei}
                                    className={cn(
                                      "text-[11px]",
                                      ei === q.correct_answer ? "text-emerald-300/70" : "text-zinc-500"
                                    )}
                                  >
                                    {String.fromCharCode(65 + ei)}: {exp}
                                  </p>
                                ))}
                              </div>
                            )}
                            <p className="ml-6 mt-2 text-xs text-indigo-300/70">
                              {q.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
