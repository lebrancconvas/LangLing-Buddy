"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Brush, Loader2, Copy, Trash2, BookOpen } from "lucide-react";
import {
  api,
  type ChineseHandwritingCandidate,
} from "@/lib/api";
import { HANZI_READING_FIELDS } from "@/lib/hanzi-readings";

const CSS_W = 340;
const CSS_H = 340;

const GUIDE_BASE = "/hanzi/romanization-guide";

/** Sort ML candidates by rank ascending (best first). Same rank preserves API order. */
function sortCandidatesByRank(candidates: ChineseHandwritingCandidate[]) {
  return [...candidates].sort((a, b) => {
    const ra = typeof a.rank === "number" && a.rank >= 1 ? a.rank : 999;
    const rb = typeof b.rank === "number" && b.rank >= 1 ? b.rank : 999;
    if (ra !== rb) return ra - rb;
    return a.character.localeCompare(b.character);
  });
}

/** Non-empty readings with labels for clipboard */
function readingsBlock(c: ChineseHandwritingCandidate): string[] {
  return HANZI_READING_FIELDS.filter((f) => c.readings[f.key]?.trim()).map(
    (f) => `${f.label}: ${c.readings[f.key]?.trim()}`
  );
}

export default function HanziStrokePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof api.visionChineseHandwriting>> | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const ranked = useMemo(
    () => (data?.candidates?.length ? sortCandidatesByRank(data.candidates) : []),
    [data]
  );

  const setupCanvas = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    el.style.width = `${CSS_W}px`;
    el.style.height = `${CSS_H}px`;
    el.width = Math.floor(CSS_W * dpr);
    el.height = Math.floor(CSS_H * dpr);
    const ctx = el.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CSS_W, CSS_H);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  const ensureContext = () => {
    const el = canvasRef.current;
    if (!el) return null;
    const ctx = el.getContext("2d");
    if (!ctx) return null;
    return { el, ctx };
  };

  const drawBg = useCallback(() => {
    setupCanvas();
  }, [setupCanvas]);

  const pos = (e: React.MouseEvent | React.TouchEvent) => {
    const el = canvasRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    if ("touches" in e && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    const me = e as React.MouseEvent;
    return { x: me.clientX - rect.left, y: me.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const r = ensureContext();
    if (!r) return;
    drawing.current = true;
    const { x, y } = pos(e);
    r.ctx.beginPath();
    r.ctx.moveTo(x, y);
  };

  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const r = ensureContext();
    if (!r) return;
    const { x, y } = pos(e);
    r.ctx.lineTo(x, y);
    r.ctx.stroke();
  };

  const endDraw = () => {
    drawing.current = false;
  };

  const recognize = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    setError("");
    setData(null);
    setSelectedIdx(0);
    el.toBlob(
      (blob) => {
        if (!blob) {
          setError("Could not read canvas.");
          return;
        }
        setIsLoading(true);
        void (async () => {
          try {
            const res = await api.visionChineseHandwriting(blob);
            setData(res);
            setSelectedIdx(0);
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "Recognition failed. Check API URL, backend, and AI keys (Gemini and/or Groq, or Ollama with a vision model)."
            );
          } finally {
            setIsLoading(false);
          }
        })();
      },
      "image/png",
      0.92
    );
  }, []);

  const displayIdx = ranked.length ? Math.min(selectedIdx, ranked.length - 1) : 0;
  const selected: ChineseHandwritingCandidate | undefined = ranked[displayIdx];

  const copyText = (t: string) => {
    if (!t) return;
    void navigator.clipboard.writeText(t);
  };

  const copyAllDetails = () => {
    if (!selected) return;
    const lines: string[] = [
      `Character: ${selected.character}`,
      selected.simplified ? `Simplified: ${selected.simplified}` : "",
      selected.traditional ? `Traditional: ${selected.traditional}` : "",
      selected.rank ? `Rank (1 = best): ${selected.rank}` : "",
      selected.confidence_note ? `Match note: ${selected.confidence_note}` : "",
      "",
      ...readingsBlock(selected),
      "",
      selected.meaning ? `Meaning: ${selected.meaning}` : "",
      selected.stroke_count != null ? `Stroke count: ${selected.stroke_count}` : "",
      selected.stroke_order_description
        ? `Stroke order: ${selected.stroke_order_description}`
        : "",
      selected.example_words.length
        ? `Examples: ${selected.example_words.join(", ")}`
        : "",
      selected.usage_notes ? `Notes: ${selected.usage_notes}` : "",
    ].filter(Boolean);
    copyText(lines.join("\n"));
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex flex-col gap-2 border-b border-zinc-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white">
            <Brush size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Chinese stroke</h1>
            <p className="max-w-xl text-xs text-zinc-400">
              Draw one character — get up to <strong className="text-zinc-300">11 ranked</strong> Hanzi guesses
              (best → least likely). Tap a character for full readings across Mandarin, Cantonese, Min, Hakka,
              Wu, and more.{" "}
              <Link href={GUIDE_BASE} className="text-orange-400 underline underline-offset-2">
                Reading systems manual
              </Link>{" "}
              is linked here only (not in the main sidebar).
            </p>
          </div>
        </div>
        <Link
          href={GUIDE_BASE}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-zinc-700 px-3 py-2 text-xs text-orange-300 transition-colors hover:border-orange-500/50 hover:bg-orange-500/10 sm:self-auto"
        >
          <BookOpen size={14} /> How to read: pinyin, zhuyin, POJ…
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 xl:flex-row xl:items-start">
          <div className="space-y-4 xl:w-[380px] xl:shrink-0">
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-4">
              <canvas
                ref={canvasRef}
                className="mx-auto cursor-crosshair touch-none rounded-lg border border-zinc-600 bg-white"
                onMouseDown={startDraw}
                onMouseMove={moveDraw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={moveDraw}
                onTouchEnd={endDraw}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    drawBg();
                    setData(null);
                    setSelectedIdx(0);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  <Trash2 size={16} /> Clear
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={recognize}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Recognize
                </button>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              Rankings reflect how well each character&apos;s glyph fits your strokes. Generated pronunciations are
              helpers for study — verify with dictionaries or speakers (
              <Link href={GUIDE_BASE} className="text-orange-400 underline">
                romanization handbook
              </Link>
              ).
            </p>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            {data && (
              <>
                {data.drawing_note && (
                  <p className="rounded-lg border border-zinc-700 bg-zinc-900/30 px-4 py-3 text-xs text-zinc-400">
                    {data.drawing_note}
                  </p>
                )}

                {ranked.length === 0 && !data.drawing_note && data.raw_model_text && (
                  <p className="text-xs text-zinc-500">No characters parsed. Try drawing more clearly.</p>
                )}

                {ranked.length > 0 && (
                  <div className="space-y-5 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-5 text-sm">
                    <div>
                      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-orange-400/90">
                          Top matches (sorted by AI rank)
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {ranked.length} suggestion{ranked.length === 1 ? "" : "s"}
                          {ranked.length < 11 ? ` — model returned fewer than 11 alternatives` : ""}
                        </p>
                      </div>
                      <p className="mb-3 text-xs text-zinc-500">
                        Tap a glyph to load details; use copy buttons beside each reading or summary actions below.
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin sm:flex-wrap sm:overflow-visible">
                        {ranked.map((c, i) => (
                          <button
                            key={`${c.character}-${c.rank}-${i}`}
                            type="button"
                            onClick={() => setSelectedIdx(i)}
                            className={`flex min-w-[3.75rem] shrink-0 flex-col items-center rounded-xl border px-2 py-2 transition-all ${
                              displayIdx === i
                                ? "border-orange-500 bg-orange-500/15 text-white shadow-lg shadow-orange-500/10"
                                : "border-zinc-600 bg-zinc-800/40 text-zinc-300 hover:border-zinc-500"
                            }`}
                          >
                            <span className="tabular-nums text-[10px] font-medium text-zinc-500">
                              #{typeof c.rank === "number" ? c.rank : i + 1}
                            </span>
                            <span className="text-2xl font-medium leading-none tracking-tight">
                              {c.character || "—"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selected && (
                      <div className="space-y-4 border-t border-zinc-800 pt-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-orange-400/80">
                              Detail — #{selected.rank}
                            </p>
                            <p className="text-4xl font-medium text-white">{selected.character}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => copyText(selected.character)}
                              disabled={!selected.character}
                              className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
                            >
                              <Copy size={14} /> Copy character
                            </button>
                            <button
                              type="button"
                              onClick={copyAllDetails}
                              className="flex items-center gap-1 rounded-lg border border-zinc-600 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
                            >
                              <Copy size={14} /> Copy detail block
                            </button>
                          </div>
                        </div>

                        {selected.confidence_note && (
                          <p className="rounded-lg bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400">
                            {selected.confidence_note}
                          </p>
                        )}

                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.simplified ? (
                            <p className="text-zinc-300">
                              <span className="text-zinc-500">Simplified:</span> {selected.simplified}
                            </p>
                          ) : null}
                          {selected.traditional ? (
                            <p className="text-zinc-300">
                              <span className="text-zinc-500">Traditional:</span> {selected.traditional}
                            </p>
                          ) : null}
                          {selected.stroke_count != null ? (
                            <p className="text-zinc-300">
                              <span className="text-zinc-500">Stroke count:</span> {selected.stroke_count}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400/85">
                              Ways to read this character
                            </p>
                            <Link
                              href={GUIDE_BASE}
                              className="text-[11px] text-orange-400 underline underline-offset-2"
                            >
                              Open pronunciation manual →
                            </Link>
                          </div>
                          <div className="grid max-h-[min(440px,50vh)] gap-3 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 lg:grid-cols-2">
                            {HANZI_READING_FIELDS.map((field) => {
                              const val = selected.readings[field.key]?.trim();
                              return (
                                <div
                                  key={field.key}
                                  className="flex flex-col gap-1 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2.5"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-zinc-200">{field.label}</span>
                                    <Link
                                      href={`${GUIDE_BASE}#${field.guideAnchor}`}
                                      className="shrink-0 text-[10px] text-orange-400/90 underline underline-offset-2"
                                    >
                                      What is this?
                                    </Link>
                                  </div>
                                  <p className="text-[11px] leading-snug text-zinc-600">{field.description}</p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`min-h-[1.25rem] flex-1 break-all font-mono text-sm ${val ? "text-zinc-100" : "italic text-zinc-600"}`}
                                    >
                                      {val || "— Not provided"}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={!val}
                                      onClick={() => val && copyText(val)}
                                      className="shrink-0 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
                                      title="Copy reading"
                                    >
                                      <Copy size={15} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {selected.meaning ? (
                          <div>
                            <p className="mb-1 text-xs uppercase tracking-wide text-orange-400/80">Meaning</p>
                            <p className="text-zinc-200">{selected.meaning}</p>
                          </div>
                        ) : null}

                        {selected.stroke_order_description ? (
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="mb-1 text-xs text-zinc-500">Stroke order (笔顺)</p>
                              <p className="text-zinc-300">{selected.stroke_order_description}</p>
                            </div>
                            <button
                              type="button"
                              className="self-start rounded-lg border border-zinc-600 px-2 py-1 text-[11px] text-zinc-400 hover:bg-zinc-800"
                              onClick={() =>
                                selected.stroke_order_description &&
                                copyText(selected.stroke_order_description)
                              }
                            >
                              Copy
                            </button>
                          </div>
                        ) : null}

                        {selected.example_words.length > 0 ? (
                          <div>
                            <p className="mb-1 text-xs text-zinc-500">Example words — tap to copy</p>
                            <div className="flex flex-wrap gap-2">
                              {selected.example_words.map((w) => (
                                <button
                                  key={w}
                                  type="button"
                                  onClick={() => copyText(w)}
                                  className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
                                >
                                  {w}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {selected.usage_notes ? (
                          <p className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">{selected.usage_notes}</p>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
