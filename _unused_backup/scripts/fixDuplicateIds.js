const fs = require('fs');
const path = require('path');

console.log('=== Fixing Duplicate Question IDs ===\n');

const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');
const backupPath = path.join(__dirname, '..', 'data', 'questions.backup.json');

// Read questions
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
console.log(`Total questions loaded: ${questions.length}\n`);

// Create backup
fs.writeFileSync(backupPath, JSON.stringify(questions, null, 2));
console.log(`✓ Backup created: data/questions.backup.json\n`);

// Step 1: Standardize all IDs to strings and check for duplicates
console.log('Step 1: Analyzing current IDs...');
const idMap = new Map();
questions.forEach((q, idx) => {
    const id = String(q.id);
    if (!idMap.has(id)) {
        idMap.set(id, []);
    }
    idMap.get(id).push(idx);
});

const duplicates = Array.from(idMap.entries()).filter(([id, indices]) => indices.length > 1);
console.log(`  Unique IDs: ${idMap.size}`);
console.log(`  Duplicates found: ${duplicates.length}\n`);

if (duplicates.length > 0) {
    console.log('❌ Duplicate IDs detected:');
    duplicates.forEach(([id, indices]) => {
        console.log(`  ID "${id}" appears at indices: [${indices.join(', ')}]`);
    });
    console.log();
}

// Step 2: Rebuild IDs using conceptId + variant pattern
console.log('Step 2: Rebuilding IDs using <conceptId>_v<variant> pattern...');

// Group questions by conceptId
const conceptGroups = new Map();
questions.forEach((q, idx) => {
    const conceptId = q.conceptId || `concept_${idx}`;
    if (!conceptGroups.has(conceptId)) {
        conceptGroups.set(conceptId, []);
    }
    conceptGroups.get(conceptId).push({ question: q, index: idx });
});

console.log(`  Found ${conceptGroups.size} unique concepts\n`);

// Track ID changes
const idChanges = [];
const usedIds = new Set();

// Regenerate IDs for each concept group
conceptGroups.forEach((group, conceptId) => {
    // Sort by variant number (0 first)
    group.sort((a, b) => (a.question.variant || 0) - (b.question.variant || 0));
    
    group.forEach(({ question, index }, variantIndex) => {
        const oldId = String(question.id);
        const newId = `${conceptId}_v${question.variant ?? variantIndex}`;
        
        // Ensure uniqueness (edge case: if somehow we generate a duplicate, append index)
        let finalId = newId;
        let suffix = 0;
        while (usedIds.has(finalId)) {
            suffix++;
            finalId = `${newId}_${suffix}`;
        }
        
        if (oldId !== finalId) {
            idChanges.push({
                index,
                oldId,
                newId: finalId,
                conceptId,
                variant: question.variant,
                question: question.question.substring(0, 60) + '...'
            });
        }
        
        // Update question
        question.id = finalId;
        usedIds.add(finalId);
        
        // Update variantOf to point to canonical (v0) question
        const canonicalId = `${conceptId}_v0`;
        question.variantOf = canonicalId;
    });
});

console.log(`Step 3: Applied ${idChanges.length} ID changes\n`);

if (idChanges.length > 0) {
    console.log('Sample ID changes (first 10):');
    idChanges.slice(0, 10).forEach(change => {
        console.log(`  [${change.index}] "${change.oldId}" -> "${change.newId}"`);
        console.log(`      ConceptId: ${change.conceptId}, Variant: ${change.variant}`);
        console.log(`      Question: ${change.question}`);
    });
    console.log();
}

// Step 4: Validate uniqueness
console.log('Step 4: Validating uniqueness...');
const finalIds = questions.map(q => q.id);
const uniqueFinalIds = new Set(finalIds);

if (uniqueFinalIds.size === questions.length) {
    console.log(`  ✓ All ${questions.length} question IDs are now unique\n`);
} else {
    console.error(`  ❌ FAILED: ${questions.length} questions but only ${uniqueFinalIds.size} unique IDs\n`);
    process.exit(1);
}

// Step 5: Write updated questions
console.log('Step 5: Writing updated questions.json...');
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
console.log('  ✓ File updated successfully\n');

// Summary
console.log('=== SUMMARY ===');
console.log(`Total questions: ${questions.length}`);
console.log(`Unique concepts: ${conceptGroups.size}`);
console.log(`IDs changed: ${idChanges.length}`);
console.log(`All IDs unique: ✓`);
console.log(`All IDs are strings: ✓`);
console.log(`variantOf updated: ✓`);
console.log('\n✓ ID fixing complete!');
console.log('\nBackup available at: data/questions.backup.json');
console.log('To restore: cp data/questions.backup.json data/questions.json');
