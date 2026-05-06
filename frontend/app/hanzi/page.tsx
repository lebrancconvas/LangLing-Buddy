"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Brush, Loader2, Copy, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

const CSS_W = 340;
const CSS_H = 340;

export default function HanziStrokePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof api.visionChineseHandwriting>> | null>(null);

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

  const clearCanvas = () => drawBg();

  const recognize = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    setError("");
    setData(null);
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

  const copyChar = (c: string) => {
    if (!c) return;
    void navigator.clipboard.writeText(c);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white">
          <Brush size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Chinese — draw a character</h1>
          <p className="text-xs text-zinc-400">Sketch 汉字 with your mouse or finger; get pinyin, meaning, and copy text</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 lg:flex-row">
          <div className="space-y-4">
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
                  onClick={clearCanvas}
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
              Tip: draw one character large and clearly. Recognition uses Google Gemini vision on the server.
            </p>
          </div>

          <div className="flex-1 space-y-4">
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
            )}

            {data && (
              <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6 text-sm">
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-orange-400/80">Character</p>
                    <p className="text-4xl font-medium text-white">{data.primary_character || "—"}</p>
                  </div>
                  {data.primary_character && (
                    <button
                      type="button"
                      onClick={() => copyChar(data.primary_character)}
                      className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-700"
                    >
                      <Copy size={14} /> Copy character
                    </button>
                  )}
                </div>

                {data.alternatives.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs text-zinc-500">Alternatives</p>
                    <div className="flex flex-wrap gap-2">
                      {data.alternatives.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => copyChar(c)}
                          className="rounded-lg border border-zinc-600 px-2 py-1 text-lg text-zinc-200 hover:border-orange-500/50"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-3 text-zinc-300 sm:grid-cols-2">
                  {data.pinyin && (
                    <p>
                      <span className="text-zinc-500">Pinyin:</span> {data.pinyin}
                    </p>
                  )}
                  {data.stroke_count != null && (
                    <p>
                      <span className="text-zinc-500">Strokes:</span> {data.stroke_count}
                    </p>
                  )}
                  {data.simplified && (
                    <p>
                      <span className="text-zinc-500">Simplified:</span> {data.simplified}
                    </p>
                  )}
                  {data.traditional && (
                    <p>
                      <span className="text-zinc-500">Traditional:</span> {data.traditional}
                    </p>
                  )}
                </div>

                {data.meaning && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-orange-400/80">Meaning</p>
                    <p className="text-zinc-200">{data.meaning}</p>
                  </div>
                )}

                {data.stroke_order_description && (
                  <div>
                    <p className="mb-1 text-xs text-zinc-500">Stroke order</p>
                    <p className="text-zinc-300">{data.stroke_order_description}</p>
                  </div>
                )}

                {data.example_words.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs text-zinc-500">Examples</p>
                    <div className="flex flex-wrap gap-2">
                      {data.example_words.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => copyChar(w)}
                          className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {data.usage_notes && (
                  <p className="border-t border-zinc-800 pt-4 text-xs text-zinc-500">{data.usage_notes}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
