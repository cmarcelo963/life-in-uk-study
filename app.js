// State Management
let state = {
    topics: [],
    currentTopicIndex: null,
    currentQuestions: [],
    currentQuestionIndex: 0,
    currentDifficulty: null,
    score: 0,
    progress: {}
};

// Initialize App
async function init() {
    await loadTopics();
    loadProgress();
    renderTopicList();
    setupEventListeners();
}

// Load Topics from JSON
async function loadTopics() {
    try {
        const response = await fetch('topics.json');
        state.topics = await response.json();
    } catch (error) {
        console.error('Error loading topics:', error);
        state.topics = [];
    }
}

// Load Progress from LocalStorage
function loadProgress() {
    const saved = localStorage.getItem('lifeInUK_progress');
    if (saved) {
        state.progress = JSON.parse(saved);
    } else {
        // Initialize progress for all topics
        state.progress = {};
        state.topics.forEach((topic, index) => {
            state.progress[index] = {
                completed: false,
                attempts: 0,
                bestScore: 0
            };
        });
    }
}

// Save Progress to LocalStorage
function saveProgress() {
    localStorage.setItem('lifeInUK_progress', JSON.stringify(state.progress));
}

// Setup Event Listeners
function setupEventListeners() {
    // Reset Progress
    document.getElementById('resetProgress').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('lifeInUK_progress');
            location.reload();
        }
    });

    // Back Buttons
    document.getElementById('backToTopics').addEventListener('click', () => {
        showScreen('topicScreen');
    });

    document.getElementById('exitTest').addEventListener('click', () => {
        if (confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
            showScreen('studyScreen');
        }
    });

    // Start Test Button
    document.getElementById('startTest').addEventListener('click', () => {
        showScreen('testScreen');
        showDifficultySelection();
    });

    // Difficulty Selection
    document.querySelectorAll('.btn-difficulty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.mode;
            startTest(mode);
        });
    });

    // Submit Answer (Hard Mode)
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const input = document.getElementById('answerInput');
        checkAnswer(input.value.trim());
    });

    // Enter key for text input
    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = document.getElementById('answerInput');
            checkAnswer(input.value.trim());
        }
    });

    // Next Question Button
    document.getElementById('nextQuestion').addEventListener('click', () => {
        nextQuestion();
    });

    // Result Buttons
    document.getElementById('retryTest').addEventListener('click', () => {
        showScreen('testScreen');
        showDifficultySelection();
    });

    document.getElementById('backToStudy').addEventListener('click', () => {
        showScreen('studyScreen');
    });

    document.getElementById('nextTopic').addEventListener('click', () => {
        const nextIndex = state.currentTopicIndex + 1;
        if (nextIndex < state.topics.length) {
            openTopic(nextIndex);
        } else {
            showScreen('topicScreen');
        }
    });
}

// Render Topic List
function renderTopicList() {
    const container = document.getElementById('topicList');
    container.innerHTML = '';

    state.topics.forEach((topic, index) => {
        const isLocked = index > 0 && !state.progress[index - 1]?.completed;
        const progress = state.progress[index] || { completed: false, attempts: 0 };

        const card = document.createElement('div');
        card.className = `topic-card ${isLocked ? 'locked' : ''}`;
        
        let statusBadge = '';
        if (isLocked) {
            statusBadge = '<span class="status-badge locked">🔒 Locked</span>';
        } else if (progress.completed) {
            statusBadge = '<span class="status-badge completed">✓ Completed</span>';
        } else if (progress.attempts > 0) {
            statusBadge = '<span class="status-badge in-progress">In Progress</span>';
        }

        // Count total questions (regular + question groups)
        const regularQuestions = topic.questions ? topic.questions.length : 0;
        const groupedQuestions = topic.questionGroups ? topic.questionGroups.length : 0;
        const totalQuestions = regularQuestions + groupedQuestions;

        card.innerHTML = `
            <div class="topic-info">
                <div class="topic-title">${topic.title}</div>
                <div class="topic-subtitle">${totalQuestions} questions</div>
            </div>
            <div class="topic-status">
                ${statusBadge}
            </div>
        `;

        if (!isLocked) {
            card.addEventListener('click', () => openTopic(index));
        }

        container.appendChild(card);
    });
}

