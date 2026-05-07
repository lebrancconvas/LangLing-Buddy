import type { ChineseCharacterReadings } from "@/lib/api";

/** Labels + in-page anchor IDs for `/hanzi/romanization-guide` */
export const HANZI_READING_FIELDS: {
  key: keyof ChineseCharacterReadings;
  label: string;
  description: string;
  guideAnchor: string;
}[] = [
  {
    key: "pinyin",
    label: "Hanyu Pinyin (汉语拼音)",
    description: "Standard Mandarin romanization (tone marks or numbers).",
    guideAnchor: "pinyin",
  },
  {
    key: "zhuyin_bopomofo",
    label: "Zhuyin / Bopomofo (注音符號)",
    description:
      "Mandarin phonetic symbols (ㄅㄆㄇㄈ…); “bopomofo” names the first four letters.",
    guideAnchor: "zhuyin-bopomofo",
  },
  {
    key: "wade_giles",
    label: "Wade–Giles",
    description: "Historical Mandarin romanization common in older English texts.",
    guideAnchor: "wade-giles",
  },
  {
    key: "cantonese_jyutping",
    label: "Cantonese — Jyutping (粤拼)",
    description: "Cantonese in Latin letters with six tones (numbers 1–6).",
    guideAnchor: "cantonese-jyutping",
  },
  {
    key: "cantonese_yale",
    label: "Cantonese — Yale",
    description: "Alternative Cantonese romanization (different vowel spelling).",
    guideAnchor: "cantonese-yale",
  },
  {
    key: "hokkien_poj",
    label: "Hokkien / Taiwanese — POJ (Pe̍h-ōe-jī)",
    description: "Southern Min romanization with diacritic tones.",
    guideAnchor: "hokkien-poj",
  },
  {
    key: "teochew_pengim",
    label: "Teochew — Peng'im / Dio̍k-ìu",
    description: "Romanization for Chaoshan Min; several schemes exist.",
    guideAnchor: "teochew-pengim",
  },
  {
    key: "hakka_pin_yim",
    label: "Hakka — Pin-Yim",
    description: "Romanization for Hakka varieties (Meixian / Sixian / etc.).",
    guideAnchor: "hakka-pin-yim",
  },
  {
    key: "hainanese",
    label: "Hainanese (海南話等)",
    description: "Southern Min / Hlai area varieties; notation varies by source.",
    guideAnchor: "hainanese",
  },
  {
    key: "shanghainese_wugniu",
    label: "Shanghai / Wu — Wugniu 等",
    description: "Wu Chinese (e.g. Shanghainese), not interchangeable with pinyin.",
    guideAnchor: "wugniu-wu",
  },
];
