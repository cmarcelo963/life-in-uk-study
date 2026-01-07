// Script to add question variations to demonstrate the new system
const fs = require('fs');

const topicsData = JSON.parse(fs.readFileSync('topics.json', 'utf8'));

// Find "What is the UK" topic and add question variations
const whatIsUKTopic = topicsData.find(t => t.title === "What is the UK");

if (whatIsUKTopic) {
    // Add questionGroups array if it doesn't exist
    if (!whatIsUKTopic.questionGroups) {
        whatIsUKTopic.questionGroups = [];
    }

    // Add example question variations
    whatIsUKTopic.questionGroups.push(
        // Currency coin variations
        {
            "topic": "UK Coin Currency",
            "variations": [
                {
                    "type": "multiple",
                    "question": "What is the highest coin currency in the UK?",
                    "options": ["50p", "£1", "£2", "£5"],
                    "answer": "£2"
                },
                {
                    "type": "boolean",
                    "question": "£5 is the highest coin currency in the UK.",
                    "answer": false
                },
                {
                    "type": "multiple",
                    "question": "The UK has a few coin currencies available, which is the highest?",
                    "options": ["£1", "£2", "50p", "£5"],
                    "answer": "£2"
                },
                {
                    "type": "multiple",
                    "question": "What is the largest denomination coin in the UK?",
                    "options": ["50 pence", "One pound", "Two pounds", "Five pounds"],
                    "answer": "Two pounds"
                }
            ]
        },
        // Pence in pound variations
        {
            "topic": "Pence in Pound",
            "variations": [
                {
                    "type": "multiple",
                    "question": "How many pence are in a pound?",
                    "options": ["10", "50", "100", "1000"],
                    "answer": "100"
                },
                {
                    "type": "boolean",
                    "question": "There are 100 pence in a pound sterling.",
                    "answer": true
                },
                {
                    "type": "multiple",
                    "question": "One pound sterling equals how many pence?",
                    "options": ["50", "75", "100", "120"],
                    "answer": "100"
                }
            ]
        },
        // Currency symbol variations
        {
            "topic": "Currency Symbol",
            "variations": [
                {
                    "type": "multiple",
                    "question": "What is the symbol for pound sterling?",
                    "options": ["$", "€", "£", "¥"],
                    "answer": "£"
                },
                {
                    "type": "boolean",
                    "question": "The symbol for pound sterling is £.",
                    "answer": true
                },
                {
                    "type": "boolean",
                    "question": "The UK uses the € symbol for its currency.",
                    "answer": false
                }
            ]
        },
        // UK countries variations
        {
            "topic": "UK Countries",
            "variations": [
                {
                    "type": "multiple",
                    "question": "Which countries make up the UK?",
                    "options": [
                        "England, Scotland, Wales, Northern Ireland",
                        "England, Scotland, Wales, Ireland",
                        "England, Scotland, Ireland",
                        "England, Wales, Northern Ireland"
                    ],
                    "answer": "England, Scotland, Wales, Northern Ireland"
                },
                {
                    "type": "boolean",
                    "question": "The UK consists of England, Scotland, Wales, and all of Ireland.",
                    "answer": false
                },
                {
                    "type": "boolean",
                    "question": "The UK is made up of four countries: England, Scotland, Wales, and Northern Ireland.",
                    "answer": true
                },
                {
                    "type": "multiple",
                    "question": "How many countries form the United Kingdom?",
                    "options": ["Two", "Three", "Four", "Five"],
                    "answer": "Four"
                }
            ]
        },
        // Capital cities variations
        {
            "topic": "Capital of UK",
            "variations": [
                {
                    "type": "multiple",
                    "question": "What is the capital city of the UK?",
                    "options": ["Edinburgh", "Cardiff", "London", "Belfast"],
                    "answer": "London"
                },
                {
                    "type": "boolean",
                    "question": "London is the capital city of the United Kingdom.",
                    "answer": true
                },
                {
                    "type": "boolean",
                    "question": "Edinburgh is the capital of the UK.",
                    "answer": false
                }
            ]
        }
    );

    console.log(`Added ${whatIsUKTopic.questionGroups.length} question groups with variations to "What is the UK"`);
}

// Find "A modern, thriving society" and add variations
const modernSocietyTopic = topicsData.find(t => t.title === "A modern, thriving society");

if (modernSocietyTopic) {
    if (!modernSocietyTopic.questionGroups) {
        modernSocietyTopic.questionGroups = [];
    }

    modernSocietyTopic.questionGroups.push(
        // England population percentage
        {
            "topic": "England Population",
            "variations": [
                {
                    "type": "multiple",
                    "question": "What percentage of the UK population makes up England?",
                    "options": ["64%", "74%", "84%", "94%"],
                    "answer": "84%"
                },
                {
                    "type": "boolean",
                    "question": "England makes up approximately 84% of the UK's total population.",
                    "answer": true
                },
                {
                    "type": "boolean",
                    "question": "More than 90% of the UK population lives in England.",
                    "answer": false
                }
            ]
        },
        // Age demographics
        {
            "topic": "Age Demographics",
            "variations": [
                {
                    "type": "multiple",
                    "question": "What percentage of the UK population is aged 19 or under?",
                    "options": ["15%", "20%", "25%", "30%"],
                    "answer": "25%"
                },
                {
                    "type": "boolean",
                    "question": "Approximately 25% of the UK population is aged 19 or under.",
                    "answer": true
                },
                {
                    "type": "multiple",
                    "question": "What percentage of the UK population is aged 65 or over?",
                    "options": ["10%", "15%", "20%", "25%"],
                    "answer": "20%"
                },
                {
                    "type": "boolean",
                    "question": "About 20% of the UK population is aged 65 or over.",
                    "answer": true
                }
            ]
        }
    );

    console.log(`Added ${modernSocietyTopic.questionGroups.length} question groups with variations to "A modern, thriving society"`);
}

// Write back to file
fs.writeFileSync('topics.json', JSON.stringify(topicsData, null, 2), 'utf8');

console.log('\n✓ Question variations added successfully!');
console.log('  - Multiple choice variations');
console.log('  - True/False variations');
console.log('  - Different wording for same concepts');
console.log('\nThe quiz will now randomly select one variation per question group.');
