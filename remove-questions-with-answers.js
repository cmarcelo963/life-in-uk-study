const fs = require('fs');
const path = require('path');

// Read questions.json
const questionsPath = path.join(__dirname, 'data', 'questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Total questions before filtering: ${questions.length}`);

// Filter function: check if answer appears in question text
function containsAnswer(question) {
    const questionText = (question.question || '').toLowerCase();
    const answer = (question.answer || '').toLowerCase();
    
    // Skip if answer is too short (avoid false positives)
    if (!answer || answer.length <= 2) {
        return false;
    }
    
    // Check if answer appears in question
    if (questionText.includes(answer)) {
        return true;
    }
    
    // For multi-answer questions, check if any correct option appears
    if (question.correctOptions && Array.isArray(question.correctOptions)) {
        for (const correctOption of question.correctOptions) {
            const optionText = (correctOption || '').toLowerCase();
            if (optionText.length > 2 && questionText.includes(optionText)) {
                return true;
            }
        }
    }
    
    return false;
}

// Find questions that contain their answers
const questionsToRemove = questions.filter(q => containsAnswer(q));
const validQuestions = questions.filter(q => !containsAnswer(q));

console.log(`\n=== Questions containing their answers (${questionsToRemove.length}) ===`);
questionsToRemove.forEach((q, idx) => {
    console.log(`\n${idx + 1}. ID: ${q.id}`);
    console.log(`   Question: ${q.question}`);
    console.log(`   Answer: ${q.answer}`);
    if (q.correctOptions) {
        console.log(`   Correct Options: ${q.correctOptions.join(', ')}`);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Total questions: ${questions.length}`);
console.log(`Questions to remove: ${questionsToRemove.length}`);
console.log(`Remaining questions: ${validQuestions.length}`);

// Create backup
const backupPath = path.join(__dirname, 'data', 'questions.backup-before-answer-removal.json');
fs.writeFileSync(backupPath, JSON.stringify(questions, null, 2));
console.log(`\nBackup created: ${backupPath}`);

// Save filtered questions
fs.writeFileSync(questionsPath, JSON.stringify(validQuestions, null, 2));
console.log(`\nUpdated questions.json saved with ${validQuestions.length} questions`);
