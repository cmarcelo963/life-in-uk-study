const fs = require('fs');
const path = require('path');

// Category mapping from new question bank to existing topics
const CATEGORY_MAPPING = {
    'history of the uk': 'A long and illustrious history',
    'a long and illustrious history': 'A long and illustrious history',
    'government, law and your role': 'The UK government, the law and your role',
    'the uk government, the law and your role': 'The UK government, the law and your role',
    'a modern, thriving society': 'A modern, thriving society',
    'values and principles': 'The values and principles of the UK',
    'the values and principles of the uk': 'The values and principles of the UK',
    'what is the uk': 'What is the UK?',
    'what is the uk?': 'What is the UK?',
    // Additional common variations
    'history': 'A long and illustrious history',
    'government': 'The UK government, the law and your role',
    'law': 'The UK government, the law and your role',
    'society': 'A modern, thriving society',
    'values': 'The values and principles of the UK',
    'principles': 'The values and principles of the UK',
};

function mapCategoryToTopic(category, existingTopicTitles) {
    if (!category) return null;
    
    const normalized = category.toLowerCase().trim();
    
    // Check direct mapping
    if (CATEGORY_MAPPING[normalized]) {
        return CATEGORY_MAPPING[normalized];
    }
    
    // Check exact match (case-insensitive) with existing topics
    const exactMatch = existingTopicTitles.find(
        title => title.toLowerCase() === normalized
    );
    if (exactMatch) return exactMatch;
    
    // Check partial match
    for (const title of existingTopicTitles) {
        if (title.toLowerCase().includes(normalized) || normalized.includes(title.toLowerCase())) {
            return title;
        }
    }
    
    return null; // No match found
}

function transformQuestion(newQuestion, conceptIdToCanonicalId) {
    const conceptId = newQuestion.conceptId || `concept_${newQuestion.id}`;
    const variant = newQuestion.variant ?? 0;
    
    // Generate stable ID using conceptId + variant
    const questionId = `${conceptId}_v${variant}`;
    
    // Determine variantOf
    let variantOf;
    if (variant === 0) {
        variantOf = questionId; // Canonical question points to itself
        conceptIdToCanonicalId[conceptId] = questionId;
    } else {
        variantOf = conceptIdToCanonicalId[conceptId] || `${conceptId}_v0`;
    }
    
    return {
        type: 'multiple',
        id: questionId,
        question: newQuestion.question,
        options: newQuestion.options,
        answer: newQuestion.answer,
        generated: true,
        feedback: {
            fact: newQuestion.fact || '',
            whyCorrect: '' // Empty as not provided in new data
        },
        conceptId: conceptId,
        variantOf: variantOf
    };
}

function replaceQuestions() {
    console.log('=== Starting Question Replacement ===\n');
    
    const rootDir = path.join(__dirname, '..');
    const topicsPath = path.join(rootDir, 'topics_grouped.json');
    const backupPath = path.join(rootDir, 'topics_grouped.backup.json');
    const newQuestionsPath = path.join(rootDir, 'life_in_the_uk_full_question_bank_with_variants.json');
    
    // Check if new question bank exists
    if (!fs.existsSync(newQuestionsPath)) {
        console.error(`ERROR: New question bank not found at: ${newQuestionsPath}`);
        console.error('Please ensure life_in_the_uk_full_question_bank_with_variants.json is in the root directory.');
        process.exit(1);
    }
    
    // Read existing topics
    console.log('Reading existing topics...');
    const existingTopics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
    const existingTopicTitles = existingTopics.map(t => t.title);
    
    // Create backup
    console.log('Creating backup...');
    fs.writeFileSync(backupPath, JSON.stringify(existingTopics, null, 2));
    console.log(`✓ Backup saved to: topics_grouped.backup.json\n`);
    
    // Read new question bank
    console.log('Reading new question bank...');
    const newQuestions = JSON.parse(fs.readFileSync(newQuestionsPath, 'utf8'));
    console.log(`✓ Loaded ${newQuestions.length} new questions\n`);
    
    // Initialize mapping structure
    const topicMap = {};
    const unmappedQuestions = [];
    const conceptIdToCanonicalId = {};
    
    // First pass: identify all canonical IDs (variant 0)
    console.log('Processing questions...');
    newQuestions.forEach(q => {
        const conceptId = q.conceptId || `concept_${q.id}`;
        const variant = q.variant ?? 0;
        if (variant === 0) {
            conceptIdToCanonicalId[conceptId] = `${conceptId}_v0`;
        }
    });
    
    // Second pass: transform and map questions to topics
    newQuestions.forEach((q, idx) => {
        const transformedQuestion = transformQuestion(q, conceptIdToCanonicalId);
        const topicTitle = mapCategoryToTopic(q.category, existingTopicTitles);
        
        if (topicTitle) {
            if (!topicMap[topicTitle]) {
                topicMap[topicTitle] = [];
            }
            topicMap[topicTitle].push(transformedQuestion);
        } else {
            unmappedQuestions.push(transformedQuestion);
        }
        
        // Progress indicator
        if ((idx + 1) % 100 === 0) {
            console.log(`  Processed ${idx + 1}/${newQuestions.length} questions...`);
        }
    });
    console.log(`✓ Processed all ${newQuestions.length} questions\n`);
    
    // Replace questions in existing topics
    console.log('Replacing questions in topics...');
    existingTopics.forEach(topic => {
        const newQuestionsForTopic = topicMap[topic.title] || [];
        topic.questions = newQuestionsForTopic;
        console.log(`  ${topic.title}: ${newQuestionsForTopic.length} questions`);
    });
    
    // Handle unmapped questions
    if (unmappedQuestions.length > 0) {
        console.log(`\n⚠ ${unmappedQuestions.length} unmapped questions found`);
        
        let importedTopic = existingTopics.find(t => t.title === 'Imported questions');
        if (!importedTopic) {
            console.log('  Creating "Imported questions" topic...');
            importedTopic = {
                title: 'Imported questions',
                content: 'Questions that could not be automatically mapped to existing topics.',
                questions: []
            };
            existingTopics.push(importedTopic);
        }
        
        importedTopic.questions = unmappedQuestions;
        console.log(`  Added to "Imported questions" topic`);
    }
    
    // Write updated topics
    console.log('\nWriting updated topics...');
    fs.writeFileSync(topicsPath, JSON.stringify(existingTopics, null, 2));
    console.log(`✓ Updated topics_grouped.json\n`);
    
    // Print summary statistics
    console.log('=== SUMMARY ===');
    console.log(`Total topics: ${existingTopics.length}`);
    console.log(`Total questions inserted: ${newQuestions.length}`);
    console.log('\nQuestions per topic:');
    existingTopics.forEach(topic => {
        console.log(`  ${topic.title}: ${topic.questions.length}`);
    });
    if (unmappedQuestions.length > 0) {
        console.log(`\nUnmapped questions: ${unmappedQuestions.length} (moved to "Imported questions")`);
    }
    
    console.log('\n✓ Question replacement complete!');
    console.log('\nNext steps:');
    console.log('1. Review the updated topics_grouped.json');
    console.log('2. If needed, restore from topics_grouped.backup.json');
    console.log('3. Test the app to ensure questions display correctly');
}

// Run the script
try {
    replaceQuestions();
} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
}
