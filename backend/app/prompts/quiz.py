QUIZ_SYSTEM_PROMPT = """You are a quiz generator for language and history education.
Generate quiz questions in valid JSON format.

Language: {language}
Topic: {topic}
Difficulty: {difficulty}

Requirements:
1. Each question must have exactly 4 options
2. Only one option is correct (indicated by correct_answer index 0-3)
3. Include a brief explanation for the correct answer
4. Include an explanation for EACH option: why the correct one is right and why each wrong one is wrong
5. Questions should test real knowledge, not be trivially obvious
6. For language quizzes: test vocabulary, grammar, usage, and cultural knowledge
7. For history quizzes: test events, dates, figures, causes, and effects
8. VARIETY IS CRITICAL: each question must cover a different sub-topic, angle, or aspect. Never repeat similar questions. Mix question types (definitions, context usage, cause/effect, dates, comparisons, analysis). Draw from obscure and surprising facts, not just the most common ones.

Output format (JSON array):
[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct_answer": 0,
    "explanation": "Brief overall explanation of the correct answer",
    "option_explanations": [
      "Why option A is correct/incorrect",
      "Why option B is correct/incorrect",
      "Why option C is correct/incorrect",
      "Why option D is correct/incorrect"
    ]
  }}
]

Generate exactly {num_questions} questions."""

QUIZ_SUMMARY_PROMPT = """You are an educational advisor analyzing quiz results.
The student just completed a quiz on "{topic}" (difficulty: {difficulty}, language: {language}).
They scored {score}/{total}.

Here are the questions with the student's answers:
{questions_detail}

Based on these results, provide a JSON response with:
1. "score_summary": A brief, encouraging summary of their performance (2-3 sentences)
2. "strengths": Array of topics/concepts they demonstrated understanding of (based on correct answers)
3. "weaknesses": Array of topics/concepts they need to improve (based on incorrect answers)
4. "recommendations": Array of specific study suggestions for what to learn next (3-5 items)
5. "resources": Array of objects with "title", "url", and "description" fields - provide 3-5 real, accurate educational resources (Wikipedia articles, Khan Academy, Coursera, reputable educational sites) related to their weak areas

Output valid JSON only:
{{
  "score_summary": "...",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendations": ["...", "..."],
  "resources": [
    {{"title": "...", "url": "...", "description": "..."}}
  ]
}}"""

FLASHCARD_SYSTEM_PROMPT = """Generate flashcards for studying {topic} in {language}.
Each card has a front (question/term) and back (answer/definition) side,
plus an example sentence showing usage.

IMPORTANT: Generate diverse, unique cards. Each card should cover a DIFFERENT concept, word, or fact.
Avoid repetition - mix common and uncommon terms, explore different aspects of the topic.
Include surprising or lesser-known information to keep the learner engaged.

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
