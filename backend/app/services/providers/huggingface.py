import json
import logging
from typing import Any

import httpx

from app.config import settings
from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)

HF_INFERENCE_URL = "https://api-inference.huggingface.co/models"


def _format_hf_chat_prompt(model_id: str, system_prompt: str, user_prompt: str) -> str:
    """Format prompt for the Inference API; templates differ by model family."""
    mid = model_id.lower()
    if "gemma" in mid:
        if system_prompt:
            return (
                f"<start_of_turn>user\n{system_prompt}\n\n{user_prompt}<end_of_turn>\n"
                "<start_of_turn>model\n"
            )
        return f"<start_of_turn>user\n{user_prompt}<end_of_turn>\n<start_of_turn>model\n"
    if system_prompt:
        return f"[INST] {system_prompt}\n\n{user_prompt} [/INST]"
    return user_prompt


class HuggingFaceProvider(BaseProvider):
    """HuggingFace Inference API provider."""

    def __init__(self, api_token: str) -> None:
        self.api_token = api_token
        self.default_model = settings.HF_CHAT_MODEL

    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        if not self.api_token:
            raise RuntimeError("HuggingFace API token not configured")

        model = kwargs.get("model", self.default_model)
        temperature = kwargs.get("temperature", 0.7)
        max_tokens = kwargs.get("max_tokens", 1024)

        full_prompt = _format_hf_chat_prompt(model, system_prompt, prompt)

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
        return 1.0 if self.api_token else 0.0

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
