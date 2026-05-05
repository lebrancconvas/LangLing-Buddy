import json
import logging

from app.models.schemas import (
    Flashcard,
    QuizAnswerSubmission,
    QuizAttempt,
    QuizQuestion,
    QuizSummaryResponse,
)
from app.prompts.quiz import FLASHCARD_SYSTEM_PROMPT, QUIZ_SUMMARY_PROMPT, QUIZ_SYSTEM_PROMPT
from app.services.ai_router import ai_router

logger = logging.getLogger(__name__)


class QuizGenerator:
    """Generates quizzes and flashcards using AI."""

    def __init__(self) -> None:
        self._history: list[QuizAttempt] = []

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
            prompt=f"Generate {num_questions} unique and diverse quiz questions about: {topic}. Surprise me with varied angles.",
            system_prompt=prompt,
            temperature=0.95,
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
            prompt=f"Generate {num_cards} diverse and unique flashcards about: {topic}. Cover different aspects and difficulty levels.",
            system_prompt=prompt,
            temperature=0.85,
        )

        return self._parse_flashcard_response(response, num_cards)

    async def generate_summary(
        self,
        topic: str,
        language: str,
        difficulty: str,
        score: int,
        total: int,
        questions: list[QuizQuestion],
        answers: list[QuizAnswerSubmission],
    ) -> QuizSummaryResponse:
        questions_detail = self._format_questions_for_summary(questions, answers)

        system_prompt = QUIZ_SUMMARY_PROMPT.format(
            topic=topic,
            language=language,
            difficulty=difficulty,
            score=score,
            total=total,
            questions_detail=questions_detail,
        )

        response = await ai_router.generate(
            prompt=f"Analyze quiz results for topic: {topic}. Score: {score}/{total}",
            system_prompt=system_prompt,
            temperature=0.6,
        )

        return self._parse_summary_response(response, score, total)

    def save_attempt(self, attempt: QuizAttempt) -> None:
        self._history.insert(0, attempt)
        if len(self._history) > 100:
            self._history = self._history[:100]

    def get_history(self) -> list[QuizAttempt]:
        return self._history

    def get_attempt(self, attempt_id: str) -> QuizAttempt | None:
        for attempt in self._history:
            if attempt.id == attempt_id:
                return attempt
        return None

    def _format_questions_for_summary(
        self, questions: list[QuizQuestion], answers: list[QuizAnswerSubmission]
    ) -> str:
        lines = []
        answer_map = {a.question_index: a.selected_answer for a in answers}
        for i, q in enumerate(questions):
            selected = answer_map.get(i, -1)
            is_correct = selected == q.correct_answer
            status = "CORRECT" if is_correct else "INCORRECT"
            lines.append(f"Q{i+1}: {q.question}")
            lines.append(f"  Options: {', '.join(q.options)}")
            lines.append(f"  Correct: {q.options[q.correct_answer]}")
            if selected >= 0:
                lines.append(f"  Student chose: {q.options[selected]} ({status})")
            lines.append("")
        return "\n".join(lines)

    def _parse_quiz_response(self, response: str, expected: int) -> list[QuizQuestion]:
        try:
            data = self._extract_json(response)
            if isinstance(data, list):
                questions = []
                for q in data[:expected]:
                    if "option_explanations" not in q:
                        q["option_explanations"] = []
                    questions.append(QuizQuestion(**q))
                return questions
        except Exception as exc:
            logger.warning("Failed to parse quiz JSON: %s", exc)

        return [
            QuizQuestion(
                question=f"Sample question about the topic ({i + 1})",
                options=["Option A", "Option B", "Option C", "Option D"],
                correct_answer=0,
                explanation="AI generated content could not be parsed.",
                option_explanations=[],
            )
            for i in range(expected)
        ]

    def _parse_summary_response(
        self, response: str, score: int, total: int
    ) -> QuizSummaryResponse:
        try:
            data = self._extract_json(response)
            if isinstance(data, dict):
                return QuizSummaryResponse(**data)
        except Exception as exc:
            logger.warning("Failed to parse summary JSON: %s", exc)

        pct = round((score / total) * 100) if total > 0 else 0
        return QuizSummaryResponse(
            score_summary=f"You scored {score}/{total} ({pct}%). Keep practicing to improve!",
            strengths=["Attempted all questions"],
            weaknesses=["Review the topics you missed"],
            recommendations=["Revisit the material and try again with different difficulty"],
            resources=[],
        )

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
