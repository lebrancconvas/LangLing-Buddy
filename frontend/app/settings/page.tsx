"use client";

import { useAppStore } from "@/lib/stores/app-store";

const languages = [
  { value: "en", label: "English" },
  { value: "th", label: "ไทย" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
  { value: "ko", label: "한국어" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
];

const levels = ["beginner", "intermediate", "advanced"] as const;

export default function SettingsPage() {
  const { currentLanguage, userLevel, preferredProvider, setLanguage, setLevel, setProvider } =
    useAppStore();

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Learning Language</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languages.map((l) => (
            <button
              key={l.value}
              onClick={() => setLanguage(l.value)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                currentLanguage === l.value
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Difficulty Level</h2>
        <div className="flex gap-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-6 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                userLevel === l
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">AI Provider</h2>
        <select
          value={preferredProvider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="auto">Auto (Smart Fallback)</option>
          <option value="gemini">Google Gemini</option>
          <option value="groq">Groq (Llama 3)</option>
          <option value="huggingface">HuggingFace</option>
          <option value="ollama">Ollama (Local)</option>
        </select>
      </section>
    </div>
  );
}
