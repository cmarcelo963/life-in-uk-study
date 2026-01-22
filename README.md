# Life in the UK - Interactive Study App

A modern, ADHD-friendly web application for studying Life in the UK exam materials. Features progressive topic unlocking, multiple difficulty modes, question variations to prevent memorization, and smart answer matching.

## ✨ Features

### 🎲 Question Variations System (NEW!)
- Multiple variations of the same question with different phrasings
- Mix of **Multiple Choice** and **True/False** question types
- Randomly selects ONE variation per test to prevent memorization
- Tests understanding, not memory of specific question text
- See [QUESTION_VARIATIONS.md](QUESTION_VARIATIONS.md) for details

### 🔒 Progressive Learning
- Topics unlock sequentially - must pass each topic to move forward
- Clear progress tracking with completion badges
- Prevents rushing through material

### 📚 Study-First Approach
- Read comprehensive study materials before testing
- Each topic contains formatted content with key facts
- Visual organization with headings, lists, and emphasis

### 🎯 Dual Difficulty Modes
- **Normal Mode**: Multiple choice and True/False questions
- **Hard Mode**: Type-in answers with intelligent fuzzy matching
  - 80-90% similarity threshold for spelling forgiveness
  - Strict matching for dates and numbers
  - Not case-sensitive

### 🔄 Smart Question Randomization
- Questions shuffled on every test attempt
- Answer options randomized in normal mode
- Fresh experience each time

### 📱 Mobile-Friendly
- Fully responsive design
- Works perfectly on phones, tablets, and desktop
- Clean, distraction-free interface for ADHD focus

### 💾 Progress Persistence
- Automatic progress saving via LocalStorage
- Track best scores and completion status
- Reset progress option available

## 📊 Question Bank

**370 total questions** across 11 comprehensive topics covering:
- UK values and citizenship requirements
- Historical periods from Stone Age to modern times
- Government structure and legal system
- Culture, traditions, and modern society
- Sports, leisure, and public services

Questions include:
- Regular multiple-choice questions
- True/False statements
- Question variations to test true understanding

## 🚀 Getting Started

### Quick Start (With Database Backend)
1. **Install Node.js** if you haven't already
2. **Install dependencies**: 
   ```bash
   npm install
   ```
3. **Start the server**: 
   ```bash
   npm start
   ```
   Or double-click `start.bat` (Windows)
4. **Open in browser**: http://localhost:3000

The app now saves your progress to a database file!

### Alternative Methods

#### Option 1: Using Python (Simplest)
1. Open terminal/PowerShell in the project folder
2. Run: `python -m http.server 8000`
3. On your phone, connect to same WiFi network
4. Open browser and go to: `http://YOUR_COMPUTER_IP:8000`
5. Find your computer IP:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

#### Option 2: Deploy to GitHub Pages (Free, Always Accessible)
1. Create a GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Enable GitHub Pages
5. Access from anywhere at: `https://yourusername.github.io/repo-name`

#### Option 3: Use Netlify/Vercel (Free, Professional)
1. Sign up for free at netlify.com or vercel.com
2. Drag and drop your project folder
3. Get a permanent URL instantly
4. Access from anywhere

## 📁 Data Storage

### Backend Database (Recommended)
- **Location**: `user-data/` folder
- **Files**: 
  - `progress.json` - Topic completion and scores
  - `question-stats.json` - Adaptive learning data
- **Backup**: Also saves to browser localStorage
- **Security**: For personal use only - no authentication

### API Endpoints
- `GET /api/progress` - Get all progress
- `POST /api/progress` - Save progress
- `GET /api/stats` - Get question statistics
- `POST /api/stats` - Save question statistics  
- `POST /api/reset` - Reset all data

### For Hosting on Your Phone

#### Option 1: Using Python (Simplest)
1. Open terminal/PowerShell in the project folder
2. Run: `python -m http.server 8000`
3. On your phone, connect to same WiFi network
4. Open browser and go to: `http://YOUR_COMPUTER_IP:8000`
5. Find your computer IP:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

#### Option 2: Deploy to GitHub Pages (Free, Always Accessible)
1. Create a GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Enable GitHub Pages
5. Access from anywhere at: `https://yourusername.github.io/repo-name`

#### Option 3: Use Netlify/Vercel (Free, Professional)
1. Sign up for free at netlify.com or vercel.com
2. Drag and drop your project folder
3. Get a permanent URL instantly
4. Access from anywhere

### Local Testing
Simply open `index.html` in any modern web browser.

## 📝 Adding Your Content

Edit `topics.json` to add your official Life in the UK study materials:

### JSON Structure

\`\`\`json
[
  {
    "title": "Topic Title",
    "content": "HTML formatted study materials",
    "questions": [
      {
        "question": "Your question here?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "answer": "Option 2"
      }
    ]
  }
]
\`\`\`

### Content Formatting Tips

Use HTML tags in the `content` field:
- `<h3>Heading</h3>` for section headings
- `<p>Text</p>` for paragraphs
- `<strong>Text</strong>` for emphasis
- `<ul><li>Item</li></ul>` for bullet lists
- `<ol><li>Item</li></ol>` for numbered lists

### Question Guidelines

1. **Normal Mode**: Provide 4 options (one correct)
2. **Hard Mode**: Uses same `answer` field - students type it in
3. **Dates/Numbers**: Must be exact match in hard mode
4. **Text answers**: 80% similarity threshold allows minor typos
5. **Case insensitive**: "London" = "london" = "LONDON"

## Practice Topics

Practice-only topics are included alongside core chapters in `data/questions.json`. These cover focused areas:

- **Values & Civics Focus** — Individual liberty, Tolerance, Mutual respect, Parliament roles, Elections, Courts, Devolution, UN membership
- **History Core Facts** — WWI/WWII dates, Industrial Revolution, Victorian era, Union with Scotland (1707), Restoration (1660), Slavery abolition, Post-war immigration (Windrush)

Practice topics are treated like any other topic in the UI and can be used in normal mode, practice mode, or flashcards.

## 🎓 Passing Criteria

- Must score **75% or higher** to pass a topic
- Unlocks next topic upon passing
- Can retry unlimited times
- Progress saved automatically

## 🛠️ Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks needed
- **No backend required** - Runs entirely in browser
- **LocalStorage** for progress persistence
- **Responsive design** - Mobile-first approach
- **Fuzzy matching** using Levenshtein distance algorithm

## 📦 Data Architecture

- **Active dataset**: `data/questions.json` (400 questions, 250 concepts)
- **Question IDs**: Format `<conceptId>_v<variant>` (e.g., `1_v0`, `1_v1`)
- **Scoring**: Concept-level tracking via `concept_<id>` keys (+1 correct, -3 incorrect)
- **Service worker**: `life-in-uk-v22` caches `data/questions.json` for offline use
- **Retired files**: Old `topics_grouped.json` and related scripts moved to `_unused_backup/`

## 📊 Progress Tracking

The app tracks:
- Completed topics
- Number of attempts per topic
- Best score achieved
- Current topic progress

Reset progress anytime using the reset button (🔄) in the header.

## 🎨 ADHD-Friendly Design

- Clean, minimal interface
- Clear visual hierarchy
- Instant feedback
- Progress indicators
- No overwhelming animations
- Focused content areas
- Short, manageable sections

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## 🔐 Privacy

All data stored locally in your browser. Nothing sent to any server.

## 📄 License

Free to use for personal study purposes.

---

**Good luck with your exam! 🇬🇧**
