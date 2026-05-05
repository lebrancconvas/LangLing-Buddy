# LangLing - AI Buddy for Language & History Learning

An AI-powered learning companion that helps you master languages and explore history through interactive conversations, quizzes, stories, and more.

## Features

- **Chat Tutor** - AI-powered conversational tutor for language and history learning with RAG
- **Quiz & Flashcard** - Adaptive quizzes with spaced repetition (SM-2 algorithm)
- **Interactive Story** - Branching narrative stories set in historical periods
- **Voice Conversation** - Practice pronunciation with Web Speech API (STT/TTS)
- **Translation** - Translate text with grammar explanations
- **Timeline Visualization** - Explore historical events on interactive timelines

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), Tailwind CSS, shadcn/ui, Zustand |
| Backend | Python FastAPI, LangChain, ChromaDB |
| Database | Supabase (PostgreSQL + Auth) |
| AI Models | Google Gemini, Groq (Llama 3), HuggingFace, Ollama (local fallback) |
| Voice | Web Speech API (browser built-in) |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- (Optional) Ollama for local AI fallback

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your settings
npm run dev
```

### Environment Variables

#### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google AI Studio API key | Recommended |
| `GROQ_API_KEY` | Groq console API key | Recommended |
| `HF_API_TOKEN` | HuggingFace API token | Optional |
| `OLLAMA_BASE_URL` | Ollama server URL | Optional (default: http://localhost:11434) |
| `SUPABASE_URL` | Supabase project URL | Optional |
| `SUPABASE_KEY` | Supabase anon key | Optional |

#### Frontend (.env.local)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:8000) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## AI Router

LangLing uses a smart AI router that automatically falls back between providers:

1. **Gemini** (Primary) - Google Gemini 2.0 Flash
2. **Groq** (Secondary) - Llama 3.1 70B with fast inference
3. **HuggingFace** (Tertiary) - Various specialized models
4. **Ollama** (Fallback) - Local models when APIs are unavailable

## Project Structure

```
langling/
├── frontend/          # Next.js App (TypeScript + Tailwind)
├── backend/           # Python FastAPI
└── README.md
```

## Deployment

- **Frontend**: Vercel (free tier)
- **Backend**: Render or HuggingFace Spaces (free tier)
- **Database**: Supabase (free tier)

## License

MIT
