import json
import logging

from app.models.schemas import Flashcard, QuizQuestion
from app.prompts.quiz import FLASHCARD_SYSTEM_PROMPT, QUIZ_SYSTEM_PROMPT
from app.services.ai_router import ai_router

logger = logging.getLogger(__name__)


class QuizGenerator:
    """Generates quizzes and flashcards using AI."""

    async def generate_quiz(
        self,
        topic: str,
        language: str = "en",
        difficulty: str = "medium",
        num_questions: int = 5,
    ) -> list[QuizQuestion]:
        prompt = QUIZ_SYSTEM_PROMPT.format(
            language=language,
            topic=topic,
            difficulty=difficulty,
            num_questions=num_questions,
        )

        response = await ai_router.generate(
            prompt=f"Generate {num_questions} quiz questions about: {topic}",
            system_prompt=prompt,
            temperature=0.8,
        )

        return self._parse_quiz_response(response, num_questions)

    async def generate_flashcards(
        self,
        topic: str,
        language: str = "en",
        num_cards: int = 10,
    ) -> list[Flashcard]:
        prompt = FLASHCARD_SYSTEM_PROMPT.format(
            topic=topic,
            language=language,
            num_cards=num_cards,
        )

        response = await ai_router.generate(
            prompt=f"Generate {num_cards} flashcards about: {topic}",
            system_prompt=prompt,
            temperature=0.7,
        )

        return self._parse_flashcard_response(response, num_cards)

    def _parse_quiz_response(self, response: str, expected: int) -> list[QuizQuestion]:
        try:
            data = self._extract_json(response)
            if isinstance(data, list):
                return [QuizQuestion(**q) for q in data[:expected]]
        except Exception as exc:
            logger.warning("Failed to parse quiz JSON: %s", exc)

        return [
            QuizQuestion(
                question=f"Sample question about the topic ({i + 1})",
                options=["Option A", "Option B", "Option C", "Option D"],
                correct_answer=0,
                explanation="AI generated content could not be parsed.",
            )
            for i in range(expected)
        ]

    def _parse_flashcard_response(self, response: str, expected: int) -> list[Flashcard]:
        try:
            data = self._extract_json(response)
            if isinstance(data, list):
                return [Flashcard(**c) for c in data[:expected]]
        except Exception as exc:
            logger.warning("Failed to parse flashcard JSON: %s", exc)

        return [
            Flashcard(front=f"Term {i + 1}", back="Definition", example="Example sentence")
            for i in range(expected)
        ]

    @staticmethod
    def _extract_json(text: str) -> list | dict:
        """Extract JSON from a response that may contain markdown fences."""
        text = text.strip()
        if "```" in text:
            start = text.find("```")
            end = text.rfind("```")
            inner = text[start:end]
            first_newline = inner.find("\n")
            if first_newline != -1:
                text = inner[first_newline + 1:]
        return json.loads(text)


quiz_generator = QuizGenerator()
