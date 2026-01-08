// State Management
let state = {
    topics: [],
    currentTopicIndex: null,
    currentQuestions: [],
    currentQuestionIndex: 0,
    currentDifficulty: null,
    score: 0,
    progress: {},
    questionStats: {}, // Track performance per question
    isPracticeMode: false, // Track if in global practice mode
    practiceStats: {}, // Track which questions have been seen in practice mode
    isFlashcardMode: false, // Track if in flashcard mode
    flashcardStats: { correct: 0, incorrect: 0, skipped: 0 }, // Track flashcard session stats
    selectedAnswers: [], // Track selected answers for multi-answer questions
    isAdventureMode: false, // Track if in adventure mode
    adventureProgress: { currentTopicIndex: 0, topicsCompleted: [] } // Track adventure progress
};


// Initialize App
async function init() {
    await loadTopics();
    loadProgress();
    loadQuestionStats();
    loadPracticeStats();
    loadAdventureProgress();
    renderTopicList();
    updateAdventureProgressDisplay();
    setupEventListeners();
}

// Load Topics from JSON
async function loadTopics() {
    try {
        // Try loading grouped topics first, fallback to old structure
        let response = await fetch('topics_grouped.json');
        if (!response.ok) {
            response = await fetch('topics.json');
        }
        state.topics = await response.json();
    } catch (error) {
        console.error('Error loading topics:', error);
        state.topics = [];
    }
}

// Load Progress from Backend
async function loadProgress() {
    try {
        const response = await fetch('http://localhost:3000/api/progress');
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
            state.progress = data;
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
    } catch (error) {
        console.error('Error loading progress:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('lifeInUK_progress');
        if (saved) {
            state.progress = JSON.parse(saved);
        } else {
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
}

// Save Progress to Backend
async function saveProgress() {
    try {
        await fetch('http://localhost:3000/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.progress)
        });
        // Also save to localStorage as backup
        localStorage.setItem('lifeInUK_progress', JSON.stringify(state.progress));
    } catch (error) {
        console.error('Error saving progress:', error);
        // Fallback to localStorage only
        localStorage.setItem('lifeInUK_progress', JSON.stringify(state.progress));
    }
}

// Load Question Statistics from Backend
async function loadQuestionStats() {
    try {
        const response = await fetch('http://localhost:3000/api/stats');
        const data = await response.json();
        state.questionStats = data || {};
    } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('lifeInUK_questionStats');
        state.questionStats = saved ? JSON.parse(saved) : {};
    }
}

// Save Question Statistics to Backend
async function saveQuestionStats() {
    try {
        await fetch('http://localhost:3000/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.questionStats)
        });
        // Also save to localStorage as backup
        localStorage.setItem('lifeInUK_questionStats', JSON.stringify(state.questionStats));
    } catch (error) {
        console.error('Error saving stats:', error);
        // Fallback to localStorage only
        localStorage.setItem('lifeInUK_questionStats', JSON.stringify(state.questionStats));
    }
}

// Get unique question ID
function getQuestionId(question, topicIndex, questionIndex) {
    // If question has a groupId, use that for tracking (all variations tracked together)
    if (question.groupId) {
        return `${topicIndex}_group_${question.groupId}`;
    }
    // Legacy: Create a unique ID based on question text (first 50 chars as hash)
    const textHash = question.question.substring(0, 50).replace(/\s+/g, '_');
    const indexPart = (question && question.sourceIndex !== undefined) ? question.sourceIndex : questionIndex;
    return `${topicIndex}_${indexPart}_${textHash}`;
}

// Initialize question stats if not exists
function initQuestionStats(questionId) {
    if (!state.questionStats[questionId]) {
        state.questionStats[questionId] = {
            correct: 0,
            incorrect: 0,
            lastAsked: null,
            points: 0  // Points system: +1 correct, -2 incorrect
        };
    }
}

// Update question stats after answer
function updateQuestionStats(questionId, isCorrect) {
    initQuestionStats(questionId);
    
    const stats = state.questionStats[questionId];
    stats.lastAsked = Date.now();
    
    if (isCorrect) {
        stats.correct++;
        stats.points += 1;  // +1 point for correct
    } else {
        stats.incorrect++;
        stats.points -= 2;  // -2 points for incorrect
    }

    // Cap upper bound so mastered questions can be retired
    stats.points = Math.min(stats.points, 100);
    
    saveQuestionStats();
}

// Calculate question weight for adaptive learning
function getQuestionWeight(questionId) {
    const points = state.questionStats[questionId]?.points ?? 0;

    // Priority: neutral (0) first, then lowest points, then highest points
    if (points === 0) return 100000; // Very high weight for neutral
    if (points >= 100) return Number.NEGATIVE_INFINITY; // Retired questions sink to the bottom
    return -points;
}

// Stop serving questions that have reached the mastery cap
function isQuestionRetired(questionId) {
    return !!(state.questionStats[questionId] && state.questionStats[questionId].points >= 100);
}

// Load Practice Statistics from Backend
async function loadPracticeStats() {
    try {
        const response = await fetch('http://localhost:3000/api/practice-stats');
        const data = await response.json();
        state.practiceStats = data || { seenAll: false, questionsSeen: {} };
    } catch (error) {
        const saved = localStorage.getItem('lifeInUK_practiceStats');
        state.practiceStats = saved ? JSON.parse(saved) : { seenAll: false, questionsSeen: {} };
    }
}

// Save Practice Statistics
async function savePracticeStats() {
    try {
        await fetch('http://localhost:3000/api/practice-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.practiceStats)
        });
        localStorage.setItem('lifeInUK_practiceStats', JSON.stringify(state.practiceStats));
    } catch (error) {
        localStorage.setItem('lifeInUK_practiceStats', JSON.stringify(state.practiceStats));
    }
}

