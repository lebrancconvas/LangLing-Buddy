"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { useHydrated } from "@/lib/hooks/use-hydration";
import { LanguagePicker } from "@/components/language-picker";
import { cn } from "@/lib/utils";
import { FOOTER_NAV_ROUTES, MAIN_NAV_ROUTES } from "@/lib/site-nav";

export function Sidebar() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const isOpen = hydrated ? sidebarOpen : true;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-[#0c1222] transition-all duration-300",
        isOpen ? "w-64" : "w-[68px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {isOpen && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
              L
            </div>
            <span className="text-lg font-bold text-white">LangLing</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {MAIN_NAV_ROUTES.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <LanguagePicker collapsed={!isOpen} />
        {FOOTER_NAV_ROUTES.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
