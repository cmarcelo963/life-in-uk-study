// Script to add commonly tested questions that may have been missed
const fs = require('fs');

const topicsData = JSON.parse(fs.readFileSync('topics.json', 'utf8'));

const missingQuestions = {
  "What is the UK": [
    {
      "question": "What is the currency symbol for pound sterling?",
      "options": ["$", "€", "£", "¥"],
      "answer": "£"
    },
    {
      "question": "How many pence are in a pound?",
      "options": ["10", "50", "100", "1000"],
      "answer": "100"
    },
    {
      "question": "What is the capital city of the UK?",
      "options": ["Edinburgh", "Cardiff", "London", "Belfast"],
      "answer": "London"
    },
    {
      "question": "Which country's flag shows a dragon?",
      "options": ["England", "Scotland", "Wales", "Northern Ireland"],
      "answer": "Wales"
    },
    {
      "question": "What are the denominations of UK coins?",
      "options": ["1p, 2p, 5p, 10p, 20p, 50p, £1 and £2", "1p, 5p, 10p, 25p, 50p, £1", "1p, 2p, 10p, 20p, £1", "1p, 5p, 10p, 50p, £1"],
      "answer": "1p, 2p, 5p, 10p, 20p, 50p, £1 and £2"
    },
    {
      "question": "What are the denominations of UK notes?",
      "options": ["£1, £5, £10, £20", "£5, £10, £20, £50", "£10, £20, £50, £100", "£5, £20, £50"],
      "answer": "£5, £10, £20, £50"
    }
  ],
  
  "A long and illustrious history - Chapter 4: A global power": [
    {
      "question": "What are the three crosses on the Union Flag?",
      "options": ["St George, St Andrew and St Patrick", "St George, St David and St Patrick", "St Andrew, St David and St Patrick", "All four patron saints"],
      "answer": "St George, St Andrew and St Patrick"
    },
    {
      "question": "What is the patron saint of England?",
      "options": ["St Andrew", "St Patrick", "St David", "St George"],
      "answer": "St George"
    },
    {
      "question": "What is the patron saint of Scotland?",
      "options": ["St Andrew", "St Patrick", "St David", "St George"],
      "answer": "St Andrew"
    },
    {
      "question": "What is the patron saint of Wales?",
      "options": ["St Andrew", "St Patrick", "St David", "St George"],
      "answer": "St David"
    },
    {
      "question": "What is the patron saint of Northern Ireland?",
      "options": ["St Andrew", "St Patrick", "St David", "St George"],
      "answer": "St Patrick"
    },
    {
      "question": "What color is St George's cross?",
      "options": ["A white cross on a red ground", "A red cross on a white ground", "A blue cross on a white ground", "A white cross on a blue ground"],
      "answer": "A red cross on a white ground"
    },
    {
      "question": "What color is St Andrew's cross?",
      "options": ["A diagonal white cross on a blue ground", "A diagonal blue cross on a white ground", "A diagonal red cross on a white ground", "A red cross on a white ground"],
      "answer": "A diagonal white cross on a blue ground"
    },
    {
      "question": "What color is St Patrick's cross?",
      "options": ["A diagonal white cross on a blue ground", "A diagonal blue cross on a white ground", "A diagonal red cross on a white ground", "A red cross on a white ground"],
      "answer": "A diagonal red cross on a white ground"
    },
    {
      "question": "What is another name for the Union Flag?",
      "options": ["The British Flag", "The Union Jack", "The Royal Flag", "The National Flag"],
      "answer": "The Union Jack"
    },
    {
      "question": "Why doesn't the Welsh dragon appear on the Union Flag?",
      "options": ["Wales wasn't part of the UK", "Wales was already united with England when the flag was created", "Wales refused to be included", "The dragon was too complex to add"],
      "answer": "Wales was already united with England when the flag was created"
    }
  ],
  
  "A modern, thriving society": [
    {
      "question": "What percentage of the UK population makes up England?",
      "options": ["64%", "74%", "84%", "94%"],
      "answer": "84%"
    },
    {
      "question": "What percentage of the UK population makes up Wales?",
      "options": ["Around 3%", "Around 5%", "Around 8%", "Around 10%"],
      "answer": "Around 5%"
    },
    {
      "question": "What percentage of the UK population makes up Scotland?",
      "options": ["Around 3%", "Around 5%", "Just over 8%", "Around 12%"],
      "answer": "Just over 8%"
    },
    {
      "question": "What percentage of the UK population makes up Northern Ireland?",
      "options": ["Less than 3%", "Around 5%", "Around 8%", "Around 10%"],
      "answer": "Less than 3%"
    },
    {
      "question": "In Wales, what language is taught in schools besides English?",
      "options": ["French", "Welsh", "Gaelic", "Latin"],
      "answer": "Welsh"
    },
    {
      "question": "Where in Scotland is Gaelic spoken?",
      "options": ["All of Scotland", "The cities", "Some parts of the Highlands and Islands", "The Lowlands"],
      "answer": "Some parts of the Highlands and Islands"
    },
    {
      "question": "What language do some people speak in Northern Ireland?",
      "options": ["Welsh", "Scottish Gaelic", "Irish Gaelic", "Manx"],
      "answer": "Irish Gaelic"
    },
    {
      "question": "What has caused people in the UK to live longer?",
      "options": ["Better weather", "Improved living standards and better health care", "More exercise", "Less work"],
      "answer": "Improved living standards and better health care"
    },
    {
      "question": "What impact does an ageing population have?",
      "options": ["Lower taxes", "Impact on the cost of pensions and health care", "More workers", "Less housing needed"],
      "answer": "Impact on the cost of pensions and health care"
    },
    {
      "question": "What is the most common ethnic description in UK surveys?",
      "options": ["Asian", "Black", "White", "Mixed"],
      "answer": "White"
    }
  ],
  
  "Leisure": [
    {
      "question": "When is St George's Day?",
      "options": ["17 March", "23 April", "1 March", "30 November"],
      "answer": "23 April"
    },
    {
      "question": "When is St Andrew's Day?",
      "options": ["17 March", "23 April", "1 March", "30 November"],
      "answer": "30 November"
    },
    {
      "question": "When is St David's Day?",
      "options": ["17 March", "23 April", "1 March", "30 November"],
      "answer": "1 March"
    },
    {
      "question": "When is St Patrick's Day?",
      "options": ["17 March", "23 April", "1 March", "30 November"],
      "answer": "17 March"
    },
    {
      "question": "Only one patron saint's day is an official holiday in the UK. Which one?",
      "options": ["St George's Day in England", "St Andrew's Day in Scotland", "St Patrick's Day in Northern Ireland", "St David's Day in Wales"],
      "answer": "St Patrick's Day in Northern Ireland"
    },
    {
      "question": "When is Christmas Day?",
      "options": ["24 December", "25 December", "26 December", "31 December"],
      "answer": "25 December"
    },
    {
      "question": "When is Boxing Day?",
      "options": ["24 December", "25 December", "26 December", "31 December"],
      "answer": "26 December"
    },
    {
      "question": "What is the day before Lent called?",
      "options": ["Shrove Tuesday or Pancake Day", "Easter Monday", "Maundy Thursday", "Good Friday"],
      "answer": "Shrove Tuesday or Pancake Day"
    },
    {
      "question": "What do children do on Halloween?",
      "options": ["Go to church", "Dress up and go trick-or-treating", "Light bonfires", "Have picnics"],
      "answer": "Dress up and go trick-or-treating"
    },
    {
      "question": "When is Halloween?",
      "options": ["30 October", "31 October", "1 November", "5 November"],
      "answer": "31 October"
    }
  ],
  
  "The UK government, the law and your role": [
    {
      "question": "How many Members of the Scottish Parliament (MSPs) are there?",
      "options": ["60", "90", "129", "650"],
      "answer": "129"
    },
    {
      "question": "How many Senedd members (SMs) are there in Wales?",
      "options": ["40", "60", "90", "129"],
      "answer": "60"
    },
    {
      "question": "Where does the Senedd sit?",
      "options": ["London", "Edinburgh", "Cardiff", "Belfast"],
      "answer": "Cardiff"
    },
    {
      "question": "Where does the Scottish Parliament sit?",
      "options": ["London", "Edinburgh", "Cardiff", "Glasgow"],
      "answer": "Edinburgh"
    },
    {
      "question": "What is the Northern Ireland Assembly also known as?",
      "options": ["The Dail", "Stormont", "Holyrood", "Westminster"],
      "answer": "Stormont"
    },
    {
      "question": "Can members of the Senedd speak in Welsh?",
      "options": ["No, only English", "Yes, members can speak in either Welsh or English", "Only in committee meetings", "Only during debates"],
      "answer": "Yes, members can speak in either Welsh or English"
    },
    {
      "question": "What voting system is used to elect the Scottish Parliament?",
      "options": ["First past the post", "A form of proportional representation", "Simple majority", "Electoral college"],
      "answer": "A form of proportional representation"
    },
    {
      "question": "What voting system is used to elect the Senedd?",
      "options": ["First past the post", "A form of proportional representation", "Simple majority", "Electoral college"],
      "answer": "A form of proportional representation"
    },
    {
      "question": "Who cannot vote in a UK general election?",
      "options": ["Irish citizens", "Commonwealth citizens over 18", "Members of the House of Lords", "UK citizens over 18"],
      "answer": "Members of the House of Lords"
    },
    {
      "question": "What must you have to watch TV or use BBC iPlayer?",
      "options": ["A TV set", "A television licence", "A government permit", "Nothing special"],
      "answer": "A television licence"
    },
    {
      "question": "What is the maximum fine for not having a TV licence?",
      "options": ["£500", "£1,000", "£2,000", "£5,000"],
      "answer": "£1,000"
    },
    {
      "question": "What does BBC stand for?",
      "options": ["British Broadcast Company", "British Broadcasting Corporation", "Britain Broadcast Centre", "British Broadcast Channel"],
      "answer": "British Broadcasting Corporation"
    },
    {
      "question": "Who can get a 50% discount on their TV licence?",
      "options": ["Students", "Pensioners", "Blind people", "Unemployed people"],
      "answer": "Blind people"
    },
    {
      "question": "Is the BBC independent of government?",
      "options": ["No, it's controlled by the government", "Yes, although it receives some state funding", "No, it's a private company", "Yes, it receives no state funding"],
      "answer": "Yes, although it receives some state funding"
    },
    {
      "question": "At what age must you pay Council Tax?",
      "options": ["16", "18", "21", "25"],
      "answer": "18"
    },
    {
      "question": "Can EU citizens stand as candidates in local elections?",
      "options": ["No, never", "Yes, EU and Commonwealth citizens can", "Only UK citizens", "Only with special permission"],
      "answer": "Yes, EU and Commonwealth citizens can"
    }
  ]
};

// Add questions to existing topics
topicsData.forEach(topic => {
  const additionalQs = missingQuestions[topic.title];
  if (additionalQs) {
    // Add new questions to existing ones
    topic.questions = [...topic.questions, ...additionalQs];
    console.log(`Added ${additionalQs.length} more questions to: ${topic.title} (Total now: ${topic.questions.length})`);
  }
});

// Write the updated data back
fs.writeFileSync('topics.json', JSON.stringify(topicsData, null, 2), 'utf8');

// Summary
console.log('\n=== UPDATED QUESTION COUNTS ===');
let totalQuestions = 0;
topicsData.forEach(topic => {
  console.log(`${topic.title}: ${topic.questions.length} questions`);
  totalQuestions += topic.questions.length;
});
console.log(`\nNEW TOTAL: ${totalQuestions} questions across all topics`);
console.log('\nKey additions:');
console.log('- Patron saints and their dates');
console.log('- UK currency details (denominations, symbols)');
console.log('- Capital cities');
console.log('- Union Flag components');
console.log('- Population distribution');
console.log('- Languages spoken in each nation');
console.log('- Devolved administrations details');
console.log('- Bank holidays and festivals');
console.log('- TV licence requirements');
console.log('- Voting eligibility details');
