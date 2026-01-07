const fs = require('fs');

// Load existing topics
const topics = JSON.parse(fs.readFileSync('topics.json', 'utf8'));

// Find topic by title
function findTopic(title) {
    return topics.find(t => t.title === title);
}

// Add variations to multiple topics
const allVariations = {
    "What is the UK": [
        {
            groupTitle: "UK Formation Year",
            variations: [
                { question: "In what year was the United Kingdom formed?", options: ["1707", "1801", "1603", "1066"], answer: "1707", type: "multiple" },
                { question: "When did the UK officially come into existence?", options: ["1707", "1801", "1603", "1066"], answer: "1707", type: "multiple" },
                { question: "The UK was formed in 1707.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Northern Ireland Status",
            variations: [
                { question: "When did Northern Ireland join the UK?", options: ["1921", "1801", "1707", "1922"], answer: "1921", type: "multiple" },
                { question: "Northern Ireland has been part of the UK since which year?", options: ["1921", "1801", "1707", "1922"], answer: "1921", type: "multiple" },
                { question: "Northern Ireland joined the UK in 1921.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Wales Joining England",
            variations: [
                { question: "When was Wales united with England?", options: ["1500s", "1600s", "1400s", "1700s"], answer: "1500s", type: "multiple" },
                { question: "Wales became part of the Kingdom of England during which century?", options: ["16th century (1500s)", "17th century (1600s)", "15th century (1400s)", "18th century (1700s)"], answer: "16th century (1500s)", type: "multiple" },
                { question: "Wales was united with England in the 1500s.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "England Area",
            variations: [
                { question: "What percentage of the UK's total area is England?", options: ["84%", "74%", "64%", "54%"], answer: "84%", type: "multiple" },
                { question: "England covers approximately what portion of the UK?", options: ["84%", "74%", "64%", "54%"], answer: "84%", type: "multiple" },
                { question: "England makes up 84% of the UK's total area.", answer: true, type: "boolean" }
            ]
        }
    ],
    
    "A long and illustrious history": [
        {
            groupTitle: "Stone Age Britain",
            variations: [
                { question: "When did Stone Age people first come to Britain?", options: ["10,000 years ago", "5,000 years ago", "15,000 years ago", "20,000 years ago"], answer: "10,000 years ago", type: "multiple" },
                { question: "Stone Age people arrived in Britain approximately how many years ago?", options: ["10,000 years ago", "5,000 years ago", "15,000 years ago", "20,000 years ago"], answer: "10,000 years ago", type: "multiple" },
                { question: "Stone Age people first came to Britain around 10,000 years ago.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Stonehenge Construction",
            variations: [
                { question: "When was Stonehenge built?", options: ["About 5,000 years ago", "About 3,000 years ago", "About 7,000 years ago", "About 10,000 years ago"], answer: "About 5,000 years ago", type: "multiple" },
                { question: "Stonehenge was constructed approximately how many years ago?", options: ["5,000 years ago", "3,000 years ago", "7,000 years ago", "10,000 years ago"], answer: "5,000 years ago", type: "multiple" },
                { question: "Stonehenge was built about 5,000 years ago.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Iron Age People",
            variations: [
                { question: "Who lived in Britain during the Iron Age?", options: ["Celts", "Romans", "Saxons", "Vikings"], answer: "Celts", type: "multiple" },
                { question: "Which group of people inhabited Britain in the Iron Age?", options: ["Celts", "Romans", "Saxons", "Vikings"], answer: "Celts", type: "multiple" },
                { question: "The Celts lived in Britain during the Iron Age.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Roman Invasion Year",
            variations: [
                { question: "In what year did the Romans invade Britain?", options: ["AD 43", "AD 55", "AD 410", "AD 122"], answer: "AD 43", type: "multiple" },
                { question: "When did Julius Caesar's successors successfully invade Britain?", options: ["AD 43", "AD 55", "AD 410", "AD 122"], answer: "AD 43", type: "multiple" },
                { question: "The Romans invaded Britain in AD 43.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Hadrian's Wall",
            variations: [
                { question: "What was built to keep out the Picts?", options: ["Hadrian's Wall", "The Great Wall", "Antonine Wall", "Offa's Dyke"], answer: "Hadrian's Wall", type: "multiple" },
                { question: "Which structure did Emperor Hadrian order to protect Roman Britain from northern tribes?", options: ["Hadrian's Wall", "The Great Wall", "Antonine Wall", "Offa's Dyke"], answer: "Hadrian's Wall", type: "multiple" },
                { question: "Hadrian's Wall was built to defend against the Picts.", answer: true, type: "boolean" }
            ]
        }
    ],
    
    "The values and principles of the UK": [
        {
            groupTitle: "Voting Age",
            variations: [
                { question: "At what age can you vote in a General Election in the UK?", options: ["18", "16", "21", "17"], answer: "18", type: "multiple" },
                { question: "What is the minimum age to vote in UK General Elections?", options: ["18 years old", "16 years old", "21 years old", "17 years old"], answer: "18 years old", type: "multiple" },
                { question: "You must be 18 or over to vote in a UK General Election.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Democracy Definition",
            variations: [
                { question: "What does democracy mean?", options: ["Rule by the people", "Rule by the king", "Rule by the rich", "Rule by the army"], answer: "Rule by the people", type: "multiple" },
                { question: "Democracy is best described as which system?", options: ["Government by the people", "Government by monarchy", "Government by wealthy elite", "Government by military"], answer: "Government by the people", type: "multiple" },
                { question: "Democracy means that the government is chosen by the people.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Jury Service Age",
            variations: [
                { question: "What age must you be to do jury service?", options: ["18 to 70", "21 to 65", "16 to 70", "18 to 75"], answer: "18 to 70", type: "multiple" },
                { question: "Jury service in the UK is for people aged between what years?", options: ["18 and 70", "21 and 65", "16 and 70", "18 and 75"], answer: "18 and 70", type: "multiple" },
                { question: "You can be called for jury service if you are between 18 and 70 years old.", answer: true, type: "boolean" }
            ]
        }
    ],
    
    "A modern, thriving society": [
        {
            groupTitle: "UK Population Total",
            variations: [
                { question: "What is the approximate population of the UK?", options: ["64 million", "54 million", "74 million", "44 million"], answer: "64 million", type: "multiple" },
                { question: "How many people live in the United Kingdom?", options: ["Around 64 million", "Around 54 million", "Around 74 million", "Around 44 million"], answer: "Around 64 million", type: "multiple" },
                { question: "The UK has a population of approximately 64 million people.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "English Speakers",
            variations: [
                { question: "What proportion of people in the UK speak English?", options: ["Everyone", "Most people", "Half the people", "Three quarters"], answer: "Everyone", type: "multiple" },
                { question: "How many UK residents can speak English?", options: ["Everyone or almost everyone", "Most people", "About half", "Three quarters"], answer: "Everyone or almost everyone", type: "multiple" },
                { question: "Everyone in the UK speaks English as their main language.", answer: false, type: "boolean" }
            ]
        },
        {
            groupTitle: "Census Frequency",
            variations: [
                { question: "How often is a census held in the UK?", options: ["Every 10 years", "Every 5 years", "Every 20 years", "Every year"], answer: "Every 10 years", type: "multiple" },
                { question: "The UK census takes place with what frequency?", options: ["Every decade", "Every 5 years", "Every 20 years", "Annually"], answer: "Every decade", type: "multiple" },
                { question: "A census is conducted in the UK every 10 years.", answer: true, type: "boolean" }
            ]
        }
    ],
    
    "The UK government, the law and your role": [
        {
            groupTitle: "Constitutional Monarchy",
            variations: [
                { question: "What type of monarchy does the UK have?", options: ["Constitutional monarchy", "Absolute monarchy", "Democratic monarchy", "Federal monarchy"], answer: "Constitutional monarchy", type: "multiple" },
                { question: "The UK operates under which system of monarchy?", options: ["Constitutional monarchy", "Absolute monarchy", "Democratic monarchy", "Federal monarchy"], answer: "Constitutional monarchy", type: "multiple" },
                { question: "The UK is a constitutional monarchy.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Head of State",
            variations: [
                { question: "Who is the head of state in the UK?", options: ["The monarch", "The Prime Minister", "The Speaker", "The President"], answer: "The monarch", type: "multiple" },
                { question: "What role does the Queen/King hold in the UK government?", options: ["Head of state", "Head of government", "Head of parliament", "Head of judiciary"], answer: "Head of state", type: "multiple" },
                { question: "The Prime Minister is the UK's head of state.", answer: false, type: "boolean" }
            ]
        },
        {
            groupTitle: "MPs Count",
            variations: [
                { question: "How many MPs are there in the House of Commons?", options: ["650", "550", "750", "600"], answer: "650", type: "multiple" },
                { question: "The House of Commons consists of how many Members of Parliament?", options: ["650", "550", "750", "600"], answer: "650", type: "multiple" },
                { question: "There are 650 MPs in the House of Commons.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Electoral Register",
            variations: [
                { question: "What must you be on to vote in elections?", options: ["Electoral register", "Census register", "Tax register", "National register"], answer: "Electoral register", type: "multiple" },
                { question: "To vote in UK elections, you must be registered on which list?", options: ["The electoral register", "The census", "The tax records", "The national database"], answer: "The electoral register", type: "multiple" },
                { question: "You must be on the electoral register to vote.", answer: true, type: "boolean" }
            ]
        }
    ],
    
    "Leisure": [
        {
            groupTitle: "Wimbledon Sport",
            variations: [
                { question: "Which sport is played at Wimbledon?", options: ["Tennis", "Cricket", "Football", "Golf"], answer: "Tennis", type: "multiple" },
                { question: "Wimbledon is famous for which sporting event?", options: ["Tennis championships", "Cricket matches", "Football finals", "Golf tournaments"], answer: "Tennis championships", type: "multiple" },
                { question: "Wimbledon hosts a famous tennis tournament.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Pantomime Season",
            variations: [
                { question: "When are pantomimes traditionally performed?", options: ["Christmas", "Easter", "Summer", "Halloween"], answer: "Christmas", type: "multiple" },
                { question: "What time of year are pantomimes usually shown?", options: ["Christmas season", "Easter time", "Summer months", "Halloween period"], answer: "Christmas season", type: "multiple" },
                { question: "Pantomimes are traditionally performed at Christmas.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "National Trust",
            variations: [
                { question: "What does the National Trust preserve?", options: ["Historic buildings and countryside", "Museums only", "Libraries only", "Sports grounds"], answer: "Historic buildings and countryside", type: "multiple" },
                { question: "The National Trust is responsible for protecting what?", options: ["Heritage sites and natural areas", "Museums only", "Libraries only", "Sports facilities"], answer: "Heritage sites and natural areas", type: "multiple" },
                { question: "The National Trust preserves historic buildings and countryside.", answer: true, type: "boolean" }
            ]
        },
        {
            groupTitle: "Edinburgh Festival",
            variations: [
                { question: "What is the Edinburgh Festival known for?", options: ["Arts and culture", "Sports", "Science", "Technology"], answer: "Arts and culture", type: "multiple" },
                { question: "The Edinburgh Festival celebrates which area?", options: ["Arts and culture", "Sports and athletics", "Science and technology", "Business and commerce"], answer: "Arts and culture", type: "multiple" },
                { question: "The Edinburgh Festival is a major arts and culture event.", answer: true, type: "boolean" }
            ]
        }
    ]
};

// Add all variations
Object.keys(allVariations).forEach(topicTitle => {
    const topic = findTopic(topicTitle);
    if (!topic) {
        console.log(`⚠️  Topic not found: ${topicTitle}`);
        return;
    }
    
    if (!topic.questionGroups) {
        topic.questionGroups = [];
    }
    
    allVariations[topicTitle].forEach(group => {
        // Check if group already exists
        const existingGroup = topic.questionGroups.find(g => g.groupTitle === group.groupTitle);
        if (!existingGroup) {
            topic.questionGroups.push(group);
            console.log(`✓ Added: ${topicTitle} - ${group.groupTitle} (${group.variations.length} variations)`);
        } else {
            console.log(`⊗ Skipped: ${topicTitle} - ${group.groupTitle} (already exists)`);
        }
    });
});

// Save updated topics
fs.writeFileSync('topics.json', JSON.stringify(topics, null, 2));

// Summary
let totalGroups = 0;
let totalVariations = 0;
topics.forEach(topic => {
    if (topic.questionGroups) {
        totalGroups += topic.questionGroups.length;
        topic.questionGroups.forEach(g => totalVariations += g.variations.length);
    }
});

console.log('\n=== Summary ===');
console.log(`Total question groups: ${totalGroups}`);
console.log(`Total variations: ${totalVariations}`);
console.log('✅ All variations added successfully!');
