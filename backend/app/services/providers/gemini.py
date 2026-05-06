import base64
import json
import logging
from typing import Any

import httpx

from app.config import settings
from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

# Tried in order if the configured model returns 404 (retired name / regional rollout).
_GEMINI_MODEL_FALLBACKS = ("gemini-2.5-flash-lite", "gemini-2.5-flash")


class GeminiProvider(BaseProvider):
    """Google Gemini AI provider using the REST API."""

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        self.default_model = settings.GEMINI_MODEL

    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        if not self.api_key:
            raise RuntimeError("Gemini API key not configured")

        primary = kwargs.get("model", self.default_model)
        models: list[str] = []
        for m in (primary, *_GEMINI_MODEL_FALLBACKS):
            if m not in models:
                models.append(m)

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

        last_detail = ""
        async with httpx.AsyncClient(timeout=60) as client:
            for model in models:
                url = f"{GEMINI_API_URL}/{model}:generateContent?key={self.api_key}"
                resp = await client.post(url, json=payload)

                if resp.status_code == 429:
                    raise RuntimeError("Gemini rate limit exceeded")
                if resp.status_code == 404:
                    last_detail = resp.text[:400]
                    logger.warning(
                        "Gemini model %s not found (404), trying fallback. Body: %s",
                        model,
                        last_detail,
                    )
                    continue

                if resp.status_code != 200:
                    last_detail = resp.text[:400]
                    # Invalid model names sometimes surface as 400 INVALID_ARGUMENT
                    if resp.status_code == 400 and (
                        "was not found" in last_detail.lower()
                        or "invalid" in last_detail.lower()
                    ):
                        logger.warning(
                            "Gemini model %s rejected (400), trying fallback", model
                        )
                        continue
                    resp.raise_for_status()

                data = resp.json()
                try:
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except (KeyError, IndexError) as exc:
                    logger.error("Unexpected Gemini response: %s", json.dumps(data)[:500])
                    raise RuntimeError("Failed to parse Gemini response") from exc

        raise RuntimeError(
            "No working Gemini model available. Last error: " + (last_detail or "unknown")
        )

    async def generate_with_image(
        self,
        prompt: str,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str = "",
        **kwargs: Any,
    ) -> str:
        """Multimodal completion (text + one inline image). Requires vision-capable model."""
        if not self.api_key:
            raise RuntimeError("Gemini API key not configured")

        primary = kwargs.get("model", self.default_model)
        models: list[str] = []
        for m in (primary, *_GEMINI_MODEL_FALLBACKS):
            if m not in models:
                models.append(m)

        temperature = kwargs.get("temperature", 0.2)
        max_tokens = kwargs.get("max_tokens", 8192)

        text_block = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        b64 = base64.b64encode(image_bytes).decode("ascii")
        parts: list[dict[str, Any]] = [
            {"text": text_block},
            {"inline_data": {"mime_type": mime_type, "data": b64}},
        ]
        payload: dict[str, Any] = {
            "contents": [{"role": "user", "parts": parts}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }

        last_detail = ""
        async with httpx.AsyncClient(timeout=120) as client:
            for model in models:
                url = f"{GEMINI_API_URL}/{model}:generateContent?key={self.api_key}"
                resp = await client.post(url, json=payload)

                if resp.status_code == 429:
                    raise RuntimeError("Gemini rate limit exceeded")
                if resp.status_code == 404:
                    last_detail = resp.text[:400]
                    logger.warning(
                        "Gemini model %s not found (404) [vision], trying fallback",
                        model,
                    )
                    continue

                if resp.status_code != 200:
                    last_detail = resp.text[:400]
                    if resp.status_code == 400 and (
                        "was not found" in last_detail.lower()
                        or "invalid" in last_detail.lower()
                    ):
                        logger.warning(
                            "Gemini model %s rejected (400) [vision], trying fallback",
                            model,
                        )
                        continue
                    resp.raise_for_status()

                data = resp.json()
                try:
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except (KeyError, IndexError) as exc:
                    logger.error(
                        "Unexpected Gemini vision response: %s", json.dumps(data)[:500]
                    )
                    raise RuntimeError("Failed to parse Gemini vision response") from exc

        raise RuntimeError(
            "No working Gemini model for vision. Last error: " + (last_detail or "unknown")
        )

    async def is_available(self) -> bool:
        return bool(self.api_key)

    async def get_quota_status(self) -> float:
        # Real limits come from Google's API (429). Do not throttle locally.
        return 1.0 if self.api_key else 0.0
