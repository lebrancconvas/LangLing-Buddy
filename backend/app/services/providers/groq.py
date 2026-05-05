import json
import logging
from typing import Any

import httpx

from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_MODEL = "llama-3.1-70b-versatile"


class GroqProvider(BaseProvider):
    """Groq inference provider (OpenAI-compatible API)."""

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        self._request_count = 0

    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        if not self.api_key:
            raise RuntimeError("Groq API key not configured")

        model = kwargs.get("model", DEFAULT_MODEL)
        temperature = kwargs.get("temperature", 0.7)
        max_tokens = kwargs.get("max_tokens", 2048)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(GROQ_API_URL, json=payload, headers=headers)
            self._request_count += 1

            if resp.status_code == 429:
                raise RuntimeError("Groq rate limit exceeded")
            resp.raise_for_status()

            data = resp.json()
            try:
                return data["choices"][0]["message"]["content"]
            except (KeyError, IndexError) as exc:
                logger.error("Unexpected Groq response: %s", json.dumps(data)[:500])
                raise RuntimeError("Failed to parse Groq response") from exc

    async def is_available(self) -> bool:
        return bool(self.api_key)

    async def get_quota_status(self) -> float:
        if self._request_count >= 30:
            return 0.0
        return 1.0 - (self._request_count / 30.0)