// Setup Event Listeners
let listenersSetup = false;
function setupEventListeners() {
    if (listenersSetup) return;
    listenersSetup = true;
    
    // Home Screen Choices
    const homeStudy = document.getElementById('homeStudy');
    if (homeStudy) homeStudy.addEventListener('click', () => {
        state.isPracticeMode = false;
        state.isFlashcardMode = false;
        showScreen('topicScreen');
    });

    const homePractice = document.getElementById('homePractice');
    if (homePractice) homePractice.addEventListener('click', () => {
        state.isPracticeMode = true;
        state.isFlashcardMode = false;
        state.currentTopicIndex = null;
        showScreen('testScreen');
        showDifficultySelection();
    });

    const homeFlashcards = document.getElementById('homeFlashcards');
    if (homeFlashcards) homeFlashcards.addEventListener('click', () => {
        state.isFlashcardMode = true;
        state.isPracticeMode = false;
        state.currentTopicIndex = null;
        startFlashcards();
    });

    const homeStats = document.getElementById('homeStats');
    if (homeStats) homeStats.addEventListener('click', async () => {
        showScreen('statsScreen');
        try {
            // Ensure data is loaded before rendering
            await Promise.all([
                loadQuestionStats(),
                loadTopics()
            ]);
            renderStatistics();
        } catch (err) {
            console.error('Failed to render statistics:', err);
            const list = document.getElementById('statsList');
            if (list) {
                list.innerHTML = '<div class="stats-empty">Unable to load statistics right now.</div>';
            }
        }
    });

    const homeAdventure = document.getElementById('homeAdventure');
    if (homeAdventure) homeAdventure.addEventListener('click', () => {
        state.isAdventureMode = true;
        state.isPracticeMode = false;
        state.isFlashcardMode = false;
        startAdventureMode();
    });

    // Back to Home
    const backToHome = document.getElementById('backToHome');
    if (backToHome) backToHome.addEventListener('click', () => {
        showScreen('homeScreen');
    });

    // Study/Practice Choice Modal
    const choiceStudy = document.getElementById('choiceStudy');
    if (choiceStudy) choiceStudy.addEventListener('click', () => {
        hideChoiceModal();
        showScreen('studyScreen');
    });

    const choicePractice = document.getElementById('choicePractice');
    if (choicePractice) choicePractice.addEventListener('click', () => {
        hideChoiceModal();
        state.isPracticeMode = false;
        showScreen('testScreen');
        showDifficultySelection();
    });

    const closeChoiceModal = document.getElementById('closeChoiceModal');
    if (closeChoiceModal) closeChoiceModal.addEventListener('click', () => {
        hideChoiceModal();
    });

    const studyChoiceModal = document.getElementById('studyChoiceModal');
    if (studyChoiceModal) studyChoiceModal.addEventListener('click', (e) => {
        if (e.target.id === 'studyChoiceModal') {
            hideChoiceModal();
        }
    });

    // Reset Progress
    const resetBtn = document.getElementById('resetProgress');
    if (resetBtn) resetBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset all progress and question statistics? This cannot be undone.')) {
            try {
                await fetch('http://localhost:3000/api/reset', { method: 'POST' });
            } catch (error) {
                console.error('Error resetting backend data:', error);
            }
            localStorage.removeItem('lifeInUK_progress');
            localStorage.removeItem('lifeInUK_questionStats');
            localStorage.removeItem('lifeInUK_practiceStats');
            location.reload();
        }
    });

    // Back Buttons
    const backToTopics = document.getElementById('backToTopics');
    if (backToTopics) backToTopics.addEventListener('click', () => {
        showScreen('homeScreen');
    });

    const exitBtn = document.getElementById('exitTest');
    if (exitBtn) exitBtn.addEventListener('click', () => {
        try {
            // Reset any test state and navigate home
            state.isPracticeMode = false;
            state.currentQuestions = [];
            state.currentQuestionIndex = 0;
            document.getElementById('difficultySelection').style.display = 'block';
            document.getElementById('testQuestions').style.display = 'none';
            document.getElementById('testResults').style.display = 'none';
            showScreen('homeScreen');
        } catch (err) {
            console.error('Exit test failed:', err);
            showScreen('homeScreen');
        }
    });

    // Start Test Button
    const startTestBtn = document.getElementById('startTest');
    if (startTestBtn) startTestBtn.addEventListener('click', () => {
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
    const submitAnswerBtn = document.getElementById('submitAnswer');
    if (submitAnswerBtn) submitAnswerBtn.addEventListener('click', () => {
        const input = document.getElementById('answerInput');
        checkAnswer(input.value.trim());
    });

    const answerInput = document.getElementById('answerInput');
    if (answerInput) answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = document.getElementById('answerInput');
            checkAnswer(input.value.trim());
        }
    });

    // Next Question Button
    const nextQuestionBtn = document.getElementById('nextQuestion');
    if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', () => {
        nextQuestion();
    });

    // Result Buttons
    const retryTestBtn = document.getElementById('retryTest');
    if (retryTestBtn) retryTestBtn.addEventListener('click', () => {
        showScreen('testScreen');
        showDifficultySelection();
    });

    const backToStudyBtn = document.getElementById('backToStudy');
    if (backToStudyBtn) backToStudyBtn.addEventListener('click', () => {
        showScreen('homeScreen');
    });

    const nextTopicBtn = document.getElementById('nextTopic');
    if (nextTopicBtn) nextTopicBtn.addEventListener('click', () => {
        const nextIndex = state.currentTopicIndex + 1;
        if (nextIndex < state.topics.length) {
            openTopic(nextIndex);
        } else {
            showScreen('topicScreen');
        }
    });

    // Flashcard Controls
    const exitFlashcardsBtn = document.getElementById('exitFlashcards');
    if (exitFlashcardsBtn) exitFlashcardsBtn.addEventListener('click', () => {
        showScreen('homeScreen');
    });

    const flashcardCorrectBtn = document.getElementById('flashcardCorrect');
    if (flashcardCorrectBtn) flashcardCorrectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFlashcardResponse('correct');
    });

    const flashcardIncorrectBtn = document.getElementById('flashcardIncorrect');
    if (flashcardIncorrectBtn) flashcardIncorrectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFlashcardResponse('incorrect');
    });

    const flashcardSkipBtn = document.getElementById('flashcardSkip');
    if (flashcardSkipBtn) flashcardSkipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFlashcardResponse('skip');
    });

    const retryFlashcardsBtn = document.getElementById('retryFlashcards');
    if (retryFlashcardsBtn) retryFlashcardsBtn.addEventListener('click', () => {
        startFlashcards();
    });

    const backToHomeFromFlashcardsBtn = document.getElementById('backToHomeFromFlashcards');
    if (backToHomeFromFlashcardsBtn) backToHomeFromFlashcardsBtn.addEventListener('click', () => {
        showScreen('homeScreen');
    });

    const backToHomeFromStatsBtn = document.getElementById('backToHomeFromStats');
    if (backToHomeFromStatsBtn) backToHomeFromStatsBtn.addEventListener('click', () => {
        showScreen('homeScreen');
    });

    // Statistics filter buttons
    const filterAllBtn = document.getElementById('filterAll');
    if (filterAllBtn) filterAllBtn.addEventListener('click', () => {
        setStatsFilter('all');
    });

    const filterWeakBtn = document.getElementById('filterWeak');
    if (filterWeakBtn) filterWeakBtn.addEventListener('click', () => {
        setStatsFilter('weak');
    });

    const filterStrongBtn = document.getElementById('filterStrong');
    if (filterStrongBtn) filterStrongBtn.addEventListener('click', () => {
        setStatsFilter('strong');
    });
}

