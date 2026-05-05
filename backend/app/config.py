from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    HF_API_TOKEN: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Default chat models (free-tier friendly: high daily limits on AI Studio / Groq dev tier)
    # Gemini 2.5 Flash-Lite is Google's most cost-efficient option for high-volume text.
    # (Gemini 2.0 models are deprecated; prefer 2.5 per Google deprecation notices.)
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    HF_CHAT_MODEL: str = "google/gemma-2-2b-it"
    OLLAMA_MODEL: str = "llama3.1:8b"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
