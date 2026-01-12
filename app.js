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
    isInfinitePracticeMode: false, // Track if in infinite practice mode (only answer questions, save anytime)
    practiceStats: {}, // Track which questions have been seen in practice mode
    isFlashcardMode: false, // Track if in flashcard mode
    flashcardStats: { correct: 0, incorrect: 0, skipped: 0 }, // Track flashcard session stats
    selectedAnswers: [], // Track selected answers for multi-answer questions
    isAdventureMode: false, // Track if in adventure mode
    adventureProgress: { currentTopicIndex: 0, topicsCompleted: [] }, // Track adventure progress
    showPracticeFirst: false, // Show practice topics at the top of topic list
    showPracticeOnly: false, // Show only practice topics
    currentQuestion: null // Store the current question being displayed (for infinite practice mode)
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
            // Backend not available (expected on mobile), continue with localStorage
            console.log('Backend not available, using localStorage');
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        state.questionStats = {};
    }
}

// Save Question Statistics to Backend
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
        // Backend not available (expected on mobile), localStorage already saved
        console.log('Backend not available for sync');
    }
}

// Get unique question ID
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
    console.log('=== updateQuestionStats ===');
    console.log('ID:', questionId);
        console.log('Correct:', isCorrect ? 'Yes' : 'No');
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
    
    console.log('New stats:', stats);
    console.log('Total entries:', Object.keys(state.questionStats).length);
    console.log('Sample keys:', Object.keys(state.questionStats).slice(0, 3));
    // Test localStorage
    try {
        localStorage.setItem('TEST_KEY', 'test');
        const test = localStorage.getItem('TEST_KEY');
        console.log('localStorage works:', test === 'test');
    } catch (e) {
        console.error('localStorage FAILED:', e);
    }
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
        // Try localStorage first (works on mobile)
        const saved = localStorage.getItem('lifeInUK_practiceStats');
        if (saved) {
            state.practiceStats = JSON.parse(saved);
            console.log('Loaded practice stats from localStorage');
        } else {
            state.practiceStats = { seenAll: false, questionsSeen: {} };
        }
        
        // Try to sync with backend if available (desktop only)
        try {
            const response = await fetch('http://localhost:3000/api/practice-stats', { timeout: 1000 });
            if (response.ok) {
                const data = await response.json();
                state.practiceStats = data || state.practiceStats;
                console.log('Synced practice stats from backend');
            }
        } catch (backendError) {
            console.log('Backend not available, using localStorage');
        }
    } catch (error) {
        console.error('Error loading practice stats:', error);
        state.practiceStats = { seenAll: false, questionsSeen: {} };
    }
}

