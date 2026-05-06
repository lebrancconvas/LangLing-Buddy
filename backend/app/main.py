from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import chat, etymology, quiz, story, translate, timeline, vision

app = FastAPI(
    title="LangLing API",
    version="1.0.0",
    description="AI-powered language & history learning platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(etymology.router, prefix="/api/etymology", tags=["Etymology"])
app.include_router(vision.router, prefix="/api/vision", tags=["Vision"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(story.router, prefix="/api/story", tags=["Story"])
app.include_router(translate.router, prefix="/api/translate", tags=["Translate"])
app.include_router(timeline.router, prefix="/api/timeline", tags=["Timeline"])


@app.get("/")
async def root():
    return {
        "name": "LangLing API",
        "version": "1.0.0",
        "description": "AI-powered language & history learning platform",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
