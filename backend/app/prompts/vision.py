OCR_SYSTEM = """You read text in images for a language-learning app.
Transcribe faithfully. If text is unclear, say so. Output valid JSON only."""

OCR_USER = """Look at the image. Identify writing systems (alphabet, syllabary, abjad, logographs, etc.).

Return ONLY a single JSON object with this shape (no markdown outside JSON):
{{
  "writing_systems": ["list of scripts you detect, e.g. Latin, Thai, Cyrillic"],
  "language_guess": "best guess of primary language or empty string",
  "full_transcription": "all readable text in order, with line breaks where natural",
  "words": ["notable word-like tokens in reading order"],
  "sentences": ["if sentences are clear, list them; else empty array"],
  "alphabet_or_script_notes": "short note on letters/symbols or empty string",
  "confidence_note": "what was fuzzy or blocked"
}}

If there is no text, use empty strings and empty arrays where appropriate and explain in confidence_note."""

CHINESE_HW_SYSTEM = """You recognize hand-drawn Chinese characters (Hanzi) for a learning app.
Rank plausible characters by visual match. Output valid JSON only (no markdown).
For romanizations: use standard references where possible; if unsure, use empty string — never invent."""

CHINESE_HW_USER = """The user drew ONE Chinese character on a white canvas (dark strokes).

Return ONLY one JSON object with this exact structure:

{{
  "drawing_note": "short global note e.g. clarity, or empty string",
  "candidates": [
    {{
      "rank": 1,
      "character": "single Unicode Hanzi — best match",
      "confidence_note": "why this rank fits the strokes",
      "simplified": "simplified form or same as character",
      "traditional": "traditional form if different, else same",
      "readings": {{
        "pinyin": "Hanyu Pinyin with tone marks",
        "zhuyin_bopomofo": "Zhuyin / Bopomofo ㄅㄆㄇㄈ form e.g. ㄒㄩㄝˊ",
        "wade_giles": "Wade–Giles if applicable",
        "cantonese_jyutping": "Jyutping (粤拼)",
        "cantonese_yale": "Yale Cantonese romanization",
        "hokkien_poj": "Pe̍h-ōe-jī (POJ) for Taiwanese / Hokkien reading",
        "teochew_pengim": "Peng'im / Teochew romanization e.g. Dio̍k-ìu-pêng-im",
        "hakka_pin_yim": "Hakka Pin-yim or common Hakka romanization",
        "hainanese": "Hainanese / 海南话 reading if known, else empty",
        "shanghainese_wugniu": "Shanghai / Wu e.g. Wugniu or similar, else empty"
      }},
      "meaning": "concise English gloss",
      "stroke_count": <integer or null>,
      "stroke_order_description": "brief 笔顺 or empty",
      "example_words": ["2-4 words/phrases containing this character"],
      "usage_notes": "confusables, register, or empty"
    }}
  ]
}}

Rules:
- Provide exactly **11** objects in `"candidates"`, **rank** 1 (best) through 11 (least likely). Same character must not repeat; use visually similar distinct characters if unsure.
- Less certain readings must be "" rather than guessed.
- If the drawing is not Chinese, use empty `"character"` strings and explain in `drawing_note`."""
