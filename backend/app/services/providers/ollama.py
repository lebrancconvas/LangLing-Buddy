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