// Save Practice Statistics
async function savePracticeStats() {
    // Always save to localStorage first (works on mobile)
    try {
        localStorage.setItem('lifeInUK_practiceStats', JSON.stringify(state.practiceStats));
        console.log('Saved practice stats to localStorage');
    } catch (localError) {
        console.error('Error saving to localStorage:', localError);
    }
    
    // Try to sync with backend if available (desktop only)
    try {
        await fetch('http://localhost:3000/api/practice-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.practiceStats)
        });
        console.log('Synced practice stats to backend');
    } catch (error) {
        console.log('Backend not available for sync');
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
        state.isInfinitePracticeMode = false;
        state.isFlashcardMode = false;
        state.currentTopicIndex = null;
        showScreen('testScreen');
        showDifficultySelection();
    });

    const homeInfinitePractice = document.getElementById('homeInfinitePractice');
    if (homeInfinitePractice) homeInfinitePractice.addEventListener('click', () => {
        state.isPracticeMode = false;
        state.isInfinitePracticeMode = true;
        state.isFlashcardMode = false;
        state.currentTopicIndex = null;
        state.score = 0;
        state.currentQuestionIndex = 0;
        state.currentDifficulty = 'normal'; // Always use normal difficulty for infinite practice
        state.currentQuestions = generateInfinitePracticeQuestions();
        showScreen('testScreen');
        document.getElementById('difficultySelection').style.display = 'none';
        document.getElementById('testQuestions').style.display = 'block';
        document.getElementById('testResults').style.display = 'none';
        document.getElementById('testTopicTitle').textContent = 'Infinite Practice - Answer Questions';
        renderQuestion();
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
        console.log('=== Opening Statistics Screen ===');
        showScreen('statsScreen');
        
        const statsList = document.getElementById('statsList');
        if (statsList) {
            statsList.innerHTML = '<div class="stats-empty">Loading statistics...</div>';
        }
        
        try {
            console.log('Loading question stats and topics...');
            // Ensure data is loaded before rendering
            await Promise.all([
                loadQuestionStats(),
                loadTopics()
            ]);
            console.log('Topics loaded:', state.topics?.length || 0);
            console.log('Question stats entries:', Object.keys(state.questionStats || {}).length);
            console.log('Sample stats:', Object.entries(state.questionStats || {}).slice(0, 3));
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

    // Save & Exit Button (Infinite Practice Mode)
    const saveExitBtn = document.getElementById('saveExitPractice');
    if (saveExitBtn) saveExitBtn.addEventListener('click', () => {
        // Save practice stats and return to home
        savePracticeStats();
        state.isInfinitePracticeMode = false;
        state.currentQuestions = [];
        state.score = 0;
        showScreen('homeScreen');
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

    // Topic controls: toggle practice-first grouping
    const togglePracticeFirst = document.getElementById('togglePracticeFirst');
    if (togglePracticeFirst) togglePracticeFirst.addEventListener('change', (e) => {
        state.showPracticeFirst = !!e.target.checked;
        renderTopicList();
    });

    // Topic controls: toggle practice-only filter
    const filterPracticeOnly = document.getElementById('filterPracticeOnly');
    if (filterPracticeOnly) filterPracticeOnly.addEventListener('click', () => {
        state.showPracticeOnly = !state.showPracticeOnly;
        filterPracticeOnly.style.background = state.showPracticeOnly ? '#5865f2' : 'transparent';
        filterPracticeOnly.style.color = state.showPracticeOnly ? '#fff' : '#5865f2';
        renderTopicList();
    });
}

// Render Topic List
function renderTopicList() {
    const container = document.getElementById('topicList');
    container.innerHTML = '';
    // Build ordered list of indices; optionally place practice topics first or filter to practice-only
    const isPracticeTitle = (t) => typeof t.title === 'string' && t.title.trim().toLowerCase().startsWith('practice:');
    let indices = state.topics.map((_, i) => i);
    
    // Filter to practice-only if enabled
    if (state.showPracticeOnly) {
        indices = indices.filter(i => isPracticeTitle(state.topics[i]));
    }
    
    // Reorder with practice first if enabled (but not when practice-only is active)
    let ordered = indices;
    if (state.showPracticeFirst && !state.showPracticeOnly) {
        const practice = indices.filter(i => isPracticeTitle(state.topics[i]));
        const core = indices.filter(i => !isPracticeTitle(state.topics[i]));
        ordered = [...practice, ...core];
    }

    // Optional section headers when grouping practice topics first
    if (state.showPracticeFirst && !state.showPracticeOnly) {
        const hasPractice = ordered.some(i => isPracticeTitle(state.topics[i]));
        if (hasPractice) {
            const header = document.createElement('div');
            header.className = 'topic-section-header';
            header.style.cssText = 'margin: 0.5rem 0; font-weight: 600; color: #dcddde;';
            header.textContent = 'Practice Topics';
            container.appendChild(header);
        }
    }

    let addedCoreHeader = false;
    ordered.forEach((index) => {
        // Topics are unlocked if: it's the first topic, OR the previous topic has been attempted
        const topic = state.topics[index];
        const practiceTopic = typeof topic.title === 'string' && topic.title.trim().toLowerCase().startsWith('practice:');
        // Practice topics should not be locked by sequential progression
        const isLocked = practiceTopic ? false : (index > 0 && (!state.progress[index - 1] || state.progress[index - 1].attempts === 0));
        const progress = state.progress[index] || { completed: false, attempts: 0 };

        // Insert a core section header once when transitioning from practice to core
        if (state.showPracticeFirst && !practiceTopic && !addedCoreHeader) {
            const header = document.createElement('div');
            header.className = 'topic-section-header';
            header.style.cssText = 'margin: 0.75rem 0; font-weight: 600; color: #dcddde;';
            header.textContent = 'Core Topics';
            container.appendChild(header);
            addedCoreHeader = true;
        }

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
        // All questions have been seen at least once
        // Check if there are any unanswered questions (0 points)
        const unansweredQuestions = allQuestions.filter((q) => {
            const questionId = getQuestionId(q, q.topicIndex, q.sourceIndex);
            const points = state.questionStats[questionId]?.points ?? 0;
            return points === 0;
        });
        
        if (unansweredQuestions.length > 0) {
            // Randomly select from unanswered questions first
            const shuffled = shuffleArray(unansweredQuestions);
            selectedQuestions = shuffled.slice(0, count);
        } else {
            // All questions have been answered - use weighted selection for adaptive learning
            const weightedQuestions = allQuestions.map((q) => {
                const questionId = getQuestionId(q, q.topicIndex, q.sourceIndex);
                const weight = getQuestionWeight(questionId);
                return { question: q, weight, id: questionId };
            });
            
            // Sort by weight (descending) - harder questions first
            weightedQuestions.sort((a, b) => b.weight - a.weight);
            
            // Take top 24
            selectedQuestions = weightedQuestions.slice(0, count).map(wq => wq.question);
        }
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

// Generate questions for infinite practice mode (generate one at a time)
function generateInfinitePracticeQuestions() {
    let allQuestions = [];
    
    // Collect all questions from all topics (similar to practice mode)
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
    
    // Return all available questions (will be cycled through)
    return allQuestions;
}

// Get next question for infinite practice mode (cycles through available questions)
function getNextInfinitePracticeQuestion() {
    if (!state.currentQuestions || state.currentQuestions.length === 0) {
        return null;
    }
    
    // Pick a random question from available pool
    const randomIndex = Math.floor(Math.random() * state.currentQuestions.length);
    return state.currentQuestions[randomIndex];
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
        document.getElementById('testTopicTitle').textContent = '';
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
        
        // Check if there are any unanswered questions (0 points)
        const unansweredQuestions = allQuestions.filter((q) => {
            const questionId = getQuestionId(q, topicIndex, q.sourceIndex);
            const points = state.questionStats[questionId]?.points ?? 0;
            return points === 0;
        });
        
        if (unansweredQuestions.length > 0) {
            // Randomly shuffle unanswered questions first
            allQuestions = shuffleArray(unansweredQuestions);
        } else {
            // All questions have been answered - use weighted selection for adaptive learning
            allQuestions = selectWeightedQuestions(allQuestions, topicIndex);
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
    let question;
    
    if (state.isInfinitePracticeMode) {
        // For infinite practice, get a random question from the pool
        question = getNextInfinitePracticeQuestion();
        if (!question) {
            showScreen('homeScreen');
            return;
        }
        // Store the current question for checkAnswer to use
        state.currentQuestion = question;
    } else {
        question = state.currentQuestions[state.currentQuestionIndex];
        state.currentQuestion = question;
        
        // Safety check if no questions available
        if (!question || !state.currentQuestions || state.currentQuestions.length === 0) {
            console.error('No questions available in test mode');
            showScreen('homeScreen');
            return;
        }
    }
    
    const totalQuestions = state.isInfinitePracticeMode ? '∞' : state.currentQuestions.length;
    const currentNum = state.currentQuestionIndex + 1;

    // Update progress bar and header (hide for infinite practice and regular practice mode)
    const testHeader = document.querySelector('.test-header');
    if (testHeader) {
        testHeader.style.display = (state.isInfinitePracticeMode || state.isPracticeMode) ? 'none' : 'flex';
    }
    
    if (state.isInfinitePracticeMode || state.isPracticeMode) {
        document.getElementById('testProgressBar').style.display = 'none';
        // Show stats in the question card instead
        const statsDiv = document.getElementById('infinitePracticeStats');
        if (statsDiv) {
            statsDiv.style.display = 'block';
            if (state.isInfinitePracticeMode) {
                document.getElementById('questionCounterInline').textContent = `Question #${currentNum}`;
                document.getElementById('scoreCounterInline').textContent = `Score: ${state.score} points`;
            } else {
                document.getElementById('questionCounterInline').textContent = `Question ${currentNum} of ${totalQuestions}`;
                document.getElementById('scoreCounterInline').textContent = `Score: ${state.score}/${totalQuestions}`;
            }
        }
    } else {
        document.getElementById('testProgressBar').style.display = 'block';
        const progress = (currentNum / state.currentQuestions.length) * 100;
        document.getElementById('testProgressBar').style.width = `${progress}%`;
        const statsDiv = document.getElementById('infinitePracticeStats');
        if (statsDiv) {
            statsDiv.style.display = 'none';
        }
        document.getElementById('questionCounter').textContent = `Question ${currentNum} of ${totalQuestions}`;
        document.getElementById('scoreCounter').textContent = `Score: ${state.score}/${totalQuestions}`;
    }

    // Show/hide Save & Exit button for infinite practice
    const saveExitBtn = document.getElementById('saveExitPractice');
    if (saveExitBtn) {
        saveExitBtn.style.display = state.isInfinitePracticeMode ? 'inline-flex' : 'none';
    }

    // Set question text
    const questionText = question.question;
    document.getElementById('questionText').textContent = questionText;

    // Hide feedback
    document.getElementById('feedback').style.display = 'none';

    // Reset selected answers for multi-answer questions
    state.selectedAnswers = [];

    // Render based on difficulty and question type
    if (state.currentDifficulty === 'normal' || state.isInfinitePracticeMode) {
        if (question.type === 'multipleAnswer') {
            renderMultipleAnswer(question);
        } else {
            renderMultipleChoice(question);
        }
    } else if (state.currentDifficulty === 'hard') {
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
    // Use stored current question (for both regular and infinite practice modes)
    const question = state.currentQuestion || state.currentQuestions[state.currentQuestionIndex];
    const correctAnswer = question.answer || question.answers;

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
        // Use the question's own topic index to ensure consistency in Practice Mode
        (typeof question.topicIndex === 'number' ? question.topicIndex : state.currentTopicIndex),
        question.sourceIndex
    );
    updateQuestionStats(questionId, isCorrect);

    // Show feedback
    showFeedback(isCorrect, correctAnswer, userAnswer);
}

// Fuzzy Match for Hard Mode
function fuzzyMatch(userAnswer, correctAnswer) {
    // Handle array answers (multi-answer questions)
    let answersToCheck = [];
    if (Array.isArray(correctAnswer)) {
        answersToCheck = correctAnswer;
    } else {
        answersToCheck = [correctAnswer];
    }
    
    // Normalize answers - remove commas, punctuation, convert to lowercase
    const normalize = (str) => {
        return String(str)
            .toLowerCase()
            .trim()
            .replace(/[,.\s]/g, ''); // Remove commas, periods, and spaces for number comparison
    };
    
    const userNorm = normalize(userAnswer);
    
    // Check against each possible answer
    for (const answer of answersToCheck) {
        const correctNorm = normalize(answer);
        
        // Exact match after normalization
        if (userNorm === correctNorm) {
            return true;
        }
        
        // For pure numbers, do strict comparison after normalization
        if (/^\d+$/.test(correctNorm) && /^\d+$/.test(userNorm)) {
            if (userNorm === correctNorm) {
                return true;
            }
            continue;
        }
        
        // Levenshtein distance for fuzzy matching text
        const similarity = calculateSimilarity(userNorm, correctNorm);
        if (similarity >= 0.8) {
            return true;
        }
    }
    
    return false;
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
    // For infinite practice mode, always generate next question
    if (state.isInfinitePracticeMode) {
        state.currentQuestionIndex++;
        renderQuestion();
    } else {
        state.currentQuestionIndex++;
        if (state.currentQuestionIndex < state.currentQuestions.length) {
            renderQuestion();
        } else {
            showResults();
        }
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
    
    // Hide header and progress bar for flashcards
    const flashcardHeader = document.querySelector('.flashcard-header');
    if (flashcardHeader) {
        flashcardHeader.style.display = 'none';
    }
    document.getElementById('flashcardProgressBar').style.display = 'none';
    
    // Show stats in the flashcard card instead
    const statsDiv = document.getElementById('flashcardStats');
    if (statsDiv) {
        statsDiv.style.display = 'block';
        document.getElementById('flashcardCounterInline').textContent = `Card ${currentNum} of ${totalQuestions}`;
        document.getElementById('flashcardScoreInline').textContent = 
            `✓ ${state.flashcardStats.correct} | ✗ ${state.flashcardStats.incorrect}`;
    }
    
    // Set question text
    const questionText = question.question;
    document.getElementById('flashcardQuestion').textContent = questionText;
    
    // Set answer
    let answerText = question.answer;
    if (Array.isArray(answerText)) {
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

// Build text hash the same way IDs were built historically
function buildTextHash(text) {
    if (!text || typeof text !== 'string') return '';
    return text.substring(0, 50).replace(/\s+/g, '_');
}

// Create indexes to help migrate legacy stats keys
function buildQuestionIndex() {
    const byHash = new Map(); // textHash -> { question, topicIndex, sourceIndex, groupId }
    const groupIdxToId = new Map(); // topicIndex -> Map(groupIdx -> groupId)

    state.topics.forEach((topic, tIdx) => {
        // Regular questions
        if (topic.questions) {
            topic.questions.forEach((q, qIdx) => {
                const hash = buildTextHash(q.question);
                byHash.set(hash, { question: q, topicIndex: tIdx, sourceIndex: qIdx, groupId: null });
            });
        }

        // Question groups
        if (topic.questionGroups) {
            const map = new Map();
            topic.questionGroups.forEach((group, gIdx) => {
                map.set(gIdx, group.id);
                if (group.variations) {
                    group.variations.forEach((v) => {
                        const hash = buildTextHash(v.question);
                        byHash.set(hash, { question: v, topicIndex: tIdx, sourceIndex: `group_${gIdx}`, groupId: group.id });
                    });
                }
            });
            groupIdxToId.set(tIdx, map);
        }
    });

    return { byHash, groupIdxToId };
}

// Migrate legacy stats keys to new consistent IDs
function migrateLegacyQuestionStats() {
    try {
        if (!state.topics || state.topics.length === 0) return; // need topics
        if (!state.questionStats || Object.keys(state.questionStats).length === 0) return; // nothing to migrate

        const { byHash, groupIdxToId } = buildQuestionIndex();
        const originalKeys = Object.keys(state.questionStats);
        let migratedCount = 0;
        let removedCount = 0;

        originalKeys.forEach((key) => {
            // Skip if key already matches a valid new format for groups: <topic>_group_<groupId>
            if (/^\d+_group_.+/.test(key)) {
                return;
            }

            // Pattern: <topicIndex>_<indexPart>_<textHash>
            const parts = key.split('_');
            if (parts.length >= 3) {
                const topicPart = parts[0];
                const indexPart = parts[1];
                const textHash = parts.slice(2).join('_');

                const entry = state.questionStats[key];

                // Try to resolve by text hash across all topics
                const match = byHash.get(textHash);
                if (match) {
                    const newKey = getQuestionId(match.question, match.topicIndex, match.sourceIndex);
                    if (newKey !== key) {
                        // Merge stats if newKey already exists
                        const existing = state.questionStats[newKey];
                        if (existing) {
                            existing.correct += (entry.correct || 0);
                            existing.incorrect += (entry.incorrect || 0);
                            existing.points = Math.max(existing.points || 0, entry.points || 0);
                            existing.lastAsked = existing.lastAsked || entry.lastAsked || null;
                        } else {
                            state.questionStats[newKey] = entry;
                        }
                        delete state.questionStats[key];
                        migratedCount++;
                    }
                    return;
                }

                // If indexPart looks like group_<number>, and topicPart is numeric, try mapping groupIdx -> groupId
                if (/^group_\d+$/.test(indexPart) && /^\d+$/.test(topicPart)) {
                    const gIdx = Number(indexPart.replace('group_', ''));
                    const tIdx = Number(topicPart);
                    const map = groupIdxToId.get(tIdx);
                    if (map && map.has(gIdx)) {
                        const groupId = map.get(gIdx);
                        const newKey = `${tIdx}_group_${groupId}`;
                        if (newKey !== key) {
                            const existing = state.questionStats[newKey];
                            const entry2 = state.questionStats[key];
                            if (existing) {
                                existing.correct += (entry2.correct || 0);
                                existing.incorrect += (entry2.incorrect || 0);
                                existing.points = Math.max(existing.points || 0, entry2.points || 0);
                                existing.lastAsked = existing.lastAsked || entry2.lastAsked || null;
                            } else {
                                state.questionStats[newKey] = entry2;
                            }
                            delete state.questionStats[key];
                            migratedCount++;
                        }
                        return;
                    }
                }

                // If we cannot resolve, leave as is for now
                return;
            }

            // Pattern: <topicIndex>_group_<number> without text hash
            const groupMatch = key.match(/^(\d+)_group_(\d+)$/);
            if (groupMatch) {
                const tIdx = Number(groupMatch[1]);
                const gIdx = Number(groupMatch[2]);
                const map = groupIdxToId.get(tIdx);
                if (map && map.has(gIdx)) {
                    const groupId = map.get(gIdx);
                    const newKey = `${tIdx}_group_${groupId}`;
                    if (newKey !== key) {
                        const entry3 = state.questionStats[key];
                        const existing = state.questionStats[newKey];
                        if (existing) {
                            existing.correct += (entry3.correct || 0);
                            existing.incorrect += (entry3.incorrect || 0);
                            existing.points = Math.max(existing.points || 0, entry3.points || 0);
                            existing.lastAsked = existing.lastAsked || entry3.lastAsked || null;
                        } else {
                            state.questionStats[newKey] = entry3;
                        }
                        delete state.questionStats[key];
                        migratedCount++;
                    }
                }
            }
        });

        if (migratedCount > 0 || removedCount > 0) {
            console.log(`[StatsMigration] Migrated: ${migratedCount}, Removed: ${removedCount}`);
            // Persist after migration
            saveQuestionStats();
        } else {
            console.log('[StatsMigration] No legacy keys found to migrate');
        }
    } catch (e) {
        console.error('[StatsMigration] Failed:', e);
    }
}

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

    // Run a one-time migration to normalize legacy keys (after topics are loaded)
    if (!state._statsMigrated) {
        migrateLegacyQuestionStats();
        state._statsMigrated = true;
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
                
                // Format question text for display
                const displayQuestion = q.question;
                
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
        
        // Handle image loading with fallback sources
        const images = contentEl.querySelectorAll('img');
        images.forEach(img => {
            const originalSrc = img.src;
            let attemptCount = 0;
            
            const tryFallback = () => {
                attemptCount++;
                
                if (attemptCount === 1) {
                    // First failure - try Wikimedia Commons version (without upload.wikimedia.org subdomain)
                    if (originalSrc.includes('upload.wikimedia.org')) {
                        const fallbackSrc = originalSrc.replace('upload.wikimedia.org', 'commons.wikimedia.org');
                        console.log('Trying fallback source:', fallbackSrc);
                        img.src = fallbackSrc;
                        return;
                    }
                } else if (attemptCount === 2) {
                    // Second failure - try thumbnail version
                    if (originalSrc.includes('/commons/')) {
                        const thumbSrc = originalSrc.replace('/commons/', '/commons/thumb/') + '/400px-' + originalSrc.split('/').pop();
                        console.log('Trying thumbnail version:', thumbSrc);
                        img.src = thumbSrc;
                        return;
                    }
                }
                
                // All attempts failed - hide image gracefully
                console.warn('All image sources failed for:', originalSrc);
                img.style.display = 'none';
                const caption = img.nextElementSibling;
                if (caption && caption.classList.contains('image-caption')) {
                    caption.style.display = 'none';
                }
            };
            
            img.addEventListener('error', tryFallback);
            
            img.addEventListener('load', function() {
                console.log('Image loaded successfully:', this.src);
            });
        });
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

