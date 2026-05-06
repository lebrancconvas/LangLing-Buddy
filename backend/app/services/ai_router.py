import logging
from typing import Any

from app.config import settings
from app.models.schemas import AIProvider
from app.services.providers.base import BaseProvider
from app.services.providers.gemini import GeminiProvider
from app.services.providers.groq import GroqProvider
from app.services.providers.huggingface import HuggingFaceProvider
from app.services.providers.ollama import OllamaProvider

logger = logging.getLogger(__name__)


class AIRouter:
    """Routes requests to the best available AI provider with smart fallback.

    Priority order: Gemini -> Groq -> HuggingFace -> Ollama (local).
    If a preferred provider is specified, it gets highest priority.
    """

    def __init__(self) -> None:
        self.providers: dict[str, BaseProvider] = {}
        self._init_providers()

    def _init_providers(self) -> None:
        self.providers["gemini"] = GeminiProvider(settings.GEMINI_API_KEY)
        self.providers["groq"] = GroqProvider(settings.GROQ_API_KEY)
        self.providers["huggingface"] = HuggingFaceProvider(settings.HF_API_TOKEN)
        self.providers["ollama"] = OllamaProvider(settings.OLLAMA_BASE_URL)

    async def generate(
        self,
        prompt: str,
        system_prompt: str = "",
        preferred_provider: str | None = None,
        **kwargs: Any,
    ) -> str:
        """Try providers in priority order until one succeeds."""
        order = self._build_priority(preferred_provider)
        last_error: Exception | None = None

        for name in order:
            provider = self.providers[name]
            try:
                if not await provider.is_available():
                    logger.debug("Provider %s not available, skipping", name)
                    continue

                quota = await provider.get_quota_status()
                if quota <= 0:
                    logger.debug("Provider %s has no remaining quota, skipping", name)
                    continue

                logger.info("Routing request to %s", name)
                result = await provider.generate(prompt, system_prompt, **kwargs)
                return result

            except Exception as exc:
                logger.warning("Provider %s failed: %s", name, exc)
                last_error = exc
                continue

        raise RuntimeError(
            f"All AI providers failed. Last error: {last_error}"
        )

    async def generate_with_image(
        self,
        prompt: str,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str = "",
        **kwargs: Any,
    ) -> str:
        """Vision / multimodal — Gemini only (requires GEMINI_API_KEY)."""
        gemini = self.providers.get("gemini")
        if not gemini or not await gemini.is_available():
            raise RuntimeError(
                "Image features require a configured Google Gemini API key (GEMINI_API_KEY)."
            )
        gen = getattr(gemini, "generate_with_image", None)
        if gen is None:
            raise RuntimeError("Gemini provider does not support vision")
        return await gen(
            prompt, image_bytes, mime_type, system_prompt=system_prompt, **kwargs
        )

    async def get_available_providers(self) -> list[AIProvider]:
        results: list[AIProvider] = []
        for name, provider in self.providers.items():
            try:
                available = await provider.is_available()
                quota = await provider.get_quota_status() if available else 0.0
            except Exception:
                available = False
                quota = 0.0
            results.append(
                AIProvider(name=name, available=available, quota_remaining=quota)
            )
        return results

    def _build_priority(self, preferred: str | None) -> list[str]:
        default_order = ["gemini", "groq", "huggingface", "ollama"]
        if preferred and preferred in default_order:
            default_order.remove(preferred)
            default_order.insert(0, preferred)
        return default_order

    def get_provider(self, name: str) -> BaseProvider:
        if name not in self.providers:
            raise ValueError(f"Unknown provider: {name}")
        return self.providers[name]


ai_router = AIRouter()
