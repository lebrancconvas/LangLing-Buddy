"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Brush, Loader2, Copy, Trash2, BookOpen } from "lucide-react";
import {
  api,
  type ChineseCharacterReadings,
  type ChineseHandwritingCandidate,
} from "@/lib/api";

const CSS_W = 340;
const CSS_H = 340;

const READING_FIELDS: { key: keyof ChineseCharacterReadings; label: string }[] = [
  { key: "pinyin", label: "Hanyu Pinyin (汉语拼音)" },
  { key: "zhuyin_bopomofo", label: "Zhuyin / Bopomofo (注音符號)" },
  { key: "wade_giles", label: "Wade–Giles" },
  { key: "cantonese_jyutping", label: "Cantonese — Jyutping (粤拼)" },
  { key: "cantonese_yale", label: "Cantonese — Yale" },
  { key: "hokkien_poj", label: "Hokkien — Pe̍h-ōe-jī (POJ)" },
  { key: "teochew_pengim", label: "Teochew — Peng'im / similar" },
  { key: "hakka_pin_yim", label: "Hakka — Pin-Yim / common romanization" },
  { key: "hainanese", label: "Hainanese / 海南話 (as cited)" },
  { key: "shanghainese_wugniu", label: "Shanghai / Wu — Wugniu / similar" },
];

export default function HanziStrokePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof api.visionChineseHandwriting>> | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

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
                : "Need GEMINI_API_KEY on the backend for drawing recognition."
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

  useEffect(() => {
    if (!data?.candidates?.length) return;
    if (selectedIdx >= data.candidates.length) {
      setSelectedIdx(0);
    }
  }, [data, selectedIdx]);

  const copyText = (t: string) => {
    if (!t) return;
    void navigator.clipboard.writeText(t);
  };

  const selected: ChineseHandwritingCandidate | undefined =
    data?.candidates?.[selectedIdx];

  return (
    <div className="flex h-screen flex-col">
      <header className="flex flex-col gap-1 border-b border-zinc-800 px-6 py-4 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white">
            <Brush size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Chinese — draw a character</h1>
            <p className="text-xs text-zinc-400">
              Up to 11 ranked guesses. Select a character for full readings (pinyin, zhuyin, POJ, Cantonese, and more).
            </p>
          </div>
        </div>
        <Link
          href="/hanzi/romanization-guide"
          className="ml-auto flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-orange-300 transition-colors hover:border-orange-500/50 hover:bg-orange-500/10"
        >
          <BookOpen size={14} /> Reading systems guide
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 xl:flex-row">
          <div className="space-y-4 xl:w-[380px]">
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
            <p className="text-xs text-zinc-500">
              Draw one character large and clearly. Readings are generated for study and may be incomplete—see the{" "}
              <Link href="/hanzi/romanization-guide" className="text-orange-400 underline">
                guide
              </Link>
              .
            </p>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
            )}

            {data && (
              <>
                {data.drawing_note && (
                  <p className="rounded-lg border border-zinc-700 bg-zinc-900/30 px-4 py-3 text-xs text-zinc-400">
                    {data.drawing_note}
                  </p>
                )}

                {data.candidates.length === 0 && !data.drawing_note && data.raw_model_text && (
                  <p className="text-xs text-zinc-500">No characters parsed. Raw output available in developer tools.</p>
                )}

                {data.candidates.length > 0 && (
                  <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-5 text-sm">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-400/90">
                        Top matches (1 = best)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.candidates.map((c, i) => (
                          <button
                            key={`${c.character}-${c.rank}-${i}`}
                            type="button"
                            onClick={() => setSelectedIdx(i)}
                            className={`flex flex-col items-center rounded-xl border px-2 py-2 transition-all min-w-[3.5rem] ${
                              selectedIdx === i
                                ? "border-orange-500 bg-orange-500/15 text-white shadow-lg shadow-orange-500/10"
                                : "border-zinc-600 bg-zinc-800/40 text-zinc-300 hover:border-zinc-500"
                            }`}
                          >
                            <span className="text-[10px] text-zinc-500">#{c.rank}</span>
                            <span className="text-2xl font-medium leading-none">{c.character}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selected && (
                      <div className="space-y-4 border-t border-zinc-800 pt-4">
                        <div className="flex flex-wrap items-start gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-orange-400/80">Selected</p>
                            <p className="text-4xl font-medium text-white">{selected.character}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => copyText(selected.character)}
                              className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-700"
                            >
                              <Copy size={14} /> Copy character
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const lines = READING_FIELDS.filter(
                                  (f) => selected.readings[f.key]?.trim()
                                ).map((f) => `${f.label}: ${selected.readings[f.key]}`);
                                copyText(
                                  [selected.character, "", ...lines, "", selected.meaning].filter(Boolean).join("\n")
                                );
                              }}
                              className="flex items-center gap-1 rounded-lg border border-zinc-600 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
                            >
                              <Copy size={14} /> Copy details
                            </button>
                          </div>
                        </div>

                        {selected.confidence_note && (
                          <p className="text-xs text-zinc-500">{selected.confidence_note}</p>
                        )}

                        <div className="grid gap-2 sm:grid-cols-2">
                          {selected.simplified && (
                            <p className="text-zinc-300">
                              <span className="text-zinc-500">Simplified:</span> {selected.simplified}
                            </p>
                          )}
                          {selected.traditional && (
                            <p className="text-zinc-300">
                              <span className="text-zinc-500">Traditional:</span> {selected.traditional}
                            </p>
                          )}
                          {selected.stroke_count != null && (
                            <p className="text-zinc-300">
                              <span className="text-zinc-500">Stroke count:</span> {selected.stroke_count}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400/85">
                            Readings
                          </p>
                          <div className="max-h-[320px] space-y-2 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                            {READING_FIELDS.map(({ key, label }) => {
                              const val = selected.readings[key]?.trim();
                              if (!val) return null;
                              return (
                                <div
                                  key={key}
                                  className="flex flex-col gap-1 border-b border-zinc-800/80 pb-2 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <span className="text-xs text-zinc-500 shrink-0 sm:max-w-[40%]">{label}</span>
                                  <div className="flex min-w-0 flex-1 items-center gap-2">
                                    <span className="break-all text-zinc-200">{val}</span>
                                    <button
                                      type="button"
                                      onClick={() => copyText(val)}
                                      className="shrink-0 rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                                      title="Copy"
                                    >
                                      <Copy size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                            {!READING_FIELDS.some((f) => selected.readings[f.key]?.trim()) && (
                              <p className="text-xs text-zinc-500">No readings returned for this character.</p>
                            )}
                          </div>
                        </div>

                        {selected.meaning && (
                          <div>
                            <p className="mb-1 text-xs uppercase tracking-wide text-orange-400/80">Meaning</p>
                            <p className="text-zinc-200">{selected.meaning}</p>
                          </div>
                        )}

                        {selected.stroke_order_description && (
                          <div>
                            <p className="mb-1 text-xs text-zinc-500">Stroke order (笔顺)</p>
                            <p className="text-zinc-300">{selected.stroke_order_description}</p>
                          </div>
                        )}

                        {selected.example_words.length > 0 && (
                          <div>
                            <p className="mb-1 text-xs text-zinc-500">Example words</p>
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
                        )}

                        {selected.usage_notes && (
                          <p className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">{selected.usage_notes}</p>
                        )}
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
