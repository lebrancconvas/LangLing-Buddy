import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import ChatRequest, ChatResponse
from app.prompts.tutor import TUTOR_RAG_PROMPT, TUTOR_SYSTEM_PROMPT
from app.services.ai_router import ai_router
from app.services.rag import rag_engine

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/send", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    try:
        system = TUTOR_SYSTEM_PROMPT.format(
            language=request.language,
            level=request.level,
            topic=request.topic,
        )

        user_msg = request.messages[-1].content if request.messages else ""
        sources: list[str] = []

        is_history = request.topic.lower() in ("history", "ประวัติศาสตร์", "general")
        context = ""
        if is_history:
            context = await rag_engine.get_context_string(user_msg, request.language)
            if context:
                user_msg = TUTOR_RAG_PROMPT.format(
                    context=context,
                    question=user_msg,
                    level=request.level,
                    language=request.language,
                )
                sources = [doc["title"] for doc in await rag_engine.retrieve(request.messages[-1].content, request.language)]

        conversation = "\n".join(
            f"{m.role}: {m.content}" for m in request.messages[:-1]
        )
        if conversation:
            user_msg = f"Previous conversation:\n{conversation}\n\nCurrent message:\n{user_msg}"

        response = await ai_router.generate(
            prompt=user_msg,
            system_prompt=system,
        )

        return ChatResponse(response=response, sources=sources)

    except Exception as exc:
        logger.error("Chat error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/history")
async def get_history():
    return {"messages": []}


@router.get("/providers")
async def get_providers():
    providers = await ai_router.get_available_providers()
    return {"providers": [p.model_dump() for p in providers]}
