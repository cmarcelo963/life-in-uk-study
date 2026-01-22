const fs = require('fs');
const path = require('path');

console.log('=== Testing Stats Migration Logic ===\n');

// Simulate old stats with numeric IDs
const mockOldStats = {
    '1': { correct: 5, incorrect: 2, points: 1, lastAsked: Date.now() - 1000 },
    '2': { correct: 3, incorrect: 1, points: 1, lastAsked: Date.now() - 2000 },
    '251': { correct: 2, incorrect: 4, points: -6, lastAsked: Date.now() - 500 }, // variant 1 of concept 1
    '10_v0': { correct: 10, incorrect: 0, points: 10, lastAsked: Date.now() }, // Already new format
};

// Load actual question data for mapping
const questions = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));

// Build ID mapping (simulating what app.js does)
const idMapping = new Map();
questions.forEach(q => {
    if (q.id && q.conceptId) {
        const oldId = String(q.conceptId);
        const newId = String(q.id);
        if (!oldId.includes('_v')) {
            idMapping.set(oldId, newId);
        }
    }
});

console.log('Sample ID mappings:');
Array.from(idMapping.entries()).slice(0, 5).forEach(([old, newId]) => {
    console.log(`  ${old} -> ${newId}`);
});
console.log();

// Simulate migration
console.log('Migrating mock stats...');
console.log('Old stats:', JSON.stringify(mockOldStats, null, 2));
console.log();

const migratedStats = {};
let migratedCount = 0;
let mergedCount = 0;

Object.entries(mockOldStats).forEach(([oldId, statData]) => {
    if (!oldId.includes('_v') && /^\d+$/.test(oldId)) {
        const newId = idMapping.get(oldId);
        if (newId) {
            if (migratedStats[newId]) {
                // Merge
                migratedStats[newId].correct += statData.correct;
                migratedStats[newId].incorrect += statData.incorrect;
                migratedStats[newId].points += statData.points;
                migratedStats[newId].lastAsked = Math.max(
                    migratedStats[newId].lastAsked,
                    statData.lastAsked
                );
                mergedCount++;
                console.log(`  Merged ${oldId} -> ${newId}`);
            } else {
                migratedStats[newId] = { ...statData };
                migratedCount++;
                console.log(`  Migrated ${oldId} -> ${newId}`);
            }
        }
    } else {
        migratedStats[oldId] = statData;
        console.log(`  Kept ${oldId} (already new format)`);
    }
});

console.log();
console.log('Migrated stats:', JSON.stringify(migratedStats, null, 2));
console.log();
console.log('Summary:');
console.log(`  Migrated: ${migratedCount}`);
console.log(`  Merged: ${mergedCount}`);
console.log(`  Total entries: ${Object.keys(migratedStats).length}`);
console.log();

// Verify specific cases
const concept1Stats = migratedStats['1_v0'];
const concept1Variant = migratedStats['1_v1'];

if (concept1Stats) {
    console.log('✓ Concept 1 (v0) migrated:');
    console.log(`  correct: ${concept1Stats.correct}, incorrect: ${concept1Stats.incorrect}, points: ${concept1Stats.points}`);
}

if (concept1Variant) {
    console.log('✓ Concept 1 (v1) migrated:');
    console.log(`  correct: ${concept1Variant.correct}, incorrect: ${concept1Variant.incorrect}, points: ${concept1Variant.points}`);
}

console.log('\n✓ Migration test complete');
