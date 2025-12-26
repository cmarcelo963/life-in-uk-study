// Question bank - will be loaded from JSON
let questionBank = [];
let chapters = [];

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        chapters = data.chapters;
        
        // Flatten all questions from all chapters
        questionBank = [];
        chapters.forEach(chapter => {
            questionBank.push(...chapter.questions);
        });
        
        console.log(`Loaded ${questionBank.length} questions from ${chapters.length} chapters`);
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to empty array
        questionBank = [];
    }
}

// Game state
let currentMode = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let level = 1;
let totalScore = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let skippedAnswers = 0;
let hasAnswered = false;

// Study mode state
let studyQuestions = [];
let currentStudyIndex = 0;
let currentStudyFilter = 'all';
let currentChapter = null;
let unlockedChapters = [1]; // Array of unlocked chapter orders
let chapterTestActive = false;
let chapterTestQuestions = [];
let chapterTestIndex = 0;
let chapterTestScore = 0;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    loadProgress();
    updateStats();
    renderChapterNavigation();
});

// Save/Load Progress
function saveProgress() {
    const progress = {
        totalScore,
        level,
        streak,
        unlockedChapters
    };
    localStorage.setItem('lifeInUKProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('lifeInUKProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        totalScore = progress.totalScore || 0;
        level = progress.level || 1;
        streak = progress.streak || 0;
        unlockedChapters = progress.unlockedChapters || [1];
    }
}

// Start Quiz
function startQuiz(mode) {
    currentMode = mode;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    skippedAnswers = 0;
    
    // Select questions based on mode
    if (mode === 'quick') {
        currentQuestions = getRandomQuestions(10);
    } else if (mode === 'full') {
        currentQuestions = getRandomQuestions(24);
    } else if (mode === 'category') {
        // For now, just do random. Can expand later.
        currentQuestions = getRandomQuestions(10);
    }
    
    showScreen('quizScreen');
    loadQuestion();
}

// Get random questions
function getRandomQuestions(count) {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Load question
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }
    
    hasAnswered = false;
    const question = currentQuestions[currentQuestionIndex];
    
    // Update UI
    document.getElementById('questionNumber').textContent = 
        `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    document.getElementById('categoryBadge').textContent = question.category;
    document.getElementById('questionText').textContent = question.question;
    
    // Update progress bar
    const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Load options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Hide feedback and next button
    document.getElementById('feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('nextBtn').style.display = 'none';
}

// Select option
function selectOption(index) {
    if (hasAnswered) return;
    
    hasAnswered = true;
    const question = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // Disable all options
    options.forEach(opt => opt.classList.add('disabled'));
    
    // Check if correct
    const isCorrect = index === question.correct;
    
    if (isCorrect) {
        options[index].classList.add('correct');
        correctAnswers++;
        score += 10;
        streak++;
        totalScore += 10;
        
        // Bonus for streak
        if (streak >= 5) {
            score += 5;
            totalScore += 5;
            showAchievement('🔥 5 Streak Bonus! +5 points');
        }
        
        // Show feedback
        showFeedback(true, question.explanation);
    } else {
        options[index].classList.add('wrong');
        options[question.correct].classList.add('correct');
        wrongAnswers++;
        streak = 0;
        
        showFeedback(false, question.explanation);
    }
    
    // Update stats
    updateStats();
    checkLevelUp();
    
    // Show next button
    document.getElementById('nextBtn').style.display = 'inline-block';
}

// Skip question
function skipQuestion() {
    if (hasAnswered) return;
    
    skippedAnswers++;
    streak = 0;
    
    const question = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    options[question.correct].classList.add('correct');
    options.forEach(opt => opt.classList.add('disabled'));
    
    showFeedback(false, "You skipped this question. " + question.explanation);
    hasAnswered = true;
    
    document.getElementById('nextBtn').style.display = 'inline-block';
}

// Show feedback
function showFeedback(isCorrect, explanation) {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = `
        <div class="feedback-title">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</div>
        <div class="feedback-text">${explanation}</div>
    `;
    feedback.classList.add('show', isCorrect ? 'correct' : 'wrong');
}

// Next question
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// Show results
function showResults() {
    const percentage = Math.round((correctAnswers / currentQuestions.length) * 100);
    const passed = percentage >= 75; // Life in UK requires 75% to pass
    
    document.getElementById('scorePercentage').textContent = percentage + '%';
    document.getElementById('scoreText').textContent = passed ? 
        '🎉 You passed! Great job!' : 
        '📚 Keep studying! You need 75% to pass.';
    
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('wrongAnswers').textContent = wrongAnswers;
    document.getElementById('skippedAnswers').textContent = skippedAnswers;
    
    // Update progress bar to 100%
    document.getElementById('progressBar').style.width = '100%';
    
    showScreen('resultsScreen');
    saveProgress();
}

// Restart quiz
function restartQuiz() {
    startQuiz(currentMode);
}

// Go home
function goHome() {
    showScreen('welcomeScreen');
    document.getElementById('progressBar').style.width = '0%';
}

// Update stats
function updateStats() {
    document.getElementById('score').textContent = totalScore;
    document.getElementById('streak').textContent = streak;
    document.getElementById('level').textContent = level;
}

// Check level up
function checkLevelUp() {
    const newLevel = Math.floor(totalScore / 100) + 1;
    if (newLevel > level) {
        level = newLevel;
        showAchievement(`🎉 Level Up! You're now Level ${level}`);
        updateStats();
    }
}

