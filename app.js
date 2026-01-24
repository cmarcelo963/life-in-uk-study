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
    selectedOptions: [], // Track selected options for multi-answer questions
    isAdventureMode: false, // Track if in adventure mode
    adventureProgress: { currentTopicIndex: 0, topicsCompleted: [] }, // Track adventure progress
    showPracticeFirst: false, // Show practice topics at the top of topic list
    showPracticeOnly: false, // Show only practice topics
    currentQuestion: null, // Store the current question being displayed (for infinite practice mode)
    lastInfiniteConceptKey: null // Track last served concept in infinite practice to avoid repeats
};

// Feature flags
const ENABLE_AUTO_BOLD_QUESTIONS = false;

// Dataset version - increment when question data format changes incompatibly
const DATA_VERSION = 4;

// Check and reset stats if dataset version changed
function checkDatasetVersion() {
    const storedVersion = localStorage.getItem('lifeInUK_dataVersion');
    const currentVersion = String(DATA_VERSION);
    
    if (storedVersion !== currentVersion) {
        console.log(`=== Dataset Version Change Detected ===`);
        console.log(`Stored: ${storedVersion || 'none'}, Current: ${currentVersion}`);
        
        // Clear incompatible stats from localStorage
        localStorage.removeItem('lifeInUK_questionStats');
        localStorage.removeItem('lifeInUK_statsMigrated_v2');
        localStorage.removeItem('lifeInUK_practiceStats');
        
        console.log('Cleared old stats from localStorage due to dataset version change');
        
        // Clear backend stats files if server is available
        clearBackendStats().catch(err => {
            console.log('Backend not available for stats clearing (expected on mobile)');
        });
        
        // Save new version
        localStorage.setItem('lifeInUK_dataVersion', currentVersion);
        console.log(`Updated data version to ${currentVersion}`);
        
        return true; // Stats were reset
    }
    
    return false; // No reset needed
}

// Clear backend stats files when dataset version changes
async function clearBackendStats() {
    try {
        // Clear question stats
        await fetch('http://localhost:3000/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        // Clear practice stats
        await fetch('http://localhost:3000/api/practice-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seenAll: false, questionsSeen: {} })
        });
        
        console.log('Cleared backend stats files');
    } catch (error) {
        // Silent fail - backend may not be available
        throw error;
    }
}

