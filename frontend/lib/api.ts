const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  async healthCheck() {
    return this.request<{ status: string }>("/health");
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
      }>;
      topic: string;
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
