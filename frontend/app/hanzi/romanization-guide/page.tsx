import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RomanizationGuidePage() {
  return (
    <div className="min-h-screen px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-3xl space-y-10">
        <Link
          href="/hanzi"
          className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300"
        >
          <ArrowLeft size={16} /> Back to Chinese stroke recognition
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-white">Chinese readings & romanization guide</h1>
          <p className="mt-2 text-sm text-zinc-400">
            LangLing can show several ways to pronounce the same Chinese character. This page explains what those labels mean.
            Machine-generated readings are for learning only—always confirm with dictionaries or native speakers for precise usage.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Why are there many systems?</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Spoken Chinese has many regional varieties (often called &quot;dialects&quot;). Written Chinese is largely shared, but pronunciation differs.
            Each region or language community has developed romanization (Latin letters) or phonetic symbols (like zhuyin) to teach or computer‑enter sounds.
            There is no single global standard that replaces all others.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Hanyu Pinyin (汉语拼音)</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            The official romanization for <strong>Standard Mandarin</strong> in mainland China and widely used internationally.
            Syllables combine an initial (consonant), a final (vowel glide), and a tone (often shown as marks over vowels: ā á ǎ à, or tone numbers).
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
            <li>Example: 学 xué, 中国 Zhōngguó</li>
            <li>Used in our field labeled &quot;Hanyu Pinyin&quot;.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Zhuyin / Bopomofo (注音符號)</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            A phonetic alphabet used especially in Taiwan to represent Mandarin sounds. Symbols are non‑Latin (e.g. ㄅㄆㄇㄈ).
            Zhuyin is aligned with Mandarin phonology; it is <strong>not</strong> a reading of Cantonese or Hokkien by itself.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
            <li>Often shown beside characters in Taiwanese educational materials and IMEs.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Wade–Giles</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            An older romanization for Mandarin, common in older English books and place names (e.g. Peking vs Beijing).
            Uses apostrophes and superscript tone numbers in some styles. Still useful when reading historical texts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Cantonese — Jyutping & Yale</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            <strong>Jyutping (粤拼)</strong> is a common Latin romanization for Cantonese, with finals like -aa, -eoi, and tone numbers (1–6).
            <strong>Yale Cantonese</strong> is another influential system (different vowel spelling conventions).
          </p>
          <p className="text-sm text-zinc-400">
            Cantonese pronunciation is not predictable from Mandarin pinyin alone.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Hokkien — Pe̍h-ōe-jī (POJ)</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            A Latin system associated with southern Min languages (including <strong>Taiwanese Hokkien</strong>). Uses diacritics for tones (e.g. ā, á, à, â, ă).
            Spellings may differ slightly by region and church / literary tradition.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Teochew — Peng&apos;im and related</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Teochew (Chaozhou‑Swatow area) has several romanization schemes; <strong>Peng&apos;im</strong>‑style spellings are one common family.
            Our field may show a best‑effort label; verify with Teochew‑specific resources.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Hakka — Pin-Yim and others</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Hakka has multiple accents (e.g. Sixian, Meixian). <strong>Pin‑Yim</strong> and other romanizations exist; notation varies by source.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Hainanese</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Languages of Hainan include Min varieties with their own sound systems. Romanization is less standardized globally; entries may use POJ‑like or local conventions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Shanghai / Wu — Wugniu and similar</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Wu varieties (including Shanghainese) have distinct phonology. Systems like <strong>Wugniu</strong> (or other Wu romanizations) attempt to write those sounds in Latin letters.
            Not interchangeable with Mandarin pinyin.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-zinc-300">
          <p className="font-medium text-amber-200/90">About LangLing’s auto-generated readings</p>
          <p className="mt-2 leading-relaxed">
            The model may leave a field empty when unsure. Tones, literary vs colloquial layers, and regional splits are easy to get wrong.
            Use this app as a <strong>starting point</strong>; for exams, signage, or professional use, cross‑check authoritative dictionaries and language teachers.
          </p>
        </section>
      </div>
    </div>
  );
}
