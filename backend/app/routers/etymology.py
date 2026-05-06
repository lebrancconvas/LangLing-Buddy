import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import EtymologyRequest, EtymologyResponse
from app.prompts.etymology import ETYMOLOGY_SYSTEM, ETYMOLOGY_USER
from app.services.ai_router import ai_router

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/lookup", response_model=EtymologyResponse)
async def lookup_etymology(body: EtymologyRequest) -> EtymologyResponse:
    try:
        prompt = ETYMOLOGY_USER.format(
            word=body.word.strip(),
            language=body.language.strip() or "(unspecified — infer if possible)",
            ui_language=(body.ui_language.strip() or "en"),
        )
        content = await ai_router.generate(
            prompt,
            ETYMOLOGY_SYSTEM,
            temperature=0.45,
            max_tokens=8192,
        )
        return EtymologyResponse(content=content)
    except Exception as exc:
        logger.exception("Etymology lookup failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
