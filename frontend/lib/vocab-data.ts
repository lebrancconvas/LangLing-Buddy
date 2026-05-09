/** Curated starter vocabulary aligned with LangLing language list. Phonology uses the usual teaching convention per language (IPA, Pinyin, Hepburn, RTGS, etc.). */

export type VocabExample = {
  text: string;
  translationEn: string;
  translationTh: string;
};

export type VocabEntry = {
  id: string;
  word: string;
  /** Pronunciation in the conventional romanization / phonemic script for this language */
  phonology: string;
  meaningEn: string;
  meaningTh: string;
  examples: VocabExample[];
};

/** Short label shown next to pronunciations */
export const PHONOLOGY_SYSTEM_BY_LANG: Record<string, string> = {
  en: "IPA (UK-style where noted)",
  th: "Royal Thai General System (RTGS)",
  "zh-CN": "Hanyu Pinyin (tone marks)",
  "zh-TW": "Zhuyin (Bopomofo)",
  ja: "Modified Hepburn (romaji)",
  ko: "Revised Romanization of Korean",
  ms: "Approximate IPA",
  id: "Approximate IPA",
  vi: "IPA (Northern convention)",
  lo: "Lao romanization (common classroom style)",
  km: "UNGEGN-style transliteration",
  hi: "IAST + IPA",
  ar: "Arabic script + transliteration (IPA)",
  fr: "IPA",
  de: "IPA",
  es: "IPA (Castilian)",
  it: "IPA",
  nl: "IPA",
  ru: "IPA",
  pt: "IPA (Brazilian)",
  tr: "IPA",
  pl: "IPA",
  uk: "IPA",
  sv: "IPA",
};

function ex(
  text: string,
  translationEn: string,
  translationTh: string
): VocabExample {
  return { text, translationEn, translationTh };
}

const EN: VocabEntry[] = [
  {
    id: "en-hello",
    word: "Hello",
    phonology: "/həˈləʊ/",
    meaningEn: "Greeting",
    meaningTh: "คำทักทาย",
    examples: [ex("Hello, how are you?", "Greeting + asking how someone is", "ทักทายและถามว่าสบายดีไหม")],
  },
  {
    id: "en-thanks",
    word: "Thank you",
    phonology: "/ˈθæŋk juː/",
    meaningEn: "Expression of gratitude",
    meaningTh: "ขอบคุณ",
    examples: [ex("Thank you for your help.", "Grateful for assistance", "ขอบคุณที่ช่วยเหลือ")],
  },
  {
    id: "en-please",
    word: "Please",
    phonology: "/pliːz/",
    meaningEn: "Polite request",
    meaningTh: "ได้โปรด / ขอร้อง",
    examples: [ex("Two tickets, please.", "Polite order at a counter", "ตั๋วสองใบ ขอร้องครับ/ค่ะ")],
  },
  {
    id: "en-sorry",
    word: "Sorry",
    phonology: "/ˈsɒri/",
    meaningEn: "Apology",
    meaningTh: "ขอโทษ",
    examples: [ex("I'm sorry I'm late.", "Apologizing for lateness", "ขอโทษที่มาสาย")],
  },
  {
    id: "en-water",
    word: "Water",
    phonology: "/ˈwɔːtə/",
    meaningEn: "H₂O; drinking water",
    meaningTh: "น้ำ",
    examples: [ex("A glass of water, please.", "Requesting water", "ขอน้ำเปล่าแก้วหนึ่งครับ/ค่ะ")],
  },
  {
    id: "en-help",
    word: "Help",
    phonology: "/help/",
    meaningEn: "Assistance",
    meaningTh: "ความช่วยเหลือ",
    examples: [ex("Can you help me?", "Asking for help", "ช่วยฉันได้ไหม?")],
  },
];

