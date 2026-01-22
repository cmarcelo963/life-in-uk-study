# Question Scoring System Analysis

## Summary
The app uses a **per-question points system** stored in `state.questionStats` (keyed by question ID), with +1 for correct and -2 for incorrect answers.

---

## 1. Score Computation Location

### File: `app.js`

**Function: `updateQuestionStats(questionId, isCorrect)`** (Lines 308-340)

```javascript
function updateQuestionStats(questionId, isCorrect) {
    console.log('=== updateQuestionStats ===');
    console.log('ID:', questionId);
    console.log('Correct:', isCorrect ? 'Yes' : 'No');
    initQuestionStats(questionId);
    
    const stats = state.questionStats[questionId];
    stats.lastAsked = Date.now();
    
    if (isCorrect) {
        stats.correct++;
        stats.points += 1;  // +1 point for correct       ⬅️ LINE 319
    } else {
        stats.incorrect++;
        stats.points -= 2;  // -2 points for incorrect    ⬅️ LINE 322
    }

    // Cap upper bound so mastered questions can be retired
    stats.points = Math.min(stats.points, 100);          ⬅️ LINE 326
    
    console.log('New stats:', stats);
    saveQuestionStats();
}
```

**Key Lines:**
- **Line 319**: `stats.points += 1;` — Correct answer adds +1 point
- **Line 322**: `stats.points -= 2;` — Incorrect answer subtracts -2 points (not -3 as stated in request)
- **Line 326**: `stats.points = Math.min(stats.points, 100);` — Cap at 100 points (mastery threshold)

**Note:** The code currently uses **-2** for incorrect answers, not -3.

---

## 2. Data Storage Structure

### Global State (Runtime)

**File:** `app.js` (Lines 1-21)

```javascript
let state = {
    topics: [],
    currentTopicIndex: null,
    currentQuestions: [],
    currentQuestionIndex: 0,
    currentDifficulty: null,
    score: 0,                    // ⬅️ Current test session score (simple counter)
    progress: {},
    questionStats: {},           // ⬅️ Per-question performance tracking
    isPracticeMode: false,
    // ... other properties
};
```

### Per-Question Stats Object

**Initialized in:** `initQuestionStats(questionId)` (Lines 296-304)

```javascript
function initQuestionStats(questionId) {
    if (!state.questionStats[questionId]) {
        state.questionStats[questionId] = {
            correct: 0,          // Number of times answered correctly
            incorrect: 0,        // Number of times answered incorrectly
            lastAsked: null,     // Timestamp of last attempt
            points: 0            // Running points total (+1 correct, -2 incorrect)
        };
    }
}
```

### Example Data Structure

```json
{
  "0_0_How_many_questions_are_in_the_Life_in_the_UK_test": {
    "correct": 3,
    "incorrect": 1,
    "lastAsked": 1737593400000,
    "points": 1
  },
  "0_1_Which_of_the_following_is_a_fundamental_principle_of_British_life": {
    "correct": 2,
    "incorrect": 0,
    "lastAsked": 1737593450000,
    "points": 2
  },
  "1_5_What_is_Stonehenge": {
    "correct": 0,
    "incorrect": 2,
    "lastAsked": 1737593500000,
    "points": -4
  }
}
```

**Key Structure:**
- **Key**: Question ID (format: `topicIndex_questionIndex_textHash`)
- **Value**: Object with:
  - `correct`: Count of correct answers
  - `incorrect`: Count of incorrect answers
  - `lastAsked`: Unix timestamp (ms)
  - `points`: Running total (can be negative or >100)

---

## 3. Persistence Layer

### Primary: localStorage

**Key:** `lifeInUK_questionStats`

**Save Function:** `saveQuestionStats()` (Lines 254-277)

```javascript
async function saveQuestionStats() {
    // Always save to localStorage first (works on mobile)
    try {
        localStorage.setItem('lifeInUK_questionStats', JSON.stringify(state.questionStats));
        console.log('Saved question stats to localStorage');
    } catch (localError) {
        console.error('Error saving to localStorage:', localError);
    }
    
    // Try to sync with backend if available (desktop only)
    try {
        await fetch('http://localhost:3000/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.questionStats)
        });
        console.log('Synced question stats to backend');
    } catch (error) {
        console.log('Backend not available for sync');
    }
}
```

**Load Function:** `loadQuestionStats()` (Lines 224-252)

```javascript
async function loadQuestionStats() {
    try {
        // Try localStorage first (works on mobile)
        const saved = localStorage.getItem('lifeInUK_questionStats');
        if (saved) {
            state.questionStats = JSON.parse(saved);
            console.log('Loaded question stats from localStorage:', Object.keys(state.questionStats).length, 'entries');
        } else {
            state.questionStats = {};
        }
        
        // Try to sync with backend if available (desktop only)
        try {
            const response = await fetch('http://localhost:3000/api/stats', { timeout: 1000 });
            if (response.ok) {
                const data = await response.json();
                state.questionStats = data || state.questionStats;
                console.log('Synced question stats from backend');
            }
        } catch (backendError) {
            console.log('Backend not available, using localStorage');
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        state.questionStats = {};
    }
}
```

