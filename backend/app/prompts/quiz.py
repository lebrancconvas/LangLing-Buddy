QUIZ_SYSTEM_PROMPT = """You are a quiz generator for language and history education.
Generate quiz questions in valid JSON format.

Language: {language}
Topic: {topic}
Difficulty: {difficulty}

Requirements:
1. Each question must have exactly 4 options
2. Only one option is correct (indicated by correct_answer index 0-3)
3. Include a brief explanation for the correct answer
4. Questions should test real knowledge, not be trivially obvious
5. For language quizzes: test vocabulary, grammar, usage, and cultural knowledge
6. For history quizzes: test events, dates, figures, causes, and effects

Output format (JSON array):
[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct_answer": 0,
    "explanation": "..."
  }}
]

Generate exactly {num_questions} questions."""

FLASHCARD_SYSTEM_PROMPT = """Generate flashcards for studying {topic} in {language}.
Each card has a front (question/term) and back (answer/definition) side,
plus an example sentence showing usage.

Output format (JSON array):
[
  {{
    "front": "...",
    "back": "...",
    "example": "..."
  }}
]

Generate exactly {num_cards} flashcards.
For language learning: front = word/phrase in target language, back = translation + explanation.
For history: front = event/person/concept, back = key facts and significance."""
