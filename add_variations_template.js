// Helper script to add question variations easily
// This template makes it easy to add new variations to any topic

const fs = require('fs');

// Load topics
const topicsData = JSON.parse(fs.readFileSync('topics.json', 'utf8'));

// ==========================================
// CONFIGURE YOUR VARIATIONS HERE
// ==========================================

// 1. Find the topic by title (exact match)
const TOPIC_TITLE = "Leisure";  // Change this to your topic

// 2. Add your question groups with variations
const NEW_QUESTION_GROUPS = [
    {
        "topic": "Bonfire Night Date",
        "variations": [
            {
                "type": "multiple",
                "question": "When is Bonfire Night?",
                "options": ["31 October", "5 November", "25 December", "1 January"],
                "answer": "5 November"
            },
            {
                "type": "boolean",
                "question": "Bonfire Night is celebrated on 5 November.",
                "answer": true
            },
            {
                "type": "boolean",
                "question": "Guy Fawkes Night takes place on 31 October.",
                "answer": false
            },
            {
                "type": "multiple",
                "question": "On which date do people celebrate Guy Fawkes Night?",
                "options": ["5 November", "31 October", "1 November", "11 November"],
                "answer": "5 November"
            }
        ]
    },
    {
        "topic": "Guy Fawkes History",
        "variations": [
            {
                "type": "multiple",
                "question": "What happened on 5 November 1605?",
                "options": [
                    "The Great Fire of London",
                    "Guy Fawkes tried to blow up Parliament",
                    "The Battle of Trafalgar",
                    "The signing of the Magna Carta"
                ],
                "answer": "Guy Fawkes tried to blow up Parliament"
            },
            {
                "type": "boolean",
                "question": "Guy Fawkes attempted to blow up the Houses of Parliament in 1605.",
                "answer": true
            },
            {
                "type": "multiple",
                "question": "What was Guy Fawkes trying to do in 1605?",
                "options": [
                    "Burn down London",
                    "Blow up Parliament",
                    "Assassinate the Queen",
                    "Start a revolution"
                ],
                "answer": "Blow up Parliament"
            }
        ]
    }
];

// ==========================================
// SCRIPT EXECUTION (DON'T MODIFY BELOW)
// ==========================================

// Find the topic
const topic = topicsData.find(t => t.title === TOPIC_TITLE);

if (!topic) {
    console.error(`❌ Topic "${TOPIC_TITLE}" not found!`);
    console.log('\nAvailable topics:');
    topicsData.forEach(t => console.log(`  - ${t.title}`));
    process.exit(1);
}

// Initialize questionGroups if needed
if (!topic.questionGroups) {
    topic.questionGroups = [];
}

// Add the new question groups
NEW_QUESTION_GROUPS.forEach(group => {
    topic.questionGroups.push(group);
    console.log(`✓ Added question group: "${group.topic}" with ${group.variations.length} variations`);
});

// Save back to file
fs.writeFileSync('topics.json', JSON.stringify(topicsData, null, 2), 'utf8');

console.log(`\n✓ Successfully added ${NEW_QUESTION_GROUPS.length} question groups to "${TOPIC_TITLE}"`);
console.log(`\nTopic now has:`);
console.log(`  - ${topic.questions ? topic.questions.length : 0} regular questions`);
console.log(`  - ${topic.questionGroups ? topic.questionGroups.length : 0} question groups`);

// Calculate total variations
let totalVariations = 0;
if (topic.questionGroups) {
    topic.questionGroups.forEach(g => totalVariations += g.variations.length);
}
console.log(`  - ${totalVariations} total question variations`);
