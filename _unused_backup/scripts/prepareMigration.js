const fs = require('fs');
const path = require('path');

console.log('=== Migrating Question Stats to New IDs ===\n');

// Read backup (old IDs) and current (new IDs)
const backupPath = path.join(__dirname, '..', 'data', 'questions.backup.json');
const currentPath = path.join(__dirname, '..', 'data', 'questions.json');

if (!fs.existsSync(backupPath)) {
    console.log('No backup file found - stats migration not needed');
    process.exit(0);
}

const oldQuestions = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const newQuestions = JSON.parse(fs.readFileSync(currentPath, 'utf8'));

console.log(`Old questions: ${oldQuestions.length}`);
console.log(`New questions: ${newQuestions.length}\n`);

// Create mapping: oldId -> newId (by array index)
const idMapping = new Map();
oldQuestions.forEach((oldQ, idx) => {
    const newQ = newQuestions[idx];
    if (oldQ && newQ) {
        const oldId = String(oldQ.id);
        const newId = String(newQ.id);
        idMapping.set(oldId, newId);
    }
});

console.log(`Created mapping for ${idMapping.size} questions\n`);
console.log('Sample mappings:');
Array.from(idMapping.entries()).slice(0, 10).forEach(([oldId, newId]) => {
    console.log(`  ${oldId} -> ${newId}`);
});
console.log();

// Generate migration code for client-side execution
const migrationCode = `
// ========== STATS MIGRATION CODE (Paste in Browser Console) ==========
(function() {
    console.log('=== Migrating Question Stats ===');
    
    const idMapping = new Map(${JSON.stringify(Array.from(idMapping.entries()))});
    
    // Load existing stats
    const statsJson = localStorage.getItem('lifeInUK_questionStats');
    if (!statsJson) {
        console.log('No existing stats found - migration not needed');
        return;
    }
    
    const oldStats = JSON.parse(statsJson);
    const oldKeys = Object.keys(oldStats);
    console.log('Old stats entries:', oldKeys.length);
    
    const newStats = {};
    let migratedCount = 0;
    let unmappedCount = 0;
    
    // Migrate each stat entry
    Object.entries(oldStats).forEach(([oldId, stats]) => {
        const newId = idMapping.get(oldId);
        
        if (newId) {
            // Check if new ID already has stats (concept-level aggregation)
            if (newStats[newId]) {
                // Merge stats
                newStats[newId].correct += stats.correct;
                newStats[newId].incorrect += stats.incorrect;
                newStats[newId].points += stats.points;
                newStats[newId].lastAsked = Math.max(
                    newStats[newId].lastAsked || 0,
                    stats.lastAsked || 0
                );
                console.log(\`Merged stats for \${oldId} -> \${newId}\`);
            } else {
                // Direct migration
                newStats[newId] = { ...stats };
                migratedCount++;
            }
        } else if (!oldId.includes('_v')) {
            // Old numeric ID with no mapping
            console.warn(\`No mapping found for old ID: \${oldId}\`);
            unmappedCount++;
        } else {
            // Already new format, keep as-is
            newStats[oldId] = stats;
        }
    });
    
    console.log(\`\\nMigration complete:\`);
    console.log(\`  Migrated: \${migratedCount} entries\`);
    console.log(\`  Unmapped: \${unmappedCount} entries\`);
    console.log(\`  Total new entries: \${Object.keys(newStats).length}\`);
    
    // Save migrated stats
    localStorage.setItem('lifeInUK_questionStats', JSON.stringify(newStats));
    console.log('\\n✓ Stats migration saved to localStorage');
    console.log('Reload the page to see updated stats');
})();
// ========== END MIGRATION CODE ==========
`;

// Write migration code to file
const migrationPath = path.join(__dirname, '..', 'migrate-stats.js');
fs.writeFileSync(migrationPath, migrationCode.trim());

console.log('=== Migration Code Generated ===\n');
console.log('To migrate stats:');
console.log('1. Open your app in browser');
console.log('2. Open browser console (F12)');
console.log('3. Paste the contents of migrate-stats.js');
console.log('4. Press Enter');
console.log('5. Reload the page\n');
console.log('OR run this one-liner in browser console:\n');

// Create one-liner version
const oneLiner = migrationCode
    .replace(/\/\/ =+.*?=+/g, '')
    .replace(/\s*console\.log\([^)]*\);?\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

console.log(oneLiner.substring(0, 200) + '...');
console.log('\n✓ Migration preparation complete');
console.log('Migration code saved to: migrate-stats.js');
