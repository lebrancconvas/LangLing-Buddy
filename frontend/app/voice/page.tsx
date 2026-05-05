"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, Loader2, RotateCcw } from "lucide-react";
import { sttService, ttsService } from "@/lib/speech";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/stores/app-store";
import { cn } from "@/lib/utils";

interface ConversationEntry {
  role: "user" | "assistant";
  text: string;
}

const langMap: Record<string, string> = {
  en: "en-US", th: "th-TH", ja: "ja-JP", zh: "zh-CN",
  ko: "ko-KR", es: "es-ES", fr: "fr-FR", de: "de-DE",
};

export default function VoicePage() {
  const { currentLanguage } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sttAvailable, setSttAvailable] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    setSttAvailable(sttService.available);
    sttService.setLanguage(langMap[currentLanguage] || "en-US");
  }, [currentLanguage]);

  const handleResponse = useCallback(async (userText: string) => {
    setConversation((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const messages = [{ role: "user", content: userText }];
      const result = await api.sendChat(messages, currentLanguage, "beginner", "general");
      const assistantText = result.response;
      setConversation((prev) => [...prev, { role: "assistant", text: assistantText }]);
      ttsService.speak(assistantText, langMap[currentLanguage] || "en-US");
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    sttService.onResult = (text: string) => {
      setTranscript(text);
      setIsRecording(false);
      handleResponse(text);
    };
    sttService.onError = () => setIsRecording(false);
    sttService.onEnd = () => setIsRecording(false);
  }, [handleResponse]);

  const toggleRecording = () => {
    if (isRecording) {
      sttService.stopListening();
      setIsRecording(false);
    } else {
      setTranscript("");
      sttService.setLanguage(langMap[currentLanguage] || "en-US");
      sttService.startListening();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <Mic size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Voice Conversation</h1>
          <p className="text-xs text-zinc-400">Practice speaking with AI</p>
        </div>
        {conversation.length > 0 && (
          <button
            onClick={() => { setConversation([]); ttsService.stop(); }}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {!sttAvailable && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
              Speech recognition is not available in your browser. Please use Chrome or Edge.
            </div>
          )}

          {conversation.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800">
                <Mic size={28} className="text-emerald-400" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-white">Voice Practice</h2>
              <p className="max-w-md text-sm text-zinc-400">
                Click the microphone button below to start speaking.
                I&apos;ll listen and respond in {currentLanguage.toUpperCase()}.
              </p>
            </div>
          )}

          {conversation.map((entry, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3",
                entry.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  entry.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-200"
                )}
              >
                {entry.text}
              </div>
              {entry.role === "assistant" && (
                <button
                  onClick={() => ttsService.speak(entry.text, langMap[currentLanguage] || "en-US")}
                  className="mt-1 self-start rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                >
                  <Volume2 size={14} />
                </button>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          )}

          {transcript && isRecording && (
            <div className="text-center text-sm italic text-zinc-400">
              Hearing: &quot;{transcript}&quot;
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-zinc-800 px-6 py-6">
        <button
          onClick={toggleRecording}
          disabled={!sttAvailable || isLoading}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full transition-all disabled:opacity-40",
            isRecording
              ? "animate-pulse bg-red-600 text-white shadow-lg shadow-red-500/30"
              : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20"
          )}
        >
          {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
        <span className="text-xs text-zinc-500">
          {isRecording ? "Listening... Click to stop" : "Click to start speaking"}
        </span>
      </div>
    </div>
  );
}
