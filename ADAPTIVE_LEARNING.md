# Adaptive Learning System

## Overview
The app now tracks your performance on individual questions and adapts future practice tests to focus on questions you struggle with.

## How It Works

### 1. **Question Tracking**
- Every question you answer (correct or incorrect) is tracked
- Each question has a "weight" that determines how often it appears
- All stats are stored in your browser's localStorage

### 2. **Weight System**
- **Starting weight**: 1.0 (all questions equal)
- **When you answer correctly**: Weight decreases by 20% (minimum 0.1)
  - Example: 1.0 → 0.8 → 0.64 → 0.51...
- **When you answer incorrectly**: Weight increases by 50% (maximum 5.0)
  - Example: 1.0 → 1.5 → 2.25 → 3.375...

### 3. **Question Selection**
- **First attempt**: Questions are completely random
- **Subsequent attempts**: Questions are sorted by weight
  - Higher weight = answered incorrectly more = appears first
  - Lower weight = answered correctly more = appears later
  - You'll see your weak areas prioritized!

### 4. **Visual Feedback**
After your first attempt on a topic, you'll see:
> 📊 **Adaptive Learning Active**
> 
> Questions you struggle with will appear more frequently in your next practice test.

## Benefits

### ✅ Efficient Learning
Focus your time on concepts you haven't mastered yet

### ✅ Smart Repetition
Questions adapt based on YOUR performance, not a fixed schedule

### ✅ Natural Progression
As you improve on a question, you'll see it less often

### ✅ Confidence Building
Master difficult questions through repeated, spaced practice

## Examples

### Scenario 1: First Attempt
You take a test on "What is the UK" for the first time:
- All questions appear randomly
- You get 8/10 correct
- Two questions were answered incorrectly

**Next time**: Those 2 incorrect questions will appear early in the test

### Scenario 2: Repeated Practice
After 3 attempts on "A modern, thriving society":
- Question A: Answered correctly 3 times → Weight: 0.51 (asked rarely)
- Question B: Answered incorrectly 2 times, correct 1 time → Weight: 2.25 (asked often)
- Question C: Answered incorrectly 3 times → Weight: 3.375 (asked very often)

**Your next test**: Questions C and B appear first, Question A appears last

### Scenario 3: Mastery
You've practiced "The values and principles of the UK" 5 times:
- You consistently get 15/16 questions correct
- One question about voting age keeps tripping you up

**Your next test**: That voting age question will be among the first you see, giving you more chances to master it!

## Data Persistence

### Stored Information
- Question ID (unique identifier based on text)
- Correct count
- Incorrect count
- Last time asked
- Current weight

### Reset Option
Use the reset button (↻) to clear:
- All progress
- All question statistics
- Start completely fresh

## Tips for Best Results

1. **Take multiple practice tests** - The system gets smarter with more data
2. **Don't rush** - Focus on understanding, not just memorizing
3. **Review study materials** - If you keep getting a question wrong, go back and study
4. **Trust the system** - It will naturally guide you to areas needing improvement

## Technical Details

### Storage
- Key: `lifeInUK_questionStats`
- Format: JSON object with question IDs as keys
- Independent from progress tracking

### Weight Calculation
```javascript
// Correct answer
newWeight = Math.max(0.1, currentWeight * 0.8)

// Incorrect answer
newWeight = Math.min(5.0, currentWeight * 1.5)
```

### Question Sorting
```javascript
// Higher weight = higher priority (appears first)
questions.sort((a, b) => b.weight - a.weight)
```

---

**The more you practice, the smarter the system becomes at helping you learn! 🧠**