// Show achievement
function showAchievement(text) {
    const toast = document.getElementById('achievementToast');
    toast.querySelector('.achievement-text').textContent = text;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ===== STUDY MODE FUNCTIONS =====

// Render chapter navigation
function renderChapterNavigation() {
    const sidebarChapters = document.getElementById('sidebarChapters');
    if (!sidebarChapters || chapters.length === 0) return;
    
    sidebarChapters.innerHTML = '';
    
    chapters.forEach(chapter => {
        const isUnlocked = unlockedChapters.includes(chapter.order);
        const chapterItem = document.createElement('div');
        chapterItem.className = `chapter-item ${isUnlocked ? '' : 'locked'}`;
        chapterItem.innerHTML = `
            <span class="chapter-number">Chapter ${chapter.order}</span>
            <span class="chapter-title">${chapter.title}</span>
            ${isUnlocked ? '' : '<span class="lock-icon">🔒</span>'}
        `;
        if (isUnlocked) {
            chapterItem.onclick = () => loadChapter(chapter.id);
        }
        sidebarChapters.appendChild(chapterItem);
    });
}

// Load a specific chapter
function loadChapter(chapterId) {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    
    const isUnlocked = unlockedChapters.includes(chapter.order);
    if (!isUnlocked) return; // Can't load locked chapters
    
    currentChapter = chapter;
    currentStudyIndex = 0;
    studyQuestions = chapter.questions;
    
    // Update active chapter in sidebar
    document.querySelectorAll('.chapter-item').forEach((item, index) => {
        item.classList.remove('active');
        if (chapters[index].id === chapterId) {
            item.classList.add('active');
        }
    });
    
    // Hide category filter when in chapter mode
    document.getElementById('categoryFilter').classList.remove('show');
    
    // Show chapter intro (this will handle showing study content when ready)
    showChapterIntro(chapter);
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('studySidebar').classList.remove('open');
    }
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    document.getElementById('studySidebar').classList.toggle('open');
}

// Start study mode
function startStudyMode() {
    currentStudyIndex = 0;
    currentStudyFilter = 'all';
    currentChapter = null;
    
    // Hide category filter controls (using chapter-based navigation instead)
    document.getElementById('categoryFilter').style.display = 'none';
    document.querySelector('.btn-filter').style.display = 'none';
    
    // Load first chapter by default
    if (chapters.length > 0) {
        loadChapter(chapters[0].id);
    } else {
        studyQuestions = [...questionBank];
    }
    
    showScreen('studyScreen');
}

