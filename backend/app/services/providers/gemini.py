import base64
import copy
import json
import logging
from typing import Any

import httpx

from app.config import settings
from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

# Built-in fallbacks after the primary model (often separate quota / RPM pools on free tier).
_BUILTIN_GEMINI_FALLBACKS: tuple[str, ...] = (
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
)

# Flash-Lite often rejects larger maxOutputTokens on some API tiers (400 INVALID_ARGUMENT).
_LITE_MODEL_SUBSTRING = "lite"


def _cap_max_output_tokens(model_id: str, requested: int) -> int:
    """Clamp requested ceiling to values Gemini accepts reliably per model family."""
    r = max(256, min(int(requested), 65536))
    if _LITE_MODEL_SUBSTRING in model_id.lower():
        return min(r, 4096)
    return min(r, 8192)


def _max_output_retry_chain(model_id: str, requested: int) -> list[int]:
    """Descending limits to retry on HTTP 400 (invalid generationConfig, etc.)."""
    cap = _cap_max_output_tokens(model_id, requested)
    tiers: list[int] = [cap]
    for t in (4096, 3072, 2048, 1536, 1024, 768, 512):
        if t < tiers[-1]:
            tiers.append(t)
    return tiers


def _gemini_headers(api_key: str) -> dict[str, str]:
    """Prefer header auth so keys never appear in URLs or HTTPStatusError messages."""
    return {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
    }


def _model_candidates(primary: str) -> list[str]:
    """Primary first, then built-ins and GEMINI_MODEL_FALLBACKS from settings (deduped)."""
    out: list[str] = []
    p = primary.strip()
    if p:
        out.append(p)
    for m in _BUILTIN_GEMINI_FALLBACKS:
        if m not in out:
            out.append(m)
    extra = (settings.GEMINI_MODEL_FALLBACKS or "").strip()
    if extra:
        for part in extra.split(","):
            m = part.strip()
            if m and m not in out:
                out.append(m)
    return out


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
        models = _model_candidates(primary)

        temperature = kwargs.get("temperature", 0.7)
        max_tokens = kwargs.get("max_tokens", 2048)

        payload_base: dict[str, Any] = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }
        if system_prompt.strip():
            payload_base["systemInstruction"] = {"parts": [{"text": system_prompt}]}

        headers = _gemini_headers(self.api_key)
        last_detail = ""

        async with httpx.AsyncClient(timeout=60) as client:
            for model in models:
                url = f"{GEMINI_API_URL}/{model}:generateContent"
                token_chain = _max_output_retry_chain(model, max_tokens)
                model_failed = False

                for max_out in token_chain:
                    payload = copy.deepcopy(payload_base)
                    payload["generationConfig"]["maxOutputTokens"] = max_out
                    resp = await client.post(url, json=payload, headers=headers)

                    if resp.status_code == 429:
                        last_detail = resp.text[:400]
                        logger.warning(
                            "Gemini model %s rate limited (429), trying next model. %s",
                            model,
                            last_detail[:200],
                        )
                        model_failed = True
                        break
                    if resp.status_code == 404:
                        last_detail = resp.text[:400]
                        logger.warning(
                            "Gemini model %s not found (404), trying fallback. Body: %s",
                            model,
                            last_detail,
                        )
                        model_failed = True
                        break

                    if resp.status_code == 400:
                        last_detail = resp.text[:800]
                        low = last_detail.lower()
                        logger.warning(
                            "Gemini model %s HTTP 400 (maxOutputTokens=%s): %s",
                            model,
                            max_out,
                            last_detail[:400],
                        )
                        # Unknown / wrong model id — lowering tokens will not help.
                        if "was not found" in low:
                            model_failed = True
                            break
                        # Typical Flash-Lite production fix: retry with smaller maxOutputTokens.
                        if max_out != token_chain[-1]:
                            continue
                        model_failed = True
                        break

                    if resp.status_code != 200:
                        last_detail = resp.text[:400]
                        resp.raise_for_status()

                    data = resp.json()
                    try:
                        return data["candidates"][0]["content"]["parts"][0]["text"]
                    except (KeyError, IndexError) as exc:
                        logger.error(
                            "Unexpected Gemini response: %s", json.dumps(data)[:500]
                        )
                        raise RuntimeError("Failed to parse Gemini response") from exc

                if model_failed:
                    continue

        raise RuntimeError(
            "All Gemini models failed (rate limits, invalid ids, or errors). "
            "Last detail: " + (last_detail or "unknown")
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
        models = _model_candidates(primary)
        temperature = kwargs.get("temperature", 0.2)
        max_tokens = kwargs.get("max_tokens", 8192)

        b64 = base64.b64encode(image_bytes).decode("ascii")
        parts: list[dict[str, Any]] = [
            {"text": prompt},
            {"inline_data": {"mime_type": mime_type, "data": b64}},
        ]
        payload_base: dict[str, Any] = {
            "contents": [{"role": "user", "parts": parts}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }
        if system_prompt.strip():
            payload_base["systemInstruction"] = {"parts": [{"text": system_prompt}]}

        headers = _gemini_headers(self.api_key)
        last_detail = ""

        async with httpx.AsyncClient(timeout=120) as client:
            for model in models:
                url = f"{GEMINI_API_URL}/{model}:generateContent"
                token_chain = _max_output_retry_chain(model, max_tokens)
                model_failed = False

                for max_out in token_chain:
                    payload = copy.deepcopy(payload_base)
                    payload["generationConfig"]["maxOutputTokens"] = max_out
                    resp = await client.post(url, json=payload, headers=headers)

                    if resp.status_code == 429:
                        last_detail = resp.text[:400]
                        logger.warning(
                            "Gemini model %s rate limited (429), trying next model. %s",
                            model,
                            last_detail[:200],
                        )
                        model_failed = True
                        break
                    if resp.status_code == 404:
                        last_detail = resp.text[:400]
                        logger.warning(
                            "Gemini model %s not found (404) [vision], trying fallback",
                            model,
                        )
                        model_failed = True
                        break

                    if resp.status_code == 400:
                        last_detail = resp.text[:800]
                        low = last_detail.lower()
                        logger.warning(
                            "Gemini model %s HTTP 400 [vision] (maxOutputTokens=%s): %s",
                            model,
                            max_out,
                            last_detail[:400],
                        )
                        if "was not found" in low:
                            model_failed = True
                            break
                        if max_out != token_chain[-1]:
                            continue
                        model_failed = True
                        break

                    if resp.status_code != 200:
                        last_detail = resp.text[:400]
                        resp.raise_for_status()

                    data = resp.json()
                    try:
                        return data["candidates"][0]["content"]["parts"][0]["text"]
                    except (KeyError, IndexError) as exc:
                        logger.error(
                            "Unexpected Gemini vision response: %s",
                            json.dumps(data)[:500],
                        )
                        raise RuntimeError(
                            "Failed to parse Gemini vision response"
                        ) from exc

                if model_failed:
                    continue

        raise RuntimeError(
            "All Gemini vision models failed (rate limits, invalid ids, or errors). "
            "Last detail: " + (last_detail or "unknown")
        )

    async def is_available(self) -> bool:
        return bool(self.api_key)

    async def get_quota_status(self) -> float:
        # Real limits come from Google's API (429). Do not throttle locally.
        return 1.0 if self.api_key else 0.0