// Render Topic List
function renderTopicList() {
    const container = document.getElementById('topicList');
    container.innerHTML = '';

    state.topics.forEach((topic, index) => {
        // Topics are unlocked if: it's the first topic, OR the previous topic has been attempted
        const isLocked = index > 0 && (!state.progress[index - 1] || state.progress[index - 1].attempts === 0);
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
    document.getElementById('choiceModalTitle').textContent = topic.title;

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

    // Show choice modal instead of going directly to study screen
    showChoiceModal();
}

// Show the study/practice choice modal
function showChoiceModal() {
    document.getElementById('studyChoiceModal').classList.add('active');
}

// Hide the choice modal
function hideChoiceModal() {
    document.getElementById('studyChoiceModal').classList.remove('active');
}

// Generate practice questions from all topics
function generatePracticeQuestions(count = 24) {
    let allQuestions = [];
    
    // Collect all questions from all topics
    state.topics.forEach((topic, topicIndex) => {
        // Add regular questions
        if (topic.questions) {
            topic.questions.forEach((q, idx) => {
                allQuestions.push({ ...q, sourceIndex: idx, topicIndex });
            });
        }
        
        // Add one random variation from each question group
        if (topic.questionGroups) {
            topic.questionGroups.forEach((group, groupIdx) => {
                if (group.variations && group.variations.length > 0) {
                    const randomVariation = group.variations[Math.floor(Math.random() * group.variations.length)];
                    // Attach groupId so all variations are tracked together
                    allQuestions.push({ 
                        ...randomVariation, 
                        sourceIndex: `group_${groupIdx}`, 
                        groupId: group.id,
                        topicIndex 
                    });
                }
            });
        }
    });

    // Remove questions that have hit the mastery cap
    allQuestions = allQuestions.filter((q) => {
        const questionId = getQuestionId(q, q.topicIndex, q.sourceIndex);
        return !isQuestionRetired(questionId);
    });
    
    // Check if user has seen all questions at least once
    const availableIds = new Set(allQuestions.map((q) => getQuestionId(q, q.topicIndex, q.sourceIndex)));
    const totalAvailable = availableIds.size;
    const seenCount = [...availableIds].filter((id) => state.practiceStats.questionsSeen?.[id]).length;
    const hasSeenAll = totalAvailable > 0 && seenCount >= totalAvailable;
    
    let selectedQuestions;
    
    if (hasSeenAll) {
        // Use weighted selection based on performance
        const weightedQuestions = allQuestions.map((q) => {
            const questionId = getQuestionId(q, q.topicIndex, q.sourceIndex);
            const weight = getQuestionWeight(questionId);
            return { question: q, weight, id: questionId };
        });
        
        // Sort by weight (descending) - harder questions first
        weightedQuestions.sort((a, b) => b.weight - a.weight);
        
        // Take top 24
        selectedQuestions = weightedQuestions.slice(0, count).map(wq => wq.question);
    } else {
        // Random selection until all questions seen
        const shuffled = shuffleArray(allQuestions);
        selectedQuestions = shuffled.slice(0, count);
        
        // Mark these questions as seen
        selectedQuestions.forEach((q) => {
            const questionId = getQuestionId(q, q.topicIndex, q.sourceIndex);
            state.practiceStats.questionsSeen[questionId] = true;
        });
        
        // Check if we've now seen all
        const updatedSeenCount = [...availableIds].filter((id) => state.practiceStats.questionsSeen?.[id]).length;
        if (totalAvailable > 0 && updatedSeenCount >= totalAvailable) {
            state.practiceStats.seenAll = true;
        }
        
        savePracticeStats();
    }
    
    return selectedQuestions;
}

// Weighted question selection for adaptive learning
function selectWeightedQuestions(questions, topicIndex) {
    // Skip questions that have reached mastery
    const availableQuestions = questions.filter((q) => {
        const questionId = getQuestionId(q, topicIndex, q.sourceIndex);
        return !isQuestionRetired(questionId);
    });

    // Create array with questions and their weights
    const weightedQuestions = availableQuestions.map((q) => {
        const questionId = getQuestionId(q, topicIndex, q.sourceIndex);
        const weight = getQuestionWeight(questionId);
        return { question: q, weight, id: questionId };
    });
    
    // Sort by weight (descending) and take all questions
    // Priority: neutral first, then lowest points, then highest points
    weightedQuestions.sort((a, b) => b.weight - a.weight);
    
    // Return sorted questions (heavily weighted first)
    return weightedQuestions.map(wq => wq.question);
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
    if (state.isPracticeMode) {
        document.getElementById('testTopicTitle').textContent = 'Practice Test - 24 Questions';
    } else {
        const topic = state.topics[state.currentTopicIndex];
        document.getElementById('testTopicTitle').textContent = topic.title;
    }
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('testQuestions').style.display = 'none';
    document.getElementById('testResults').style.display = 'none';
}

// Start Test
function startTest(difficulty) {
    state.currentDifficulty = difficulty;
    state.currentQuestionIndex = 0;
    state.score = 0;

    if (state.isPracticeMode) {
        // PRACTICE MODE: 24 questions from all topics
        state.currentQuestions = generatePracticeQuestions(24);
    } else {
        // TOPIC MODE: All questions from current topic
        const topic = state.topics[state.currentTopicIndex];
        const topicIndex = state.currentTopicIndex;
        const attempts = state.progress[topicIndex].attempts;
        
        // Combine regular questions and question groups
        let allQuestions = [];
        
        // Add regular questions with index tracking
        if (topic.questions) {
            topic.questions.forEach((q, idx) => {
                allQuestions.push({ ...q, sourceIndex: idx, topicIndex });
            });
        }
        
        // Add one random variation from each question group
        if (topic.questionGroups) {
            topic.questionGroups.forEach((group, groupIdx) => {
                if (group.variations && group.variations.length > 0) {
                    // Randomly select one variation from this group
                    const randomVariation = group.variations[Math.floor(Math.random() * group.variations.length)];
                    // Attach groupId so all variations are tracked together
                    allQuestions.push({ 
                        ...randomVariation, 
                        sourceIndex: `group_${groupIdx}`, 
                        groupId: group.id,
                        topicIndex 
                    });
                }
            });
        }

        // Remove questions that have hit the mastery cap
        allQuestions = allQuestions.filter((q) => {
            const questionId = getQuestionId(q, topicIndex, q.sourceIndex);
            return !isQuestionRetired(questionId);
        });
        
        // Use weighted selection for subsequent attempts (adaptive learning)
        if (attempts > 0) {
            // Prioritize questions that were answered incorrectly
            allQuestions = selectWeightedQuestions(allQuestions, topicIndex);
        } else {
            // First attempt: shuffle randomly
            allQuestions = shuffleArray(allQuestions);
        }
        
        state.currentQuestions = allQuestions;

        // Update attempt count
        state.progress[state.currentTopicIndex].attempts++;
        saveProgress();
    }

    // Hide difficulty selection, show questions
    document.getElementById('difficultySelection').style.display = 'none';
    document.getElementById('testQuestions').style.display = 'block';
    
    // Set title based on mode
    if (state.isPracticeMode) {
        document.getElementById('questionTopicTitle').textContent = 'Practice Test - 24 Questions';
    } else {
        const topic = state.topics[state.currentTopicIndex];
        document.getElementById('questionTopicTitle').textContent = topic.title;
    }

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
    document.getElementById('scoreCounter').textContent = `Score: ${state.score}/${totalQuestions}`;

    // Set question text with formatting for boolean questions
    let questionText = question.question;
    let expectedAnswer = question.answer;
    
    // Transform awkward boolean format "[ANSWER] is the correct answer to: [QUESTION]" 
    // into a cleaner format by combining both parts into a statement
    if (question.type === 'boolean') {
        const match = questionText.match(/^(.+?)\s+is the correct answer to:\s+(.+)$/i);
        if (match) {
            const answer = match[1].trim();
            const originalQuestion = match[2].trim().replace(/\?$/, '');
            
            // Randomly invert 40% of boolean questions to add variety (since all originals are "true")
            // Use a deterministic random based on question text so same question always gets same treatment
            const hash = question.question.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const shouldInvert = (hash % 100) < 40;
            
            if (shouldInvert) {
                expectedAnswer = false;
                // Add "not" or modify the statement to make it false
                const lowerQuestion = originalQuestion.toLowerCase();
                
                if (lowerQuestion.startsWith('who is') || lowerQuestion.startsWith('who was')) {
                    const subject = originalQuestion.replace(/^who (is|was)\s+/i, '');
                    questionText = `${subject.charAt(0).toUpperCase() + subject.slice(1)} is NOT ${answer}.`;
                } else if (lowerQuestion.startsWith('what is') || lowerQuestion.startsWith('what was')) {
                    const subject = originalQuestion.replace(/^what (is|was)\s+/i, '');
                    questionText = `${subject.charAt(0).toUpperCase() + subject.slice(1)} is NOT ${answer}.`;
                } else {
                    // For all other question types, use "It is FALSE that:"
                    questionText = `It is FALSE that: ${originalQuestion}: ${answer}.`;
                }
            } else {
                // Keep as true statement
                const lowerQuestion = originalQuestion.toLowerCase();
                
                // Try to create natural statements
                if (lowerQuestion.startsWith('who is') || lowerQuestion.startsWith('who was')) {
                    const subject = originalQuestion.replace(/^who (is|was)\s+/i, '');
                    questionText = `${subject.charAt(0).toUpperCase() + subject.slice(1)} is ${answer}.`;
                } else if (lowerQuestion.startsWith('what is') || lowerQuestion.startsWith('what was')) {
                    const subject = originalQuestion.replace(/^what (is|was)\s+/i, '');
                    questionText = `${subject.charAt(0).toUpperCase() + subject.slice(1)} is ${answer}.`;
                } else if (lowerQuestion.startsWith('which')) {
                    // Keep "Which" for context
                    questionText = `${originalQuestion}: ${answer}.`;
                } else if (lowerQuestion.startsWith('when')) {
                    // Keep "When" for context
                    questionText = `${originalQuestion}: ${answer}.`;
                } else if (lowerQuestion.startsWith('why')) {
                    questionText = `${originalQuestion}: ${answer}.`;
                } else if (lowerQuestion.startsWith('how many')) {
                    questionText = `${originalQuestion}: ${answer}.`;
                } else if (lowerQuestion.startsWith('where')) {
                    questionText = `${originalQuestion}: ${answer}.`;
                } else {
                    questionText = `${originalQuestion}: ${answer}.`;
                }
            }
            
            // Store the expected answer for this rendering
            question._renderedAnswer = expectedAnswer;
        }
    }
    
    document.getElementById('questionText').textContent = questionText;

    // Hide feedback
    document.getElementById('feedback').style.display = 'none';

    // Reset selected answers for multi-answer questions
    state.selectedAnswers = [];

    // Render based on difficulty and question type
    if (state.currentDifficulty === 'normal') {
        // Check if this is a boolean (true/false) question or multiple choice
        if (question.type === 'boolean') {
            renderTrueFalse(question);
        } else if (question.type === 'multipleAnswer') {
            renderMultipleAnswer(question);
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

// Render Multiple Answer Question (select TWO or more)
function renderMultipleAnswer(question) {
    document.getElementById('multipleChoice').style.display = 'block';
    document.getElementById('textInput').style.display = 'none';

    const container = document.getElementById('multipleChoice');
    container.innerHTML = '';

    // Shuffle options
    const options = shuffleArray([...question.options]);
    const numAnswers = question.numRequired || (question.answers ? question.answers.length : 2);

    // Create instruction text
    const instruction = document.createElement('div');
    instruction.style.cssText = 'margin-bottom: 1rem; font-size: 0.9rem; color: #dcddde;';
    instruction.textContent = `Select ${numAnswers} answers`;
    container.appendChild(instruction);

    // Create options
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.dataset.selected = 'false';
        
        btn.addEventListener('click', () => {
            if (btn.classList.contains('disabled')) return;
            
            // Toggle selection
            if (btn.dataset.selected === 'true') {
                btn.dataset.selected = 'false';
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                const index = state.selectedAnswers.indexOf(option);
                if (index > -1) state.selectedAnswers.splice(index, 1);
            } else {
                if (state.selectedAnswers.length < numAnswers) {
                    btn.dataset.selected = 'true';
                    btn.style.backgroundColor = '#5865f2';
                    btn.style.borderColor = '#5865f2';
                    state.selectedAnswers.push(option);
                }
            }
            
            // If correct number selected, show submit button
            if (state.selectedAnswers.length === numAnswers) {
                // Check if submit button already exists
                let submitBtn = container.querySelector('.submit-multi-answer');
                if (!submitBtn) {
                    submitBtn = document.createElement('button');
                    submitBtn.className = 'option submit-multi-answer';
                    submitBtn.textContent = 'Submit Answers';
                    submitBtn.style.cssText = 'background-color: #3ba55d; border-color: #3ba55d; margin-top: 1rem;';
                    submitBtn.addEventListener('click', () => {
                        checkAnswer(state.selectedAnswers);
                    });
                    container.appendChild(submitBtn);
                }
            } else {
                // Remove submit button if it exists
                const submitBtn = container.querySelector('.submit-multi-answer');
                if (submitBtn) submitBtn.remove();
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
    // For boolean questions that were inverted during rendering, use the rendered answer
    const correctAnswer = question.type === 'boolean' && question._renderedAnswer !== undefined 
        ? question._renderedAnswer 
        : (question.answer || question.answers);

    let isCorrect = false;

    if (state.currentDifficulty === 'normal') {
        // Handle multiple answer questions
        if (question.type === 'multipleAnswer') {
            // If correctOptions is defined, check if all selected are valid
            if (question.correctOptions) {
                const allCorrect = Array.isArray(userAnswer) && 
                    userAnswer.length === (question.numRequired || 2) &&
                    userAnswer.every(ans => question.correctOptions.includes(ans));
                isCorrect = allCorrect;
                
                // Highlight options
                const options = document.querySelectorAll('.option:not(.submit-multi-answer)');
                options.forEach(opt => {
                    opt.classList.add('disabled');
                    opt.style.backgroundColor = '';
                    opt.style.borderColor = '';
                    opt.dataset.selected = 'false';
                    
                    if (question.correctOptions.includes(opt.textContent)) {
                        opt.classList.add('correct');
                    }
                    if (Array.isArray(userAnswer) && userAnswer.includes(opt.textContent) && !question.correctOptions.includes(opt.textContent)) {
                        opt.classList.add('incorrect');
                    }
                });
            } else {
                // Legacy: Compare arrays for exact match
                const sortedUser = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
                const sortedCorrect = Array.isArray(correctAnswer) ? [...correctAnswer].sort() : [];
                isCorrect = sortedUser.length === sortedCorrect.length && 
                           sortedUser.every((val, idx) => val === sortedCorrect[idx]);
                
                // Highlight options
                const options = document.querySelectorAll('.option:not(.submit-multi-answer)');
                options.forEach(opt => {
                    opt.classList.add('disabled');
                    opt.style.backgroundColor = '';
                    opt.style.borderColor = '';
                    opt.dataset.selected = 'false';
                    
                    if (correctAnswer.includes(opt.textContent)) {
                        opt.classList.add('correct');
                    }
                    if (Array.isArray(userAnswer) && userAnswer.includes(opt.textContent) && !correctAnswer.includes(opt.textContent)) {
                        opt.classList.add('incorrect');
                    }
                });
            }
            
            // Remove submit button
            const submitBtn = document.querySelector('.submit-multi-answer');
            if (submitBtn) submitBtn.remove();
        }
        // Handle boolean questions
        else if (question.type === 'boolean') {
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
    
    // Track question performance for adaptive learning
    const questionId = getQuestionId(
        question,
        state.currentTopicIndex,
        question.sourceIndex
    );
    updateQuestionStats(questionId, isCorrect);

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
        // Format correct answer (handle arrays for multi-answer questions)
        if (Array.isArray(correctAnswer)) {
            correctAnswerEl.textContent = `The correct answers are: ${correctAnswer.join(' and ')}`;
        } else {
            correctAnswerEl.textContent = `The correct answer is: ${correctAnswer}`;
        }
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

    // Update progress (only for non-practice mode)
    if (!state.isPracticeMode) {
        const topicProgress = state.progress[state.currentTopicIndex];
        topicProgress.bestScore = Math.max(topicProgress.bestScore, percentage);
        
        // Mark as completed if passed
        if (passed && !topicProgress.completed) {
            topicProgress.completed = true;
        }
        
        // Unlock next topic after any attempt (regardless of pass/fail)
        const nextIndex = state.currentTopicIndex + 1;
        if (nextIndex < state.topics.length) {
            if (!state.progress[nextIndex]) {
                state.progress[nextIndex] = {
                    completed: false,
                    attempts: 0,
                    bestScore: 0
                };
            }
        }
        
        saveProgress();
    }

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
        
        // Show appropriate buttons based on mode
        if (state.isPracticeMode) {
            // For practice mode, show back to study button
            document.getElementById('backToStudy').style.display = 'inline-flex';
            document.getElementById('nextTopic').style.display = 'none';
        } else {
            document.getElementById('backToStudy').style.display = 'none';
            document.getElementById('nextTopic').style.display = 'inline-flex';
            
            // If last topic, show back to study
            if (state.currentTopicIndex === state.topics.length - 1) {
                document.getElementById('nextTopic').style.display = 'none';
                document.getElementById('backToStudy').style.display = 'inline-flex';
            }
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
    
    // Show adaptive learning info if this is not the first attempt and not practice mode
    if (!state.isPracticeMode && state.progress[state.currentTopicIndex].attempts > 1) {
        document.getElementById('adaptiveLearningInfo').style.display = 'block';
    } else {
        document.getElementById('adaptiveLearningInfo').style.display = 'none';
    }

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

// ==================== FLASHCARD MODE ====================

// Start Flashcards
function startFlashcards() {
    state.currentQuestionIndex = 0;
    state.flashcardStats = { correct: 0, incorrect: 0, skipped: 0 };
    
    // Generate questions (use same adaptive logic as practice mode)
    state.currentQuestions = generatePracticeQuestions(24);
    
    showScreen('flashcardScreen');
    document.getElementById('flashcardResults').style.display = 'none';
    document.querySelector('.flashcard-card').style.display = 'block';
    document.querySelector('.flashcard-header').style.display = 'block';
    
    renderFlashcard();
}

// Render current flashcard
function renderFlashcard() {
    const question = state.currentQuestions[state.currentQuestionIndex];
    const totalQuestions = state.currentQuestions.length;
    const currentNum = state.currentQuestionIndex + 1;
    
    // Update progress bar
    const progress = (currentNum / totalQuestions) * 100;
    document.getElementById('flashcardProgressBar').style.width = `${progress}%`;
    
    // Update counters
    document.getElementById('flashcardCounter').textContent = `Card ${currentNum} of ${totalQuestions}`;
    document.getElementById('flashcardScore').textContent = 
        `Correct: ${state.flashcardStats.correct} | Incorrect: ${state.flashcardStats.incorrect}`;
    
    // Set question text (apply same transformation as renderQuestion for boolean)
    let questionText = question.question;
    if (question.type === 'boolean') {
        const match = questionText.match(/^(.+?)\s+is the correct answer to:\s+(.+)$/i);
        if (match) {
            const answer = match[1].trim();
            const originalQuestion = match[2].trim();
            // For flashcards, show the original question as the "question" side
            questionText = originalQuestion;
        }
    }
    document.getElementById('flashcardQuestion').textContent = questionText;
    
    // Set answer (handle boolean type properly)
    let answerText = question.answer;
    if (question.type === 'boolean') {
        const match = question.question.match(/^(.+?)\s+is the correct answer to:\s+(.+)$/i);
        if (match) {
            const answer = match[1].trim();
            // Show the extracted answer as the answer side
            answerText = answer.charAt(0).toUpperCase() + answer.slice(1);
        } else {
            answerText = question.answer === true ? 'True' : 'False';
        }
    } else if (Array.isArray(answerText)) {
        answerText = answerText.join(', ');
    }
    document.getElementById('flashcardAnswer').textContent = answerText;
}

// Handle flashcard response
function handleFlashcardResponse(response) {
    console.log('handleFlashcardResponse called with:', response, 'current index:', state.currentQuestionIndex);
    
    const question = state.currentQuestions[state.currentQuestionIndex];
    
    // Track in adaptive learning system
    if (response === 'correct' || response === 'incorrect') {
        const questionId = getQuestionId(
            question,
            question.topicIndex || 0,
            question.sourceIndex
        );
        const isCorrect = response === 'correct';
        updateQuestionStats(questionId, isCorrect);
        
        // Update session stats
        state.flashcardStats[response]++;
    } else if (response === 'skip') {
        state.flashcardStats.skipped++;
    }
    
    // Move to next question or show results
    state.currentQuestionIndex++;
    console.log('After increment, index is now:', state.currentQuestionIndex);
    
    if (state.currentQuestionIndex < state.currentQuestions.length) {
        renderFlashcard();
    } else {
        showFlashcardResults();
    }
}

// Show flashcard results
function showFlashcardResults() {
    document.querySelector('.flashcard-card').style.display = 'none';
    document.querySelector('.flashcard-header').style.display = 'none';
    document.getElementById('flashcardResults').style.display = 'block';
    
    document.getElementById('flashcardFinalCorrect').textContent = state.flashcardStats.correct;
    document.getElementById('flashcardFinalIncorrect').textContent = state.flashcardStats.incorrect;
    document.getElementById('flashcardFinalSkipped').textContent = state.flashcardStats.skipped;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// ==================== STATISTICS ====================
// ==================== GLOBAL ERROR CAPTURE ====================
window.addEventListener('error', (event) => {
    console.error('[GlobalError]', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('[UnhandledRejection]', event.reason);
});

// ==================== CLICK DELEGATION (Back buttons) ====================
// Removed delegated click debug instrumentation
// ==================== DEBUG TOAST ====================
// Removed showDebug helper (debug-only)

let currentStatsFilter = 'all';

function renderStatistics() {
    // Safety check: ensure topics are loaded
    if (!state.topics || state.topics.length === 0) {
        console.warn('Topics not loaded yet');
        const statsList = document.getElementById('statsList');
        if (statsList) {
            statsList.innerHTML = '<div class="stats-empty">Loading statistics...</div>';
        }
        return;
    }
    
    // Get all questions with stats
    const questionStats = [];
    
    // Iterate through all topics and questions using consistent question IDs
    state.topics.forEach((topic, tIdx) => {
        if (topic.questions) {
            topic.questions.forEach((q, qIdx) => {
                const qId = getQuestionId(q, tIdx, qIdx);
                const stats = state.questionStats[qId] || null;
                if (!stats) return; // Only include attempted questions
                const total = stats.correct + stats.incorrect;
                const accuracy = total > 0 ? (stats.correct / total * 100) : 0;
                
                // Format question text for display (especially boolean questions)
                let displayQuestion = q.question;
                if (q.type === 'boolean') {
                    const match = displayQuestion.match(/^(.+?)\s+is the correct answer to:\s+(.+)$/i);
                    if (match) {
                        const answer = match[1].trim();
                        const originalQuestion = match[2].trim();
                        // Show as "Question: Answer"
                        displayQuestion = `${originalQuestion} → ${answer}`;
                    }
                }
                
                questionStats.push({
                    question: displayQuestion,
                    correct: stats.correct,
                    incorrect: stats.incorrect,
                    accuracy,
                    total,
                    points: stats.points || 0
                });
            });
        }
        // Include question groups (tracked as one unit, not individual variations)
        if (topic.questionGroups) {
            topic.questionGroups.forEach((group) => {
                if (group.variations && group.variations.length > 0) {
                    // Use groupId for tracking
                    const qObj = { groupId: group.id };
                    const qId = getQuestionId(qObj, tIdx, null);
                    const stats = state.questionStats[qId] || null;
                    if (!stats) return; // Only include attempted groups
                    const total = stats.correct + stats.incorrect;
                    const accuracy = total > 0 ? (stats.correct / total * 100) : 0;
                    questionStats.push({
                        question: group.baseQuestion || group.variations[0].question,
                        correct: stats.correct,
                        incorrect: stats.incorrect,
                        accuracy,
                        total,
                        points: stats.points || 0
                    });
                }
            });
        }
    });
    
    // Sort by incorrect count descending (most wrong first), then by accuracy ascending
    questionStats.sort((a, b) => {
        if (b.incorrect !== a.incorrect) {
            return b.incorrect - a.incorrect;
        }
        return a.accuracy - b.accuracy;
    });
    
    // Calculate summary stats
    const tracked = questionStats.filter(q => q.total > 0);
    const totalTracked = tracked.length;
    const avgAccuracy = totalTracked > 0 
        ? tracked.reduce((sum, q) => sum + q.accuracy, 0) / totalTracked 
        : 0;
    
    // Calculate total correct and incorrect across all questions
    const totalCorrect = tracked.reduce((sum, q) => sum + q.correct, 0);
    const totalIncorrect = tracked.reduce((sum, q) => sum + q.incorrect, 0);
    
    // Calculate total questions vs answered
    let totalQuestions = 0;
    state.topics.forEach((topic) => {
        if (topic.questions) totalQuestions += topic.questions.length;
        // Count each question group as ONE question (not all variations)
        if (topic.questionGroups) {
            totalQuestions += topic.questionGroups.length;
        }
    });
    const questionsNotAnswered = totalQuestions - totalTracked;
    
    // Update summary boxes
    document.getElementById('totalQuestionsTracked').textContent = totalTracked;
    document.getElementById('questionsNotAnswered').textContent = questionsNotAnswered;
    document.getElementById('totalCorrect').textContent = totalCorrect;
    document.getElementById('totalIncorrect').textContent = totalIncorrect;
    document.getElementById('avgAccuracy').textContent = avgAccuracy.toFixed(1) + '%';
    
    // Render list based on filter
    renderStatsList(questionStats);
}

function setStatsFilter(filter) {
    currentStatsFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1)).classList.add('active');
    
    // Re-render with new filter
    renderStatistics();
}

function renderStatsList(questionStats) {
    const statsList = document.getElementById('statsList');
    
    // Filter questions based on current filter
    let filteredStats = questionStats.filter(q => q.total > 0); // Only show questions that have been attempted
    
    if (currentStatsFilter === 'weak') {
        // Show questions with accuracy < 50% or more incorrect than correct
        filteredStats = filteredStats.filter(q => q.accuracy < 50);
    } else if (currentStatsFilter === 'strong') {
        // Show questions with accuracy >= 80%
        filteredStats = filteredStats.filter(q => q.accuracy >= 80);
    }
    
    // Clear list
    statsList.innerHTML = '';
    
    if (filteredStats.length === 0) {
        statsList.innerHTML = '<div class="stats-empty">No questions to display. Start studying to see statistics!</div>';
        return;
    }
    
    // Render each question
    filteredStats.forEach(stat => {
        const item = document.createElement('div');
        item.className = 'stat-item';
        
        // Add color coding
        if (stat.accuracy < 50) {
            item.classList.add('weak');
        } else if (stat.accuracy >= 80) {
            item.classList.add('strong');
        }
        
        item.innerHTML = `
            <div class="stat-item-question">${stat.question}</div>
            <div class="stat-item-performance">
                <div class="stat-item-accuracy ${stat.accuracy < 50 ? 'weak' : stat.accuracy >= 80 ? 'strong' : ''}">${stat.accuracy.toFixed(0)}%</div>
                <div class="stat-item-count">✓${stat.correct} ✗${stat.incorrect} | ${stat.points >= 0 ? '+' : ''}${stat.points}pts</div>
            </div>
        `;
        
        statsList.appendChild(item);
    });
}

// ==================== ADVENTURE MODE FUNCTIONS ====================

// Load Adventure Progress
function loadAdventureProgress() {
    try {
        const saved = localStorage.getItem('lifeInUK_adventureProgress');
        if (saved) {
            state.adventureProgress = JSON.parse(saved);
        } else {
            state.adventureProgress = { currentTopicIndex: 0, topicsCompleted: [] };
        }
    } catch (error) {
        console.error('Error loading adventure progress:', error);
        state.adventureProgress = { currentTopicIndex: 0, topicsCompleted: [] };
    }
}

// Save Adventure Progress
function saveAdventureProgress() {
    try {
        localStorage.setItem('lifeInUK_adventureProgress', JSON.stringify(state.adventureProgress));
    } catch (error) {
        console.error('Error saving adventure progress:', error);
    }
}

// Update Adventure Progress Display on Home Screen
function updateAdventureProgressDisplay() {
    const progressEl = document.getElementById('adventureProgress');
    if (!progressEl) return;
    
    const currentIdx = state.adventureProgress.currentTopicIndex;
    const totalTopics = state.topics.length;
    
    if (currentIdx > 0 || state.adventureProgress.topicsCompleted.length > 0) {
        const topicTitle = state.topics[currentIdx]?.title || 'Unknown Topic';
        progressEl.textContent = `Continue: ${topicTitle}`;
        progressEl.style.display = 'block';
    } else {
        progressEl.textContent = 'Start your journey!';
        progressEl.style.display = 'block';
    }
}

// Start Adventure Mode
function startAdventureMode() {
    showScreen('adventureScreen');
    renderAdventureTopic();
}

// Render Current Adventure Topic
function renderAdventureTopic() {
    const currentIdx = state.adventureProgress.currentTopicIndex;
    const topic = state.topics[currentIdx];
    
    if (!topic) {
        // Completed all topics!
        showAdventureComplete();
        return;
    }
    
    state.currentTopicIndex = currentIdx;
    
    // Update progress bar
    const progressFill = document.getElementById('adventureProgressFill');
    const progressText = document.getElementById('adventureProgressText');
    const totalTopics = state.topics.length;
    const percentage = (currentIdx / totalTopics) * 100;
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `Topic ${currentIdx + 1} of ${totalTopics}`;
    
    // Show study content
    const contentEl = document.getElementById('adventureStudyContent');
    if (contentEl && topic.content) {
        contentEl.innerHTML = `<h3>${topic.title}</h3>${topic.content}`;
    }
    
    // Show/hide navigation buttons
    document.getElementById('adventurePrevious').style.display = currentIdx > 0 ? 'inline-block' : 'none';
    document.getElementById('adventureNext').style.display = currentIdx < state.topics.length - 1 ? 'inline-block' : 'none';
    
    // Setup button handlers
    setupAdventureButtons();
}

// Setup Adventure Mode Button Handlers
function setupAdventureButtons() {
    const backBtn = document.getElementById('backToHomeFromAdventure');
    if (backBtn) {
        backBtn.replaceWith(backBtn.cloneNode(true));
        document.getElementById('backToHomeFromAdventure').addEventListener('click', () => {
            state.isAdventureMode = false;
            showScreen('homeScreen');
        });
    }
    
    const prevBtn = document.getElementById('adventurePrevious');
    if (prevBtn) {
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        document.getElementById('adventurePrevious').addEventListener('click', () => {
            if (state.adventureProgress.currentTopicIndex > 0) {
                state.adventureProgress.currentTopicIndex--;
                saveAdventureProgress();
                updateAdventureProgressDisplay();
                renderAdventureTopic();
                // Stay at bottom when going back - no scroll
            }
        });
    }
    
    const nextBtn = document.getElementById('adventureNext');
    if (nextBtn) {
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        document.getElementById('adventureNext').addEventListener('click', () => {
            advanceToNextTopic();
            // Scroll to top when advancing
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Advance to Next Topic
function advanceToNextTopic() {
    const currentIdx = state.adventureProgress.currentTopicIndex;
    if (!state.adventureProgress.topicsCompleted.includes(currentIdx)) {
        state.adventureProgress.topicsCompleted.push(currentIdx);
    }
    
    state.adventureProgress.currentTopicIndex++;
    saveAdventureProgress();
    updateAdventureProgressDisplay();
    
    if (state.adventureProgress.currentTopicIndex >= state.topics.length) {
        showAdventureComplete();
    } else {
        renderAdventureTopic();
    }
}

// Show Adventure Complete
function showAdventureComplete() {
    document.getElementById('adventureContent').innerHTML = `
        <div class="results-card">
            <div class="result-icon">🏆</div>
            <h2>Adventure Complete!</h2>
            <p>You've completed your journey through UK history!</p>
            <div class="result-actions">
                <button id="restartAdventure" class="btn btn-secondary">Restart Adventure</button>
                <button id="backHomeComplete" class="btn btn-primary">Back to Home</button>
            </div>
        </div>
    `;
    document.getElementById('adventureTestSection').style.display = 'none';
    document.getElementById('adventureTestResults').style.display = 'none';
    
    const restartBtn = document.getElementById('restartAdventure');
    if (restartBtn) restartBtn.addEventListener('click', () => {
        state.adventureProgress = { currentTopicIndex: 0, topicsCompleted: [] };
        saveAdventureProgress();
        updateAdventureProgressDisplay();
        renderAdventureTopic();
    });
    
    const backBtn = document.getElementById('backHomeComplete');
    if (backBtn) backBtn.addEventListener('click', () => {
        state.isAdventureMode = false;
        showScreen('homeScreen');
    });
}

// Hash code function for deterministic randomization
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

// Start the app
init();