// Open Topic
function openTopic(index) {
    state.currentTopicIndex = index;
    const topic = state.topics[index];
    const progress = state.progress[index];

    document.getElementById('studyTopicTitle').textContent = topic.title;
    document.getElementById('studyContent').innerHTML = topic.content;

    // Update status badge
    const statusBadge = document.getElementById('studyTopicStatus');
    if (progress.completed) {
        statusBadge.className = 'status-badge completed';
        statusBadge.textContent = '✓ Completed';
    } else if (progress.attempts > 0) {
        statusBadge.className = 'status-badge in-progress';
        statusBadge.textContent = 'In Progress';
    } else {
        statusBadge.className = '';
        statusBadge.textContent = '';
    }

    showScreen('studyScreen');
}

// Show Screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Show Difficulty Selection
function showDifficultySelection() {
    const topic = state.topics[state.currentTopicIndex];
    document.getElementById('testTopicTitle').textContent = topic.title;
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('testQuestions').style.display = 'none';
    document.getElementById('testResults').style.display = 'none';
}

// Start Test
function startTest(difficulty) {
    state.currentDifficulty = difficulty;
    state.currentQuestionIndex = 0;
    state.score = 0;

    const topic = state.topics[state.currentTopicIndex];
    
    // Combine regular questions and question groups
    let allQuestions = [];
    
    // Add regular questions
    if (topic.questions) {
        allQuestions = [...topic.questions];
    }
    
    // Add one random variation from each question group
    if (topic.questionGroups) {
        topic.questionGroups.forEach(group => {
            if (group.variations && group.variations.length > 0) {
                // Randomly select one variation from this group
                const randomVariation = group.variations[Math.floor(Math.random() * group.variations.length)];
                allQuestions.push(randomVariation);
            }
        });
    }
    
    // Shuffle all questions
    state.currentQuestions = shuffleArray(allQuestions);

    // Update attempt count
    state.progress[state.currentTopicIndex].attempts++;
    saveProgress();

    // Hide difficulty selection, show questions
    document.getElementById('difficultySelection').style.display = 'none';
    document.getElementById('testQuestions').style.display = 'block';
    document.getElementById('questionTopicTitle').textContent = topic.title;

    renderQuestion();
}

// Render Question
function renderQuestion() {
    const question = state.currentQuestions[state.currentQuestionIndex];
    const totalQuestions = state.currentQuestions.length;
    const currentNum = state.currentQuestionIndex + 1;

    // Update progress bar
    const progress = (currentNum / totalQuestions) * 100;
    document.getElementById('testProgressBar').style.width = `${progress}%`;

    // Update counters
    document.getElementById('questionCounter').textContent = `Question ${currentNum} of ${totalQuestions}`;
    document.getElementById('scoreCounter').textContent = `Score: ${state.score}/${state.currentQuestionIndex}`;

    // Set question text
    document.getElementById('questionText').textContent = question.question;

    // Hide feedback
    document.getElementById('feedback').style.display = 'none';

    // Render based on difficulty and question type
    if (state.currentDifficulty === 'normal') {
        // Check if this is a boolean (true/false) question or multiple choice
        if (question.type === 'boolean') {
            renderTrueFalse(question);
        } else {
            renderMultipleChoice(question);
        }
    } else {
        renderTextInput();
    }
}

// Render Multiple Choice
function renderMultipleChoice(question) {
    document.getElementById('multipleChoice').style.display = 'block';
    document.getElementById('textInput').style.display = 'none';

    const container = document.getElementById('multipleChoice');
    container.innerHTML = '';

    // Shuffle options
    const options = shuffleArray([...question.options]);

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('disabled')) {
                checkAnswer(option);
            }
        });
        container.appendChild(btn);
    });
}

// Render True/False Question
function renderTrueFalse(question) {
    document.getElementById('multipleChoice').style.display = 'block';
    document.getElementById('textInput').style.display = 'none';

    const container = document.getElementById('multipleChoice');
    container.innerHTML = '';

    // Create True and False buttons
    ['True', 'False'].forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('disabled')) {
                checkAnswer(option === 'True');
            }
        });
        container.appendChild(btn);
    });
}

// Render Text Input
function renderTextInput() {
    document.getElementById('multipleChoice').style.display = 'none';
    document.getElementById('textInput').style.display = 'block';

    const input = document.getElementById('answerInput');
    input.value = '';
    input.focus();
}

