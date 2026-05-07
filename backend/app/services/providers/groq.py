import base64
import json
import logging
from typing import Any

import httpx

from app.config import settings
from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# High free-tier RPM first; OSS 20B is a documented fallback if a model id is retired.
_GROQ_MODEL_FALLBACKS = ("llama-3.1-8b-instant", "openai/gpt-oss-20b")

# Vision: Groq multimodal chat (same OpenAI-compatible endpoint).
_GROQ_VISION_FALLBACKS = (
    "meta-llama/llama-4-scout-17b-16e-instruct",
)


class GroqProvider(BaseProvider):
    """Groq inference provider (OpenAI-compatible API)."""

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        self.default_model = settings.GROQ_MODEL

    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        if not self.api_key:
            raise RuntimeError("Groq API key not configured")

        primary = kwargs.get("model", self.default_model)
        models: list[str] = []
        for m in (primary, *_GROQ_MODEL_FALLBACKS):
            if m not in models:
                models.append(m)

        temperature = kwargs.get("temperature", 0.7)
        max_tokens = kwargs.get("max_tokens", 2048)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        last_body = ""
        async with httpx.AsyncClient(timeout=60) as client:
            for model in models:
                payload["model"] = model
                resp = await client.post(GROQ_API_URL, json=payload, headers=headers)

                if resp.status_code == 429:
                    raise RuntimeError("Groq rate limit exceeded")
                if resp.status_code == 200:
                    data = resp.json()
                    try:
                        return data["choices"][0]["message"]["content"]
                    except (KeyError, IndexError) as exc:
                        logger.error("Unexpected Groq response: %s", json.dumps(data)[:500])
                        raise RuntimeError("Failed to parse Groq response") from exc

                last_body = resp.text[:500]
                low = last_body.lower()
                if resp.status_code == 400 and (
                    "model" in low
                    and (
                        "decommission" in low
                        or "invalid" in low
                        or "does not exist" in low
                        or "not found" in low
                    )
                ):
                    logger.warning(
                        "Groq model %s rejected (400), trying fallback", model
                    )
                    continue

                logger.error("Groq API error %d: %s", resp.status_code, last_body)
                resp.raise_for_status()

        raise RuntimeError("No working Groq model. Last error: " + last_body)

    async def generate_with_image(
        self,
        prompt: str,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str = "",
        **kwargs: Any,
    ) -> str:
        """Multimodal chat completion (vision). OpenAI-compatible content parts."""
        if not self.api_key:
            raise RuntimeError("Groq API key not configured")

        primary = (
            kwargs.get("groq_vision_model") or settings.GROQ_VISION_MODEL or ""
        ).strip()
        models: list[str] = []
        for m in (primary, *_GROQ_VISION_FALLBACKS):
            ms = str(m).strip()
            if ms and ms not in models:
                models.append(ms)

        temperature = kwargs.get("temperature", 0.2)
        max_tokens = kwargs.get("max_tokens", 8192)
        response_format = kwargs.get("response_format")

        b64 = base64.b64encode(image_bytes).decode("ascii")
        mime = (mime_type or "image/png").split(";")[0].strip().lower()
        data_uri = f"data:{mime};base64,{b64}"

        user_content: list[dict[str, Any]] = [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": data_uri}},
        ]
        messages: list[dict[str, Any]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_content})

        payload: dict[str, Any] = {
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format is not None:
            payload["response_format"] = response_format

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        last_body = ""
        async with httpx.AsyncClient(timeout=120) as client:
            for model in models:
                payload["model"] = model
                resp = await client.post(GROQ_API_URL, json=payload, headers=headers)

                if resp.status_code == 429:
                    logger.warning("Groq vision model %s rate limited (429)", model)
                    continue
                if resp.status_code == 200:
                    data = resp.json()
                    try:
                        return data["choices"][0]["message"]["content"]
                    except (KeyError, IndexError) as exc:
                        logger.error(
                            "Unexpected Groq vision response: %s", json.dumps(data)[:500]
                        )
                        raise RuntimeError(
                            "Failed to parse Groq vision response"
                        ) from exc

                last_body = resp.text[:500]
                low = last_body.lower()
                if resp.status_code == 400 and (
                    "model" in low
                    and (
                        "decommission" in low
                        or "invalid" in low
                        or "does not exist" in low
                        or "not found" in low
                    )
                ):
                    logger.warning(
                        "Groq vision model %s rejected (400), trying fallback",
                        model,
                    )
                    continue

                logger.error("Groq vision API error %d: %s", resp.status_code, last_body)
                resp.raise_for_status()

        raise RuntimeError(
            "No working Groq vision model. Last error: " + (last_body or "unknown")
        )

    async def is_available(self) -> bool:
        return bool(self.api_key)

    async def get_quota_status(self) -> float:
        return 1.0 if self.api_key else 0.0
