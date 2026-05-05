import logging

import httpx

logger = logging.getLogger(__name__)

WIKIPEDIA_API_TEMPLATE = "https://{lang}.wikipedia.org/w/api.php"


class ContentPipeline:
    """Fetches and processes educational content from various sources."""

    async def get_timeline_events(
        self, topic: str, language: str = "en", start_year: int | None = None, end_year: int | None = None
    ) -> list[dict]:
        """Fetch historical events related to a topic from Wikipedia."""
        api_url = WIKIPEDIA_API_TEMPLATE.format(lang=language)

        try:
            titles = await self._search(api_url, f"{topic} history timeline", limit=5)
            events: list[dict] = []
            for title in titles:
                extract = await self._get_extract(api_url, title)
                if extract:
                    events.append({
                        "title": title,
                        "description": extract[:500],
                        "source": f"Wikipedia ({language})",
                    })
            return events
        except Exception as exc:
            logger.warning("Content pipeline error: %s", exc)
            return []

    async def _search(self, api_url: str, query: str, limit: int = 5) -> list[str]:
        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
            "format": "json",
        }
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(api_url, params=params)
            resp.raise_for_status()
            data = resp.json()
            return [item["title"] for item in data.get("query", {}).get("search", [])]

    async def _get_extract(self, api_url: str, title: str) -> str:
        params = {
            "action": "query",
            "titles": title,
            "prop": "extracts",
            "exintro": True,
            "explaintext": True,
            "format": "json",
        }
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(api_url, params=params)
            resp.raise_for_status()
            pages = resp.json().get("query", {}).get("pages", {})
            for page in pages.values():
                return page.get("extract", "")[:2000]
        return ""


content_pipeline = ContentPipeline()