const TH: VocabEntry[] = [
  {
    id: "th-sawasdee",
    word: "สวัสดี",
    phonology: "sà-wàt-dii",
    meaningEn: "Hello / goodbye (general greeting)",
    meaningTh: "คำทักทายทั่วไป",
    examples: [ex("สวัสดีครับ", "Hello (male, polite)", "ทักทายผู้ชายอย่างสุภาพ")],
  },
  {
    id: "th-khop",
    word: "ขอบคุณ",
    phonology: "khòp-khun",
    meaningEn: "Thank you",
    meaningTh: "แสดงความขอบคุณ",
    examples: [ex("ขอบคุณมากครับ", "Thank you very much (male)", "ขอบคุณมากอย่างสุภาพ")],
  },
  {
    id: "th-chai",
    word: "ใช่",
    phonology: "châi",
    meaningEn: "Yes (that's right)",
    meaningTh: "ตอบรับ / ถูกต้อง",
    examples: [ex("ใช่ไหมครับ?", "Is that right?", "ใช่หรือเปล่า (สุภาพ)")],
  },
  {
    id: "th-mai",
    word: "ไม่",
    phonology: "mâi",
    meaningEn: "No; not",
    meaningTh: "ปฏิเสธ / ไม่ใช่",
    examples: [ex("ไม่เป็นไร", "It's okay / never mind", "ไม่เป็นไร / ไม่มีปัญหา")],
  },
  {
    id: "th-nam",
    word: "น้ำ",
    phonology: "nám",
    meaningEn: "Water",
    meaningTh: "ของเหลว / น้ำดื่ม",
    examples: [ex("น้ำเปล่า", "Plain water", "น้ำดื่มไม่มีรส")],
  },
  {
    id: "th-rot",
    word: "รถ",
    phonology: "rót",
    meaningEn: "Vehicle; car",
    meaningTh: "ยานพาหนะ / รถยนต์",
    examples: [ex("รถไฟ", "Train", "รถไฟ")],
  },
  {
    id: "th-kin",
    word: "กิน",
    phonology: "kin",
    meaningEn: "To eat",
    meaningTh: "รับประทานอาหาร",
    examples: [ex("กินข้าวหรือยัง?", "Have you eaten yet?", "ถามว่าทานข้าวแล้วหรือยัง")],
  },
  {
    id: "th-pen",
    word: "เป็น",
    phonology: "bpen",
    meaningEn: "To be; to become",
    meaningTh: "กริยา 'เป็น'",
    examples: [ex("เป็นยังไงบ้าง?", "How are things?", "ถามอาการหรือความเป็นอยู่")],
  },
];

