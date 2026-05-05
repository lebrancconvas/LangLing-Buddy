"use client";

import {
  BookOpen,
  MessageSquare,
  BrainCircuit,
  Layers,
  Mic,
  Languages,
  Clock,
  Globe,
  Settings,
  History,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  content: React.ReactNode;
}

export default function GuidePage() {
  const sections: Section[] = [
    {
      id: "getting-started",
      icon: Lightbulb,
      title: "Getting Started",
      color: "from-amber-500 to-orange-600",
      content: (
        <div className="space-y-3">
          <p>Welcome to LangLing! Here&apos;s how to get started:</p>
          <ol className="list-inside list-decimal space-y-2 text-zinc-300">
            <li><strong>Select your language</strong> — Click the globe icon at the bottom of the sidebar to choose from 24+ languages</li>
            <li><strong>Set your level</strong> — Go to Settings to choose Beginner, Intermediate, or Advanced</li>
            <li><strong>Start learning</strong> — Pick any feature from the sidebar and begin!</li>
          </ol>
          <div className="mt-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
            <p className="text-sm text-indigo-300">
              <strong>Tip:</strong> You can change the language at any time from the sidebar — it takes effect immediately across all features.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "chat-tutor",
      icon: MessageSquare,
      title: "Chat Tutor",
      color: "from-blue-500 to-indigo-600",
      content: (
        <div className="space-y-3">
          <p>An AI tutor that adapts to your level and chosen language.</p>
          <h4 className="font-semibold text-white">How to use:</h4>
          <ol className="list-inside list-decimal space-y-1.5 text-zinc-300">
            <li>Navigate to Chat Tutor from the sidebar</li>
            <li>Type a question or use a suggested prompt</li>
            <li>The AI responds with educational content adapted to your level</li>
            <li>Ask follow-up questions to dive deeper</li>
          </ol>
          <h4 className="mt-3 font-semibold text-white">Try asking:</h4>
          <ul className="list-inside list-disc space-y-1 text-zinc-400">
            <li>&quot;Teach me basic Japanese greetings&quot;</li>
            <li>&quot;Tell me about the Roman Empire&quot;</li>
            <li>&quot;How do I say &apos;thank you&apos; in Thai?&quot;</li>
            <li>&quot;Explain the French Revolution&quot;</li>
          </ul>
        </div>
      ),
    },
    {
      id: "quiz",
      icon: BrainCircuit,
      title: "Quiz & Flashcards",
      color: "from-purple-500 to-pink-600",
      content: (
        <div className="space-y-3">
          <p>Test your knowledge with AI-generated quizzes or study with flashcards.</p>
          <h4 className="font-semibold text-white">Taking a Quiz:</h4>
          <ol className="list-inside list-decimal space-y-1.5 text-zinc-300">
            <li>Enter a topic (e.g., &quot;Japanese N5 vocabulary&quot;)</li>
            <li>Select difficulty: Easy, Medium, or Hard</li>
            <li>Choose the number of questions (5–20) with the slider</li>
            <li>Click Generate Quiz</li>
            <li>Answer each question — see explanations for every option</li>
            <li>Get an AI-generated summary with study recommendations and resources</li>
          </ol>
          <h4 className="mt-3 font-semibold text-white">Flashcards:</h4>
          <ul className="list-inside list-disc space-y-1 text-zinc-300">
            <li>Click the card to flip between question and answer</li>
            <li>Rate your recall: Again, Hard, Good, or Easy</li>
            <li>Uses SM-2 spaced repetition for optimal learning</li>
          </ul>
          <div className="mt-3 rounded-xl bg-purple-500/10 border border-purple-500/20 p-4">
            <p className="text-sm text-purple-300">
              <strong>Quiz History:</strong> Click the &quot;Quiz History&quot; button (top-right of the quiz page) to review past attempts, summaries, and recommendations.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "story",
      icon: BookOpen,
      title: "Interactive Stories",
      color: "from-emerald-500 to-teal-600",
      content: (
        <div className="space-y-3">
          <p>Explore history through branching narrative stories.</p>
          <h4 className="font-semibold text-white">How to use:</h4>
          <ol className="list-inside list-decimal space-y-1.5 text-zinc-300">
            <li>Enter a historical topic or era</li>
            <li>Read the story segment</li>
            <li>Make choices at decision points</li>
            <li>Each choice leads to a different educational path</li>
          </ol>
          <p className="text-zinc-400">Stories are grounded in real historical events with key vocabulary woven into the narrative.</p>
        </div>
      ),
    },
    {
      id: "voice",
      icon: Mic,
      title: "Voice Conversation",
      color: "from-cyan-500 to-blue-600",
      content: (
        <div className="space-y-3">
          <p>Practice pronunciation with speech recognition and text-to-speech.</p>
          <h4 className="font-semibold text-white">How to use:</h4>
          <ol className="list-inside list-decimal space-y-1.5 text-zinc-300">
            <li>Click the microphone to start speaking</li>
            <li>The app transcribes your speech</li>
            <li>Listen to the correct pronunciation</li>
          </ol>
          <div className="mt-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4">
            <p className="text-sm text-cyan-300">
              <strong>Requirements:</strong> A working microphone and a modern browser (Chrome, Edge, or Safari recommended).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "translate",
      icon: Languages,
      title: "Translation",
      color: "from-green-500 to-emerald-600",
      content: (
        <div className="space-y-3">
          <p>Translate text between languages with optional grammar explanations.</p>
          <h4 className="font-semibold text-white">How to use:</h4>
          <ol className="list-inside list-decimal space-y-1.5 text-zinc-300">
            <li>Select source and target languages</li>
            <li>Type or paste your text</li>
            <li>Toggle &quot;Explain Grammar&quot; for detailed breakdowns</li>
            <li>View translation, romanization, and grammar notes</li>
          </ol>
        </div>
      ),
    },
    {
      id: "timeline",
      icon: Clock,
      title: "Timeline Explorer",
      color: "from-rose-500 to-red-600",
      content: (
        <div className="space-y-3">
          <p>Visualize historical events on an interactive, detailed timeline.</p>
          <h4 className="font-semibold text-white">How to use:</h4>
          <ol className="list-inside list-decimal space-y-1.5 text-zinc-300">
            <li>Enter a historical topic</li>
            <li>Optionally set a year range</li>
            <li>Click Generate to create the timeline</li>
            <li>Click any event to expand full details:</li>
          </ol>
          <ul className="ml-6 list-inside list-disc space-y-1 text-zinc-400">
            <li>Context and background</li>
            <li>Impact and lasting legacy</li>
            <li>Key figures involved</li>
            <li>Related events</li>
          </ul>
        </div>
      ),
    },
    {
      id: "language",
      icon: Globe,
      title: "Language Selection",
      color: "from-violet-500 to-purple-600",
      content: (
        <div className="space-y-3">
          <p>LangLing supports <strong>24+ languages</strong>:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm text-zinc-300">
            {[
              "English", "ไทย (Thai)", "简体中文 (Simplified Chinese)", "繁體中文 (Traditional Chinese)",
              "日本語 (Japanese)", "한국어 (Korean)", "Bahasa Melayu", "Bahasa Indonesia",
              "Tiếng Việt", "ພາສາລາວ (Lao)", "ភាសាខ្មែរ (Khmer)", "हिन्दी (Hindi)",
              "العربية (Arabic)", "Français", "Deutsch", "Español",
              "Italiano", "Nederlands", "Русский", "Português",
              "Türkçe", "Polski", "Українська", "Svenska",
            ].map((lang) => (
              <span key={lang} className="truncate">• {lang}</span>
            ))}
          </div>
          <p className="text-zinc-400">Switch languages anytime using the globe icon at the bottom of the sidebar. Changes take effect immediately.</p>
        </div>
      ),
    },
    {
      id: "settings",
      icon: Settings,
      title: "Settings & Tips",
      color: "from-zinc-500 to-zinc-600",
      content: (
        <div className="space-y-3">
          <h4 className="font-semibold text-white">Settings options:</h4>
          <ul className="list-inside list-disc space-y-1.5 text-zinc-300">
            <li><strong>Language</strong> — Choose from 24+ supported languages</li>
            <li><strong>Difficulty</strong> — Beginner, Intermediate, or Advanced</li>
            <li><strong>AI Provider</strong> — Auto (recommended), Gemini, Groq, HuggingFace, or Ollama</li>
          </ul>
          <h4 className="mt-4 font-semibold text-white">Tips for best results:</h4>
          <ul className="list-inside list-disc space-y-1.5 text-zinc-300">
            <li>Be specific with topics — &quot;Japanese JLPT N3 grammar&quot; works better than just &quot;Japanese&quot;</li>
            <li>Adjust difficulty if content is too easy or hard</li>
            <li>Combine features — Quiz yourself after a Chat session</li>
            <li>Review Quiz History to track progress and focus on weak areas</li>
            <li>Try different languages to practice multiple at once</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
          <HelpCircle size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">User Guide</h1>
          <p className="text-xs text-zinc-400">Learn how to use all LangLing features</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-zinc-700 bg-zinc-900/50 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", section.color)}>
                  <section.icon size={18} />
                </div>
                <h2 className="text-base font-semibold text-white">{section.title}</h2>
              </div>
              <div className="px-5 py-4 text-sm leading-relaxed text-zinc-300">
                {section.content}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Troubleshooting</h3>
            <div className="space-y-2 text-sm">
              {[
                { issue: "\"All AI providers failed\"", fix: "Check that at least one API key is configured in the backend .env file" },
                { issue: "Slow responses", fix: "Try switching to Groq (fastest) in Settings > AI Provider" },
                { issue: "No voice input", fix: "Ensure microphone permissions are granted in your browser" },
                { issue: "App not loading", fix: "Verify both the backend (port 8000) and frontend (port 3000) are running" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 rounded-lg bg-zinc-800/50 px-3 py-2">
                  <span className="shrink-0 font-medium text-red-400">{item.issue}</span>
                  <span className="text-zinc-400">→ {item.fix}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
