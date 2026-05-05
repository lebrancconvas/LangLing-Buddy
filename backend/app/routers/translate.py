import json
import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import TranslateRequest, TranslateResponse
from app.prompts.translate import TRANSLATE_SYSTEM_PROMPT, TRANSLATE_WITH_GRAMMAR_PROMPT
from app.services.ai_router import ai_router

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    try:
        if request.explain_grammar:
            prompt = TRANSLATE_WITH_GRAMMAR_PROMPT.format(
                source_lang=request.source_lang,
                target_lang=request.target_lang,
                text=request.text,
            )
        else:
            prompt = TRANSLATE_SYSTEM_PROMPT.format(
                source_lang=request.source_lang,
                target_lang=request.target_lang,
                text=request.text,
            )

        response = await ai_router.generate(prompt=prompt, temperature=0.3)

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
            return TranslateResponse(
                translated=data.get("translated", response),
                grammar_notes=data.get("grammar_notes", ""),
                romanization=data.get("romanization", ""),
            )
        except json.JSONDecodeError:
            return TranslateResponse(translated=response)

    except Exception as exc:
        logger.error("Translation error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))
