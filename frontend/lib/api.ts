const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChineseCharacterReadings {
  pinyin: string;
  zhuyin_bopomofo: string;
  wade_giles: string;
  cantonese_jyutping: string;
  cantonese_yale: string;
  hokkien_poj: string;
  teochew_pengim: string;
  hakka_pin_yim: string;
  hainanese: string;
  shanghainese_wugniu: string;
}

export interface ChineseHandwritingCandidate {
  rank: number;
  character: string;
  confidence_note: string;
  simplified: string;
  traditional: string;
  readings: ChineseCharacterReadings;
  meaning: string;
  stroke_count: number | null;
  stroke_order_description: string;
  example_words: string[];
  usage_notes: string;
}

export interface ChineseHandwritingResult {
  candidates: ChineseHandwritingCandidate[];
  drawing_note: string;
  raw_model_text: string;
}

interface ChatMessage {
  role: string;
  content: string;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new Error(`API error ${res.status}: ${detail}`);
    }
    return res.json();
  }

  private async postForm<T>(path: string, form: FormData): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, { method: "POST", body: form });
    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new Error(`API error ${res.status}: ${detail}`);
    }
    return res.json();
  }

  async healthCheck() {
    return this.request<{ status: string }>("/health");
  }

  // ── Etymology ─────────────────────────────────────────────────────────

  async lookupEtymology(word: string, language = "", uiLanguage = "en") {
    return this.request<{ content: string }>("/api/etymology/lookup", {
      method: "POST",
      body: JSON.stringify({ word, language, ui_language: uiLanguage }),
    });
  }

  // ── Vision (Gemini image) ───────────────────────────────────────────

  async visionOcr(file: Blob) {
    const form = new FormData();
    form.append("file", file, "upload.png");
    return this.postForm<{
      writing_systems: string[];
      language_guess: string;
      full_transcription: string;
      words: string[];
      sentences: string[];
      alphabet_or_script_notes: string;
      confidence_note: string;
      raw_model_text: string;
    }>("/api/vision/ocr", form);
  }

  async visionChineseHandwriting(file: Blob) {
    const form = new FormData();
    form.append("file", file, "stroke.png");
    return this.postForm<ChineseHandwritingResult>(
      "/api/vision/chinese-handwriting",
      form
    );
  }

  // ── Chat ──────────────────────────────────────────────────────────────

  async sendChat(
    messages: ChatMessage[],
    language = "en",
    level = "beginner",
    topic = "general"
  ) {
    return this.request<{ response: string; sources: string[] }>("/api/chat/send", {
      method: "POST",
      body: JSON.stringify({ messages, language, level, topic }),
    });
  }

  async getChatHistory() {
    return this.request<{ messages: ChatMessage[] }>("/api/chat/history");
  }

  // ── Quiz ──────────────────────────────────────────────────────────────

  async generateQuiz(
    topic: string,
    language = "en",
    difficulty = "medium",
    numQuestions = 5
  ) {
    return this.request<{
      questions: Array<{
        question: string;
        options: string[];
        correct_answer: number;
        explanation: string;
        option_explanations: string[];
      }>;
      topic: string;
      quiz_id: string;
    }>("/api/quiz/generate", {
      method: "POST",
      body: JSON.stringify({
        topic,
        language,
        difficulty,
        num_questions: numQuestions,
      }),
    });
  }

  async submitQuiz(data: {
    quiz_id: string;
    topic: string;
    language: string;
    difficulty: string;
    questions: Array<{
      question: string;
      options: string[];
      correct_answer: number;
      explanation: string;
      option_explanations: string[];
    }>;
    answers: Array<{ question_index: number; selected_answer: number }>;
    score: number;
    total: number;
    summary?: {
      score_summary: string;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      resources: Array<{ title: string; url: string; description: string }>;
    };
  }) {
    return this.request<{ id: string; message: string }>("/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getQuizHistory() {
    return this.request<{
      attempts: Array<{
        id: string;
        topic: string;
        language: string;
        difficulty: string;
        score: number;
        total: number;
        questions: Array<{
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
          option_explanations: string[];
        }>;
        answers: Array<{ question_index: number; selected_answer: number }>;
        summary?: {
          score_summary: string;
          strengths: string[];
          weaknesses: string[];
          recommendations: string[];
          resources: Array<{ title: string; url: string; description: string }>;
        } | null;
        timestamp: string;
      }>;
    }>("/api/quiz/history");
  }

  async getQuizAttempt(attemptId: string) {
    return this.request<{
      id: string;
      topic: string;
      language: string;
      difficulty: string;
      score: number;
      total: number;
      questions: Array<{
        question: string;
        options: string[];
        correct_answer: number;
        explanation: string;
        option_explanations: string[];
      }>;
      answers: Array<{ question_index: number; selected_answer: number }>;
      timestamp: string;
    }>(`/api/quiz/history/${attemptId}`);
  }

  async generateQuizSummary(data: {
    topic: string;
    language: string;
    difficulty: string;
    score: number;
    total: number;
    questions: Array<{
      question: string;
      options: string[];
      correct_answer: number;
      explanation: string;
      option_explanations: string[];
    }>;
    answers: Array<{ question_index: number; selected_answer: number }>;
  }) {
    return this.request<{
      score_summary: string;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      resources: Array<{ title: string; url: string; description: string }>;
    }>("/api/quiz/summary", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async generateFlashcards(topic: string, language = "en", numCards = 10) {
    return this.request<{
      cards: Array<{ front: string; back: string; example: string }>;
      topic: string;
    }>("/api/quiz/flashcards", {
      method: "POST",
      body: JSON.stringify({ topic, language, num_cards: numCards }),
    });
  }

  async reviewFlashcard(cardId: string, quality: number) {
    return this.request("/api/quiz/review", {
      method: "POST",
      body: JSON.stringify({ card_id: cardId, quality }),
    });
  }

  // ── Story ─────────────────────────────────────────────────────────────

  async startStory(topic: string, language = "en", era = "", style = "narrative") {
    return this.request<{
      segment: { text: string; choices: Array<{ text: string; id: number }> };
      story_id: string;
    }>("/api/story/start", {
      method: "POST",
      body: JSON.stringify({ topic, language, era, style }),
    });
  }

  async continueStory(storyId: string, choiceIndex: number) {
    return this.request<{
      segment: { text: string; choices: Array<{ text: string; id: number }> };
      story_id: string;
    }>("/api/story/continue", {
      method: "POST",
      body: JSON.stringify({ story_id: storyId, choice_index: choiceIndex }),
    });
  }

  // ── Translate ─────────────────────────────────────────────────────────

  async translate(
    text: string,
    sourceLang: string,
    targetLang: string,
    explainGrammar = false
  ) {
    return this.request<{
      translated: string;
      grammar_notes: string;
      romanization: string;
    }>("/api/translate/translate", {
      method: "POST",
      body: JSON.stringify({
        text,
        source_lang: sourceLang,
        target_lang: targetLang,
        explain_grammar: explainGrammar,
      }),
    });
  }

  // ── Timeline ──────────────────────────────────────────────────────────

  async generateTimeline(
    topic: string,
    language = "en",
    startYear?: number,
    endYear?: number
  ) {
    return this.request<{
      events: Array<{
        year: number;
        title: string;
        description: string;
        detail: string;
        impact: string;
        key_figures: string[];
        category: string;
        related_events: string[];
      }>;
      topic: string;
    }>("/api/timeline/generate", {
      method: "POST",
      body: JSON.stringify({
        topic,
        language,
        start_year: startYear,
        end_year: endYear,
      }),
    });
  }

  async getTimelineEvents(topic: string) {
    return this.request<{
      events: Array<{
        year: number;
        title: string;
        description: string;
        category: string;
      }>;
    }>(`/api/timeline/events/${encodeURIComponent(topic)}`);
  }
}

export const api = new APIClient();
