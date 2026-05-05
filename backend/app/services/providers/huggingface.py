import json
import logging
from typing import Any

import httpx

from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)

HF_INFERENCE_URL = "https://api-inference.huggingface.co/models"
DEFAULT_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"


class HuggingFaceProvider(BaseProvider):
    """HuggingFace Inference API provider."""

    def __init__(self, api_token: str) -> None:
        self.api_token = api_token
        self._request_count = 0

    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        if not self.api_token:
            raise RuntimeError("HuggingFace API token not configured")

        model = kwargs.get("model", DEFAULT_MODEL)
        temperature = kwargs.get("temperature", 0.7)
        max_tokens = kwargs.get("max_tokens", 1024)

        full_prompt = prompt
        if system_prompt:
            full_prompt = f"[INST] {system_prompt}\n\n{prompt} [/INST]"

        payload = {
            "inputs": full_prompt,
            "parameters": {
                "temperature": temperature,
                "max_new_tokens": max_tokens,
                "return_full_text": False,
            },
        }

        headers = {"Authorization": f"Bearer {self.api_token}"}
        url = f"{HF_INFERENCE_URL}/{model}"

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(url, json=payload, headers=headers)
            self._request_count += 1

            if resp.status_code == 429:
                raise RuntimeError("HuggingFace rate limit exceeded")
            if resp.status_code == 503:
                raise RuntimeError("HuggingFace model is loading, try again later")
            resp.raise_for_status()

            data = resp.json()
            try:
                if isinstance(data, list) and data:
                    return data[0].get("generated_text", "")
                return str(data)
            except Exception as exc:
                logger.error("Unexpected HF response: %s", json.dumps(data)[:500])
                raise RuntimeError("Failed to parse HuggingFace response") from exc

    async def is_available(self) -> bool:
        return bool(self.api_token)

    async def get_quota_status(self) -> float:
        return max(0.0, 1.0 - (self._request_count / 100.0))

    async def translate(self, text: str, model: str = "Helsinki-NLP/opus-mt-en-th") -> str:
        """Use a dedicated Helsinki-NLP translation model."""
        if not self.api_token:
            raise RuntimeError("HuggingFace API token not configured")

        url = f"{HF_INFERENCE_URL}/{model}"
        headers = {"Authorization": f"Bearer {self.api_token}"}
        payload = {"inputs": text}

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, list) and data:
                return data[0].get("translation_text", str(data[0]))
            return str(data)
