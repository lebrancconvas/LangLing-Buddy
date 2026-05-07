import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HANZI_READING_FIELDS } from "@/lib/hanzi-readings";

export const metadata: Metadata = {
  title: "Chinese readings & romanization manual — LangLing",
  description:
    "Pinyin, Zhuyin/Bopomofo, Wade–Giles, Cantonese, POJ, Hakka, Wu, and how LangLing labels them.",
};

const sectionClass = "scroll-mt-24 space-y-3";

export default function RomanizationGuidePage() {
  return (
    <div className="min-h-screen px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-3xl space-y-10">
        <nav className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href="/hanzi"
            className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft size={16} /> Back to Chinese stroke
          </Link>
        </nav>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 px-5 py-6">
          <h1 className="text-2xl font-bold text-white">Chinese readings & romanization manual</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            LangLing’s <strong className="text-zinc-300">Chinese stroke</strong> page lists many ways one Hanzi can be
            pronounced: Standard Mandarin, Zhuyin, older spellings, Cantonese, southern Min, Hakka, Hainanese, and Wu
            romanizations. Use this page when a label is unfamiliar. Auto-generated text is for{" "}
            <strong className="text-zinc-300">learning only</strong>—verify with speakers and reference books.
          </p>
        </div>

        <section id="overview" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">On this page</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-300">
            <li>
              <a href="#why-many" className="text-orange-400 hover:underline">
                Why so many systems?
              </a>
            </li>
            {HANZI_READING_FIELDS.map((f) => (
              <li key={f.key}>
                <a href={`#${f.guideAnchor}`} className="text-orange-400 hover:underline">
                  {f.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#disclaimer" className="text-orange-400 hover:underline">
                About AI-generated readings
              </a>
            </li>
          </ol>
        </section>

        <section id="why-many" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Why are there many systems?</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Written Chinese is broadly shared, but <strong>speech varies by region and language</strong> (“topolects” /
            fāngyán 方言). Mandarin (Putonghua / Guoyu), Yue (Cantonese), Min (Hokkien, Teochew, Hainan branch),
            Hakka, and Wu (e.g. Shanghai) have different sound inventories. Each community has developed phonetic
            symbols (like <strong>Zhuyin</strong>) or <strong>romanizations</strong> (Latin letters) for teaching and
            keyboards. None fully replace the others—you learn the system that matches your course, family, or locale.
          </p>
        </section>

        <section id="pinyin" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Hanyu Pinyin (汉语拼音)</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Official romanization for <strong>Standard Mandarin</strong> (mainland China, international teaching,
            most learner textbooks). A syllable is usually an <strong>initial</strong> (consonant onset), a{" "}
            <strong>final</strong> (vowel + glide), and one of <strong>four full tones</strong> plus neutral tone.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
            <li>
              Tone marks on vowels: first tone ¯ (mā), second ´ (má), third ˇ (mǎ), fourth ` (mà); neutral is often
              unstressed and unmarked (ma).
            </li>
            <li>Alternate style: tone numbers after the syllable (e.g. ma1–ma4).</li>
            <li>Special spellings: zh, ch, sh; j, q, x; y/w as syllable boundaries; ü sometimes written v in IMEs.</li>
            <li>Examples: <span className="font-mono text-zinc-300">xué</span>,{" "}
            <span className="font-mono text-zinc-300">Zhōngguó</span>,{" "}
            <span className="font-mono text-zinc-300">nǐ hǎo</span>.</li>
          </ul>
        </section>

        <section id="zhuyin-bopomofo" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Zhuyin / Bopomofo (注音符號)</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Non-Latin phonetic letters for <strong>Mandarin</strong>, standard in Taiwan beside characters in
            children’s books and on some signs. The nickname <strong>“Bopomofo”</strong> comes from the sounds of the
            first four symbols: ㄅㄆㄇㄈ (bo-po-mo-fo). Tone marks are separate small strokes (ˊ ˇ ˋ ˙) placed at the
            top-right of the syllable.
          </p>
          <p className="text-sm text-zinc-400">
            Zhuyin is <strong>not</strong> a reading of Cantonese or Hokkien by itself—it mirrors Mandarin phonology
            only.
          </p>
        </section>

        <section id="wade-giles" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Wade–Giles</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Historical <strong>Mandarin</strong> romanization (19th–20th c.). Uses apostrophes between syllable parts
            and sometimes superscript tone numbers. You still see it in older books, names, and placenames (e.g.
            Peking ↔ Beijing, Tsinghua ↔ Qinghua).
          </p>
        </section>

        <section id="cantonese-jyutping" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Cantonese — Jyutping (粤拼)</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Common Latin romanization for <strong>Yue/Cantonese</strong>. Finals like{" "}
            <span className="font-mono">aa</span>, <span className="font-mono">eon</span>, endings{" "}
            <span className="font-mono">-p -t -k</span> for stopped syllables. Six contrastive tones (sometimes
            split into 9 onsets in detailed analysis) are usually written as numbers <strong>1–6</strong> after the
            syllable (e.g. <span className="font-mono">si1</span>, <span className="font-mono">sik6</span>).
          </p>
          <p className="text-sm text-zinc-400">
            You <strong>cannot</strong> infer Cantonese from Mandarin pinyin alone—the same character may sound
            unrelated.
          </p>
        </section>

        <section id="cantonese-yale" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Cantonese — Yale Romanization</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Another influential system for Cantonese, used in many textbooks and linguistic work. Vowel letters differ
            from Jyutping (e.g. <span className="font-mono">y</span> vs <span className="font-mono">j</span> choices),
            and tone may be marked with diacritics or <span className="font-mono">h</span> for low-register syllables
            in some styles.
          </p>
        </section>

        <section id="hokkien-poj" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Hokkien / Taiwanese — Pe̍h-ōe-jī (POJ)</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Classic Latin romanization for <strong>Southern Min</strong>, including Taiwanese Hokkien. Uses diacritics
            for <strong>eight tonal categories</strong> (shown as accents on vowels—ā, á, à, â, etc.). Developed in
            missionary and literary traditions; spellings can vary slightly by church or locality.
          </p>
          <p className="text-sm text-zinc-400">
            POJ corresponds to spoken Min—not to Mandarin pinyin. Same character ≠ same sound across languages.
          </p>
        </section>

        <section id="teochew-pengim" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Teochew — Peng&apos;im / Dio̍k-ìu-pêng-im</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            <strong>Teochew</strong> (Chaoshan–Swatow Min) uses several romanization families; Peng&apos;im-style
            tables are widespread in diaspora references. Tone marks may follow POJ-like habits or roman numerals depending
            on the source—always confirm with Teochew-specific dictionaries.
          </p>
        </section>

        <section id="hakka-pin-yim" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Hakka — Pin-Yim and related</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            <strong>Hakka</strong> has many county-level accents (e.g. Sixian, Meixian). Pin-Yim (“拼音”) romanizations in
            Taiwan and mainland materials differ by standard; consonants such as voiced stops and finals like{" "}
            <span className="font-mono">-rh</span> distinguish Hakka from Mandarin.
          </p>
        </section>

        <section id="hainanese" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Hainanese</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Covers varieties on Hainan and related southern Min strata. Orthography is <strong>less globally
            standardized</strong>—you may see POJ-inspired spellings or local pedagogical romanizations.
            Treat any single field label as illustrative.
          </p>
        </section>

        <section id="wugniu-wu" className={sectionClass}>
          <h2 className="text-lg font-semibold text-white">Shanghai / Wu — Wugniu and similar</h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            <strong>Wu</strong> (吳語), including metropolitan Shanghainese, has rich tone sandhi and consonants absent
            in Mandarin—e.g. voiced obstruents historically preserved in many lects.
            <strong> Wugniu</strong> (吴拼 / 教会罗马字系) or other Wu latinizations transcribe local phonetics; they{" "}
            <strong>do not substitute</strong> for pinyin.
          </p>
        </section>

        <section id="disclaimer" className="scroll-mt-24 rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 text-sm text-zinc-300">
          <h2 className="font-semibold text-amber-100/95">About LangLing’s auto-generated readings</h2>
          <p className="mt-2 leading-relaxed">
            Models may omit a field rather than hallucinate obscure variants. Literary vs colloquial readings, tone
            sandhi chains, regional splits, and character polyphony are inherently hard. Combine this manual with offline
            resources (MOE dictionaries for Mandarin/Zhuyin, LSHK for Cantonese Jyutping, church or academic POJ spelling
            guides, etc.).
          </p>
        </section>
      </div>
    </div>
  );
}
