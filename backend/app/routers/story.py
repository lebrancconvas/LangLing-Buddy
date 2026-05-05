import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    StoryContinueRequest,
    StoryRequest,
    StoryResponse,
)
from app.services.story_gen import story_engine

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/start", response_model=StoryResponse)
async def start_story(request: StoryRequest):
    try:
        segment, story_id = await story_engine.start_story(
            topic=request.topic,
            language=request.language,
            era=request.era,
            style=request.style,
        )
        return StoryResponse(segment=segment, story_id=story_id)
    except Exception as exc:
        logger.error("Story start error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/continue", response_model=StoryResponse)
async def continue_story(request: StoryContinueRequest):
    try:
        segment = await story_engine.continue_story(
            story_id=request.story_id,
            choice_index=request.choice_index,
        )
        return StoryResponse(segment=segment, story_id=request.story_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.error("Story continue error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))
