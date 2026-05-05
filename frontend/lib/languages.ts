export interface Language {
  code: string;
  label: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "zh-CN", label: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", label: "繁體中文", flag: "🇹🇼" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "lo", label: "ພາສາລາວ", flag: "🇱🇦" },
  { code: "km", label: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
];

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