// Check Answer
function checkAnswer(userAnswer) {
    const question = state.currentQuestions[state.currentQuestionIndex];
    const correctAnswer = question.answer;

    let isCorrect = false;

    if (state.currentDifficulty === 'normal') {
        // Handle boolean questions
        if (question.type === 'boolean') {
            isCorrect = userAnswer === correctAnswer;
            
            // Highlight options
            const options = document.querySelectorAll('.option');
            options.forEach(opt => {
                opt.classList.add('disabled');
                const optValue = opt.textContent === 'True';
                if (optValue === correctAnswer) {
                    opt.classList.add('correct');
                }
                if (optValue === userAnswer && !isCorrect) {
                    opt.classList.add('incorrect');
                }
            });
        } else {
            // Handle multiple choice questions
            isCorrect = userAnswer === correctAnswer;
            
            // Highlight options
            const options = document.querySelectorAll('.option');
            options.forEach(opt => {
                opt.classList.add('disabled');
                if (opt.textContent === correctAnswer) {
                    opt.classList.add('correct');
                }
                if (opt.textContent === userAnswer && !isCorrect) {
                    opt.classList.add('incorrect');
                }
            });
        }
    } else {
        // Hard mode: fuzzy matching
        isCorrect = fuzzyMatch(userAnswer, correctAnswer);
    }

    // Update score
    if (isCorrect) {
        state.score++;
    }

    // Show feedback
    showFeedback(isCorrect, correctAnswer, userAnswer);
}

// Fuzzy Match for Hard Mode
function fuzzyMatch(userAnswer, correctAnswer) {
    // Normalize both answers
    const normalize = (str) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
    
    const userNorm = normalize(userAnswer);
    const correctNorm = normalize(correctAnswer);

    // Exact match
    if (userNorm === correctNorm) return true;

    // Check if answer contains only numbers (dates, years)
    if (/^\d+$/.test(correctNorm)) {
        return userNorm === correctNorm;
    }

    // Levenshtein distance for fuzzy matching
    const similarity = calculateSimilarity(userNorm, correctNorm);
    return similarity >= 0.8; // 80% similarity threshold
}

// Calculate String Similarity (Levenshtein-based)
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Levenshtein Distance
function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

// Show Feedback
function showFeedback(isCorrect, correctAnswer, userAnswer) {
    const feedback = document.getElementById('feedback');
    const message = document.getElementById('feedbackMessage');
    const correctAnswerEl = document.getElementById('correctAnswer');

    feedback.className = 'feedback';
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    feedback.style.display = 'block';

    if (isCorrect) {
        message.textContent = '✓ Correct!';
        correctAnswerEl.textContent = '';
    } else {
        message.textContent = '✗ Incorrect';
        correctAnswerEl.textContent = `The correct answer is: ${correctAnswer}`;
    }
}

// Next Question
function nextQuestion() {
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex < state.currentQuestions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    const totalQuestions = state.currentQuestions.length;
    const percentage = Math.round((state.score / totalQuestions) * 100);
    const passed = percentage >= 75; // 75% to pass

    // Update progress
    const topicProgress = state.progress[state.currentTopicIndex];
    topicProgress.bestScore = Math.max(topicProgress.bestScore, percentage);
    
    if (passed && !topicProgress.completed) {
        topicProgress.completed = true;
    }
    
    saveProgress();

    // Hide questions, show results
    document.getElementById('testQuestions').style.display = 'none';
    document.getElementById('testResults').style.display = 'block';

    // Set result content
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');

    if (passed) {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = 'Congratulations!';
        resultTitle.style.color = 'var(--success)';
        
        // Show appropriate button
        document.getElementById('backToStudy').style.display = 'none';
        document.getElementById('nextTopic').style.display = 'inline-flex';
        
        // If last topic, show back to study
        if (state.currentTopicIndex === state.topics.length - 1) {
            document.getElementById('nextTopic').style.display = 'none';
            document.getElementById('backToStudy').style.display = 'inline-flex';
        }
    } else {
        resultIcon.textContent = '📚';
        resultTitle.textContent = 'Keep Studying!';
        resultTitle.style.color = 'var(--warning)';
        
        document.getElementById('backToStudy').style.display = 'inline-flex';
        document.getElementById('nextTopic').style.display = 'none';
    }

    document.getElementById('finalScore').textContent = `${state.score}/${totalQuestions}`;
    document.getElementById('finalPercentage').textContent = `${percentage}%`;

    // Update topic list
    renderTopicList();
}

// Utility: Shuffle Array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
