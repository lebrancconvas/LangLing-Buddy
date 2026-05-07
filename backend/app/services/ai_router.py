import asyncio
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
    """Routes requests to providers with fallback.

    Text: Gemini → Groq → Hugging Face → Ollama.
    Vision (images): Gemini → Groq (Llama vision) → Ollama (/api/chat + vision tags).
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

        raise RuntimeError(f"All AI providers failed. Last error: {last_error}")

    def _kwargs_for_vision_provider(
        self, name: str, base_kwargs: dict[str, Any]
    ) -> dict[str, Any]:
        """Per-provider knobs so Gemini/Ollama model ids are not leaked into Groq."""
        pk = {k: v for k, v in base_kwargs.items() if k not in ("preferred_provider",)}
        if name == "gemini":
            vm = (settings.GEMINI_VISION_MODEL or "").strip()
            if vm:
                pk["model"] = vm
            return pk
        if name == "groq":
            pk.pop("model", None)
            pk.pop("ollama_vision_model", None)
            return pk
        if name == "ollama":
            pk.pop("model", None)
            return pk
        pk.pop("model", None)
        return pk

    async def generate_with_image(
        self,
        prompt: str,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str = "",
        preferred_provider: str | None = None,
        **kwargs: Any,
    ) -> str:
        """Vision / multimodal: Gemini → Groq → Ollama (providers with `generate_with_image`)."""
        order = self._build_priority(preferred_provider)
        last_err: BaseException | None = None

        base_kwargs = {k: v for k, v in kwargs.items() if v is not None}

        for name in order:
            provider = self.providers.get(name)
            if not provider:
                continue
            gen = getattr(provider, "generate_with_image", None)
            if gen is None or not callable(gen):
                logger.debug("Provider %s has no multimodal API, skipping", name)
                continue

            try:
                available = await provider.is_available()
            except Exception as exc:
                logger.warning("Vision provider %s availability failed: %s", name, exc)
                continue
            if not available:
                logger.debug("Vision provider %s not configured, skipping", name)
                continue

            try:
                quota = await provider.get_quota_status()
            except Exception as exc:
                logger.warning(
                    "Vision provider %s quota check failed: %s", name, exc
                )
                continue
            if quota <= 0:
                continue

            vk = self._kwargs_for_vision_provider(name, base_kwargs)

            if name == "gemini":
                for attempt in range(2):
                    try:
                        logger.info("Routing vision to %s", name)
                        return await gen(
                            prompt,
                            image_bytes,
                            mime_type,
                            system_prompt=system_prompt,
                            **vk,
                        )
                    except RuntimeError as exc:
                        last_err = exc
                        msg = str(exc).lower()
                        is_rate = (
                            "rate limit" in msg
                            or "429" in msg
                            or "resource exhausted" in msg
                            or "quota" in msg
                        )
                        if attempt == 0 and is_rate:
                            logger.info(
                                "Gemini vision exhausted/quota; waiting 2s then retry once "
                                "before fallback providers."
                            )
                            await asyncio.sleep(2.0)
                            continue
                        logger.warning(
                            "Gemini vision failed (attempt %s): %s", attempt + 1, exc
                        )
                        break
                continue

            try:
                logger.info("Routing vision to %s", name)
                return await gen(
                    prompt,
                    image_bytes,
                    mime_type,
                    system_prompt=system_prompt,
                    **vk,
                )
            except Exception as exc:
                logger.warning("Vision provider %s failed: %s", name, exc)
                last_err = exc
                continue

        raise RuntimeError(
            "All vision-capable providers failed (configure GEMINI_API_KEY and/or "
            "GROQ_API_KEY and/or pull a vision model for Ollama). "
            f"Last error: {last_err}"
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
