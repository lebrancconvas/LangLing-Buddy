import Link from "next/link";
import { LANDING_FEATURE_ROUTES } from "@/lib/site-nav";

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

      <section className="mx-auto w-full max-w-7xl px-6 pb-20">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Features
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {LANDING_FEATURE_ROUTES.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{feature.label}</h3>
              <p className="text-sm text-zinc-400">{feature.description}</p>
              <div className="mt-4 text-sm font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
                Open &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
