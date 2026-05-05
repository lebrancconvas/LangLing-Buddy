from abc import ABC, abstractmethod
from typing import Any


class BaseProvider(ABC):
    """Abstract base class for all AI providers."""

    @abstractmethod
    async def generate(
        self, prompt: str, system_prompt: str = "", **kwargs: Any
    ) -> str:
        """Generate a completion from the given prompt."""
        ...

    @abstractmethod
    async def is_available(self) -> bool:
        """Check whether this provider is currently reachable and configured."""
        ...

    @abstractmethod
    async def get_quota_status(self) -> float:
        """Return remaining quota as a float between 0.0 and 1.0."""
        ...
