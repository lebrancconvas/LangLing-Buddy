"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, Search } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { LANGUAGES, getLanguageByCode } from "@/lib/languages";
import { cn } from "@/lib/utils";

interface LanguagePickerProps {
  collapsed?: boolean;
}

export function LanguagePicker({ collapsed = false }: LanguagePickerProps) {
  const { currentLanguage, setLanguage } = useAppStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const current = getLanguageByCode(currentLanguage);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200",
          collapsed && "justify-center"
        )}
        title={current ? `${current.flag} ${current.label}` : "Select language"}
      >
        <Globe size={20} className="shrink-0" />
        {!collapsed && (
          <span className="flex items-center gap-1.5 truncate">
            {current ? `${current.flag} ${current.label}` : "Language"}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 w-64 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl",
            collapsed ? "bottom-0 left-full ml-2" : "bottom-full left-0 mb-2"
          )}
        >
          <div className="border-b border-zinc-800 p-2">
            <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-2.5 py-1.5">
              <Search size={14} className="text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-zinc-500">No languages found</p>
            )}
            {filtered.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  currentLanguage === lang.code
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "text-zinc-300 hover:bg-zinc-800"
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 truncate">{lang.label}</span>
                {currentLanguage === lang.code && (
                  <Check size={14} className="shrink-0 text-indigo-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
