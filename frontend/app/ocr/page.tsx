"use client";

import { useCallback, useRef, useState } from "react";
import { ScanText, Loader2, Copy, ImagePlus } from "lucide-react";
import { api } from "@/lib/api";

export default function OcrPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof api.visionOcr>> | null>(null);

  const onFile = (f: File | null) => {
    setError("");
    setData(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await api.visionOcr(file);
      setData(res);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Vision requires Gemini. Set GEMINI_API_KEY on the backend."
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const copyText = (text: string) => {
    if (!text) return;
    void navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <ScanText size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Image → text</h1>
          <p className="text-xs text-zinc-400">Detect script, words, and sentences from a photo or screenshot</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-900/40 p-6">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-zinc-700 py-8 text-zinc-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-zinc-200"
            >
              <ImagePlus size={32} />
              <span className="text-sm">Choose image (max ~4MB)</span>
            </button>
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Upload preview" className="mx-auto mt-4 max-h-56 rounded-lg border border-zinc-700 object-contain" />
            )}
            <button
              type="button"
              disabled={!file || isLoading}
              onClick={handleAnalyze}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Analyze image
            </button>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
          )}

          {data && (
            <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/50 p-6 text-sm text-zinc-200">
              <div className="flex flex-wrap gap-2">
                {data.writing_systems.map((s) => (
                  <span key={s} className="rounded-full bg-teal-500/15 px-3 py-1 text-xs text-teal-300">
                    {s}
                  </span>
                ))}
              </div>
              {data.language_guess && (
                <p>
                  <span className="text-zinc-500">Language guess:</span> {data.language_guess}
                </p>
              )}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400/90">Full transcription</span>
                  <button
                    type="button"
                    onClick={() => copyText(data.full_transcription)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950/80 p-4 font-sans text-zinc-200">
                  {data.full_transcription || "(none)"}
                </pre>
              </div>
              {data.words.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-400/90">Words</p>
                  <p className="text-zinc-300">{data.words.join(" · ")}</p>
                </div>
              )}
              {data.sentences.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-400/90">Sentences</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {data.sentences.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(data.alphabet_or_script_notes || data.confidence_note) && (
                <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-500">
                  {data.alphabet_or_script_notes && <p>{data.alphabet_or_script_notes}</p>}
                  {data.confidence_note && <p className="mt-2">{data.confidence_note}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
