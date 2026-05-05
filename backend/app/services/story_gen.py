import json
import logging
import uuid

from app.models.schemas import StorySegment
from app.prompts.story import STORY_CONTINUE_PROMPT, STORY_SYSTEM_PROMPT
from app.services.ai_router import ai_router

logger = logging.getLogger(__name__)


class StoryEngine:
    """Interactive branching narrative story engine."""

    def __init__(self) -> None:
        self._sessions: dict[str, list[dict]] = {}

    async def start_story(
        self,
        topic: str,
        language: str = "en",
        era: str = "",
        style: str = "narrative",
    ) -> tuple[StorySegment, str]:
        story_id = str(uuid.uuid4())

        prompt = STORY_SYSTEM_PROMPT.format(
            language=language,
            era=era or "any historical era",
            style=style,
            topic=topic,
        )

        response = await ai_router.generate(
            prompt=f"Begin an interactive historical story about: {topic}",
            system_prompt=prompt,
            temperature=0.9,
        )

        segment = self._parse_segment(response)
        self._sessions[story_id] = [{"text": segment.text, "choices": segment.choices}]
        return segment, story_id

    async def continue_story(
        self, story_id: str, choice_index: int
    ) -> StorySegment:
        history = self._sessions.get(story_id, [])
        if not history:
            raise ValueError(f"Story session {story_id} not found")

        last = history[-1]
        choices = last.get("choices", [])
        if choice_index >= len(choices):
            choice_text = f"Choice {choice_index}"
        else:
            choice_text = choices[choice_index].get("text", f"Choice {choice_index}")

        context_parts = [entry["text"] for entry in history[-3:]]
        context = "\n\n".join(context_parts)

        prompt = STORY_CONTINUE_PROMPT.format(
            context=context,
            choice=choice_text,
        )

        response = await ai_router.generate(
            prompt=prompt,
            temperature=0.9,
        )

        segment = self._parse_segment(response)
        history.append({"text": segment.text, "choices": segment.choices})
        self._sessions[story_id] = history
        return segment

    def _parse_segment(self, response: str) -> StorySegment:
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
            return StorySegment(
                text=data.get("text", response),
                choices=data.get("choices", []),
            )
        except (json.JSONDecodeError, Exception):
            return StorySegment(
                text=response,
                choices=[
                    {"text": "Continue the story", "id": 0},
                    {"text": "Take a different path", "id": 1},
                ],
            )


story_engine = StoryEngine()
