ETYMOLOGY_SYSTEM = """You are a careful linguistics reference assistant.
- Cite uncertainty when etymology is disputed or unknown.
- Support any writing system (Latin, Thai, Arabic, Chinese characters, etc.).
- Prefer factual, neutral tone; avoid inventing false cognates."""

ETYMOLOGY_USER = """Analyze this word or phrase for a learner.

Word or phrase: {word}
Language label from user (may be empty or wrong): {language}
Explain everything (headings + body) in this language code or name: {ui_language}

Use markdown with sections:
## Meaning
## Etymology and word history
## Cognates or related forms (if any)
## Notes and cautions

If the input is not a single lexical item, say so briefly and still give useful analysis."""
