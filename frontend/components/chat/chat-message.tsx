"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { Message } from "@/lib/stores/chat-store";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-indigo-600" : "bg-zinc-700"
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-zinc-800 text-zinc-200"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 border-t border-white/10 pt-2 text-xs text-zinc-400">
            Sources: {message.sources.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
