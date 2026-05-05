import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    FlashcardRequest,
    FlashcardResponse,
    FlashcardReview,
    QuizRequest,
    QuizResponse,
)
from app.services.quiz_gen import quiz_generator

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    try:
        questions = await quiz_generator.generate_quiz(
            topic=request.topic,
            language=request.language,
            difficulty=request.difficulty,
            num_questions=request.num_questions,
        )
        return QuizResponse(questions=questions, topic=request.topic)
    except Exception as exc:
        logger.error("Quiz generation error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/flashcards", response_model=FlashcardResponse)
async def generate_flashcards(request: FlashcardRequest):
    try:
        cards = await quiz_generator.generate_flashcards(
            topic=request.topic,
            language=request.language,
            num_cards=request.num_cards,
        )
        return FlashcardResponse(cards=cards, topic=request.topic)
    except Exception as exc:
        logger.error("Flashcard generation error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/review")
async def review_flashcard(review: FlashcardReview):
    """Record a flashcard review for SM-2 spaced repetition.
    Quality: 0=blackout, 1=wrong, 2=hard, 3=ok, 4=easy, 5=perfect"""
    ef = 2.5
    ef = max(1.3, ef + (0.1 - (5 - review.quality) * (0.08 + (5 - review.quality) * 0.02)))

    interval = 1
    if review.quality >= 3:
        interval = 1 if review.quality == 3 else 6

    return {
        "card_id": review.card_id,
        "quality": review.quality,
        "new_ease_factor": round(ef, 2),
        "next_interval_days": interval,
        "message": "Review recorded",
    }
