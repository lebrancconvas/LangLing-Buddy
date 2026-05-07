from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    HF_API_TOKEN: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    # Optional: from Supabase Database settings (direct Postgres); harmless if unused.
    SUPABASE_DATABASE_PASSWORD: str = ""
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Default chat models (free-tier friendly: high daily limits on AI Studio / Groq dev tier)
    # Gemini 2.5 Flash-Lite is cost-efficient for high-volume text; vision fallbacks use 2.5/2.0 Flash.
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"
    # Comma-separated model ids, tried when a model returns 429 or is invalid (may have separate quotas).
    GEMINI_MODEL_FALLBACKS: str = ""
    # Optional: override the *first* model used only for multimodal / vision (Chinese handwriting, OCR).
    # Use when GEMINI_MODEL (e.g. flash-lite) runs out faster than another Flash variant, or billing differs.
    # Example: GEMINI_VISION_MODEL=gemini-2.0-flash
    GEMINI_VISION_MODEL: str = ""
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    # Multimodal fallback when Gemini vision fails (Groq OpenAI-style vision chat).
    GROQ_VISION_MODEL: str = "meta-llama/llama-4-scout-17b-16e-instruct"
    HF_CHAT_MODEL: str = "google/gemma-2-2b-it"
    OLLAMA_MODEL: str = "llama3.1:8b"
    # Vision model for Ollama (/api/chat); e.g. llama3.2-vision, llava — must be pulled locally.
    OLLAMA_VISION_MODEL: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
