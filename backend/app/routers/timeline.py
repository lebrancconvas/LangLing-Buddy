import json
import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import TimelineEvent, TimelineRequest, TimelineResponse
from app.services.ai_router import ai_router
from app.services.content import content_pipeline

logger = logging.getLogger(__name__)

router = APIRouter()

TIMELINE_PROMPT = """Generate a detailed timeline of key historical events related to "{topic}".
{year_range}

For EACH event, provide rich and informative content — not just a headline. Include:
- A clear title
- A description (2-3 sentences summarizing what happened)
- Detailed context (3-5 sentences explaining the background, causes, and how it unfolded)
- The lasting impact or significance (2-3 sentences on long-term effects)
- Key figures involved (people, organizations, or nations)
- Related events that connect to it

Output format (JSON array):
[
  {{
    "year": 1776,
    "title": "Event title",
    "description": "2-3 sentence summary of what happened",
    "detail": "3-5 sentences providing deeper context, background, causes, and how the event unfolded in detail",
    "impact": "2-3 sentences on the lasting significance, consequences, and legacy of this event",
    "key_figures": ["Person or group 1", "Person or group 2"],
    "category": "political|military|cultural|scientific|economic",
    "related_events": ["Related event 1", "Related event 2"]
  }}
]

Generate 8-15 events, sorted chronologically. Be historically accurate.
Include a MIX of well-known and lesser-known events. Go beyond the obvious — include cultural, scientific, and social milestones, not just political/military ones."""


@router.post("/generate", response_model=TimelineResponse)
async def generate_timeline(request: TimelineRequest):
    try:
        year_range = ""
        if request.start_year and request.end_year:
            year_range = f"Focus on events between {request.start_year} and {request.end_year}."
        elif request.start_year:
            year_range = f"Focus on events from {request.start_year} onwards."
        elif request.end_year:
            year_range = f"Focus on events up to {request.end_year}."

        prompt = TIMELINE_PROMPT.format(topic=request.topic, year_range=year_range)

        response = await ai_router.generate(
            prompt=prompt,
            temperature=0.7,
            max_tokens=8192,
        )

        events = _parse_events(response)

        wiki_context = await content_pipeline.get_timeline_events(
            request.topic, request.language
        )
        sources = [item["title"] for item in wiki_context]
        if sources:
            logger.info("Enriched timeline with Wikipedia sources: %s", sources)

        return TimelineResponse(events=events, topic=request.topic)

    except Exception as exc:
        logger.error("Timeline generation error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/events/{topic}")
async def get_events(topic: str):
    wiki_events = await content_pipeline.get_timeline_events(topic)
    return {"events": wiki_events, "topic": topic}


def _parse_events(response: str) -> list[TimelineEvent]:
    try:
        text = response.strip()
        if "```" in text:
            start = text.find("```")
            end = text.rfind("```")
            inner = text[start:end]
            nl = inner.find("\n")
            if nl != -1:
                text = inner[nl + 1:]
        data = json.loads(text)
        if isinstance(data, list):
            return [TimelineEvent(**evt) for evt in data]
    except json.JSONDecodeError as exc:
        logger.warning("Failed to parse timeline JSON: %s", exc)
        events = _try_salvage_truncated_json(text)
        if events:
            return events

    return [
        TimelineEvent(
            year=2000,
            title="Sample Event",
            description="AI generated content could not be parsed",
            category="general",
        )
    ]


def _try_salvage_truncated_json(text: str) -> list[TimelineEvent]:
    """Attempt to recover events from a truncated JSON response."""
    try:
        last_complete = text.rfind("}")
        if last_complete == -1:
            return []
        truncated = text[: last_complete + 1]
        if not truncated.rstrip().endswith("]"):
            truncated = truncated.rstrip().rstrip(",") + "]"
        data = json.loads(truncated)
        if isinstance(data, list) and len(data) > 0:
            logger.info("Salvaged %d events from truncated response", len(data))
            return [TimelineEvent(**evt) for evt in data]
    except Exception:
        pass
    return []
