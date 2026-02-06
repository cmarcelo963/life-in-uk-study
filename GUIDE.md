# Study Guide - Complete User & Maintainer Guide

**Version:** 1.0.3  
**Last Updated:** February 2026

---

## Table of Contents

1. [What is Study Guide?](#what-is-study-guide)
2. [Who is this for?](#who-is-this-for)
3. [Getting Started](#getting-started)
4. [Information Architecture](#information-architecture)
5. [Learning Modes Explained](#learning-modes-explained)
6. [Question Formats](#question-formats)
7. [Scoring System](#scoring-system)
8. [Statistics & Tracking](#statistics--tracking)
9. [Data Files & Structure](#data-files--structure)
10. [Troubleshooting](#troubleshooting)
11. [Driving Theory Parity Plan](#driving-theory-parity-plan)
12. [Technical Architecture](#technical-architecture)

---

## What is Study Guide?

Study Guide is a **multi-subject interactive learning platform** designed to help users prepare for standardized tests through adaptive learning, spaced repetition, and multiple study modes.

**Current subjects:**
- 🇬🇧 **Life in the UK** - Citizenship test preparation (fully functional)
- 🚗 **Driving Theory** - UK driving theory test preparation (coming soon)

**Key features:**
- Adaptive learning algorithm (concept-based scoring)
- Multiple study modes (Adventure, Study, Practice, Flashcards)
- Offline-first PWA (Progressive Web App)
- Mobile-friendly design with ADHD-friendly interface
- LocalStorage + Node.js backend sync for data persistence

---

## Who is this for?

**End Users:**
- UK citizenship test candidates
- Driving theory test candidates (future)
- Self-directed learners who prefer interactive study tools
- People who benefit from structured, progressive learning

**Maintainers:**
- Developers adding new subjects or features
- Content creators updating question banks
- Anyone deploying this app for personal or organizational use

---

## Getting Started

### Quick Start (Recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   Or double-click `start.bat` (Windows)

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

### First-Time User Flow

1. **Subject Selection** - Homepage displays available subjects (Life in the UK, Driving Theory)
2. **Choose Life in the UK** - Click the 🇬🇧 card to enter Life in the UK study area
3. **Select a Learning Mode** - Choose from Adventure Mode, Study by Topics, Practice Test, Infinite Practice, Flashcards, or Statistics
4. **Start Learning!**

---

## Information Architecture

### Homepage (Subject Selection)

The app opens to a **subject selection screen** where users choose their study track:

- **🇬🇧 Life in the UK** - UK citizenship test preparation
- **🚗 Driving Theory** - Driving theory test (coming soon)

Each subject has its own:
- Question bank
- Study materials (topics_grouped.json)
- Progress tracking
- Statistics

### Within Each Subject

Once a subject is selected (e.g., Life in the UK), users see the **Learning Mode Dashboard** with these options:

---

## Learning Modes Explained

### A) Study by Topics

**Purpose:** Structured, sequential learning through all study materials.

**How it works:**
1. Topics are **locked progressively** - you must complete Topic 1 before accessing Topic 2
2. Each topic contains:
   - **Study Material** - Read comprehensive content with key facts, dates, and concepts
   - **Practice Checkpoint** - After reading, take a 24-question test to demonstrate understanding
3. **Passing score:** 75% or higher (18/24 questions)
4. **Unlocking:** Pass the checkpoint to unlock the next topic
5. **Retries:** Unlimited attempts if you don't pass

**Use case:** First-time learners who need structured guidance.

---

### B) Adventure Mode

**Purpose:** Continuous reading of study materials in chronological order without interruptions.

**How it works:**
1. Presents study materials in a **linear, story-like sequence**
2. No checkpoints or tests interrupt the flow
3. Users can read at their own pace
4. Progress is saved automatically (tracks current topic index)
5. Topics are presented in logical order (e.g., chronological for Life in the UK)

**Use case:** Users who prefer uninterrupted reading, reviewing material they've already studied, or getting a big-picture understanding before diving into tests.

**Note:** "Story Mode" and "Adventure Mode" refer to the same feature - it's the narrative path through study materials.

---

### C) Practice Test

**Purpose:** Full-length practice exam with random questions from all topics.

**How it works:**
1. Generates **24 random questions** from the entire question bank
2. Questions are selected using an **adaptive algorithm**:
   - Prioritizes questions you've answered incorrectly (low points)
   - Avoids recently-asked questions when possible
   - Includes questions from all difficulty levels
3. **Question formats supported:**
   - Standard multiple choice (4 options)
   - True/False (2 options)
   - "Which statement is correct?" (2 options)
   - Multiple-answer questions (select N correct answers, then submit)
4. **After completion:**
   - View your score (X/24)
   - See which questions you got right/wrong
   - Stats are saved to localStorage and backend
   - Points are updated per concept (+1 correct, -3 incorrect)

**Use case:** Users ready to test their knowledge across all topics, or simulating the real exam.

---

### D) Infinite Practice

**Purpose:** Practice unlimited questions one at a time, save progress anytime.

**How it works:**
1. Serves **one question at a time** using adaptive selection
2. No time limit or fixed question count
3. **Save anytime** - click "Save & Exit" to persist stats and return to menu
4. Questions are selected from weak areas (low-point concepts)
5. Avoids repeating the last concept served

**Use case:** Short study sessions, targeting weak areas, or practicing without the pressure of a full test.

---

### E) Flashcards

**Purpose:** Study mode where question and answer are both visible (no testing).

**How it works:**
1. Generates 24 questions using adaptive algorithm (prioritizes weak concepts)
2. **Front:** Question text
3. **Back:** Correct answer (visible immediately)
4. User self-assesses:
   - **✓ Correct** - "I knew this" (+1 point to concept)
   - **✗ Incorrect** - "I didn't know this" (-3 points to concept)
   - **Skip** - No points change, move to next card
5. Session stats tracked: correct, incorrect, skipped
6. Stats saved to localStorage and backend

**Use case:** Learning mode for absorbing facts without pressure, reviewing weak areas, or initial exposure to questions.

**Weak area prioritization:** The adaptive algorithm automatically surfaces questions from concepts with low points (those you've struggled with).

---

### F) Statistics

**Purpose:** View detailed performance data for all questions you've attempted.

**What's tracked:**
- **Correct count** - How many times you answered correctly
- **Incorrect count** - How many times you answered incorrectly
- **Points** - Current score for this concept (+1 per correct, -3 per incorrect)
- **Last asked** - Timestamp of last attempt
- **Percentage** - Success rate (correct / total attempts)

**How to read stats:**
- **High points (e.g., 10+):** Strong concept, likely to be retired from adaptive selection
- **Low/negative points (e.g., -5):** Weak concept, will appear more frequently
- **Never attempted:** Concepts with no data yet

**Use case:** Identifying weak areas, tracking improvement over time, understanding which topics need more study.

---

## Question Formats

The app supports multiple question types:

### 1. Standard Multiple Choice (4 options)
- One correct answer
- Three distractors
- Click to select, submit to check

### 2. True/False (2 options)
- Statement is either True or False
- Click to select, submit to check

### 3. "Which statement is correct?" (2 options)
- Two statements, only one is correct
- Often used for comparing facts

### 4. Multiple-Answer Questions
- Question specifies "Select all that apply" or "Select 2 correct answers"
- User clicks multiple checkboxes
- Must select correct number of answers
- All selected answers must be correct to get points

**Example:**
> "Which TWO of the following are British values? (Select 2)"
> - [ ] Democracy
> - [ ] Individual liberty
> - [ ] Monarchy
> - [ ] Military service

### 5. Type-In Answers (Hard Mode - Legacy)
- User types the answer
- Fuzzy matching algorithm allows minor typos (80-90% similarity)
- Strict matching for dates and numbers
- Not case-sensitive

---

## Scoring System

### Concept-Based Scoring

The app uses **concept-level tracking** rather than question-level tracking. This means:

- Questions are grouped by `conceptId` (e.g., `long_illustrious_history_chapter_britain_33`)
- Multiple question **variants** can share the same `conceptId` (e.g., `long_illustrious_history_chapter_britain_33_v0`, `long_illustrious_history_chapter_britain_33_v1`)
- When you answer a question, the stats are saved to `concept_<conceptId>` (e.g., `concept_long_illustrious_history_chapter_britain_33`)
- All variants of the same concept share the same score

**Why concept-based scoring?**
- Tests understanding, not memorization of specific question phrasing
- Allows question variations without inflating stats
- More accurate representation of knowledge

### Points Algorithm

- **Correct answer:** +1 point
- **Incorrect answer:** -3 points
- **Skip (flashcards only):** No change

**Example:**
```
Initial state: concept_history_wwi = 0 points

Answer correctly:  concept_history_wwi = 1 point
Answer incorrectly: concept_history_wwi = -2 points
Answer correctly:  concept_history_wwi = -1 points
Answer correctly:  concept_history_wwi = 0 points
Answer correctly:  concept_history_wwi = 1 point
```

### Adaptive Question Selection

Questions are selected based on their concept's point value:

1. **Weak concepts first** (low or negative points) - these appear more frequently
2. **Strong concepts less often** (high points) - once you've mastered them, they appear rarely
3. **Retirement threshold** - Concepts with 100+ points are considered "mastered" and retired from adaptive selection
4. **Random fallback** - If all concepts are mastered, questions are selected randomly

### Stats Reset on Dataset Version Change

When the question bank is updated (new questions added, IDs changed, structure modified), stats may become incompatible. The app detects this using `DATA_VERSION`:

```javascript
const DATA_VERSION = 4; // Increment when dataset changes
```

**What happens on version change:**
1. App checks `localStorage.getItem('lifeInUK_dataVersion')`
2. If stored version ≠ current version:
   - Clear `lifeInUK_questionStats`
   - Clear `lifeInUK_practiceStats`
   - Update `lifeInUK_dataVersion` to current version
3. User starts fresh with new question bank

**Keys cleared on reset:**
- `lifeInUK_questionStats` - All concept scores
- `lifeInUK_practiceStats` - Seen questions tracker
- `lifeInUK_statsMigrated_v2` - Migration flags

**Keys preserved:**
- `lifeInUK_progress` - Topic completion (unless incompatible)
- `lifeInUK_dataVersion` - Updated to new version

---

## Statistics & Tracking

### LocalStorage Keys

The app uses these localStorage keys:

| Key | Purpose | Format |
|-----|---------|--------|
| `lifeInUK_progress` | Topic completion, scores | `{ topicId: { completed: bool, score: number, attempts: number } }` |
| `lifeInUK_questionStats` | Concept scores and attempt counts | `{ "concept_id": { correct: N, incorrect: N, lastAsked: timestamp } }` |
| `lifeInUK_practiceStats` | Tracks which questions have been seen | `{ seenAll: bool, questionsSeen: { "question_id": true } }` |
| `lifeInUK_adventureProgress` | Adventure mode progress | `{ currentTopicIndex: N, topicsCompleted: [] }` |
| `lifeInUK_dataVersion` | Dataset version for compatibility | `"4"` (string) |

### Backend Sync

If the Node.js server is running, data is also persisted to `user-data/`:

- **`progress.json`** - Mirrors `lifeInUK_progress`
- **`question-stats.json`** - Mirrors `lifeInUK_questionStats`
- **`practice-stats.json`** - Mirrors `lifeInUK_practiceStats`

**API Endpoints:**
- `GET /api/progress` - Fetch progress data
- `POST /api/progress` - Save progress data
- `GET /api/question-stats` - Fetch question stats
- `POST /api/question-stats` - Save question stats
- `GET /api/practice-stats` - Fetch practice stats
- `POST /api/practice-stats` - Save practice stats
- `POST /api/reset` - Clear all backend data

**Sync behavior:**
- On app load, fetch from backend (if available)
- On stat change, save to localStorage immediately
- Debounced save to backend (500ms delay)
- If backend fails, fallback to localStorage

---

## Data Files & Structure

### Question Bank: `data/questions.json`

**Location:** `data/questions.json`

**Structure:** Array of question objects

```json
[
  {
    "id": "long_illustrious_history_chapter_britain_33_v0",
    "question": "The Bill of Rights confirmed the rights of who to elect members of Parliament?",
    "options": [
      "The monarch",
      "Parliament",
      "The people",
      "The Church"
    ],
    "answer": "Parliament",
    "conceptId": "long_illustrious_history_chapter_britain_33",
    "category": "A long and illustrious history",
    "type": "multiple-choice"
  },
  {
    "id": "values_principles_britain_2_v0",
    "question": "Is this statement true or false? UK laws do not apply to everyone.",
    "options": ["True", "False"],
    "answer": "False",
    "conceptId": "values_principles_britain_2",
    "category": "The values and principles of the UK",
    "type": "true-false"
  }
]
```

**Key fields:**
- `id` - Unique question identifier (format: `<conceptId>_v<variant>`)
- `question` - Question text
- `options` - Array of answer choices
- `answer` - Correct answer (must match one option exactly)
- `conceptId` - Concept identifier for grouping variants
- `category` - Topic/chapter name (for filtering)
- `type` - Question type (multiple-choice, true-false, multi-select)

**Adding questions:**
1. Add to `data/questions.json`
2. Ensure `conceptId` is unique (or matches existing concept if it's a variant)
3. Format `id` as `<conceptId>_v<variant_number>`
4. Increment `DATA_VERSION` in `app.js` if IDs change

---

### Study Materials: `data/topics_grouped.json`

**Location:** `data/topics_grouped.json`

**Structure:** Array of topic objects

```json
[
  {
    "title": "The values and principles of the UK",
    "content": "<h3>British Values</h3><p>The UK is founded on values including...</p>",
    "conceptId": "values_principles_britain"
  },
  {
    "title": "A long and illustrious history",
    "content": "<h3>Early Britain</h3><p>The first people arrived in Britain...</p>",
    "conceptId": "long_illustrious_history_chapter_britain"
  }
]
```

**Key fields:**
- `title` - Topic name (displayed in UI)
- `content` - HTML-formatted study material
- `conceptId` - Identifier linking to questions (optional, for future filtering)

**Content formatting:**
- Use semantic HTML: `<h3>`, `<p>`, `<strong>`, `<ul>`, `<ol>`, `<li>`
- Keep paragraphs short for readability
- Use `<strong>` for key facts (dates, names, important concepts)
- Break content into sections with `<h3>` headings

**Adding topics:**
1. Add to `data/topics_grouped.json`
2. Ensure questions in `questions.json` have matching `category` field
3. Order topics logically (chronological for history topics)

---

### User Data Files (Backend)

**Location:** `user-data/` (created by server.js)

**Files:**
- `progress.json` - Topic completion and scores
- `question-stats.json` - Concept scores, correct/incorrect counts
- `practice-stats.json` - Seen questions tracker

**Format:** Same as localStorage data (JSON objects)

**Backup strategy:**
- Server writes to `user-data/` folder
- Browser keeps copy in localStorage
- If backend unavailable, app works in offline mode
- Next sync will upload localStorage data to backend

---

## Troubleshooting

### Issue: Cached Service Worker (Stale Code)

**Symptoms:**
- Changes to `app.js`, `styles.css`, or `index.html` don't appear
- Old version number shows in console (e.g., "Study Guide v1.0.1" instead of "v1.0.3")
- Features behave as if code wasn't updated

**Cause:**
- Service worker caches files for offline use
- Browser may serve cached version instead of new code

**Solution 1: Use the Clear Cache Button**
1. Click the 🗑️ (trash) icon in the header
2. Confirm "Clear all cached data and reload the app?"
3. App will:
   - Clear service worker cache
   - Unregister service worker
   - Clear localStorage (except progress data)
   - Force reload

**Solution 2: Manual Cache Clear**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page with `Ctrl + F5` (hard reload)

**Solution 3: Developer Tools**
1. Press `F12` to open DevTools
2. Go to "Application" tab
3. Click "Service Workers" in sidebar
4. Click "Unregister" next to the service worker
5. Click "Clear storage" → "Clear site data"
6. Refresh page

**Prevention:**
- Check console for version number on load
- Increment `APP_VERSION` in `app.js` when making changes
- Service worker name includes version (e.g., `life-in-uk-v22`)

---

### Issue: Undefined Answer Error

**Symptoms:**
- Error in console: `Cannot set properties of undefined (setting 'concept_xyz')`
- Flashcards or practice mode crashes
- Questions don't load

**Cause:**
- `state.practiceStats.questionsSeen` object not initialized
- Race condition during data loading

**Solution:**
1. Check browser console for full error
2. Click "Clear Cache" button to reset app state
3. If error persists, check `data/questions.json` for:
   - Missing `conceptId` fields
   - Malformed JSON
   - Duplicate IDs
4. Validate JSON at https://jsonlint.com

**Prevention:**
- Initialization code in `generatePracticeQuestions()` ensures `practiceStats` exists
- Always test new questions after adding to `questions.json`

---

### Issue: Stats Not Updating

**Symptoms:**
- Answer questions but stats don't change
- Points always show 0
- Statistics screen is empty

**Cause:**
- Backend server not running (stats not persisting)
- localStorage quota exceeded (rare)
- JavaScript error preventing save

**Solution:**
1. **Check server status:**
   - Ensure `npm start` or `node server.js` is running
   - Look for "✅ Server running on http://localhost:3000" message
   - Try accessing http://localhost:3000/api/question-stats in browser

2. **Check browser console:**
   - Look for errors during `saveQuestionStats()` calls
   - Check localStorage size: run in console:
     ```javascript
     Object.keys(localStorage).map(key => 
       `${key}: ${localStorage[key].length} chars`
     )
     ```

3. **Force save:**
   - Open console (F12)
   - Run: `window.debugStats()` to see current stats
   - Run: `saveQuestionStats()` to trigger manual save

4. **Reset stats:**
   - Click Reset Progress button (⟳) in header
   - This clears all stats and resets to fresh state

---

### Issue: Repeated Questions (Same Concept Appearing Too Often)

**Symptoms:**
- Same question appears multiple times in one practice session
- Questions feel repetitive even though you've answered correctly

**Cause:**
- Question has low points (you've answered incorrectly recently)
- Small question bank or limited concepts in selected category
- `lastInfiniteConceptKey` not preventing immediate repeats

**Solution:**
1. **Answer correctly consistently** - Once you get +3 to +5 points, the concept will appear less often
2. **Check stats** - Go to Statistics mode and see which concepts have low points
3. **Complete more topics** - More topics = larger question pool
4. **Use Flashcards mode** - Review low-point concepts until you master them

**Expected behavior:**
- Weak concepts (low points) appear frequently (this is intentional!)
- Strong concepts (high points) appear rarely
- Concepts with 100+ points are retired (won't appear unless all concepts are mastered)

---

### Issue: Questions Not Loading (Blank Screen)

**Symptoms:**
- Practice test or flashcards screen is empty
- No questions displayed
- Console shows "Cannot read property 'question' of undefined"

**Cause:**
- `data/questions.json` failed to load
- `data/topics_grouped.json` missing or malformed
- Network error (if running via server)

**Solution:**
1. **Check data files exist:**
   - Verify `data/questions.json` exists and is valid JSON
   - Verify `data/topics_grouped.json` exists

2. **Validate JSON:**
   - Copy contents of `questions.json`
   - Paste into https://jsonlint.com
   - Fix any syntax errors

3. **Check network (if using server):**
   - Open DevTools → Network tab
   - Refresh page
   - Look for failed requests to `/data/questions.json`
   - Check server console for errors

4. **Reload topics:**
   - Open console (F12)
   - Run: `await loadTopics()`
   - Run: `await loadQuestions()`
   - Check if data loads successfully

---

### Issue: Progress Lost After Clearing Cache

**Symptoms:**
- Cleared cache and lost all progress
- Had to restart all topics

**Cause:**
- Clear Cache button clears all localStorage (including progress) if not connected to backend
- Browser data wipe (clearing browsing data)

**Solution:**
1. **Restore from backend (if available):**
   - Start the Node.js server (`npm start`)
   - Refresh the app
   - Backend data will sync to localStorage

2. **Manual backup (prevention):**
   - Open console (F12)
   - Run: `JSON.stringify(localStorage)`
   - Copy output and save to a text file
   - To restore: `Object.entries(savedData).forEach(([k,v]) => localStorage.setItem(k,v))`

3. **Future prevention:**
   - Always run the Node.js backend server for automatic backups
   - Backend stores data in `user-data/` folder (persists across cache clears)

---

## Driving Theory Parity Plan

### Goal

Replicate the Life in the UK structure for Driving Theory test preparation, ensuring feature parity and consistent user experience.

### Required Data Inputs

To add Driving Theory, you'll need:

1. **Question Bank** - `data/driving-theory-questions.json`
   - Format: Same as `questions.json` (see structure above)
   - Categories: Highway Code, Road Signs, Hazard Perception (if applicable)
   - Estimated 50-100 questions minimum

2. **Study Materials** - `data/driving-theory-topics.json`
   - Format: Same as `topics_grouped.json`
   - Topics: Rules of the Road, Road Signs, Vehicle Safety, etc.
   - HTML-formatted content with key facts

3. **Assets (optional)** - `data/driving-theory-assets/`
   - Road sign images (SVG or PNG)
   - Hazard perception videos (if implementing)

### Feature Parity Checklist

Driving Theory should support the same modes as Life in the UK:

- [ ] **Study by Topics** - Progressive topic unlocking, 75% passing score
- [ ] **Adventure Mode** - Linear reading of study materials
- [ ] **Practice Test** - 24 random questions from all topics
- [ ] **Infinite Practice** - One question at a time, adaptive selection
- [ ] **Flashcards** - Question + answer visible, self-assessment
- [ ] **Statistics** - Concept-based tracking, points system

### Implementation Steps

1. **Create data files:**
   ```
   data/
     driving-theory-questions.json   (question bank)
     driving-theory-topics.json      (study materials)
   ```

2. **Update `app.js`:**
   - Add driving theory loading functions (`loadDrivingTheoryQuestions()`, `loadDrivingTheoryTopics()`)
   - Duplicate state management for driving theory (or refactor to be subject-agnostic)
   - Update `selectSubject()` function to handle `'driving-theory'` case

3. **Update `index.html`:**
   - Create driving theory screens (clone Life in the UK screens)
   - Update subject selection button to be clickable (remove "Coming Soon" badge)

4. **Update localStorage keys:**
   - Add `drivingTheory_progress`, `drivingTheory_questionStats`, `drivingTheory_practiceStats`
   - Keep subjects isolated (don't mix Life in the UK and Driving Theory stats)

5. **Update backend (`server.js`):**
   - Add endpoints for driving theory data (`/api/driving-theory/progress`, etc.)
   - Store driving theory data in separate files (`driving-theory-progress.json`)

6. **Test thoroughly:**
   - Verify all modes work for Driving Theory
   - Verify subject switching doesn't corrupt data
   - Verify offline mode works for both subjects

### Content Guidelines: Life in the UK

**Important:** When testing Life in the UK citizenship content, **do not include current office-holders** (e.g., "Who is the current Prime Minister?"). These change over time and make the question bank obsolete.

**Instead, focus on:**
- **Role responsibilities** - "What is the Prime Minister responsible for?"
- **Historical facts** - "Who was Prime Minister during WWII?"
- **System structure** - "How is the Prime Minister chosen?"
- **Timeless facts** - Dates, laws, historical events, cultural traditions

This ensures the question bank remains relevant for years without updates.

---

## Technical Architecture

### Tech Stack

- **Frontend:** Pure HTML, CSS, JavaScript (no frameworks)
- **Backend:** Node.js + Express (optional, for data persistence)
- **Storage:** LocalStorage (browser) + JSON files (backend)
- **Offline:** Service Worker (PWA) caches data and assets

### File Structure

```
project/
├── index.html              # Main HTML structure
├── app.js                  # Core application logic (2900+ lines)
├── styles.css              # All styling (1300+ lines)
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline caching
├── server.js               # Node.js backend (optional)
├── package.json            # Dependencies
├── data/
│   ├── questions.json      # Life in the UK question bank
│   └── topics_grouped.json # Life in the UK study materials
├── user-data/              # Backend storage (created by server)
│   ├── progress.json
│   ├── question-stats.json
│   └── practice-stats.json
└── _unused_backup/         # Archived files
```

### Key Functions (app.js)

| Function | Purpose | Line (approx) |
|----------|---------|---------------|
| `init()` | App initialization, loads data and sets up event listeners | ~2300 |
| `selectSubject(subject)` | Handles subject selection, updates header | ~1530 |
| `loadTopics()` | Fetches `topics_grouped.json` | ~200 |
| `loadQuestions()` | Fetches `questions.json` | ~250 |
| `generatePracticeQuestions(count)` | Adaptive question selection algorithm | ~1280 |
| `updateQuestionStats(questionId, isCorrect)` | Updates concept scores | ~550 |
| `saveQuestionStats()` | Persists stats to localStorage and backend | ~450 |
| `startFlashcards()` | Initializes flashcard mode | ~1800 |
| `handleFlashcardResponse(response)` | Processes flashcard self-assessment | ~1900 |
| `renderStatistics()` | Displays stats screen | ~700 |
| `showScreen(screenId)` | Switches between screens | ~1520 |

### Service Worker (service-worker.js)

- **Cache name:** `life-in-uk-v22` (increment on data updates)
- **Cached resources:**
  - `index.html`
  - `app.js`
  - `styles.css`
  - `data/questions.json`
  - `data/topics_grouped.json`
- **Strategy:** Cache-first (serve from cache if available, fetch if not)
- **Update:** Change cache version to force re-download

### Backend API (server.js)

**Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Serve `index.html` |
| GET | `/api/progress` | Fetch topic progress |
| POST | `/api/progress` | Save topic progress |
| GET | `/api/question-stats` | Fetch concept scores |
| POST | `/api/question-stats` | Save concept scores |
| GET | `/api/practice-stats` | Fetch practice seen tracker |
| POST | `/api/practice-stats` | Save practice seen tracker |
| POST | `/api/reset` | Clear all user data |

**Data storage:**
- Files stored in `user-data/` folder
- Atomically written (write to temp file, then rename)
- No authentication (for personal use only)

---

## Deployment Options

### Option 1: Local Server (Recommended for Development)

```bash
npm install
npm start
# Access at http://localhost:3000
```

### Option 2: Static Hosting (GitHub Pages, Netlify, Vercel)

**Limitations:**
- No backend (no data persistence across devices)
- localStorage only (cleared if browser data is wiped)

**Steps:**
1. Deploy entire project folder to hosting service
2. Service worker will enable offline mode
3. Users' data stays in their browser localStorage

### Option 3: Self-Hosted (VPS, Raspberry Pi, Home Server)

**Requirements:**
- Node.js installed
- Port 3000 open (or configure nginx reverse proxy)
- Domain name (optional, use IP address otherwise)

**Steps:**
1. Clone repo to server
2. Run `npm install`
3. Run `npm start` (or use PM2 for process management)
4. Access via server IP: `http://YOUR_SERVER_IP:3000`

### Option 4: Docker (Advanced)

Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Run:
```bash
docker build -t study-guide .
docker run -p 3000:3000 -v $(pwd)/user-data:/app/user-data study-guide
```

---

## FAQ

**Q: Can I add my own subjects (e.g., Math, History)?**  
A: Yes! Follow the Driving Theory parity plan - create question and topic JSON files, add a subject card to the homepage, and implement loading logic in `app.js`.

**Q: Can I use this offline?**  
A: Yes, the service worker caches all data. After the first load, the app works fully offline. Stats are saved to localStorage and synced to backend when back online.

**Q: Can multiple users use the same app?**  
A: The current architecture is single-user. Each user would need their own deployment or browser profile (different localStorage).

**Q: How do I add images to study materials?**  
A: Add images to a `data/images/` folder and reference them in `topics_grouped.json` content:
```json
"content": "<h3>Topic</h3><img src='data/images/example.jpg' alt='Example'><p>Text...</p>"
```

**Q: How do I change the passing score?**  
A: Edit the `checkAnswer()` function in `app.js`. Look for the line:
```javascript
if (state.score >= Math.ceil(state.currentQuestions.length * 0.75)) {
```
Change `0.75` to desired percentage (e.g., `0.80` for 80%).

**Q: How do I export my stats?**  
A: Open browser console (F12) and run:
```javascript
const stats = {
  progress: localStorage.getItem('lifeInUK_progress'),
  questionStats: localStorage.getItem('lifeInUK_questionStats'),
  practiceStats: localStorage.getItem('lifeInUK_practiceStats')
};
console.log(JSON.stringify(stats, null, 2));
```
Copy the output and save to a file.

---

## Contributing

If you're maintaining this app or adding features:

1. **Increment `APP_VERSION`** in `app.js` when making changes
2. **Increment `DATA_VERSION`** if question IDs or structure changes
3. **Update service worker cache name** (`service-worker.js`) if data files change
4. **Test all modes** after adding questions or features
5. **Document changes** in this guide

---

## License

Free to use for personal study purposes.

---

**Happy studying! 📚✨**
