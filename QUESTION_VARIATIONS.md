# Question Variations System

## Overview
The quiz app now supports question variations to prevent memorization and add variety to the test experience.

## How It Works

### Data Structure
Each topic can have two types of questions:

1. **Regular Questions** (existing format):
```json
{
  "question": "What is the capital of the UK?",
  "options": ["London", "Edinburgh", "Cardiff", "Belfast"],
  "answer": "London"
}
```

2. **Question Groups with Variations** (new format):
```json
{
  "topic": "UK Coin Currency",
  "variations": [
    {
      "type": "multiple",
      "question": "What is the highest coin currency in the UK?",
      "options": ["50p", "£1", "£2", "£5"],
      "answer": "£2"
    },
    {
      "type": "boolean",
      "question": "£5 is the highest coin currency in the UK.",
      "answer": false
    },
    {
      "type": "multiple",
      "question": "The UK has a few coin currencies available, which is the highest?",
      "options": ["£1", "£2", "50p", "£5"],
      "answer": "£2"
    }
  ]
}
```

### Question Types
- **multiple**: Traditional multiple-choice questions with 4 options
- **boolean**: True/False questions (displayed as "True" and "False" buttons)

### Quiz Behavior
When a student starts a quiz:
1. All regular questions are included
2. From each question group, **only ONE variation is randomly selected**
3. Questions are shuffled together
4. No duplicate variations of the same question appear in a single test

## Benefits

1. **Prevents Memorization**: Students can't just remember question-answer pairs
2. **Tests Understanding**: Different phrasings test actual comprehension
3. **Adds Variety**: Each test attempt feels fresh and different
4. **Format Mixing**: True/False and multiple-choice keep students alert
5. **No Repetition**: Within a single test, the same concept isn't asked twice

## Example

If a question group has 3 variations about UK coin currency:
- Test Attempt 1: Student gets variation #2 (True/False format)
- Test Attempt 2: Student gets variation #1 (Multiple choice format)
- Test Attempt 3: Student gets variation #3 (Different wording, multiple choice)

Each attempt tests the same knowledge but in a different way!

## Current Implementation

### "What is the UK" Topic
5 question groups with variations:
1. UK Coin Currency (4 variations: mix of multiple choice and true/false)
2. Pence in Pound (3 variations)
3. Currency Symbol (3 variations)
4. UK Countries (4 variations)
5. Capital of UK (3 variations)

### "A modern, thriving society" Topic
2 question groups with variations:
1. England Population (3 variations)
2. Age Demographics (4 variations)

## Adding More Variations

To add variations to your topics, add a `questionGroups` array:

```javascript
const topic = {
  "title": "Your Topic",
  "content": "...",
  "questions": [...], // Regular questions
  "questionGroups": [  // New question groups
    {
      "topic": "Description of what this tests",
      "variations": [
        // Add 2-5 variations here
      ]
    }
  ]
}
```

### Tips for Creating Variations
1. **Rephrase the question** - Ask the same thing in different words
2. **Change the format** - Convert between multiple-choice and true/false
3. **Reverse the question** - "What is X?" vs "X is what?"
4. **Statement form** - Turn questions into statements for true/false
5. **Add context** - Include more detail or background information

### Examples
- "What is the highest coin?" → "The UK has several coins, what's the largest?"
- "How many pence in a pound?" → "A pound contains 100 pence." (True/False)
- "Capital of UK?" → "London is the UK's capital city." (True/False)
