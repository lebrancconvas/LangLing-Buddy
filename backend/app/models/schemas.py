from pydantic import BaseModel, Field


# ── Chat ──────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    language: str = "en"
    level: str = "beginner"
    topic: str = "general"


class ChatResponse(BaseModel):
    response: str
    sources: list[str] = Field(default_factory=list)


# ── Quiz ──────────────────────────────────────────────────────────────

class QuizRequest(BaseModel):
    topic: str
    language: str = "en"
    difficulty: str = "medium"
    num_questions: int = 5


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_answer: int
    explanation: str
    option_explanations: list[str] = Field(default_factory=list)


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]
    topic: str
    quiz_id: str = ""


class QuizAnswerSubmission(BaseModel):
    question_index: int
    selected_answer: int


class QuizSummaryData(BaseModel):
    score_summary: str = ""
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    resources: list[dict] = Field(default_factory=list)


class QuizSubmitRequest(BaseModel):
    quiz_id: str
    topic: str
    language: str = "en"
    difficulty: str = "medium"
    questions: list[QuizQuestion]
    answers: list[QuizAnswerSubmission]
    score: int
    total: int
    summary: QuizSummaryData | None = None


class QuizAttempt(BaseModel):
    id: str
    topic: str
    language: str = "en"
    difficulty: str = "medium"
    score: int
    total: int
    questions: list[QuizQuestion]
    answers: list[QuizAnswerSubmission]
    summary: QuizSummaryData | None = None
    timestamp: str


class QuizHistoryResponse(BaseModel):
    attempts: list[QuizAttempt]


class QuizSummaryRequest(BaseModel):
    topic: str
    language: str = "en"
    difficulty: str = "medium"
    score: int
    total: int
    questions: list[QuizQuestion]
    answers: list[QuizAnswerSubmission]


class QuizSummaryResponse(BaseModel):
    score_summary: str
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    resources: list[dict] = Field(default_factory=list)


# ── Flashcards ────────────────────────────────────────────────────────

class FlashcardRequest(BaseModel):
    topic: str
    language: str = "en"
    num_cards: int = 10


class Flashcard(BaseModel):
    front: str
    back: str
    example: str = ""


class FlashcardResponse(BaseModel):
    cards: list[Flashcard]
    topic: str


class FlashcardReview(BaseModel):
    card_id: str
    quality: int = Field(..., ge=0, le=5, description="SM-2 quality rating 0-5")


# ── Story ─────────────────────────────────────────────────────────────

class StoryRequest(BaseModel):
    topic: str
    language: str = "en"
    era: str = ""
    style: str = "narrative"


class StorySegment(BaseModel):
    text: str
    choices: list[dict] = Field(default_factory=list)


class StoryResponse(BaseModel):
    segment: StorySegment
    story_id: str


class StoryContinueRequest(BaseModel):
    story_id: str
    choice_index: int


# ── Translate ─────────────────────────────────────────────────────────

class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str
    explain_grammar: bool = False


class TranslateResponse(BaseModel):
    translated: str
    grammar_notes: str = ""
    romanization: str = ""


# ── Timeline ──────────────────────────────────────────────────────────

class TimelineRequest(BaseModel):
    topic: str
    language: str = "en"
    start_year: int | None = None
    end_year: int | None = None


class TimelineEvent(BaseModel):
    year: int
    title: str
    description: str
    detail: str = ""
    impact: str = ""
    key_figures: list[str] = Field(default_factory=list)
    category: str = ""
    related_events: list[str] = Field(default_factory=list)


class TimelineResponse(BaseModel):
    events: list[TimelineEvent]
    topic: str


# ── AI Provider ───────────────────────────────────────────────────────

class AIProvider(BaseModel):
    name: str
    available: bool
    quota_remaining: float = 1.0
