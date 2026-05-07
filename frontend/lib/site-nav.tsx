import type { LucideIcon } from "lucide-react";
import {
  Home,
  MessageSquare,
  BrainCircuit,
  BookOpen,
  Mic,
  Languages,
  BookMarked,
  ScanText,
  Brush,
  MapPin,
  Clock,
  HelpCircle,
  Settings,
} from "lucide-react";

export type AppRouteDef = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  /** main = top sidebar nav; footer = User Guide / Settings */
  group: "main" | "footer";
};

/** Single source of truth for primary navigation + landing feature descriptions */
export const APP_ROUTE_DEFS: AppRouteDef[] = [
  {
    href: "/",
    label: "Home",
    description: "Overview and quick links to everything LangLing offers.",
    icon: Home,
    gradient: "from-zinc-500 to-zinc-700",
    group: "main",
  },
  {
    href: "/chat",
    label: "Chat Tutor",
    description: "Learn languages and history through AI-powered conversations.",
    icon: MessageSquare,
    gradient: "from-blue-500 to-indigo-600",
    group: "main",
  },
  {
    href: "/quiz",
    label: "Quiz & Cards",
    description: "Quizzes with explanations, spaced-repetition flashcards, and AI summaries.",
    icon: BrainCircuit,
    gradient: "from-purple-500 to-pink-600",
    group: "main",
  },
  {
    href: "/story",
    label: "Stories",
    description: "Branching historical fiction with genre, mood, and tone you choose.",
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-600",
    group: "main",
  },
  {
    href: "/voice",
    label: "Voice",
    description: "Practice pronunciation with speech recognition and synthesis.",
    icon: Mic,
    gradient: "from-emerald-500 to-teal-600",
    group: "main",
  },
  {
    href: "/translate",
    label: "Translate",
    description: "Translate with optional grammar notes and romanization.",
    icon: Languages,
    gradient: "from-cyan-500 to-blue-600",
    group: "main",
  },
  {
    href: "/etymology",
    label: "Etymology",
    description: "Word origins and meanings across languages and writing systems.",
    icon: BookMarked,
    gradient: "from-violet-500 to-fuchsia-600",
    group: "main",
  },
  {
    href: "/ocr",
    label: "Image to text",
    description: "Detect scripts, words, and sentences from photos or screenshots.",
    icon: ScanText,
    gradient: "from-emerald-500 to-teal-700",
    group: "main",
  },
  {
    href: "/hanzi",
    label: "Chinese strokes",
    description: "Draw 汉字, get ranked readings (pinyin, POJ, Cantonese, and more).",
    icon: Brush,
    gradient: "from-rose-500 to-orange-600",
    group: "main",
  },
  {
    href: "/maps",
    label: "Maps",
    description: "Explore the world—continents, countries, and place search on an interactive map.",
    icon: MapPin,
    gradient: "from-sky-500 to-indigo-600",
    group: "main",
  },
  {
    href: "/timeline",
    label: "Timeline",
    description: "AI-generated timelines with rich detail for each historical event.",
    icon: Clock,
    gradient: "from-rose-500 to-red-600",
    group: "main",
  },
  {
    href: "/guide",
    label: "User Guide",
    description: "How to use LangLing—features, settings, and tips.",
    icon: HelpCircle,
    gradient: "from-slate-500 to-slate-700",
    group: "footer",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Language, AI provider preferences, and app options.",
    icon: Settings,
    gradient: "from-zinc-600 to-zinc-800",
    group: "footer",
  },
];

export const MAIN_NAV_ROUTES = APP_ROUTE_DEFS.filter((r) => r.group === "main");
export const FOOTER_NAV_ROUTES = APP_ROUTE_DEFS.filter((r) => r.group === "footer");

export const LANDING_FEATURE_ROUTES = APP_ROUTE_DEFS;
