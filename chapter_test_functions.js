// Add these functions to the end of script.js

// ===== CHAPTER TEST FUNCTIONS =====

// Start chapter test
function startChapterTest() {
    if (!currentChapter) return;
    
    chapterTestActive = true;
    chapterTestIndex = 0;
    chapterTestScore = 0;
    
    // Select 5-8 random questions from the chapter
    const numQuestions = Math.min(8, currentChapter.questions.length);
    chapterTestQuestions = [...currentChapter.questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, numQuestions);
    
    // Show test modal
    document.getElementById('chapterTestModal').classList.add('show');
    loadChapterTestQuestion();
}

// Load chapter test question
function loadChapterTestQuestion() {
    const question = chapterTestQuestions[chapterTestIndex];
    const testContent = document.getElementById('chapterTestContent');
    
    // Update progress
    document.getElementById('testProgress').textContent = 
        `Question ${chapterTestIndex + 1} of ${chapterTestQuestions.length}`;
    
    // Build question HTML
    testContent.innerHTML = `
        <div class="test-question-card">
            <div class="test-category-badge">${question.category}</div>
            <h3 class="test-question">${question.question}</h3>
            <div class="test-options" id="testOptions">
                ${question.options.map((option, index) => `
                    <button class="test-option" onclick="selectTestAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
            <div class="test-feedback" id="testFeedback"></div>
        </div>
    `;
}

// Select test answer
function selectTestAnswer(selectedIndex) {
    const question = chapterTestQuestions[chapterTestIndex];
    const isCorrect = selectedIndex === question.correct;
    const options = document.querySelectorAll('.test-option');
    
    // Disable all options
    options.forEach((opt, idx) => {
        opt.disabled = true;
        if (idx === question.correct) {
            opt.classList.add('correct');
        }
        if (idx === selectedIndex && !isCorrect) {
            opt.classList.add('wrong');
        }
    });
    
    // Show feedback
    const feedback = document.getElementById('testFeedback');
    if (isCorrect) {
        chapterTestScore++;
        feedback.innerHTML = `
            <div class="feedback-correct">
                ✅ Correct! ${question.explanation}
            </div>
        `;
    } else {
        feedback.innerHTML = `
            <div class="feedback-wrong">
                ❌ Incorrect. ${question.explanation}
            </div>
        `;
    }
    
    // Show next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-next-test';
    nextBtn.textContent = chapterTestIndex < chapterTestQuestions.length - 1 ? 'Next Question →' : 'See Results';
    nextBtn.onclick = nextTestQuestion;
    feedback.appendChild(nextBtn);
}

// Next test question
function nextTestQuestion() {
    chapterTestIndex++;
    
    if (chapterTestIndex < chapterTestQuestions.length) {
        loadChapterTestQuestion();
    } else {
        showChapterTestResults();
    }
}

// Show chapter test results
function showChapterTestResults() {
    const percentage = Math.round((chapterTestScore / chapterTestQuestions.length) * 100);
    const passed = percentage === 100;
    
    const testContent = document.getElementById('chapterTestContent');
    testContent.innerHTML = `
        <div class="test-results">
            <div class="test-score-circle ${passed ? 'passed' : 'failed'}">
                <div class="score-number">${percentage}%</div>
                <div class="score-label">${chapterTestScore}/${chapterTestQuestions.length}</div>
            </div>
            
            <h2 class="test-result-title">
                ${passed ? '🎉 Perfect Score!' : '📚 Not Quite There'}
            </h2>
            
            <p class="test-result-message">
                ${passed 
                    ? `Congratulations! You've mastered Chapter ${currentChapter.order}. The next chapter is now unlocked!`
                    : `You need 100% to unlock the next chapter. Review the material and try again. You got ${chapterTestScore} out of ${chapterTestQuestions.length} questions correct.`
                }
            </p>
            
            <div class="test-result-buttons">
                ${passed 
                    ? `<button class="btn-continue" onclick="unlockNextChapter()">Continue to Next Chapter →</button>`
                    : `<button class="btn-retry" onclick="retryChapterTest()">Try Again</button>
                       <button class="btn-review" onclick="reviewChapter()">Review Chapter</button>`
                }
            </div>
        </div>
    `;
}

// Unlock next chapter
function unlockNextChapter() {
    const nextChapterOrder = currentChapter.order + 1;
    
    if (!unlockedChapters.includes(nextChapterOrder)) {
        unlockedChapters.push(nextChapterOrder);
        saveProgress();
        renderChapterNavigation();
    }
    
    // Close modal
    document.getElementById('chapterTestModal').classList.remove('show');
    
    // Load next chapter if it exists
    const nextChapter = chapters.find(c => c.order === nextChapterOrder);
    if (nextChapter) {
        loadChapter(nextChapter.id);
    } else {
        // All chapters complete!
        alert('🎊 Congratulations! You\'ve completed all chapters! You\'re ready for the real exam!');
        goHome();
    }
}

// Retry chapter test
function retryChapterTest() {
    startChapterTest();
}

// Review chapter
function reviewChapter() {
    document.getElementById('chapterTestModal').classList.remove('show');
    currentStudyIndex = 0;
    loadStudyCard();
}

// Close chapter test modal
function closeChapterTest() {
    document.getElementById('chapterTestModal').classList.remove('show');
    chapterTestActive = false;
}
