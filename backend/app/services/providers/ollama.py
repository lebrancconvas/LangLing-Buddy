import base64
import json
import logging
from typing import Any

import httpx

from app.config import settings
from app.services.providers.base import BaseProvider

logger = logging.getLogger(__name__)


class OllamaProvider(BaseProvider):
    """Local Ollama inference provider."""

    def __init__(self, base_url: str = "http://localhost:11434") -> None:
        self.base_url = base_url.rstrip("/")
        self.default_model = settings.OLLAMA_MODEL
        self._available_models: list[str] = []

    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        model = kwargs.get("model", self.default_model)
        temperature = kwargs.get("temperature", 0.7)

        payload: dict[str, Any] = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature},
        }
        if system_prompt:
            payload["system"] = system_prompt

        url = f"{self.base_url}/api/generate"

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data.get("response", "")

    async def generate_with_image(
        self,
        prompt: str,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str = "",
        **kwargs: Any,
    ) -> str:
        """Multimodal `/api/chat` (vision models such as llama3.2-vision, llava)."""
        b64 = base64.b64encode(image_bytes).decode("ascii")

        model = (kwargs.get("ollama_vision_model") or "").strip()
        if not model:
            model = (settings.OLLAMA_VISION_MODEL or "").strip()
        if not model:
            dm = (self.default_model or "").lower()
            if "vision" in dm or "llava" in dm or "bakllava" in dm or "moondream" in dm:
                model = self.default_model
            else:
                model = "llama3.2-vision"

        messages: list[dict[str, Any]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append(
            {"role": "user", "content": prompt, "images": [b64]}
        )

        temperature = kwargs.get("temperature", 0.2)
        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": temperature},
        }

        url = f"{self.base_url}/api/chat"

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                body = resp.text[:500]
                logger.error(
                    "Ollama vision chat error %s: %s (model=%s)",
                    resp.status_code,
                    body,
                    model,
                )
                resp.raise_for_status()
            data = resp.json()
            msg = data.get("message") or {}
            content = msg.get("content") or ""
            if content:
                return str(content).strip()

        raise RuntimeError("Failed to parse Ollama vision chat response")

    async def is_available(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=3) as client:
                resp = await client.get(f"{self.base_url}/api/tags")
                if resp.status_code == 200:
                    data = resp.json()
                    self._available_models = [
                        m["name"] for m in data.get("models", [])
                    ]
                    return len(self._available_models) > 0
                return False
        except (httpx.HTTPError, Exception):
            return False

    async def get_quota_status(self) -> float:
        return 1.0
