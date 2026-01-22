# Life in the UK Question JSON Schema

## Overview
Questions are stored in `topics_grouped.json` as an array of topic objects. Each topic contains a `questions` array with individual question objects. The schema supports two main question types: `multiple` (single-choice) and `multipleAnswer` (select N answers).

---

## Topic Structure

```json
{
  "title": "Topic Name",
  "content": "<h3>HTML formatted study material</h3><p>Content here...</p>",
  "questions": [
    // Question objects here
  ]
}
```

---

## Question Type 1: Single Multiple Choice (`type: "multiple"`)

**Used for**: Questions with exactly ONE correct answer.

```json
{
  "type": "multiple",
  "question": "What English language level is required for citizenship?",
  "options": [
    "A1 level",
    "A2 level",
    "B1 level",
    "C1 level"
  ],
  "answer": "B1 level",
  "id": "citizenship_language_level"
}
```

### Required Fields:
- **`type`**: `"multiple"`
- **`question`**: String - The question text (should be standalone, clear without context)
- **`options`**: Array of strings - 4 answer options (1 correct, 3 distractors)
- **`answer`**: String - The correct answer (must match exactly one option)
- **`id`**: String - Unique identifier (snake_case, no spaces)

### Optional Fields:
- `generated`: Boolean (true if auto-generated)

---

## Question Type 2: Multiple Answer (`type: "multipleAnswer"`)

**Used for**: Questions where students must select N correct answers from a larger pool.

```json
{
  "type": "multipleAnswer",
  "question": "In the Life in the UK handbook section 'The values and principles of the UK', select the core British values:",
  "options": [
    "Democracy",
    "Rule of law",
    "Individual liberty",
    "Tolerance",
    "Mutual respect",
    "Authoritarianism"
  ],
  "correctOptions": [
    "Democracy",
    "Rule of law",
    "Individual liberty",
    "Tolerance",
    "Mutual respect"
  ],
  "numRequired": 3,
  "id": "british_values_core"
}
```

### Required Fields:
- **`type`**: `"multipleAnswer"`
- **`question`**: String - The question text
- **`options`**: Array of strings - All available options (correct + distractors; typically 6-8)
- **`correctOptions`**: Array of strings - Which options are correct (must all be in `options`)
- **`numRequired`**: Number - How many correct answers the user must select
- **`id`**: String - Unique identifier

### Rules:
- `numRequired` should typically be 3-4
- All items in `correctOptions` must exist in `options`
- Include clear distractors (bad answers) among the options
- Distractors should be plausible but incorrect

---

## Best Practices

### Question Text (`question` field):
- **Must be standalone** – someone who hasn't read the book should understand it
- Include context: `"In the values and principles section, which..."`
- Avoid pronouns that refer to undefined context: not "What was it?" but "What was the Industrial Revolution?"
- Keep it clear and specific

### Options:
- All options should be grammatically consistent
- For single-choice: provide 4 options
- For multiple-answer: provide 6–8 options
- Distractors should be plausible, not absurd
- Options should be mutually exclusive (for single-choice)

### IDs:
- Use `snake_case` format
- Must be unique across all questions in the topic
- Avoid special characters
- Be descriptive (e.g., `citizenship_language_level` not `q1`)

### Examples to Avoid:
- ❌ "Who was he?" → ✓ "Which person became the first Prime Minister?"
- ❌ "What was it?" → ✓ "What was the Magna Carta?"
- ❌ "These settlements in Ireland" → ✓ "What were the English-controlled plantation settlements in Ireland called?"

---

## Example Topic with Mixed Questions

```json
{
  "title": "The values and principles of the UK",
  "content": "...",
  "questions": [
    {
      "type": "multiple",
      "question": "How many questions are in the Life in the UK test?",
      "options": ["20 questions", "24 questions", "30 questions", "18 questions"],
      "answer": "24 questions",
      "id": "test_questions"
    },
    {
      "type": "multiple",
      "question": "Which of the following is a fundamental principle of British life?",
      "options": ["Democracy", "Monarchy", "Capitalism", "Socialism"],
      "answer": "Democracy",
      "id": "fundamental_principles"
    },
    {
      "type": "multipleAnswer",
      "question": "Select the core British values:",
      "options": ["Democracy", "Rule of law", "Authoritarianism", "Individual liberty"],
      "correctOptions": ["Democracy", "Rule of law", "Individual liberty"],
      "numRequired": 3,
      "id": "core_values_multi"
    }
  ]
}
```

---

## Tips for ChatGPT

When asking ChatGPT to generate questions, provide:

1. **Topic title** and section content
2. **Question count** you want (e.g., 5–10)
3. **Mix** of single-choice and multi-answer if desired
4. **Key facts** to cover (e.g., specific names, dates, concepts)
5. **This schema** as a reference

**Example prompt:**
```
Using the JSON schema below, create 5 multiple-choice questions 
for the topic "A long and illustrious history - Chapter 1: Early Britain".

Key facts to cover:
- Stonehenge (about 3000 BC)
- Roman invasion (AD 43)
- Hadrian's Wall
- Anglo-Saxon kingdoms
- Norman Conquest (1066)

Each question should:
- Be standalone (no pronouns like "this" or "it")
- Have 1 correct answer and 3 plausible distractors
- Include context in the question (e.g., "In Early Britain...")

Schema: [insert schema or examples]
```

---

## Current Statistics

- **Total questions**: ~1050 (including auto-generated coverage questions)
- **Topics**: 13
- **Question types**: `multiple` and `multipleAnswer`
- **Auto-generated**: Questions with `"generated": true` are machine-created for coverage
