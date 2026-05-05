import json
import logging
from typing import Any

import httpx

from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"
DEFAULT_MODEL = "gemini-2.0-flash"


class GeminiProvider(BaseProvider):
    """Google Gemini AI provider using the REST API."""

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        self._request_count = 0

    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        if not self.api_key:
            raise RuntimeError("Gemini API key not configured")

        model = kwargs.get("model", DEFAULT_MODEL)
        temperature = kwargs.get("temperature", 0.7)
        max_tokens = kwargs.get("max_tokens", 2048)

        contents = []
        if system_prompt:
            contents.append({"role": "user", "parts": [{"text": system_prompt}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I will follow these instructions."}]})
        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }

        url = f"{GEMINI_API_URL}/{model}:generateContent?key={self.api_key}"

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(url, json=payload)
            self._request_count += 1

            if resp.status_code == 429:
                raise RuntimeError("Gemini rate limit exceeded")
            resp.raise_for_status()

            data = resp.json()
            try:
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError) as exc:
                logger.error("Unexpected Gemini response: %s", json.dumps(data)[:500])
                raise RuntimeError("Failed to parse Gemini response") from exc

    async def is_available(self) -> bool:
        return bool(self.api_key)

    async def get_quota_status(self) -> float:
        if self._request_count >= 15:
            return 0.0
        return 1.0 - (self._request_count / 15.0)