// Build a short excerpt around a bold term so generated questions have context
function buildContextSnippet(node, term) {
    if (!node) return '';

    // Climb to a reasonably sized ancestor to capture a full sentence or list item
    let current = node;
    while (current && (current.textContent || '').trim().length < 30) {
        current = current.parentElement;
    }

    const text = ((current || node).textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';

    const idx = text.toLowerCase().indexOf((term || '').toLowerCase());
    if (idx === -1) {
        return text.slice(0, 180);
    }

    const padding = 90;
    const start = Math.max(0, idx - padding);
    const end = Math.min(text.length, idx + term.length + padding);
    let snippet = text.slice(start, end).trim();

    if (start > 0) snippet = `...${snippet}`;
    if (end < text.length) snippet = `${snippet}...`;
    return snippet;
}

// Extract bold facts along with a contextual snippet
function extractBoldFacts(html) {
    try {
        const doc = new DOMParser().parseFromString(html || '', 'text/html');
        return Array.from(doc.querySelectorAll('strong'))
            .map((el) => {
                const term = (el.textContent || '').trim();
                if (!term) return null;
                const context = buildContextSnippet(el, term);
                if (!context) return null;
                return { term, context };
            })
            .filter(Boolean);
    } catch (e) {
        console.warn('Failed to parse HTML for bold facts', e);
        return [];
    }
}

// Filter out terms that are too short or meaningless for questions
function isUsableBoldTerm(term) {
    const cleaned = (term || '').trim();
    if (!cleaned) return false;
    if (cleaned.length === 1) return false;
    if (/^[0-9]+$/.test(cleaned)) return false;
    // Allow short abbreviations like UK or EU but drop other very short tokens
    if (cleaned.length < 3 && !/^[A-Z]{2,}$/.test(cleaned)) return false;
    return true;
}

// Pick unique distractors from a pool, excluding the correct term
function pickDistractors(pool, correct, count) {
    const candidates = pool.filter((t) => t !== correct);
    const shuffled = shuffleArray(candidates);
    return shuffled.slice(0, Math.max(0, count));
}

// Add one generated question per bold term (no variations) into each topic
function augmentTopicsWithGeneratedBoldQuestions(topics) {
    if (!ENABLE_AUTO_BOLD_QUESTIONS) return;
    if (!Array.isArray(topics)) return;

    // Pre-extract facts so we can reuse them for global distractors
    const topicFacts = topics.map((topic) => extractBoldFacts(topic?.content || ''));

    // Build global pool of bold terms for distractors
    const globalTerms = new Set();
    topicFacts.forEach((facts) => facts.forEach((fact) => {
        if (fact && isUsableBoldTerm(fact.term)) {
            globalTerms.add(fact.term);
        }
    }));
    const globalList = Array.from(globalTerms);

    topics.forEach((topic, tIdx) => {
        if (!topic || topic._generatedBoldAdded) return; // prevent double-add on reload
        const facts = Array.from(new Set((topicFacts[tIdx] || []).map((f) => f.term)))
            .map((term) => (topicFacts[tIdx] || []).find((f) => f.term === term))
            .filter((fact) => fact && fact.context && isUsableBoldTerm(fact.term));
        if (facts.length === 0) return;
        if (!Array.isArray(topic.questions)) topic.questions = [];

        const questionText = `Which key fact is highlighted (bolded) in the official study material for ${topic.title}?`;

        facts.forEach((fact, idx) => {
            const distractors = pickDistractors(globalList, fact.term, 3);
            const options = shuffleArray([fact.term, ...distractors]);

            topic.questions.push({
                id: `auto_bold_${tIdx}_${idx}`,
                type: 'multiple',
                question: questionText,
                options,
                answer: fact.term,
                generated: true,
                sourceIndex: `auto_${idx}`,
                topicIndex: tIdx
            });
        });

        topic._generatedBoldAdded = true;
    });
}


// Initialize App
async function init() {
    // Check dataset version and reset stats if incompatible
    checkDatasetVersion();
    
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
        // Load flat question array from data/questions.json
        const response = await fetch('data/questions.json');
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        const questions = await response.json();
        
        console.log(`Loaded ${questions.length} questions from data/questions.json`);
        
        // Transform flat array into topics structure grouped by category
        const categoryMap = new Map();
        
        questions.forEach(q => {
            const category = q.category || 'Uncategorized';
            
            if (!categoryMap.has(category)) {
                categoryMap.set(category, {
                    title: category,
                    content: `<p>Study material for ${category}</p>`,
                    questions: []
                });
            }
            
            // Map question to expected schema
            // Question IDs are already in format: <conceptId>_v<variant>
            const mappedQuestion = {
                type: q.type || 'multiple', // Preserve original type (multipleAnswer or multiple)
                id: String(q.id), // Already in correct format from fixDuplicateIds.js
                question: q.question,
                options: q.options,
                answer: q.answer,
                conceptId: q.conceptId,
                variant: q.variant ?? 0,
                variantOf: q.variantOf || `${q.conceptId}_v0`, // Points to canonical v0
                feedback: {
                    fact: q.fact || '',
                    whyCorrect: ''
                },
                generated: false,
                sourceIndex: categoryMap.get(category).questions.length
            };
            
            // Preserve multi-answer specific fields if they exist
            if (q.correctOptions) {
                mappedQuestion.correctOptions = q.correctOptions;
            }
            if (q.numRequired) {
                mappedQuestion.numRequired = q.numRequired;
            }
            
            categoryMap.get(category).questions.push(mappedQuestion);
        });
        
        // Convert map to array
        state.topics = Array.from(categoryMap.values());
        
        console.log(`Loaded ${questions.length} questions across ${state.topics.length} topics`);
        
        // Now hydrate topics with real content from topics_grouped.json
        await hydrateTopicContent();
        
    } catch (error) {
        console.error('Error loading topics:', error);
        state.topics = [];
    }
}

