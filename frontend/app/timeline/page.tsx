"use client";

import { useState } from "react";
import { Clock, Loader2, Search } from "lucide-react";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/stores/app-store";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  detail: string;
  impact: string;
  key_figures: string[];
  category: string;
  related_events: string[];
}

const categoryColors: Record<string, string> = {
  political: "border-blue-500 bg-blue-500/10",
  military: "border-red-500 bg-red-500/10",
  cultural: "border-purple-500 bg-purple-500/10",
  scientific: "border-emerald-500 bg-emerald-500/10",
  economic: "border-amber-500 bg-amber-500/10",
  general: "border-zinc-500 bg-zinc-500/10",
};

const categoryDots: Record<string, string> = {
  political: "bg-blue-500",
  military: "bg-red-500",
  cultural: "bg-purple-500",
  scientific: "bg-emerald-500",
  economic: "bg-amber-500",
  general: "bg-zinc-500",
};

export default function TimelinePage() {
  const { currentLanguage } = useAppStore();
  const [topic, setTopic] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setEvents([]);
    setSelectedEvent(null);
    try {
      const result = await api.generateTimeline(
        topic,
        currentLanguage,
        startYear ? parseInt(startYear) : undefined,
        endYear ? parseInt(endYear) : undefined
      );
      setEvents(result.events.sort((a, b) => a.year - b.year));
    } catch {
      // handled by empty state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white">
          <Clock size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Timeline Explorer</h1>
          <p className="text-xs text-zinc-400">Visualize historical events</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic (e.g., Space exploration, Thai history)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
              />
            </div>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              placeholder="From year"
              className="w-28 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              placeholder="To year"
              className="w-28 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Search size={16} />
              Generate
            </button>
          </div>

          {!events.length && !isLoading && (
            <div className="flex flex-col items-center py-16 text-center">
              <Clock size={40} className="mb-4 text-zinc-600" />
              <p className="text-sm text-zinc-400">
                Enter a historical topic to generate an interactive timeline.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["Ancient Rome", "World War II", "Space Exploration", "Thai Kingdoms"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setTopic(s)}
                    className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-rose-500 hover:text-rose-400"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center py-16">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-rose-400" />
              <p className="text-sm text-zinc-400">Generating timeline...</p>
            </div>
          )}

          {events.length > 0 && (
            <div className="relative">
              <div className="absolute left-8 top-0 h-full w-0.5 bg-zinc-700" />
              <div className="space-y-6">
                {events.map((event, idx) => {
                  const cat = event.category || "general";
                  return (
                    <div key={idx} className="relative flex gap-4 pl-4">
                      <div className={cn("z-10 mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-background", categoryDots[cat] || categoryDots.general)} />
                      <button
                        onClick={() => setSelectedEvent(selectedEvent === event ? null : event)}
                        className={cn(
                          "flex-1 rounded-2xl border p-4 text-left transition-all hover:shadow-lg",
                          selectedEvent === event
                            ? categoryColors[cat] || categoryColors.general
                            : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
                        )}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-400">{event.year}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", categoryColors[cat] || categoryColors.general)}>
                            {cat}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{event.description}</p>
                        {selectedEvent === event && (
                          <div className="mt-3 space-y-3 border-t border-zinc-700/50 pt-3">
                            {event.detail && (
                              <div>
                                <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Context & Details</h4>
                                <p className="text-xs leading-relaxed text-zinc-300">{event.detail}</p>
                              </div>
                            )}
                            {event.impact && (
                              <div>
                                <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Impact & Legacy</h4>
                                <p className="text-xs leading-relaxed text-zinc-300">{event.impact}</p>
                              </div>
                            )}
                            {event.key_figures?.length > 0 && (
                              <div>
                                <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Key Figures</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {event.key_figures.map((fig, fi) => (
                                    <span key={fi} className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">{fig}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {event.related_events?.length > 0 && (
                              <div>
                                <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Related Events</h4>
                                <p className="text-xs text-zinc-400">{event.related_events.join(" • ")}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
