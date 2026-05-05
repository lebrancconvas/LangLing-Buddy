import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
USER_AGENT = "LangLing/1.0 (Educational AI App; https://github.com/langling) httpx/0.27"


class RAGEngine:
    """Retrieval-Augmented Generation engine using Wikipedia as a knowledge source."""

    def __init__(self) -> None:
        self._cache: dict[str, str] = {}

    async def retrieve(self, query: str, language: str = "en", max_results: int = 3) -> list[dict[str, str]]:
        """Retrieve relevant context from Wikipedia for a given query."""
        wiki_api = WIKIPEDIA_API.replace("en.", f"{language}.")
        if language != "en":
            wiki_api = f"https://{language}.wikipedia.org/w/api.php"

        results: list[dict[str, str]] = []

        try:
            search_results = await self._search_wikipedia(wiki_api, query, max_results)
            for title in search_results:
                content = await self._get_page_extract(wiki_api, title)
                if content:
                    results.append({"title": title, "content": content, "source": f"Wikipedia ({language})"})
        except Exception as exc:
            logger.warning("Wikipedia retrieval failed: %s", exc)

        return results

    async def get_context_string(self, query: str, language: str = "en") -> str:
        """Retrieve context and format it as a single string for the LLM prompt."""
        docs = await self.retrieve(query, language)
        if not docs:
            return ""
        parts = []
        for doc in docs:
            parts.append(f"Source: {doc['title']} ({doc['source']})\n{doc['content']}")
        return "\n\n---\n\n".join(parts)

    def _get_client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            timeout=15,
            headers={"User-Agent": USER_AGENT},
        )

    async def _search_wikipedia(self, api_url: str, query: str, limit: int) -> list[str]:
        params: dict[str, Any] = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
            "format": "json",
        }
        async with self._get_client() as client:
            resp = await client.get(api_url, params=params)
            resp.raise_for_status()
            data = resp.json()
            return [item["title"] for item in data.get("query", {}).get("search", [])]

    async def _get_page_extract(self, api_url: str, title: str) -> str:
        cache_key = f"{api_url}:{title}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        params: dict[str, Any] = {
            "action": "query",
            "titles": title,
            "prop": "extracts",
            "exintro": True,
            "explaintext": True,
            "format": "json",
        }
        async with self._get_client() as client:
            resp = await client.get(api_url, params=params)
            resp.raise_for_status()
            data = resp.json()
            pages = data.get("query", {}).get("pages", {})
            for page in pages.values():
                extract = page.get("extract", "")
                if extract:
                    trimmed = extract[:2000]
                    self._cache[cache_key] = trimmed
                    return trimmed
        return ""


rag_engine = RAGEngine()