### Secondary: Backend API (Optional)

**Endpoint:** `http://localhost:3000/api/stats`
- **GET**: Load stats from server
- **POST**: Save stats to server

**Server File:** `server.js` (Lines 67-91)

```javascript
// Get question stats
app.get('/api/stats', async (req, res) => {
    try {
        const data = await fs.readFile(STATS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.json({});
    }
});

// Save question stats
app.post('/api/stats', async (req, res) => {
    try {
        await fs.writeFile(STATS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

**Backend File:** `user-data/question-stats.json`

---

## 4. Score vs Points Distinction

### `state.score` (Session Score)
- **Purpose**: Count correct answers in current test session
- **Type**: Simple integer counter
- **Scope**: Resets to 0 at start of each test
- **Location**: Lines 438, 611, 1370
- **Display**: Used for "Score: X/24" in test mode

### `state.questionStats[id].points` (Adaptive Learning Points)
- **Purpose**: Track long-term mastery of individual questions
- **Type**: Accumulating integer (can be negative or >100)
- **Scope**: Persists across sessions
- **Used For**:
  - Adaptive question selection (prioritize low-scoring questions)
  - Retirement threshold (100 points = mastered, removed from pool)
  - Performance analytics

---

## 5. Where Scores Are Updated

### `checkAnswer(userAnswer)` (Lines 1279-1380)

This function:
1. Determines if answer is correct
2. Updates `state.score` for current session: `state.score++` (Line 1370)
3. Calls `updateQuestionStats(questionId, isCorrect)` (Line 1379)

```javascript
function checkAnswer(userAnswer) {
    const question = state.currentQuestion || state.currentQuestions[state.currentQuestionIndex];
    const correctAnswer = question.answer || question.answers;

    let isCorrect = false;
    // ... correctness logic ...

    // Update score
    if (isCorrect) {
        state.score++;                              // ⬅️ LINE 1370
    }
    
    // Track question performance for adaptive learning
    const questionId = getQuestionId(
        question,
        (typeof question.topicIndex === 'number' ? question.topicIndex : state.currentTopicIndex),
        question.sourceIndex
    );
    updateQuestionStats(questionId, isCorrect);     // ⬅️ LINE 1379
}
```

---

## 6. Question ID Generation

**Function:** `getQuestionId(question, topicIndex, questionIndex)` (Lines 280-293)

```javascript
function getQuestionId(question, topicIndex, questionIndex) {
    if (!question) {
        console.error('getQuestionId: null/undefined question');
        return `${topicIndex}_${(typeof question.topicIndex === 'number' ? question.topicIndex : questionIndex)}_unknown`;
    }
    if (question.groupId) {
        return `${topicIndex}_group_${question.groupId}`;
    }
    if (!question.question) {
        console.warn('Question missing .question:', question);
        return `${topicIndex}_${questionIndex}_no_text`;
    }
    const textHash = question.question.substring(0, 50).replace(/\s+/g, '_');
    const indexPart = (question && question.sourceIndex !== undefined) ? question.sourceIndex : questionIndex;
    return `${topicIndex}_${indexPart}_${textHash}`;
}
```

**ID Format:** `{topicIndex}_{questionIndex}_{first50CharsOfQuestionText}`

---

## 7. Adaptive Learning Integration

### Question Weight Calculation (Lines 342-349)

```javascript
function getQuestionWeight(questionId) {
    const points = state.questionStats[questionId]?.points ?? 0;

    // Retired questions sink to the bottom; otherwise lower points (including negative) rise to the top
    if (points >= 100) return Number.NEGATIVE_INFINITY;
    return -points;
}
```

- **Lower points** (including negative) → **Higher priority** (shown more often)
- **100+ points** → Question is "retired" (removed from question pool)

### Retirement Check (Lines 352-354)

```javascript
function isQuestionRetired(questionId) {
    return !!(state.questionStats[questionId] && state.questionStats[questionId].points >= 100);
}
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Correct Answer** | `+1` point (Line 319) |
| **Incorrect Answer** | `-2` points (Line 322) ⚠️ *not -3* |
| **Storage Type** | Per-question (keyed by question ID) |
| **Primary Persistence** | `localStorage` key: `lifeInUK_questionStats` |
| **Secondary Persistence** | Backend API: `http://localhost:3000/api/stats` → `user-data/question-stats.json` |
| **Data Structure** | `{ questionId: { correct, incorrect, lastAsked, points } }` |
| **Point Cap** | 100 (mastery threshold) |
| **Update Function** | `updateQuestionStats()` (Line 308) |
| **Save Function** | `saveQuestionStats()` (Line 254) |
| **Load Function** | `loadQuestionStats()` (Line 224) |
| **Caller** | `checkAnswer()` → calls `updateQuestionStats()` (Line 1379) |

---

## Correction Needed

⚠️ **User stated "-3 for incorrect" but code shows "-2"**

If you want to change it to -3:
- Modify **Line 322** in `app.js`:
  ```javascript
  stats.points -= 3;  // -3 points for incorrect
  ```