// Load study card
function loadStudyCard() {
    if (studyQuestions.length === 0) {
        document.getElementById('studyQuestion').textContent = 'No content available.';
        return;
    }
    
    const question = studyQuestions[currentStudyIndex];
    
    // Update counter - show chapter info if in chapter mode
    let counterText = `${currentStudyIndex + 1} of ${studyQuestions.length}`;
    if (currentChapter) {
        counterText = `Chapter ${currentChapter.order}: ${counterText}`;
    }
    document.getElementById('studyCounter').textContent = counterText;
    
    // Create narrative story format
    const storyContent = `
        <div class="story-narrative">
            <div class="narrative-icon">${getCategoryIcon(question.category)}</div>
            <h3 class="narrative-title">${question.question}</h3>
            <div class="narrative-content">
                <p class="narrative-text">${question.explanation || 'In this moment of British history, we learn about ' + question.question.toLowerCase()}</p>
                <div class="key-fact">
                    <span class="key-fact-label">📌 Key Fact:</span>
                    <span class="key-fact-text">${question.options[question.correct]}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('studyCategoryBadge').textContent = question.category;
    document.getElementById('studyQuestion').innerHTML = storyContent;
    document.querySelector('.study-answer-section').style.display = 'none';
    document.querySelector('.study-explanation').style.display = 'none';
    document.querySelector('.study-options-preview').style.display = 'none';
    
    // Update navigation buttons
    document.getElementById('prevStudyBtn').disabled = currentStudyIndex === 0;
    
    // Check if this is the last card in the chapter
    if (currentStudyIndex === studyQuestions.length - 1) {
        document.getElementById('nextStudyBtn').style.display = 'none';
        document.getElementById('chapterTestBtn').style.display = 'block';
    } else {
        document.getElementById('nextStudyBtn').style.display = 'block';
        document.getElementById('chapterTestBtn').style.display = 'none';
    }
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'History': '🏛️',
        'Government': '⚖️',
        'Values': '🤝',
        'Culture': '🎨',
        'Geography': '🗺️',
        'Sports': '⚽'
    };
    return icons[category] || '📖';
}

// Navigate study cards
function nextStudyCard() {
    if (currentStudyIndex < studyQuestions.length - 1) {
        currentStudyIndex++;
        loadStudyCard();
    }
}

function previousStudyCard() {
    if (currentStudyIndex > 0) {
        currentStudyIndex--;
        loadStudyCard();
    }
}

// Toggle category filter
function toggleCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    filter.classList.toggle('show');
}

// Filter by category
function filterCategory(category) {
    currentStudyFilter = category;
    currentStudyIndex = 0;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter questions
    if (category === 'all') {
        studyQuestions = [...questionBank];
    } else {
        studyQuestions = questionBank.filter(q => q.category === category);
    }
    
    loadStudyCard();
}

// ===== CHAPTER STORY MODE FUNCTIONS =====

// Get chapter story intro
function getChapterStory(chapter) {
    const stories = {
        1: "🏛️ **Welcome to Ancient and Medieval Britain!**\n\nOur journey begins thousands of years ago, when Britain was first inhabited by ancient peoples. We'll explore the mysterious stone circles they built, the mighty Roman Empire that conquered these lands, and the waves of invaders who shaped the nation. From the Stone Age hunters to the Norman conquest of 1066, this is where Britain's story truly begins...",
        2: "👑 **The Tudor Dynasty and Religious Reformation**\n\nAfter centuries of medieval rule, a new dynasty emerged that would change Britain forever. The Tudors brought drama, intrigue, and revolutionary change. From Henry VIII's six marriages to Elizabeth I's golden age of exploration and Shakespeare's theatre, this chapter reveals how England transformed from a Catholic kingdom into a Protestant power on the world stage...",
        3: "⚔️ **The Stuarts and the English Civil War**\n\nThe 17th century brought turbulent times as kings clashed with Parliament. Witness the Gunpowder Plot, the devastating Civil War that tore families apart, and the execution of a king. From Cromwell's Commonwealth to the Glorious Revolution, discover how these conflicts shaped Britain's constitutional monarchy and planted the seeds of democracy...",
        4: "🎭 **From Restoration to the Georgian Era**\n\nAs Britain rebuilt after civil war, a new age of enlightenment dawned. London rose from the ashes of the Great Fire, science and reason flourished, and the kingdom united. Follow the story through the reigns of the Georges, as Britain lost American colonies but gained an empire, and society transformed through intellectual revolution...",
        5: "🏭 **The Victorian Era and Industrial Revolution**\n\nStep into the age of steam and iron! Britain became the world's first industrial nation, transforming from a rural society into an urban powerhouse. Queen Victoria's long reign saw incredible innovation - railways connecting cities, factories powering an empire, and social reforms improving lives. But progress came with challenges that would echo through generations...",
        6: "💥 **Britain in the 20th Century**\n\nThe modern age brought unprecedented change. Two devastating world wars tested the nation's resolve, Churchill's leadership inspired resistance, and the welfare state was born from post-war reforms. From suffragettes fighting for women's rights to the swinging sixties and Thatcher's reforms, witness Britain's transformation into the country it is today...",
        7: "🏛️ **Understanding UK Government and Politics**\n\nHow does Britain actually govern itself? In this chapter, we'll demystify the political system - from Parliament and the Prime Minister to elections and devolution. Learn how this ancient democracy balances tradition with modern governance, and understand your rights and responsibilities as part of this system...",
        8: "🤝 **British Values and Principles**\n\nWhat makes Britain... British? Beyond history and politics lie the core values that bind this diverse society together. Explore the principles of tolerance, freedom, democracy, and the rule of law. Understand how these values evolved and why they matter in modern British life...",
        9: "🎨 **British Culture and Traditions**\n\nFrom Shakespeare to the Beatles, Dickens to Harry Potter - British culture has shaped the world. Dive into the rich tapestry of arts, literature, music, and customs that make Britain unique. Discover patron saints' days, Burns Night, pantomimes, and the traditions that bring communities together throughout the year...",
        10: "🗺️ **Geography of the United Kingdom**\n\nExplore the physical landscape of this island nation. From the Scottish Highlands to the rolling hills of Wales, from England's bustling cities to Northern Ireland's dramatic coastlines. Learn about the countries that make up the UK, their capitals, populations, and the features that define each region...",
        11: "⚽ **British Sports and Leisure**\n\nBritain gave the world many of its favorite sports! Football, rugby, cricket, tennis - all have British origins. Discover the sporting traditions, major events, and achievements that have made Britain a sporting nation. From Wimbledon to the Premier League, explore how sports unite and entertain the British people..."
    };
    
    return stories[chapter.order] || `📖 **${chapter.title}**\n\nExplore the fascinating facts and stories from this important period in British history.`;
}

// Get chapter image
function getChapterImage(chapter) {
    const images = {
        1: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=800&q=80', // Stonehenge
        2: 'https://images.unsplash.com/photo-1587916606304-e4042b8b8e7a?w=800&q=80', // Tudor architecture
        3: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // Palace/castle
        4: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80', // Georgian architecture
        5: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=80', // Victorian London
        6: 'https://images.unsplash.com/photo-1570297116200-15e43339aac6?w=800&q=80', // WWII memorial
        7: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // Parliament
        8: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // British flag
        9: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // British culture
        10: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80', // UK landscape
        11: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80' // Sports stadium
    };
    return images[chapter.order] || '';
}

// Show chapter intro
function showChapterIntro(chapter) {
    const storyIntro = document.getElementById('chapterStoryIntro');
    const studyCard = document.querySelector('.study-card');
    
    if (!storyIntro) return;
    
    const story = getChapterStory(chapter);
    const imageUrl = getChapterImage(chapter);
    
    document.getElementById('storyTitle').textContent = `Chapter ${chapter.order}: ${chapter.title}`;
    
    // Add image if available
    const storyContent = document.getElementById('storyContent');
    if (imageUrl) {
        storyContent.innerHTML = `
            <img src="${imageUrl}" alt="${chapter.title}" class="story-image" onerror="this.style.display='none'">
            <div class="story-text">${story.replace(/\n/g, '<br>')}</div>
        `;
    } else {
        storyContent.innerHTML = story.replace(/\n/g, '<br>');
    }
    
    // Show intro, hide study card
    storyIntro.style.display = 'block';
    if (studyCard) studyCard.style.display = 'none';
}

// Begin chapter study
function beginChapterStudy() {
    const studyCard = document.querySelector('.study-card');
    
    document.getElementById('chapterStoryIntro').style.display = 'none';
    if (studyCard) studyCard.style.display = 'block';
    
    // Show navigation
    const studyNav = document.querySelector('.study-navigation');
    if (studyNav) studyNav.style.display = 'flex';
    
    // Load the first study card
    loadStudyCard();
}

// Update loadStudyCard to show chapter test button at the end
function loadStudyCard() {
    if (studyQuestions.length === 0) {
        document.getElementById('studyQuestion').textContent = 'No questions available for this category.';
        return;
    }
    
    const question = studyQuestions[currentStudyIndex];
    const isLastCard = currentStudyIndex === studyQuestions.length - 1;
    
    // Update counter
    let counterText = `${currentStudyIndex + 1} of ${studyQuestions.length}`;
    if (currentChapter) {
        counterText = `Chapter ${currentChapter.order}: ${counterText}`;
    }
    document.getElementById('studyCounter').textContent = counterText;
    
    // Update content
    document.getElementById('studyCategoryBadge').textContent = question.category;
    document.getElementById('studyQuestion').textContent = question.question;
    document.getElementById('studyAnswer').textContent = question.options[question.correct];
    document.getElementById('studyExplanation').textContent = question.explanation;
    
    // Show all options
    const optionsPreview = document.getElementById('studyOptionsPreview');
    optionsPreview.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'study-option-item';
        if (index === question.correct) {
            optionDiv.classList.add('correct-option');
        }
        optionDiv.textContent = option;
        optionsPreview.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    document.getElementById('prevStudyBtn').disabled = currentStudyIndex === 0;
    
    // Show chapter test button if at the end of a chapter
    const nextBtn = document.getElementById('nextStudyBtn');
    const testBtn = document.getElementById('chapterTestBtn');
    
    if (currentChapter && isLastCard) {
        nextBtn.style.display = 'none';
        testBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = isLastCard;
        testBtn.style.display = 'none';
    }
}
