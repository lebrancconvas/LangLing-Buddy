"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useAppStore } from "@/lib/stores/app-store";
import { api } from "@/lib/api";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage() {
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChatStore();
  const { currentLanguage, userLevel } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    addMessage({ role: "user", content });
    setLoading(true);

    try {
      const allMessages = [...useChatStore.getState().messages].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await api.sendChat(allMessages, currentLanguage, userLevel);
      addMessage({ role: "assistant", content: result.response, sources: result.sources });
    } catch {
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please check that the backend is running and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Chat Tutor</h1>
            <p className="text-xs text-zinc-400">
              Language: {currentLanguage.toUpperCase()} &middot; Level: {userLevel}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800">
              <MessageSquare size={28} className="text-indigo-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Start a Conversation</h2>
            <p className="max-w-md text-sm text-zinc-400">
              Ask me anything about languages or history. I&apos;ll adapt to your level
              and help you learn through conversation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "Teach me basic Japanese greetings",
                "Tell me about the Roman Empire",
                "How do I say 'thank you' in Thai?",
                "Explain the French Revolution",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-indigo-500 hover:text-indigo-400"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700">
                  <MessageSquare size={16} className="text-zinc-400" />
                </div>
                <div className="rounded-2xl bg-zinc-800 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
