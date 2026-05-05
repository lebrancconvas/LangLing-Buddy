# LangLing User Manual

Welcome to **LangLing** — your AI-powered learning companion for languages and history!

---

## Getting Started

### Selecting Your Language

You can change the app language at any time using the **globe icon** in the bottom of the sidebar. LangLing supports 24+ languages including Thai, English, Chinese (Simplified & Traditional), Japanese, Korean, Vietnamese, French, German, Spanish, Arabic, Hindi, and more.

### Setting Your Level

Go to **Settings** to choose your difficulty level:
- **Beginner** — Simple explanations, translations provided, basic concepts
- **Intermediate** — Moderate complexity, idioms, follow-up questions
- **Advanced** — Natural usage, nuances, cultural context, complex grammar

---

## Features

### 1. Chat Tutor

An AI tutor that adapts to your level and chosen language.

**How to use:**
1. Navigate to **Chat Tutor** from the sidebar
2. Type a question or use one of the suggested prompts
3. The AI will respond with educational content adapted to your level
4. Ask follow-up questions to dive deeper

**Tips:**
- Ask about vocabulary, grammar, cultural context, or history
- The tutor will mix your target language with explanations
- Try "Teach me basic [language] greetings" to get started

---

### 2. Quiz & Flashcards

Test your knowledge with AI-generated quizzes and study with flashcards.

#### Taking a Quiz

1. Navigate to **Quiz & Cards** from the sidebar
2. Enter a topic (e.g., "Japanese N5 vocabulary", "World War II")
3. Select a difficulty level: Easy, Medium, or Hard
4. Choose the number of questions (5–20) using the slider
5. Click **Generate Quiz**
6. Answer each question — after selecting, you'll see:
   - Why the correct answer is right
   - Why each wrong answer is wrong
   - An overall explanation
7. After completing all questions, you'll receive:
   - Your score
   - An AI-generated summary of your strengths and weaknesses
   - Personalized study recommendations
   - Curated learning resources with links

#### Using Flashcards

1. Enter a topic and click **Flashcards**
2. Click the card to flip between front (question) and back (answer)
3. Rate your recall: Again, Hard, Good, or Easy
4. The SM-2 spaced repetition algorithm optimizes your review schedule

#### Quiz History

Click the **Quiz History** button (top-right of the quiz page) to:
- See all your past quiz attempts
- Review each question with explanations
- Re-read your AI-generated summary and resource recommendations
- Track your progress over time

---

### 3. Interactive Stories

Explore history through branching narrative stories.

**How to use:**
1. Navigate to **Stories** from the sidebar
2. Enter a historical topic or era (e.g., "Ancient Egypt", "Edo period Japan")
3. Choose a narrative style
4. Read the story and make choices at decision points
5. Each choice leads to a different educational path

**Tips:**
- Stories are grounded in real historical events
- Key vocabulary is woven into the narrative
- Try different choices to explore multiple perspectives

---

### 4. Voice Conversation

Practice pronunciation with speech recognition and text-to-speech.

**How to use:**
1. Navigate to **Voice** from the sidebar
2. Click the microphone to start speaking
3. The app transcribes your speech and provides feedback
4. Listen to the correct pronunciation using text-to-speech

**Requirements:**
- A working microphone
- A modern browser (Chrome, Edge, or Safari recommended)

---

### 5. Translation

Translate text between languages with optional grammar explanations.

**How to use:**
1. Navigate to **Translate** from the sidebar
2. Select source and target languages
3. Type or paste your text
4. Toggle **Explain Grammar** for detailed breakdowns
5. View the translation, romanization (for non-Latin scripts), and grammar notes

---

### 6. Timeline Explorer

Visualize historical events on an interactive timeline.

**How to use:**
1. Navigate to **Timeline** from the sidebar
2. Enter a historical topic (e.g., "Space exploration", "Thai kingdoms")
3. Optionally set a year range to focus on
4. Click **Generate** to create the timeline
5. Click on any event to expand and see:
   - Detailed context and background
   - Impact and lasting legacy
   - Key figures involved
   - Related events

**Tips:**
- Try different topics or year ranges for variety
- Events are color-coded by category (political, military, cultural, scientific, economic)

---

## Settings

Access Settings from the bottom of the sidebar:

- **Learning Language** — Choose from 24+ supported languages with search
- **Difficulty Level** — Beginner, Intermediate, or Advanced
- **AI Provider** — Auto (recommended), or manually select Gemini, Groq, HuggingFace, or Ollama

---

## Tips for Best Results

1. **Be specific with topics** — "Japanese JLPT N3 grammar" works better than just "Japanese"
2. **Change difficulty** — If content is too easy or hard, adjust your level in Settings
3. **Use different features together** — Quiz yourself after a Chat session, or explore a Timeline before starting a Story
4. **Try different languages** — Switch languages anytime from the sidebar to practice multiple
5. **Review Quiz History** — Track your progress and focus on weak areas identified in summaries

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "All AI providers failed" | Check that at least one API key is configured in the backend `.env` file |
| Slow responses | Try switching to Groq (fastest) in Settings > AI Provider |
| No voice input | Ensure microphone permissions are granted in your browser |
| App not loading | Verify both the backend (port 8000) and frontend (port 3000) are running |

---

## Keyboard Shortcuts

- **Enter** — Submit in chat, generate quiz (when topic is filled)
- **Click card** — Flip flashcard

---

*Built with Next.js, FastAPI, LangChain, and love for learning.*
