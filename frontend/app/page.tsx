import Link from "next/link";
import {
  MessageSquare,
  BrainCircuit,
  BookOpen,
  Mic,
  Languages,
  Clock,
} from "lucide-react";

const features = [
  {
    href: "/chat",
    icon: MessageSquare,
    title: "Chat Tutor",
    description: "Learn languages & history through AI-powered conversations",
    color: "from-blue-500 to-indigo-600",
  },
  {
    href: "/quiz",
    icon: BrainCircuit,
    title: "Quiz & Flashcards",
    description: "Test your knowledge with adaptive quizzes and spaced repetition",
    color: "from-purple-500 to-pink-600",
  },
  {
    href: "/story",
    icon: BookOpen,
    title: "Interactive Stories",
    description: "Explore history through branching narrative adventures",
    color: "from-amber-500 to-orange-600",
  },
  {
    href: "/voice",
    icon: Mic,
    title: "Voice Practice",
    description: "Practice pronunciation with speech recognition & synthesis",
    color: "from-emerald-500 to-teal-600",
  },
  {
    href: "/translate",
    icon: Languages,
    title: "Translation",
    description: "Translate text with grammar explanations and analysis",
    color: "from-cyan-500 to-blue-600",
  },
  {
    href: "/timeline",
    icon: Clock,
    title: "Timeline Explorer",
    description: "Visualize historical events on interactive timelines",
    color: "from-rose-500 to-red-600",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-bold text-white shadow-lg shadow-indigo-500/25">
            L
          </div>
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white">
            Lang<span className="text-indigo-400">Ling</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-zinc-400">
            Your AI buddy for mastering languages and exploring history.
            Learn through conversation, quizzes, stories, and more.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform group-hover:scale-110`}
            >
              <feature.icon size={24} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">{feature.title}</h2>
            <p className="text-sm text-zinc-400">{feature.description}</p>
            <div className="mt-4 text-sm font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
              Get started &rarr;
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
