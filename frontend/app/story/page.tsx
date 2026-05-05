"use client";

import { useState } from "react";
import { BookOpen, Loader2, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/stores/app-store";

interface StorySegment {
  text: string;
  choices: Array<{ text: string; id: number }>;
}

export default function StoryPage() {
  const { currentLanguage } = useAppStore();
  const [topic, setTopic] = useState("");
  const [era, setEra] = useState("");
  const [storyId, setStoryId] = useState<string | null>(null);
  const [segments, setSegments] = useState<StorySegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setSegments([]);
    try {
      const result = await api.startStory(topic, currentLanguage, era);
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
          <button
            onClick={handleReset}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <RotateCcw size={14} />
            New Story
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {segments.length === 0 && !isLoading && (
            <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6">
              <h2 className="text-lg font-semibold text-white">Begin Your Journey</h2>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic (e.g., Samurai in feudal Japan)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={era}
                onChange={(e) => setEra(e.target.value)}
                placeholder="Era (e.g., 1600s, Ancient Egypt) - optional"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
              />
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
            <div key={idx} className="space-y-4">
              <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                  {segment.text}
                </p>
              </div>
              {idx === segments.length - 1 && segment.choices.length > 0 && !isLoading && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-zinc-400">What do you do?</p>
                  {segment.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice.id)}
                      className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-left text-sm text-zinc-300 transition-all hover:border-amber-500 hover:bg-zinc-800 hover:text-amber-400"
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              <span className="ml-2 text-sm text-zinc-400">Writing the next chapter...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
