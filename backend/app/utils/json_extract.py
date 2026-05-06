"""Best-effort extraction of a JSON object from LLM output."""

from __future__ import annotations

import json
import re


def extract_json_object(text: str) -> dict | None:
    text = text.strip()
    if "```" in text:
        block = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
        if block:
            text = block.group(1).strip()
    try:
        data = json.loads(text)
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        pass
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        try:
            data = json.loads(text[start : end + 1])
            return data if isinstance(data, dict) else None
        except json.JSONDecodeError:
            pass
    return None