const ZH_CN: VocabEntry[] = [
  {
    id: "cn-nihao",
    word: "你好",
    phonology: "nǐ hǎo",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("你好，很高兴认识你。", "Hello, nice to meet you.", "สวัสดี ยินดีที่ได้รู้จัก")],
  },
  {
    id: "cn-xiexie",
    word: "谢谢",
    phonology: "xièxie",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("谢谢你的帮助。", "Thanks for your help.", "ขอบคุณสำหรับความช่วยเหลือ")],
  },
  {
    id: "cn-duibuqi",
    word: "对不起",
    phonology: "duìbuqǐ",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("对不起，我迟到了。", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "cn-shi",
    word: "是",
    phonology: "shì",
    meaningEn: "Yes; to be",
    meaningTh: "ใช่ / เป็น",
    examples: [ex("是的。", "Yes.", "ใช่")],
  },
  {
    id: "cn-bu",
    word: "不",
    phonology: "bù",
    meaningEn: "No; not",
    meaningTh: "ไม่",
    examples: [ex("我不会中文。", "I don't speak Chinese.", "ฉันพูดจีนไม่ได้")],
  },
  {
    id: "cn-shui",
    word: "水",
    phonology: "shuǐ",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("请给我一杯水。", "Please give me a glass of water.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
  {
    id: "cn-zaijian",
    word: "再见",
    phonology: "zàijiàn",
    meaningEn: "Goodbye",
    meaningTh: "ลาก่อน",
    examples: [ex("再见！", "Goodbye!", "ลาก่อน!")],
  },
];

const ZH_TW: VocabEntry[] = [
  {
    id: "tw-nihao",
    word: "你好",
    phonology: "ㄋㄧˇ ㄏㄠˇ",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("你好，歡迎來到臺灣。", "Hello, welcome to Taiwan.", "สวัสดี ยินดีต้อนรับสู่ไต้หวัน")],
  },
  {
    id: "tw-xiexie",
    word: "謝謝",
    phonology: "ㄒㄧㄝˋ ㄒㄧㄝˋ",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("謝謝你。", "Thank you.", "ขอบคุณคุณ")],
  },
  {
    id: "tw-duibuqi",
    word: "對不起",
    phonology: "ㄉㄨㄟˋ ㄅㄨˇ ㄑㄧˇ",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("對不起，我遲到了。", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "tw-shi",
    word: "是",
    phonology: "ㄕˋ",
    meaningEn: "Yes; to be",
    meaningTh: "ใช่ / เป็น",
    examples: [ex("是的。", "Yes.", "ใช่")],
  },
  {
    id: "tw-bu",
    word: "不",
    phonology: "ㄅㄨˋ",
    meaningEn: "No; not",
    meaningTh: "ไม่",
    examples: [ex("我不會。", "I can't / I don't know how.", "ฉันทำไม่เป็น")],
  },
  {
    id: "tw-zaijian",
    word: "再見",
    phonology: "ㄗㄞˋ ㄐㄧㄢˋ",
    meaningEn: "Goodbye",
    meaningTh: "ลาก่อน",
    examples: [ex("再見！", "Goodbye!", "ลาก่อน!")],
  },
];

const JA: VocabEntry[] = [
  {
    id: "ja-konnichiwa",
    word: "こんにちは",
    phonology: "konnichiwa",
    meaningEn: "Hello (daytime)",
    meaningTh: "สวัสดี (ตอนกลางวัน)",
    examples: [ex("こんにちは、元気ですか。", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "ja-arigato",
    word: "ありがとう",
    phonology: "arigatō",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("ありがとうございます。", "Thank you (polite).", "ขอบคุณอย่างสุภาพ")],
  },
  {
    id: "ja-sumimasen",
    word: "すみません",
    phonology: "sumimasen",
    meaningEn: "Excuse me; sorry",
    meaningTh: "ขอโทษ / ขออภัย",
    examples: [ex("すみません、駅はどこですか。", "Excuse me, where is the station?", "ขอโทษครับ/ค่ะ สถานีอยู่ไหน")],
  },
  {
    id: "ja-hai",
    word: "はい",
    phonology: "hai",
    meaningEn: "Yes",
    meaningTh: "ใช่ / ครับ/ค่ะ",
    examples: [ex("はい、そうです。", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "ja-iie",
    word: "いいえ",
    phonology: "iie",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("いいえ、違います。", "No, that's not right.", "ไม่ ไม่ใช่")],
  },
  {
    id: "ja-mizu",
    word: "水",
    phonology: "mizu",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("水をください。", "Water, please.", "ขอน้ำครับ/ค่ะ")],
  },
  {
    id: "ja-sayonara",
    word: "さようなら",
    phonology: "sayōnara",
    meaningEn: "Goodbye",
    meaningTh: "ลาก่อน",
    examples: [ex("さようなら、また明日。", "Goodbye, see you tomorrow.", "ลาก่อน เจอกันพรุ่งนี้")],
  },
];

const KO: VocabEntry[] = [
  {
    id: "ko-annyeong",
    word: "안녕하세요",
    phonology: "annyeonghaseyo",
    meaningEn: "Hello (polite)",
    meaningTh: "สวัสดี (สุภาพ)",
    examples: [ex("안녕하세요, 만나서 반갑습니다.", "Hello, nice to meet you.", "สวัสดี ยินดีที่ได้รู้จัก")],
  },
  {
    id: "ko-gamsa",
    word: "감사합니다",
    phonology: "gamsahamnida",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("도와주셔서 감사합니다.", "Thank you for helping me.", "ขอบคุณที่ช่วยเหลือ")],
  },
  {
    id: "ko-joesong",
    word: "죄송합니다",
    phonology: "joesonghamnida",
    meaningEn: "I'm sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("늦어서 죄송합니다.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "ko-ne",
    word: "네",
    phonology: "ne",
    meaningEn: "Yes",
    meaningTh: "ใช่ / ครับ/ค่ะ",
    examples: [ex("네, 맞아요.", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "ko-aniyo",
    word: "아니요",
    phonology: "aniyo",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("아니요, 괜찮아요.", "No, it's fine.", "ไม่ ไม่เป็นไร")],
  },
  {
    id: "ko-mul",
    word: "물",
    phonology: "mul",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("물 한 잔 주세요.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const MS: VocabEntry[] = [
  {
    id: "ms-hai",
    word: "Hai",
    phonology: "/haɪ/",
    meaningEn: "Yes; hi",
    meaningTh: "ใช่ / หรือทักทายแบบสั้น",
    examples: [ex("Hai, apa khabar?", "Hi, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "ms-terima",
    word: "Terima kasih",
    phonology: "/təˈrima ˈkasih/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Terima kasih banyak.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "ms-maaf",
    word: "Maaf",
    phonology: "/maʔaf/",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Maaf, saya lewat.", "Sorry, I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "ms-air",
    word: "Air",
    phonology: "/aʔir/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Satu gelas air, sila.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
  {
    id: "ms-tolong",
    word: "Tolong",
    phonology: "/ˈtoloŋ/",
    meaningEn: "Please; help",
    meaningTh: "ช่วยด้วย / ได้โปรด",
    examples: [ex("Tolong bantu saya.", "Please help me.", "กรุณาช่วยฉันด้วย")],
  },
  {
    id: "ms-tidak",
    word: "Tidak",
    phonology: "/ˈtidaʔ/",
    meaningEn: "No; not",
    meaningTh: "ไม่",
    examples: [ex("Tidak mengapa.", "It's okay.", "ไม่เป็นไร")],
  },
];

const ID: VocabEntry[] = [
  {
    id: "id-halo",
    word: "Halo",
    phonology: "/ˈhalo/",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("Halo, apa kabar?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "id-terima",
    word: "Terima kasih",
    phonology: "/təˈrima ˈkasɪh/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Terima kasih banyak.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "id-maaf",
    word: "Maaf",
    phonology: "/maʔaf/",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Maaf saya terlambat.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "id-air",
    word: "Air",
    phonology: "/aʔir/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Satu gelas air, tolong.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
  {
    id: "id-ya",
    word: "Ya",
    phonology: "/ja/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Ya, benar.", "Yes, correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "id-tidak",
    word: "Tidak",
    phonology: "/ˈtidaʔ/",
    meaningEn: "No; not",
    meaningTh: "ไม่",
    examples: [ex("Tidak apa-apa.", "It's nothing / it's okay.", "ไม่เป็นไร")],
  },
];

const VI: VocabEntry[] = [
  {
    id: "vi-xin-chao",
    word: "Xin chào",
    phonology: "/sin tɕaːw˨˩/",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("Xin chào, bạn khỏe không?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "vi-cam-on",
    word: "Cảm ơn",
    phonology: "/kam ʔɜn˦˥/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Cảm ơn bạn nhiều.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "vi-xin-loi",
    word: "Xin lỗi",
    phonology: "/sin lɔj˦˥/",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Xin lỗi tôi đến muộn.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "vi-vang",
    word: "Vâng",
    phonology: "/vəŋ˧˥/",
    meaningEn: "Yes (polite, Northern)",
    meaningTh: "ใช่ (สุภาพ)",
    examples: [ex("Vâng, đúng ạ.", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "vi-khong",
    word: "Không",
    phonology: "/kʰoŋ˧/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Không sao.", "It's okay.", "ไม่เป็นไร")],
  },
  {
    id: "vi-nuoc",
    word: "Nước",
    phonology: "/nuə̯k˦˥/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Cho tôi một ly nước.", "Give me a glass of water.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const LO: VocabEntry[] = [
  {
    id: "lo-sabaidi",
    word: "ສະບາຍດີ",
    phonology: "sábai di",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("ສະບາຍດີ, ສະບາຍດີບໍ?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "lo-khop",
    word: "ຂອບໃຈ",
    phonology: "khǒop jai",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("ຂອບໃຈຫຼາຍໆ.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "lo-ko-thot",
    word: "ຂໍໂທດ",
    phonology: "khǒo thôot",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("ຂໍໂທດທີ່ມາຊ້າ.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "lo-chai",
    word: "ໃຊ່",
    phonology: "chài",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("ໃຊ່, ຖືກຕ້ອງ.", "Yes, correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "lo-bo",
    word: "ບໍ່",
    phonology: "bò",
    meaningEn: "No; not",
    meaningTh: "ไม่",
    examples: [ex("ບໍ່ເປັນຫຍັງ.", "It's okay / never mind.", "ไม่เป็นไร")],
  },
  {
    id: "lo-nam",
    word: "ນ້ຳ",
    phonology: "nám",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("ນ້ຳຫນຶ່ງແກ້ວ.", "A glass of water.", "น้ำหนึ่งแก้ว")],
  },
];

const KM: VocabEntry[] = [
  {
    id: "km-sousdey",
    word: "ជំរាបសួរ",
    phonology: "chom reap suor",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("ជំរាបសួរ អ្នកសុខសប្បាយទេ?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "km-akun",
    word: "អរគុណ",
    phonology: "ɑɑ kun",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("អរគុណច្រើន។", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "km-som-tos",
    word: "សុំទោស",
    phonology: "som toŭəh",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("សុំទោសដែលយឺត។", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "km-baht",
    word: "បាទ/ចាស",
    phonology: "baat / caah",
    meaningEn: "Yes (male/female polite)",
    meaningTh: "ใช่ (สุภาพ)",
    examples: [ex("បាទ ត្រូវហើយ។", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "km-ot-te",
    word: "អត់ទេ។",
    phonology: "ɑt te",
    meaningEn: "It's okay; never mind",
    meaningTh: "ไม่เป็นไร",
    examples: [ex("អត់ទេ មិនអីទេ។", "It's okay, no problem.", "ไม่เป็นไร ไม่มีปัญหา")],
  },
  {
    id: "km-tuk",
    word: "ទឹក",
    phonology: "tɨk",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("ទឹកមួយកែវ។", "A glass of water.", "น้ำหนึ่งแก้ว")],
  },
];

const HI: VocabEntry[] = [
  {
    id: "hi-namaste",
    word: "नमस्ते",
    phonology: "namaste [nəməsteː]",
    meaningEn: "Hello (respectful greeting)",
    meaningTh: "สวัสดี (แบบเคารพ)",
    examples: [ex("नमस्ते, आप कैसे हैं?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "hi-dhanyavaad",
    word: "धन्यवाद",
    phonology: "dhanyavād [d̪ʱənjʋaːd̪]",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("आपकी मदद के लिए धन्यवाद।", "Thanks for your help.", "ขอบคุณสำหรับความช่วยเหลือ")],
  },
  {
    id: "hi-maaf",
    word: "माफ़ कीजिए",
    phonology: "māf kījie [maːf kiːdʒɪeː]",
    meaningEn: "Excuse me; sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("माफ़ कीजिए, मुझे देर हो गई।", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "hi-haan",
    word: "हाँ",
    phonology: "hā̃ [ɦaː̃]",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("हाँ, सही है।", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "hi-nahi",
    word: "नहीं",
    phonology: "nahī̃ [nəˈɦiː̃]",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("नहीं, कोई बात नहीं।", "No, it's okay.", "ไม่ ไม่เป็นไร")],
  },
  {
    id: "hi-paani",
    word: "पानी",
    phonology: "pānī [paːniː]",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("एक गिलास पानी, कृपया।", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const AR: VocabEntry[] = [
  {
    id: "ar-salam",
    word: "السَّلَامُ عَلَيْكُم",
    phonology: "as-salāmu ʿalaykum [assalaːmu ʕalajkum]",
    meaningEn: "Peace be upon you (greeting)",
    meaningTh: "คำทักทายมุสลิม",
    examples: [ex("السَّلَامُ عَلَيْكُم، كيف حالك؟", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "ar-shukran",
    word: "شُكْرًا",
    phonology: "šukran [ˈʃukran]",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("شُكْرًا جزيلًا.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "ar-asif",
    word: "آسِف",
    phonology: "ʾāsif [ˈʔaːsif]",
    meaningEn: "Sorry (I'm sorry)",
    meaningTh: "ขอโทษ",
    examples: [ex("آسف، لقد تأخرتُ.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "ar-naam",
    word: "نَعَم",
    phonology: "naʿam [ˈnaʕam]",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("نعم، هذا صحيح.", "Yes, that's correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "ar-la",
    word: "لا",
    phonology: "lā [laː]",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("لا بأس.", "It's okay / no problem.", "ไม่เป็นไร")],
  },
  {
    id: "ar-ma",
    word: "مَاء",
    phonology: "māʾ [maːʔ]",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("كأس ماء، مِن فَضْلِك.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const FR: VocabEntry[] = [
  {
    id: "fr-bonjour",
    word: "Bonjour",
    phonology: "/bɔ̃ˈʒuʁ/",
    meaningEn: "Hello; good day",
    meaningTh: "สวัสดีตอนกลางวัน",
    examples: [ex("Bonjour, comment allez-vous ?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "fr-merci",
    word: "Merci",
    phonology: "/mɛʁˈsi/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Merci beaucoup.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "fr-pardon",
    word: "Pardon",
    phonology: "/paʁˈdɔ̃/",
    meaningEn: "Sorry; excuse me",
    meaningTh: "ขอโทษ",
    examples: [ex("Pardon pour le retard.", "Sorry for the delay.", "ขอโทษที่มาสาย")],
  },
  {
    id: "fr-oui",
    word: "Oui",
    phonology: "/wi/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Oui, c'est correct.", "Yes, that's correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "fr-non",
    word: "Non",
    phonology: "/nɔ̃/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Non, ce n'est pas grave.", "No, it's not serious.", "ไม่ ไม่หนักหนา")],
  },
  {
    id: "fr-eau",
    word: "Eau",
    phonology: "/o/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Un verre d'eau, s'il vous plaît.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const DE: VocabEntry[] = [
  {
    id: "de-hallo",
    word: "Hallo",
    phonology: "/ˈhaloː/",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("Hallo, wie geht es dir?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "de-danke",
    word: "Danke",
    phonology: "/ˈdaŋkə/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Vielen Dank.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "de-entschuldigung",
    word: "Entschuldigung",
    phonology: "/ɛntˈʃʊldɪɡʊŋ/",
    meaningEn: "Sorry; excuse me",
    meaningTh: "ขอโทษ",
    examples: [ex("Entschuldigung, ich bin zu spät.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "de-ja",
    word: "Ja",
    phonology: "/jaː/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Ja, das stimmt.", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "de-nein",
    word: "Nein",
    phonology: "/naɪ̯n/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Nein, schon gut.", "No, it's fine.", "ไม่ ไม่เป็นไร")],
  },
  {
    id: "de-wasser",
    word: "Wasser",
    phonology: "/ˈvasɐ/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Ein Glas Wasser, bitte.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const ES: VocabEntry[] = [
  {
    id: "es-hola",
    word: "Hola",
    phonology: "/ˈola/",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("Hola, ¿cómo estás?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "es-gracias",
    word: "Gracias",
    phonology: "/ˈɡɾaθjas/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Muchas gracias.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "es-perdon",
    word: "Perdón",
    phonology: "/peɾˈðon/",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Perdón por llegar tarde.", "Sorry for arriving late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "es-si",
    word: "Sí",
    phonology: "/si/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Sí, es correcto.", "Yes, that's correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "es-no",
    word: "No",
    phonology: "/no/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("No pasa nada.", "It's okay / no problem.", "ไม่เป็นไร")],
  },
  {
    id: "es-agua",
    word: "Agua",
    phonology: "/ˈaɡwa/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Un vaso de agua, por favor.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const IT: VocabEntry[] = [
  {
    id: "it-ciao",
    word: "Ciao",
    phonology: "/ˈtʃao/",
    meaningEn: "Hi / bye (informal)",
    meaningTh: "สวัสดี / บาย (ไม่เป็นทางการ)",
    examples: [ex("Ciao, come stai?", "Hi, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "it-grazie",
    word: "Grazie",
    phonology: "/ˈɡrattsje/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Grazie mille.", "Thanks a lot.", "ขอบคุณมาก")],
  },
  {
    id: "it-scusa",
    word: "Scusa",
    phonology: "/ˈskuza/",
    meaningEn: "Sorry (informal)",
    meaningTh: "ขอโทษ",
    examples: [ex("Scusa il ritardo.", "Sorry for the delay.", "ขอโทษที่มาสาย")],
  },
  {
    id: "it-si",
    word: "Sì",
    phonology: "/si/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Sì, è giusto.", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "it-no",
    word: "No",
    phonology: "/ˈnɔ/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("No, non fa niente.", "No, it's nothing.", "ไม่ ไม่เป็นไร")],
  },
  {
    id: "it-acqua",
    word: "Acqua",
    phonology: "/ˈakkwa/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Un bicchiere d'acqua, per favore.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const NL: VocabEntry[] = [
  {
    id: "nl-hallo",
    word: "Hallo",
    phonology: "/ˈhɑloː/",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("Hallo, hoe gaat het?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "nl-dank",
    word: "Dank je",
    phonology: "/dɑŋk jə/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Heel erg bedankt.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "nl-sorry",
    word: "Sorry",
    phonology: "/ˈsɔri/",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Sorry dat ik te laat ben.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "nl-ja",
    word: "Ja",
    phonology: "/jaː/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Ja, dat klopt.", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "nl-nee",
    word: "Nee",
    phonology: "/neː/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Nee, maakt niet uit.", "No, it doesn't matter.", "ไม่ ไม่เป็นไร")],
  },
  {
    id: "nl-water",
    word: "Water",
    phonology: "/ˈʋaːtər/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Een glas water, alstublieft.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const RU: VocabEntry[] = [
  {
    id: "ru-zdravstvuj",
    word: "Здравствуйте",
    phonology: "/ˈzdrastvujtʲɪ/",
    meaningEn: "Hello (formal)",
    meaningTh: "สวัสดี (ทางการ)",
    examples: [ex("Здравствуйте, как дела?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "ru-spasibo",
    word: "Спасибо",
    phonology: "/spɐˈsʲibə/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Большое спасибо.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "ru-izvinite",
    word: "Извините",
    phonology: "/ɪzˈvʲinʲɪtʲɪ/",
    meaningEn: "Excuse me; sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Извините за опоздание.", "Sorry for being late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "ru-da",
    word: "Да",
    phonology: "/da/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Да, всё верно.", "Yes, that's correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "ru-net",
    word: "Нет",
    phonology: "/nʲet/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Нет, всё нормально.", "No, it's okay.", "ไม่ ไม่เป็นไร")],
  },
  {
    id: "ru-voda",
    word: "Вода",
    phonology: "/vɐˈda/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Стакан воды, пожалуйста.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const PT: VocabEntry[] = [
  {
    id: "pt-ola",
    word: "Olá",
    phonology: "/oˈla/",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("Olá, tudo bem?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "pt-obrigado",
    word: "Obrigado / Obrigada",
    phonology: "/obɾiˈɡadu/ · /obɾiˈɡadɐ/",
    meaningEn: "Thank you (m/f)",
    meaningTh: "ขอบคุณ (ชาย/หญิง)",
    examples: [ex("Muito obrigado.", "Thank you very much (m).", "ขอบคุณมาก")],
  },
  {
    id: "pt-desculpe",
    word: "Desculpe",
    phonology: "/dʒisˈkulpi/",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Desculpe o atraso.", "Sorry for the delay.", "ขอโทษที่มาสาย")],
  },
  {
    id: "pt-sim",
    word: "Sim",
    phonology: "/sĩ/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Sim, está certo.", "Yes, that's correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "pt-nao",
    word: "Não",
    phonology: "/nɐ̃w/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Não tem problema.", "No problem.", "ไม่เป็นไร")],
  },
  {
    id: "pt-agua",
    word: "Água",
    phonology: "/ˈagwɐ/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Um copo d'água, por favor.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const TR: VocabEntry[] = [
  {
    id: "tr-merhaba",
    word: "Merhaba",
    phonology: "/meɾˈhaba/",
    meaningEn: "Hello",
    meaningTh: "สวัสดี",
    examples: [ex("Merhaba, nasılsın?", "Hello, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "tr-tesekkur",
    word: "Teşekkür ederim",
    phonology: "/teʃekˈkyɾ edeˈɾim/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Çok teşekkür ederim.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "tr-ozur",
    word: "Özür dilerim",
    phonology: "/ˈœzyɾ diˈleɾim/",
    meaningEn: "I'm sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Geç kaldığım için özür dilerim.", "I'm sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "tr-evet",
    word: "Evet",
    phonology: "/eˈvet/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Evet, doğru.", "Yes, that's right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "tr-hayir",
    word: "Hayır",
    phonology: "/haˈjɯɾ/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Hayır, sorun değil.", "No, it's not a problem.", "ไม่ ไม่มีปัญหา")],
  },
  {
    id: "tr-su",
    word: "Su",
    phonology: "/su/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Bir bardak su, lütfen.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const PL: VocabEntry[] = [
  {
    id: "pl-czesc",
    word: "Cześć",
    phonology: "/tʂɛɕtɕ/",
    meaningEn: "Hi / hello (informal)",
    meaningTh: "สวัสดี (ไม่เป็นทางการ)",
    examples: [ex("Cześć, jak się masz?", "Hi, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "pl-dziekuje",
    word: "Dziękuję",
    phonology: "/ˈdʑɛŋkujɛ/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Bardzo dziękuję.", "Thank you very much.", "ขอบคุณมาก")],
  },
  {
    id: "pl-przepraszam",
    word: "Przepraszam",
    phonology: "/pʂɛˈpraʂam/",
    meaningEn: "Sorry; excuse me",
    meaningTh: "ขอโทษ",
    examples: [ex("Przepraszam za spóźnienie.", "Sorry for being late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "pl-tak",
    word: "Tak",
    phonology: "/tak/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Tak, masz rację.", "Yes, you're right.", "ใช่ ถูกต้อง")],
  },
  {
    id: "pl-nie",
    word: "Nie",
    phonology: "/ɲɛ/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Nie szkodzi.", "It doesn't matter / that's okay.", "ไม่เป็นไร")],
  },
  {
    id: "pl-woda",
    word: "Woda",
    phonology: "/ˈvɔda/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Szklanka wody, proszę.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const UK: VocabEntry[] = [
  {
    id: "uk-pryvit",
    word: "Привіт",
    phonology: "/prɪˈʋit/",
    meaningEn: "Hi / hello",
    meaningTh: "สวัสดี",
    examples: [ex("Привіт, як справи?", "Hi, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "uk-diakuju",
    word: "Дякую",
    phonology: "/ˈdʲakuju/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Щиро дякую.", "Thank you sincerely.", "ขอบคุณอย่างจริงใจ")],
  },
  {
    id: "uk-vybac",
    word: "Вибачте",
    phonology: "/ˈʋɪbatʃte/",
    meaningEn: "Excuse me; sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Вибачте за запізнення.", "Sorry for being late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "uk-tak",
    word: "Так",
    phonology: "/tak/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Так, це правильно.", "Yes, that's correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "uk-ni",
    word: "Ні",
    phonology: "/n⁽ʲ⁾i/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Ні, нічого страшного.", "No, it's nothing serious.", "ไม่ ไม่หนักหนา")],
  },
  {
    id: "uk-voda",
    word: "Вода",
    phonology: "/vɔˈda/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Склянка води, будь ласка.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

const SV: VocabEntry[] = [
  {
    id: "sv-hej",
    word: "Hej",
    phonology: "/hɛjː/",
    meaningEn: "Hi / hello",
    meaningTh: "สวัสดี",
    examples: [ex("Hej, hur mår du?", "Hi, how are you?", "สวัสดี สบายดีไหม")],
  },
  {
    id: "sv-tack",
    word: "Tack",
    phonology: "/takː/",
    meaningEn: "Thank you",
    meaningTh: "ขอบคุณ",
    examples: [ex("Stort tack.", "Thanks a lot.", "ขอบคุณมาก")],
  },
  {
    id: "sv-forlat",
    word: "Förlåt",
    phonology: "/fœrˈloːt/",
    meaningEn: "Sorry",
    meaningTh: "ขอโทษ",
    examples: [ex("Förlåt att jag är sen.", "Sorry I'm late.", "ขอโทษที่มาสาย")],
  },
  {
    id: "sv-ja",
    word: "Ja",
    phonology: "/jaː/",
    meaningEn: "Yes",
    meaningTh: "ใช่",
    examples: [ex("Ja, det stämmer.", "Yes, that's correct.", "ใช่ ถูกต้อง")],
  },
  {
    id: "sv-nej",
    word: "Nej",
    phonology: "/nɛjː/",
    meaningEn: "No",
    meaningTh: "ไม่",
    examples: [ex("Nej, det är lugnt.", "No, it's cool / it's fine.", "ไม่ ไม่เป็นไร")],
  },
  {
    id: "sv-vatten",
    word: "Vatten",
    phonology: "/ˈvatːɛn/",
    meaningEn: "Water",
    meaningTh: "น้ำ",
    examples: [ex("Ett glas vatten, tack.", "A glass of water, please.", "ขอน้ำหนึ่งแก้วครับ/ค่ะ")],
  },
];

export const VOCAB_BY_LANGUAGE: Record<string, VocabEntry[]> = {
  en: EN,
  th: TH,
  "zh-CN": ZH_CN,
  "zh-TW": ZH_TW,
  ja: JA,
  ko: KO,
  ms: MS,
  id: ID,
  vi: VI,
  lo: LO,
  km: KM,
  hi: HI,
  ar: AR,
  fr: FR,
  de: DE,
  es: ES,
  it: IT,
  nl: NL,
  ru: RU,
  pt: PT,
  tr: TR,
  pl: PL,
  uk: UK,
  sv: SV,
};

export function getVocabForLanguage(code: string): VocabEntry[] {
  return VOCAB_BY_LANGUAGE[code] ?? [];
}

export function getPhonologyLabel(code: string): string {
  return PHONOLOGY_SYSTEM_BY_LANG[code] ?? "Pronunciation guide";
}

/** Fisher–Yates shuffle (in-place copy) */
export function shuffleArray<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuizQuestion = {
  entryId: string;
  promptWord: string;
  promptPhonology: string;
  optionLabels: string[];
  correctIndex: number;
};

export function buildVocabQuizQuestions(
  deck: VocabEntry[],
  count: number,
  gloss: "en" | "th"
): QuizQuestion[] {
  if (deck.length < 2) return [];
  const shuffled = shuffleArray(deck);
  const take = Math.min(count, shuffled.length);
  const questions: QuizQuestion[] = [];
  const pick = (e: VocabEntry) => (gloss === "en" ? e.meaningEn : e.meaningTh);

  for (let i = 0; i < take; i++) {
    const correct = shuffled[i];
    const distractors = shuffleArray(
      deck.filter((e) => e.id !== correct.id)
    ).slice(0, 3);
    const correctLabel = pick(correct);
    const options = shuffleArray([
      correctLabel,
      ...distractors.map((d) => pick(d)),
    ]);
    const correctIndex = options.indexOf(correctLabel);

    questions.push({
      entryId: correct.id,
      promptWord: correct.word,
      promptPhonology: correct.phonology,
      optionLabels: options,
      correctIndex,
    });
  }

  return questions;
}
