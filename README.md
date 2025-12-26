# Life in the UK - Interactive Study App

An engaging, interactive web application designed to help you study for the Life in the UK exam, with features specifically designed to make learning easier for people with ADHD.

## 🎯 Features

### ADHD-Friendly Design
- **Bite-sized questions**: Short, focused questions that don't overwhelm
- **Instant feedback**: Immediate visual and textual feedback on answers
- **Gamification**: Points, streaks, and levels to maintain motivation
- **Visual progress**: Clear progress bars and statistics
- **Variety**: Different quiz modes to prevent boredom

### Study Modes
- **⚡ Quick Practice**: 10 random questions for short study sessions
- **📚 Full Test**: 24 questions simulating the real exam
- **🎯 Category Focus**: Practice specific topics (coming soon)

### Interactive Elements
- Score tracking and level progression
- Streak bonuses for consecutive correct answers
- Achievement notifications
- Detailed explanations for every answer
- Skip option when you need a break

### Question Categories
- History (Battle of Hastings, Magna Carta, etc.)
- Government (Elections, Parliament, Voting)
- Culture (Shakespeare, National flowers, Celebrations)
- Geography (Capitals, Rivers, Mountains)
- Sports (Cricket, Golf, Olympics)

## 🚀 Getting Started

### Simple Setup
1. Open `index.html` in any modern web browser
2. No installation or server required!

### Usage
1. Choose your preferred study mode from the home screen
2. Answer questions by clicking on options
3. Get instant feedback with explanations
4. Track your progress with scores, streaks, and levels
5. Review your results at the end of each quiz

## 📊 Scoring System
- **+10 points** for each correct answer
- **+5 bonus points** for 5+ correct answers in a row
- **Level up** every 100 points
- **Pass requirement**: 75% or higher (like the real exam)

## 💡 Study Tips for ADHD
- Use the **Quick Practice** mode for short, focused sessions
- Take breaks between quizzes
- Focus on your streak to build momentum
- Celebrate small wins - each correct answer counts!
- Review the explanations even when you get it right

## 🎨 Customization
The app saves your progress automatically in your browser, so you can pick up where you left off.

## 📝 Adding More Questions
To add more questions, edit the `questionBank` array in `script.js`. Each question should follow this format:

```javascript
{
    category: "Category Name",
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correct: 0, // Index of correct option (0-3)
    explanation: "Explanation of the correct answer."
}
```

## 🔮 Future Enhancements
- Category-specific practice mode
- Timed exam mode
- More question types (true/false, matching)
- Progress analytics and weak area identification
- Dark mode
- Sound effects (optional)
- Spaced repetition algorithm

## 📱 Mobile Friendly
The app is fully responsive and works great on phones and tablets!

## 🎓 About the Life in the UK Test
The Life in the UK test is required for anyone applying for British citizenship or permanent residence. You need to score at least 75% (18 out of 24 questions) to pass.

---

Good luck with your studies! Remember: small, consistent practice sessions work best. 🇬🇧✨
