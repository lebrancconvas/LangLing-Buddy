"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Loader2, RotateCcw, ScrollText } from "lucide-react";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/stores/app-store";
import { cn } from "@/lib/utils";

interface StorySegment {
  text: string;
  choices: Array<{ text: string; id: number }>;
}

function StoryText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, i) => {
        const trimmed = paragraph.trim();
        const isDialogue = trimmed.startsWith('"') || trimmed.startsWith("'") || trimmed.startsWith("\u201C");
        const isHeading = trimmed.length < 80 && !trimmed.endsWith(".") && !isDialogue && i === 0;

        if (isHeading && paragraphs.length > 1) {
          return (
            <h3 key={i} className="text-base font-semibold text-amber-300/90">
              {trimmed}
            </h3>
          );
        }

        if (isDialogue) {
          return (
            <p key={i} className="border-l-2 border-amber-500/30 pl-4 text-sm italic leading-relaxed text-zinc-200">
              {trimmed}
            </p>
          );
        }

        return (
          <p key={i} className="text-sm leading-[1.8] text-zinc-300">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

const GENRES = [
  "historical fiction", "mystery", "adventure", "drama", "thriller",
  "romance", "comedy", "horror", "fantasy", "sci-fi",
];

const MOODS = [
  "serious", "lighthearted", "dark", "hopeful", "melancholic",
  "tense", "whimsical", "inspiring", "eerie", "nostalgic",
];

const TONES = [
  "narrative", "cinematic", "poetic", "conversational", "journalistic",
  "epic", "intimate", "satirical", "philosophical", "suspenseful",
];

export default function StoryPage() {
  const { currentLanguage } = useAppStore();
  const [topic, setTopic] = useState("");
  const [era, setEra] = useState("");
  const [genre, setGenre] = useState("historical fiction");
  const [mood, setMood] = useState("serious");
  const [tone, setTone] = useState("narrative");
  const [storyId, setStoryId] = useState<string | null>(null);
  const [segments, setSegments] = useState<StorySegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (segments.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [segments]);

  const handleStart = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setSegments([]);
    try {
      const styleDesc = `genre: ${genre}; mood: ${mood}; tone: ${tone}`;
      const result = await api.startStory(topic, currentLanguage, era, styleDesc);
      setStoryId(result.story_id);
      setSegments([result.segment]);
    } catch {
      setSegments([{ text: "Failed to start story. Check backend connection.", choices: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choiceIndex: number) => {
    if (!storyId) return;
    setIsLoading(true);
    try {
      const result = await api.continueStory(storyId, choiceIndex);
      setSegments((prev) => [...prev, result.segment]);
    } catch {
      setSegments((prev) => [
        ...prev,
        { text: "Failed to continue story. Please try again.", choices: [] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStoryId(null);
    setSegments([]);
    setTopic("");
    setEra("");
    setGenre("historical fiction");
    setMood("serious");
    setTone("narrative");
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <BookOpen size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Interactive Stories</h1>
          <p className="text-xs text-zinc-400">Explore history through branching narratives</p>
        </div>
        {segments.length > 0 && (
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <ScrollText size={12} />
              Chapter {segments.length}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <RotateCcw size={14} />
              New Story
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          {segments.length === 0 && !isLoading && (
            <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6">
              <h2 className="text-lg font-semibold text-white">Begin Your Journey</h2>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic (e.g., Samurai in feudal Japan)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />
              <input
                type="text"
                value={era}
                onChange={(e) => setEra(e.target.value)}
                placeholder="Era (e.g., 1600s, Ancient Egypt) - optional"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500"
                  >
                    {MOODS.map((m) => (
                      <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!topic.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Start Story
              </button>
              <div className="flex flex-wrap gap-2">
                {[
                  { t: "A merchant on the Silk Road", e: "200 BC" },
                  { t: "A Viking explorer", e: "800 AD" },
                  { t: "Life in ancient Athens", e: "400 BC" },
                  { t: "A ninja in Edo period", e: "1700s" },
                ].map((s) => (
                  <button
                    key={s.t}
                    onClick={() => { setTopic(s.t); setEra(s.e); }}
                    className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-amber-500 hover:text-amber-400"
                  >
                    {s.t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {segments.map((segment, idx) => (
            <div key={idx} className="space-y-5">
              {idx > 0 && (
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                    Chapter {idx + 1}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                </div>
              )}
              <div className={cn(
                "rounded-2xl border bg-zinc-900/50 px-8 py-7",
                idx === segments.length - 1
                  ? "border-amber-500/20 shadow-lg shadow-amber-500/5"
                  : "border-zinc-800"
              )}>
                <StoryText text={segment.text} />
              </div>
              {idx === segments.length - 1 && segment.choices.length > 0 && !isLoading && (
                <div className="space-y-2.5 px-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">
                    What do you do?
                  </p>
                  {segment.choices.map((choice, ci) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice.id)}
                      className="group flex w-full items-start gap-3 rounded-xl border border-zinc-700 px-5 py-3.5 text-left transition-all hover:border-amber-500/50 hover:bg-amber-500/5"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-400 group-hover:bg-amber-500/20 group-hover:text-amber-400">
                        {ci + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-zinc-300 group-hover:text-amber-200">
                        {choice.text}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="mb-3 h-6 w-6 animate-spin text-amber-400" />
              <span className="text-sm text-zinc-400">Writing the next chapter...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