// Hydrate topic content from topics_grouped.json
async function hydrateTopicContent() {
    try {
        const response = await fetch('data/topics_grouped.json');
        if (!response.ok) {
            console.warn('Could not load topics_grouped.json, continuing with placeholder content');
            return;
        }
        
        const groupedTopics = await response.json();
        console.log(`Loaded ${groupedTopics.length} topics with full content from topics_grouped.json`);
        
        // Build lookup map by normalized title
        const contentLookup = new Map();
        groupedTopics.forEach(topic => {
            const normalizedTitle = (topic.title || '').trim().toLowerCase();
            contentLookup.set(normalizedTitle, {
                content: topic.content,
                originalTitle: topic.title
            });
        });
        
        // Special handling for "History of the UK" - combine all history chapters
        const historyChapters = groupedTopics.filter(t => 
            t.title && t.title.toLowerCase().includes('a long and illustrious history')
        );
        if (historyChapters.length > 0) {
            const combinedHistoryContent = historyChapters
                .map(ch => ch.content)
                .join('\n<hr style="margin: 2rem 0; border: none; border-top: 2px solid #ddd;">\n');
            contentLookup.set('history of the uk', {
                content: combinedHistoryContent,
                originalTitle: `Combined from ${historyChapters.length} history chapters`
            });
        }
        
        // Special mappings for other known mismatches
        const specialMappings = {
            'government, law and your role': 'the uk government, the law and your role'
        };
        
        // Match and hydrate topics
        let hydratedCount = 0;
        const unmatchedTitles = [];
        
        state.topics.forEach(topic => {
            const normalizedTitle = (topic.title || '').trim().toLowerCase();
            
            // Try exact match first
            if (contentLookup.has(normalizedTitle)) {
                const match = contentLookup.get(normalizedTitle);
                topic.content = match.content;
                console.log(`  ✓ Matched "${topic.title}" → "${match.originalTitle}"`);
                hydratedCount++;
                return;
            }
            
            // Check special mappings
            const mappedKey = specialMappings[normalizedTitle];
            if (mappedKey && contentLookup.has(mappedKey)) {
                const match = contentLookup.get(mappedKey);
                topic.content = match.content;
                console.log(`  ✓ Matched "${topic.title}" → "${match.originalTitle}" (via mapping)`);
                hydratedCount++;
                return;
            }
            
            // Try partial matches
            let matched = false;
            for (const [key, data] of contentLookup.entries()) {
                if (key.includes(normalizedTitle) || normalizedTitle.includes(key)) {
                    topic.content = data.content;
                    console.log(`  ✓ Matched "${topic.title}" → "${data.originalTitle}" (partial)`);
                    hydratedCount++;
                    matched = true;
                    break;
                }
            }
            
            if (!matched) {
                unmatchedTitles.push(topic.title);
            }
        });
        
        console.log(`✅ Hydrated ${hydratedCount} of ${state.topics.length} topics with real content`);
        
        if (unmatchedTitles.length > 0) {
            console.warn('⚠️ Topics without matching content:', unmatchedTitles);
        }
        
    } catch (error) {
        console.warn('Failed to load topics_grouped.json, continuing with placeholder content:', error);
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

// Migrate old numeric question IDs to new format
function migrateQuestionStats(stats) {
    const migrationKey = 'lifeInUK_statsMigrated_v2';
    
    // Check if migration already done
    if (localStorage.getItem(migrationKey) === 'true') {
        return stats;
    }
    
    console.log('=== Checking for stats migration ===');
    
    // Check if we have stats with old numeric format
    let hasOldIds = false;
    Object.keys(stats).forEach(key => {
        // Old format: numeric only (1, 2, 3...) or topic_idx_text format
        if (/^\d+$/.test(key) || /^\d+_\d+_/.test(key)) {
            hasOldIds = true;
        }
    });
    
    if (!hasOldIds) {
        console.log('No old-format stats found');
        localStorage.setItem(migrationKey, 'true');
        return stats;
    }
    
    // Build mapping: We need to map old numeric IDs to new <conceptId>_v<variant> IDs
    // Old IDs were 1,2,3...400 corresponding to array index + 1
    // New IDs are <conceptId>_v<variant> based on conceptId and variant fields
    
    // Build index-based mapping from current questions
    const idMapping = new Map();
    let questionIndex = 0;
    state.topics.forEach(topic => {
        if (!topic.questions) return;
        topic.questions.forEach(q => {
            questionIndex++;
            // Old ID format was numeric (1, 2, 3, ...) matching original array order
            // Map old numeric ID to new ID
            idMapping.set(String(questionIndex), String(q.id));
            
            // Also map conceptId if someone had stats keyed by conceptId
            if (q.conceptId) {
                const conceptKey = String(q.conceptId);
                if (!idMapping.has(conceptKey)) {
                    // Map to the canonical (v0) question for this concept
                    if (q.variant === 0) {
                        idMapping.set(conceptKey, String(q.id));
                    }
                }
            }
        });
    });
    
    if (idMapping.size === 0) {
        console.log('No ID mapping created');
        localStorage.setItem(migrationKey, 'true');
        return stats;
    }
    
    console.log(`Migrating stats with ${idMapping.size} ID mappings...`);
    console.log('Sample mappings:', Array.from(idMapping.entries()).slice(0, 5));
    
    const migratedStats = {};
    let migratedCount = 0;
    let mergedCount = 0;
    let keptCount = 0;
    let skippedCount = 0;
    
    Object.entries(stats).forEach(([oldId, statData]) => {
        // Check if this is an old numeric ID
        if (/^\d+$/.test(oldId)) {
            const newId = idMapping.get(oldId);
            if (newId) {
                // Merge if new ID already has stats (concept-level aggregation)
                if (migratedStats[newId]) {
                    migratedStats[newId].correct += (statData.correct || 0);
                    migratedStats[newId].incorrect += (statData.incorrect || 0);
                    migratedStats[newId].points += (statData.points || 0);
                    migratedStats[newId].lastAsked = Math.max(
                        migratedStats[newId].lastAsked || 0,
                        statData.lastAsked || 0
                    );
                    mergedCount++;
                    console.log(`Merged ${oldId} -> ${newId}`);
                } else {
                    migratedStats[newId] = { ...statData };
                    migratedCount++;
                }
            } else {
                console.warn(`No mapping found for old ID: ${oldId}`);
                skippedCount++;
            }
        } else if (oldId.includes('_v')) {
            // Already new format - keep as-is
            migratedStats[oldId] = statData;
            keptCount++;
        } else {
            // Unknown format (e.g., old topic_idx_text format) - skip
            console.log(`Skipping unknown format ID: ${oldId}`);
            skippedCount++;
        }
    });
    
    console.log(`Migration complete:`);
    console.log(`  - Migrated: ${migratedCount} entries`);
    console.log(`  - Merged: ${mergedCount} entries`);
    console.log(`  - Kept: ${keptCount} entries`);
    console.log(`  - Skipped: ${skippedCount} entries`);
    console.log(`  - Total: ${Object.keys(migratedStats).length} entries`);
    
    // Mark migration as complete
    localStorage.setItem(migrationKey, 'true');
    
    return migratedStats;
}

// Load Question Statistics from Backend
async function loadQuestionStats() {
    try {
        // Try localStorage first (works on mobile)
        const saved = localStorage.getItem('lifeInUK_questionStats');
        if (saved) {
            let stats = JSON.parse(saved);
            
            // Migrate old IDs if needed (must have topics loaded first)
            if (state.topics && state.topics.length > 0) {
                stats = migrateQuestionStats(stats);
            }
            
            state.questionStats = stats;
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
        
        // Save migrated stats
        if (saved && state.topics && state.topics.length > 0) {
            saveQuestionStats();
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
    
    // Use question.id if available (preferred - stable ID from data file)
    if (question.id) {
        return String(question.id);
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

// Get concept ID for concept-level scoring (groups variants together)
function getConceptKey(question) {
    if (question.conceptId) {
        return `concept_${question.conceptId}`;
    }
    // Fallback to question ID if no conceptId
    return getQuestionId(question, question.topicIndex, question.sourceIndex);
}

// Initialize question stats if not exists
function initQuestionStats(questionId) {
    if (!state.questionStats[questionId]) {
        state.questionStats[questionId] = {
            correct: 0,
            incorrect: 0,
            lastAsked: null,
            points: 0  // Points system: +1 correct, -3 incorrect
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
            stats.points -= 3;  // -3 points for incorrect
        }
    
        // Cap upper bound so mastered questions can be retired
        stats.points = Math.min(stats.points, 100);
    
        // Stats updated and capped; persist
        saveQuestionStats();
}

// Calculate question weight for adaptive learning (concept-level)
function getQuestionWeight(question) {
    const conceptKey = typeof question === 'string' ? question : getConceptKey(question);
    const points = state.questionStats[conceptKey]?.points ?? 0;

    // Retired questions sink to the bottom; otherwise lower points (including negative) rise to the top
    if (points >= 100) return Number.NEGATIVE_INFINITY;
    return -points;
}

// Stop serving questions that have reached the mastery cap (concept-level)
function isQuestionRetired(question) {
    const conceptKey = typeof question === 'string' ? question : getConceptKey(question);
    return !!(state.questionStats[conceptKey] && state.questionStats[conceptKey].points >= 100);
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

// Get a single canonical variation for a question group (first variation wins)
function getCanonicalGroupQuestion(group, groupIdx, topicIndex) {
    if (!group || !group.variations || group.variations.length === 0) return null;
    const canonical = group.variations[0];
    return {
        ...canonical,
        question: canonical.question || group.baseQuestion,
        sourceIndex: `group_${groupIdx}`,
        groupId: group.id,
        topicIndex
    };
}

// Select questions prioritising unseen and low-point items
function selectAdaptiveSubset(allQuestions, count) {
    // Build entries with concept-level points
    const entries = allQuestions.map((q) => {
        const id = getQuestionId(q, q.topicIndex, q.sourceIndex);
        const conceptKey = getConceptKey(q);
        const stats = state.questionStats[conceptKey];
        const points = stats?.points ?? 0;
        const attempts = (stats?.correct || 0) + (stats?.incorrect || 0);
        return { question: q, id, conceptKey, points, attempts };
    });

    // Priority 1: questions with exactly 0 points (includes unseen)
    const zeroPoint = entries.filter(e => e.points === 0);
    const others = entries.filter(e => e.points !== 0);

    // Randomise zero-point questions
    const selected = [];
    const zeroShuffled = shuffleArray(zeroPoint);
    while (selected.length < count && zeroShuffled.length > 0) {
        selected.push(zeroShuffled.shift());
    }

    // Priority 2: lowest points next, but randomised among the lowest slice
    if (selected.length < count && others.length > 0) {
        // Sort ascending by points (lowest first)
        others.sort((a, b) => a.points - b.points);
        while (selected.length < count && others.length > 0) {
            const windowSize = Math.min(10, others.length); // pick randomly among the lowest K
            const idx = Math.floor(Math.random() * windowSize);
            selected.push(others.splice(idx, 1)[0]);
        }
    }

    return selected;
}

// Generate practice questions from all topics
function generatePracticeQuestions(count = 24) {
    let allQuestions = [];

    // Collect all questions from all topics (one canonical variation per group)
    state.topics.forEach((topic, topicIndex) => {
        if (topic.questions) {
            topic.questions.forEach((q, idx) => {
                allQuestions.push({ ...q, sourceIndex: idx, topicIndex });
            });
        }

        if (topic.questionGroups) {
            topic.questionGroups.forEach((group, groupIdx) => {
                const canonical = getCanonicalGroupQuestion(group, groupIdx, topicIndex);
                if (canonical) {
                    allQuestions.push(canonical);
                }
            });
        }
    });

    // Remove questions that have hit the mastery cap (concept-level)
    allQuestions = allQuestions.filter((q) => {
        return !isQuestionRetired(q);
    });

    const availableIds = new Set(allQuestions.map((q) => getQuestionId(q, q.topicIndex, q.sourceIndex)));
    const totalAvailable = availableIds.size;

    // Group by concept and pick one random variant per concept
    const byConcept = new Map();
    for (const q of allQuestions) {
        const key = getConceptKey(q);
        if (!byConcept.has(key)) byConcept.set(key, []);
        byConcept.get(key).push(q);
    }

    const onePerConcept = [];
    for (const group of byConcept.values()) {
        const idx = Math.floor(Math.random() * group.length);
        onePerConcept.push(group[idx]);
    }

    // Shuffle and take the first `count`
    const shuffled = shuffleArray(onePerConcept);
    const selected = shuffled.slice(0, count);

    // Debug log removed after verification

    // Mark selected as seen for practice tracking
    for (const q of selected) {
        const id = getQuestionId(q, q.topicIndex, q.sourceIndex);
        state.practiceStats.questionsSeen[id] = true;
    }

    const seenCount = [...availableIds].filter((id) => state.practiceStats.questionsSeen?.[id]).length;
    state.practiceStats.seenAll = totalAvailable > 0 && seenCount >= totalAvailable;
    savePracticeStats();

    return selected;
}

// Generate questions for infinite practice mode (generate one at a time)
function generateInfinitePracticeQuestions() {
    let allQuestions = [];

    state.topics.forEach((topic, topicIndex) => {
        if (topic.questions) {
            topic.questions.forEach((q, idx) => {
                allQuestions.push({ ...q, sourceIndex: idx, topicIndex });
            });
        }

        if (topic.questionGroups) {
            topic.questionGroups.forEach((group, groupIdx) => {
                const canonical = getCanonicalGroupQuestion(group, groupIdx, topicIndex);
                if (canonical) {
                    allQuestions.push(canonical);
                }
            });
        }
    });

    allQuestions = allQuestions.filter((q) => {
        return !isQuestionRetired(q);
    });

    // Sort the full pool by adaptive priority
    return selectAdaptiveSubset(allQuestions, allQuestions.length).map((entry) => entry.question);
}

// Get next question for infinite practice mode (cycles through available questions)
function getNextInfinitePracticeQuestion() {
    if (!state.currentQuestions || state.currentQuestions.length === 0) {
        return null;
    }

    // Re-rank questions each time based on latest stats
    const prioritized = selectAdaptiveSubset(state.currentQuestions, state.currentQuestions.length);
    state.currentQuestions = prioritized.map((entry) => entry.question);

    // Prefer a different concept than last served, from the top N candidates
    const prevKey = state.lastInfiniteConceptKey;
    const topN = Math.min(20, prioritized.length);
    // Build unique-by-concept candidate list to avoid many duplicates of the same concept
    const uniqueCandidates = [];
    const seenConcepts = new Set();
    for (let i = 0; i < topN; i++) {
        const entry = prioritized[i];
        if (!seenConcepts.has(entry.conceptKey)) {
            seenConcepts.add(entry.conceptKey);
            uniqueCandidates.push(entry);
        }
    }

    let chosenEntry = null;
    for (const entry of uniqueCandidates) {
        const key = entry.conceptKey;
        if (key !== prevKey) {
            // Optional: de-prioritise very recently asked concepts (<30s)
            const stats = state.questionStats[key];
            const recentlyAsked = stats && stats.lastAsked && (Date.now() - stats.lastAsked < 30000);
            if (!recentlyAsked) {
                chosenEntry = entry;
                break;
            }
        }
    }

    // Fallback: if none found, take the first candidate
    if (!chosenEntry) {
        chosenEntry = prioritized[0];
    }

    // Log previous and chosen for verification
    console.log(`[InfinitePractice] previous conceptKey=${prevKey || 'none'}`);
    console.log(`[InfinitePractice] chosen conceptKey=${chosenEntry.conceptKey} points=${chosenEntry.points}`);

    // Update last served concept key
    state.lastInfiniteConceptKey = chosenEntry.conceptKey;

    return chosenEntry.question;
}

// Weighted question selection for adaptive learning
function selectWeightedQuestions(questions, topicIndex) {
    // Skip questions that have reached mastery (concept-level)
    const availableQuestions = questions.filter((q) => {
        return !isQuestionRetired(q);
    });

    // Create array with questions and their weights (concept-level)
    const weightedQuestions = availableQuestions.map((q) => {
        const questionId = getQuestionId(q, topicIndex, q.sourceIndex);
        const weight = getQuestionWeight(q);
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
        
        // Add one canonical variation from each question group
        if (topic.questionGroups) {
            topic.questionGroups.forEach((group, groupIdx) => {
                const canonical = getCanonicalGroupQuestion(group, groupIdx, topicIndex);
                if (canonical) {
                    allQuestions.push(canonical);
                }
            });
        }

        // Remove questions that have hit the mastery cap (concept-level)
        allQuestions = allQuestions.filter((q) => {
            return !isQuestionRetired(q);
        });

        const prioritized = selectAdaptiveSubset(allQuestions, allQuestions.length);
        state.currentQuestions = prioritized.map((entry) => entry.question);

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

    // TEMP DEBUG PANEL: removed after verification

    // Hide feedback
    document.getElementById('feedback').style.display = 'none';

    // Reset selected options for multi-answer questions
    state.selectedOptions = [];

    // Render based on difficulty and question type
    if (state.currentDifficulty === 'normal' || state.isInfinitePracticeMode) {
        // Robust multi-answer detector
        const isMultiAnswer =
            (String(question.type || '').trim().toLowerCase() === 'multipleanswer') ||
            (Array.isArray(question.correctOptions) && question.correctOptions.length > 0) ||
            (Number.isInteger(question.numRequired) && question.numRequired > 1);
        
        if (isMultiAnswer) {
            renderMultipleAnswer(question);
        } else {
            renderMultipleChoice(question);
        }
    } else if (state.currentDifficulty === 'hard') {
        renderTextInput();
    }
}

// TEMP DEBUG PANEL: removed after verification

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

    // Submit button (created once, enabled when ready)
    const submitBtn = document.createElement('button');
    submitBtn.className = 'option submit-multi-answer';
    submitBtn.textContent = 'Submit Answers';
    submitBtn.style.cssText = 'background-color: #3ba55d; border-color: #3ba55d; margin-top: 1rem; opacity: 0.6;';
    submitBtn.disabled = true;
    submitBtn.addEventListener('click', () => {
        if (!submitBtn.disabled) {
            checkAnswer([...state.selectedOptions]);
        }
    });

    // Helper to update submit state
    const updateSubmitState = () => {
        const ready = state.selectedOptions.length === numAnswers;
        submitBtn.disabled = !ready;
        submitBtn.style.opacity = ready ? '1' : '0.6';
    };

    // Create options
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.dataset.selected = 'false';
        
        btn.addEventListener('click', () => {
            if (btn.classList.contains('disabled')) return;
            
            const isSelected = btn.dataset.selected === 'true';
            if (isSelected) {
                btn.dataset.selected = 'false';
                btn.classList.remove('selected');
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                const index = state.selectedOptions.indexOf(option);
                if (index > -1) state.selectedOptions.splice(index, 1);
            } else {
                if (state.selectedOptions.length < numAnswers) {
                    btn.dataset.selected = 'true';
                    btn.classList.add('selected');
                    btn.style.backgroundColor = '#5865f2';
                    btn.style.borderColor = '#5865f2';
                    state.selectedOptions.push(option);
                }
            }
            
            updateSubmitState();
        });
        
        container.appendChild(btn);
    });

    // Append submit button after options
    container.appendChild(submitBtn);
    updateSubmitState();
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
    console.log("checkAnswer loaded from app.js - build marker v1");
    // Use stored current question (for both regular and infinite practice modes)
    const question = state.currentQuestion || state.currentQuestions[state.currentQuestionIndex];
    
    const isMultiAnswer =
        (String(question.type || '').trim().toLowerCase() === 'multipleanswer') ||
        (Array.isArray(question.correctOptions) && question.correctOptions.length > 0) ||
        (Number.isInteger(question.numRequired) && question.numRequired > 1);
    
    if (isMultiAnswer && !Array.isArray(userAnswer)) {
        console.warn("Blocked premature multi-answer evaluation", question);
        return;
    }
    
    const correctAnswer =
        question.type === 'multipleAnswer'
            ? (Array.isArray(question.correctOptions) ? question.correctOptions : [])
            : (question.answer || question.answers);

    let isCorrect = false;

    if (state.currentDifficulty === 'normal') {
        // Handle multiple answer questions
        if (question.type === 'multipleAnswer') {
            const correctOptions = Array.isArray(question.correctOptions) ? question.correctOptions : Array.isArray(correctAnswer) ? correctAnswer : [];
            const required = question.numRequired || correctOptions.length || 2;
            const userSelections = userAnswer; // Already validated as array above

            // Correct if the user selected exactly the required count and all selections are in the correct set
            isCorrect = userSelections.length === required && userSelections.every(ans => correctOptions.includes(ans));
            
            // Highlight options
            const options = document.querySelectorAll('.option:not(.submit-multi-answer)');
            options.forEach(opt => {
                opt.classList.add('disabled');
                opt.style.backgroundColor = '';
                opt.style.borderColor = '';
                opt.dataset.selected = 'false';
                
                if (correctOptions.includes(opt.textContent)) {
                    opt.classList.add('correct');
                }
                if (userSelections.includes(opt.textContent) && !correctOptions.includes(opt.textContent)) {
                    opt.classList.add('incorrect');
                }
            });
            
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
    // Use concept-level key so all variants of same concept share score
    const conceptKey = getConceptKey(question);
    const questionId = getQuestionId(question, 
        (typeof question.topicIndex === 'number' ? question.topicIndex : state.currentTopicIndex),
        question.sourceIndex
    );
    
    updateQuestionStats(conceptKey, isCorrect);
    // Runtime assertion: verify concept-level stats entry exists and log summary
    const statsAfter = state.questionStats[conceptKey];
    if (statsAfter) {
        console.log(`[StatsUpdate] ${conceptKey} correct=${statsAfter.correct} incorrect=${statsAfter.incorrect} points=${statsAfter.points} lastAsked=${statsAfter.lastAsked}`);
    } else {
        console.warn(`[StatsUpdateMissing] ${conceptKey}`, question);
    }

    // Show feedback
    showFeedback(isCorrect, correctAnswer, userAnswer, question);
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
function showFeedback(isCorrect, correctAnswer, userAnswer, question) {
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

        // Show the right answer depending on question type
        if (question?.type === 'multipleAnswer') {
            const answersArray = Array.isArray(question.correctOptions)
                ? question.correctOptions
                : Array.isArray(question.answers)
                    ? question.answers
                    : Array.isArray(correctAnswer)
                        ? correctAnswer
                        : correctAnswer
                            ? [correctAnswer]
                            : [];

            const cleanAnswers = answersArray.filter(Boolean);
            let answerText = '';
            if (cleanAnswers.length === 0) {
                answerText = '(no correct answers provided)';
            } else if (cleanAnswers.length === 1) {
                answerText = cleanAnswers[0];
            } else if (cleanAnswers.length === 2) {
                answerText = `${cleanAnswers[0]} and ${cleanAnswers[1]}`;
            } else {
                // Oxford-comma style list for 3+ items
                const last = cleanAnswers[cleanAnswers.length - 1];
                answerText = `${cleanAnswers.slice(0, -1).join(', ')}, and ${last}`;
            }

            const selectHint = question.numRequired ? ` (select ${question.numRequired})` : '';
            correctAnswerEl.textContent = `The correct answers${selectHint}: ${answerText}`;
        } else {
            // Default to single-answer multiple choice
            const answerText = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
            correctAnswerEl.textContent = `The correct answer is: ${answerText}`;
        }
    }
    
    // Display fact from feedback (shown for both correct and incorrect answers)
    const fact = question?.feedback?.fact;
    let factEl = document.getElementById('feedbackFact');
    
    if (fact) {
        if (!factEl) {
            // Create fact element if it doesn't exist
            factEl = document.createElement('div');
            factEl.id = 'feedbackFact';
            factEl.className = 'feedback-fact';
            feedback.appendChild(factEl);
        }
        factEl.textContent = `📖 ${fact}`;
        factEl.style.display = 'block';
    } else if (factEl) {
        factEl.style.display = 'none';
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
        const isCorrect = response === 'correct';
        const conceptKey = getConceptKey(question);
        updateQuestionStats(conceptKey, isCorrect);
        
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

// Consolidate any non-concept keys into concept-level stats
function unifyStatsToConceptKeys() {
    try {
        if (!state.questionStats || Object.keys(state.questionStats).length === 0) return;
        const topics = state.topics || [];
        let changed = false;
        const newStats = { ...state.questionStats };

        for (const [key, entry] of Object.entries(state.questionStats)) {
            if (key.startsWith('concept_')) continue;

            let conceptKey = null;
            // New ID format: <conceptId>_v<variant>
            const m = key.match(/^(.+)_v\d+$/);
            if (m) {
                conceptKey = `concept_${m[1]}`;
            } else {
                // Group key format: <topicIndex>_group_<groupId>
                const gm = key.match(/^(\d+)_group_(.+)$/);
                if (gm) {
                    const tIdx = Number(gm[1]);
                    const groupId = gm[2];
                    const topic = topics[tIdx];
                    if (topic && Array.isArray(topic.questionGroups)) {
                        const group = topic.questionGroups.find(g => String(g.id) === String(groupId));
                        if (group && group.variations && group.variations[0]) {
                            const canonical = group.variations[0];
                            const canonicalWithMeta = { ...canonical, groupId: group.id, topicIndex: tIdx, sourceIndex: `group_${topic.questionGroups.indexOf(group)}` };
                            const maybeKey = canonical.conceptId ? getConceptKey(canonicalWithMeta) : key;
                            if (maybeKey && maybeKey.startsWith('concept_')) {
                                conceptKey = maybeKey;
                            }
                        }
                    }
                }
            }

            if (conceptKey && conceptKey !== key) {
                const existing = newStats[conceptKey] || { correct: 0, incorrect: 0, lastAsked: null, points: 0 };
                existing.correct += (entry.correct || 0);
                existing.incorrect += (entry.incorrect || 0);
                existing.points += (entry.points || 0);
                if (!existing.lastAsked || (entry.lastAsked && entry.lastAsked > existing.lastAsked)) {
                    existing.lastAsked = entry.lastAsked || existing.lastAsked;
                }
                if (existing.points > 100) existing.points = 100;
                newStats[conceptKey] = existing;
                delete newStats[key];
                changed = true;
            }
        }

        if (changed) {
            state.questionStats = newStats;
            console.log('[StatsUnify] Consolidated to concept-level keys');
            saveQuestionStats();
        }
    } catch (e) {
        console.error('[StatsUnify] Failed:', e);
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

    // Run migrations: normalize legacy keys and unify to concept-level
    if (!state._statsMigrated) {
        migrateLegacyQuestionStats();
        unifyStatsToConceptKeys();
        state._statsMigrated = true;
    }
    
    // Get all questions with stats (concept-level; avoid duplicates)
    const byConcept = new Map(); // conceptKey -> { questionText, stats }

    state.topics.forEach((topic, tIdx) => {
        // Regular questions
        if (topic.questions) {
            topic.questions.forEach((q, qIdx) => {
                const conceptKey = getConceptKey(q);
                const stats = state.questionStats[conceptKey] || null;
                if (!stats) return; // Only include attempted concepts
                if (!byConcept.has(conceptKey)) {
                    const displayQuestion = q.question;
                    byConcept.set(conceptKey, { question: displayQuestion, stats });
                }
            });
        }

        // Question groups (treated as one unit; prefer canonical variant)
        if (topic.questionGroups) {
            topic.questionGroups.forEach((group, groupIdx) => {
                if (group.variations && group.variations.length > 0) {
                    const canonical = group.variations[0];
                    const canonicalWithMeta = { ...canonical, groupId: group.id, sourceIndex: `group_${groupIdx}`, topicIndex: tIdx };
                    // Prefer concept-level key if available; else use stable group key
                    const conceptKey = canonical.conceptId ? getConceptKey(canonicalWithMeta) : getQuestionId({ groupId: group.id }, tIdx, null);
                    const stats = state.questionStats[conceptKey] || null;
                    if (!stats) return;
                    if (!byConcept.has(conceptKey)) {
                        const displayQuestion = group.baseQuestion || canonical.question;
                        byConcept.set(conceptKey, { question: displayQuestion, stats });
                    }
                }
            });
        }
    });

    // Build array for rendering
    const questionStats = Array.from(byConcept.values()).map(({ question, stats }) => {
        const total = (stats.correct || 0) + (stats.incorrect || 0);
        const accuracy = total > 0 ? ((stats.correct || 0) / total * 100) : 0;
        return {
            question,
            correct: stats.correct || 0,
            incorrect: stats.incorrect || 0,
            accuracy,
            total,
            points: stats.points || 0
        };
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

