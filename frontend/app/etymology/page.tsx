"use client";

import { useState } from "react";
import { BookMarked, Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/stores/app-store";

export default function EtymologyPage() {
  const { currentLanguage } = useAppStore();
  const [word, setWord] = useState("");
  const [languageHint, setLanguageHint] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async () => {
    if (!word.trim()) return;
    setIsLoading(true);
    setResult("");
    try {
      const res = await api.lookupEtymology(
        word.trim(),
        languageHint.trim(),
        currentLanguage || "en"
      );
      setResult(res.content);
    } catch {
      setResult("Request failed. Check that the backend is running and AI keys are set.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white">
          <BookMarked size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Etymology & word origins</h1>
          <p className="text-xs text-zinc-400">Explore meaning, history, and cognates in many languages</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles size={16} className="text-fuchsia-400" />
              Enter any word, phrase, or expression (any script).
            </div>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Word or phrase (e.g. 哲学, karma, déjà vu)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
            <input
              type="text"
              value={languageHint}
              onChange={(e) => setLanguageHint(e.target.value)}
              placeholder="Language hint (optional, e.g. Thai, French, Mandarin)"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
            <p className="text-xs text-zinc-500">
              Explanations use your app language: <span className="text-zinc-300">{currentLanguage || "en"}</span> (change in the sidebar picker).
            </p>
            <button
              type="button"
              onClick={handleLookup}
              disabled={!word.trim() || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Look up
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-8 text-sm text-zinc-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-fuchsia-400" />
              Researching…
            </div>
          )}

          {result && !isLoading && (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 px-6 py-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fuchsia-400/80">
                Result
              </h2>
              <div className="max-w-none whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
