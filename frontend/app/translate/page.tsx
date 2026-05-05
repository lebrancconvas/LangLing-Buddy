"use client";

import { useState } from "react";
import { Languages, ArrowRightLeft, Loader2, BookOpen } from "lucide-react";
import { api } from "@/lib/api";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "th", label: "Thai" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
  { value: "ko", label: "Korean" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
];

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("th");
  const [translated, setTranslated] = useState("");
  const [romanization, setRomanization] = useState("");
  const [grammarNotes, setGrammarNotes] = useState("");
  const [explainGrammar, setExplainGrammar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setTranslated("");
    setRomanization("");
    setGrammarNotes("");

    try {
      const result = await api.translate(sourceText, sourceLang, targetLang, explainGrammar);
      setTranslated(result.translated);
      setRomanization(result.romanization);
      setGrammarNotes(result.grammar_notes);
    } catch {
      setTranslated("Translation failed. Please check the backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translated);
    setTranslated(sourceText);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
          <Languages size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Translation</h1>
          <p className="text-xs text-zinc-400">Translate with grammar analysis</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-4">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-indigo-500"
            >
              {languageOptions.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={swapLanguages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <ArrowRightLeft size={18} />
            </button>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-indigo-500"
            >
              {languageOptions.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                rows={8}
                className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-4">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                </div>
              ) : translated ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-zinc-200">{translated}</p>
                  {romanization && (
                    <p className="text-xs italic text-zinc-400">{romanization}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Translation will appear here...</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={explainGrammar}
                onChange={(e) => setExplainGrammar(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
              />
              <BookOpen size={14} />
              Explain grammar
            </label>
            <button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isLoading}
              className="ml-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
            >
              {isLoading ? "Translating..." : "Translate"}
            </button>
          </div>

          {grammarNotes && (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-400">
                <BookOpen size={16} />
                Grammar Notes
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {grammarNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
