// Script to add comprehensive questions to remaining topics
const fs = require('fs');

const topicsData = JSON.parse(fs.readFileSync('topics.json', 'utf8'));

// Map of additional questions with exact topic titles from the JSON
const additionalQuestions = {
  "A long and illustrious history - Chapter 4: A global power": [
    {
      "question": "When did Anne become queen?",
      "options": ["1688", "1702", "1714", "1745"],
      "answer": "1702"
    },
    {
      "question": "What changed about Parliament during Anne's reign?",
      "options": ["It was abolished", "Newspapers began to report on proceedings", "It moved to Edinburgh", "Only nobles could attend"],
      "answer": "Newspapers began to report on proceedings"
    },
    {
      "question": "When did the Act of Union create the Kingdom of Great Britain?",
      "options": ["1688", "1702", "1707", "1745"],
      "answer": "1707"
    },
    {
      "question": "What happened to the Scottish Parliament after the Act of Union?",
      "options": ["It became more powerful", "It abolished", "It merged with England's", "It moved to London"],
      "answer": "It abolished"
    },
    {
      "question": "Who succeeded Queen Anne?",
      "options": ["George I", "James II", "Charles III", "William III"],
      "answer": "George I"
    },
    {
      "question": "Where did the Hanoverian kings come from?",
      "options": ["France", "Spain", "Germany", "Denmark"],
      "answer": "Germany"
    },
    {
      "question": "Who supported James II's son in claiming the throne?",
      "options": ["The Whigs", "The Tories", "The Jacobites", "Parliament"],
      "answer": "The Jacobites"
    },
    {
      "question": "What was Charles Edward Stuart also known as?",
      "options": ["The Black Prince", "Bonnie Prince Charlie", "The Young Pretender", "Both B and C"],
      "answer": "Both B and C"
    },
    {
      "question": "Where was the Jacobite army defeated?",
      "options": ["Battle of Bosworth", "Battle of Waterloo", "Battle of Culloden", "Battle of the Boyne"],
      "answer": "Battle of Culloden"
    },
    {
      "question": "What happened after the Battle of Culloden?",
      "options": ["Scottish clans gained power", "The clan system was destroyed", "Scotland gained independence", "Nothing changed"],
      "answer": "The clan system was destroyed"
    },
    {
      "question": "Who was Britain's first 'Prime Minister'?",
      "options": ["George I", "Robert Walpole", "William Pitt", "Duke of Wellington"],
      "answer": "Robert Walpole"
    },
    {
      "question": "When did Britain's colonies in America declare independence?",
      "options": ["1707", "1745", "1776", "1789"],
      "answer": "1776"
    },
    {
      "question": "Who led the French army in the wars with France?",
      "options": ["Louis XIV", "Napoleon Bonaparte", "Charles de Gaulle", "Joan of Arc"],
      "answer": "Napoleon Bonaparte"
    },
    {
      "question": "Where did Admiral Nelson defeat the French fleet?",
      "options": ["Battle of Waterloo", "Battle of Trafalgar", "Battle of the Nile", "Battle of Culloden"],
      "answer": "Battle of Trafalgar"
    },
    {
      "question": "Which famous column commemorates Admiral Nelson?",
      "options": ["The Victory Column", "Nelson's Column", "The Naval Column", "The Trafalgar Monument"],
      "answer": "Nelson's Column"
    },
    {
      "question": "Who defeated Napoleon at Waterloo?",
      "options": ["Admiral Nelson", "The Duke of Wellington", "Robert Walpole", "General Gordon"],
      "answer": "The Duke of Wellington"
    },
    {
      "question": "What was the Duke of Wellington known as?",
      "options": ["The Iron Duke", "The Steel General", "The Bronze Warrior", "The Great Leader"],
      "answer": "The Iron Duke"
    },
    {
      "question": "Who wrote The Wealth of Nations?",
      "options": ["David Hume", "Adam Smith", "John Locke", "Edmund Burke"],
      "answer": "Adam Smith"
    },
    {
      "question": "Who was a pioneer of steam power?",
      "options": ["Richard Arkwright", "James Watt", "George Stephenson", "Isambard Kingdom Brunel"],
      "answer": "James Watt"
    },
    {
      "question": "Who invented the Rocket?",
      "options": ["James Watt", "George Stephenson", "Isambard Kingdom Brunel", "Richard Arkwright"],
      "answer": "George Stephenson"
    }
  ],
  
  "A long and illustrious history - Chapter 5: The 20th century": [
    {
      "question": "When did the First World War begin?",
      "options": ["1910", "1914", "1918", "1939"],
      "answer": "1914"
    },
    {
      "question": "When did the First World War end?",
      "options": ["1914", "1916", "1918", "1920"],
      "answer": "1918"
    },
    {
      "question": "What is Remembrance Day also known as?",
      "options": ["Victory Day", "Poppy Day", "Armistice Day", "Veterans Day"],
      "answer": "Armistice Day"
    },
    {
      "question": "What do people wear on Remembrance Day?",
      "options": ["White flowers", "Poppies", "Ribbons", "Medals"],
      "answer": "Poppies"
    },
    {
      "question": "When do people observe a two-minute silence?",
      "options": ["At midnight on 11 November", "At 11:00 am on 11 November", "At noon on 11 November", "At any time on 11 November"],
      "answer": "At 11:00 am on 11 November"
    },
    {
      "question": "How many British soldiers died in WWI?",
      "options": ["Over 1 million", "Over 2 million", "Over 500,000", "Over 250,000"],
      "answer": "Over 2 million"
    },
    {
      "question": "What were the areas between the trenches called?",
      "options": ["Neutral ground", "Battle zones", "No man's land", "Dead zones"],
      "answer": "No man's land"
    },
    {
      "question": "When did women over 30 get the vote in the UK?",
      "options": ["1900", "1918", "1928", "1945"],
      "answer": "1918"
    },
    {
      "question": "When did women get the vote at 21, same as men?",
      "options": ["1918", "1928", "1945", "1969"],
      "answer": "1928"
    },
    {
      "question": "What were women who campaigned for the vote called?",
      "options": ["Chartists", "Suffragettes", "Feminists", "Activists"],
      "answer": "Suffragettes"
    },
    {
      "question": "Who was the leader of the suffragette movement?",
      "options": ["Florence Nightingale", "Emmeline Pankhurst", "Queen Victoria", "Margaret Thatcher"],
      "answer": "Emmeline Pankhurst"
    },
    {
      "question": "When did Ireland become two countries?",
      "options": ["1918", "1921", "1939", "1945"],
      "answer": "1921"
    },
    {
      "question": "When did the Second World War begin?",
      "options": ["1935", "1937", "1939", "1941"],
      "answer": "1939"
    },
    {
      "question": "When did WWII end?",
      "options": ["1943", "1944", "1945", "1946"],
      "answer": "1945"
    },
    {
      "question": "Who was the British Prime Minister during much of WWII?",
      "options": ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Anthony Eden"],
      "answer": "Winston Churchill"
    },
    {
      "question": "What famous speeches did Churchill make?",
      "options": ["'I have a dream'", "'We shall fight on the beaches'", "'Ask not what your country can do'", "'Four score and seven years ago'"],
      "answer": "'We shall fight on the beaches'"
    },
    {
      "question": "What does VE Day stand for?",
      "options": ["Victory in Europe", "Very Important Events", "Veterans' Equality", "Victory in England"],
      "answer": "Victory in Europe"
    },
    {
      "question": "When is VE Day celebrated?",
      "options": ["6 June", "8 May", "11 November", "25 December"],
      "answer": "8 May"
    },
    {
      "question": "What was the Blitz?",
      "options": ["A battle in France", "German bombing of British cities", "The D-Day invasion", "A naval battle"],
      "answer": "German bombing of British cities"
    },
    {
      "question": "What did Alexander Fleming discover?",
      "options": ["DNA", "Penicillin", "The atom", "Gravity"],
      "answer": "Penicillin"
    }
  ],
  
  "A long and illustrious history - Chapter 6: Britain since 1945": [
    {
      "question": "Who was elected as Prime Minister immediately after WWII?",
      "options": ["Winston Churchill", "Clement Attlee", "Margaret Thatcher", "Tony Blair"],
      "answer": "Clement Attlee"
    },
    {
      "question": "What did Clement Attlee's government introduce?",
      "options": ["The monarchy", "The welfare state", "The European Union", "The internet"],
      "answer": "The welfare state"
    },
    {
      "question": "When was the National Health Service (NHS) established?",
      "options": ["1945", "1948", "1950", "1960"],
      "answer": "1948"
    },
    {
      "question": "What does the NHS provide?",
      "options": ["Free legal advice", "Free healthcare for all residents", "Free education", "Free housing"],
      "answer": "Free healthcare for all residents"
    },
    {
      "question": "What is the Commonwealth?",
      "options": ["The British Empire", "An association of countries supporting democracy and development", "A trade union", "A military alliance"],
      "answer": "An association of countries supporting democracy and development"
    },
    {
      "question": "How many countries are in the Commonwealth?",
      "options": ["Over 20", "Over 40", "Over 50", "Over 100"],
      "answer": "Over 50"
    },
    {
      "question": "When did Britain join the European Economic Community (EEC)?",
      "options": ["1945", "1957", "1973", "1992"],
      "answer": "1973"
    },
    {
      "question": "Who was the first female Prime Minister of the UK?",
      "options": ["Queen Elizabeth II", "Margaret Thatcher", "Theresa May", "Emmeline Pankhurst"],
      "answer": "Margaret Thatcher"
    },
    {
      "question": "When did Margaret Thatcher serve as Prime Minister?",
      "options": ["1960s", "1970s", "1979-1990", "1990s"],
      "answer": "1979-1990"
    },
    {
      "question": "In what year did people vote to leave the EU?",
      "options": ["2010", "2014", "2016", "2019"],
      "answer": "2016"
    },
    {
      "question": "Where did the 'Windrush generation' come from?",
      "options": ["India", "The Caribbean", "Africa", "Eastern Europe"],
      "answer": "The Caribbean"
    },
    {
      "question": "What conflict took place in Northern Ireland from the 1960s?",
      "options": ["The Troubles", "The Irish War", "The Belfast Conflict", "The Ulster Crisis"],
      "answer": "The Troubles"
    },
    {
      "question": "What was the 1998 agreement that helped bring peace to Northern Ireland?",
      "options": ["The Belfast Agreement", "The Good Friday Agreement", "The Peace Agreement", "Both A and B"],
      "answer": "Both A and B"
    }
  ],
  
  "A modern, thriving society": [
    {
      "question": "What percentage of the UK population is aged 19 or under?",
      "options": ["15%", "20%", "25%", "30%"],
      "answer": "25%"
    },
    {
      "question": "What percentage of the UK population is aged 65 or over?",
      "options": ["10%", "15%", "20%", "25%"],
      "answer": "20%"
    },
    {
      "question": "Is there an established Church in Scotland?",
      "options": ["Yes, the Church of England", "Yes, the Church of Scotland", "No", "Yes, the Catholic Church"],
      "answer": "Yes, the Church of Scotland"
    },
    {
      "question": "What is the established Church in England?",
      "options": ["The Catholic Church", "The Church of England", "The Methodist Church", "The Baptist Church"],
      "answer": "The Church of England"
    },
    {
      "question": "Who is the head of the Church of England?",
      "options": ["The Prime Minister", "The Archbishop of Canterbury", "The monarch", "Both B and C"],
      "answer": "Both B and C"
    },
    {
      "question": "Which is the largest religious group in the UK?",
      "options": ["Muslims", "Hindus", "Christians", "Jews"],
      "answer": "Christians"
    },
    {
      "question": "What is the second largest religious group?",
      "options": ["Hindus", "Muslims", "Jews", "Sikhs"],
      "answer": "Muslims"
    },
    {
      "question": "Which famous British bands are mentioned?",
      "options": ["The Beatles", "The Rolling Stones", "Both A and B", "Neither"],
      "answer": "Both A and B"
    },
    {
      "question": "What is the Turner Prize awarded for?",
      "options": ["Literature", "Music", "Contemporary art", "Film"],
      "answer": "Contemporary art"
    },
    {
      "question": "Where is the National Gallery?",
      "options": ["Edinburgh", "Manchester", "London", "Cardiff"],
      "answer": "London"
    }
  ],
  
  "Leisure": [
    {
      "question": "Where were the first rules of modern football established?",
      "options": ["Manchester", "London", "Birmingham", "Liverpool"],
      "answer": "London"
    },
    {
      "question": "How long is the Grand National horse race?",
      "options": ["2 miles", "Over 4 miles", "1 mile", "10 miles"],
      "answer": "Over 4 miles"
    },
    {
      "question": "Where is the Grand National held?",
      "options": ["Ascot", "Aintree, near Liverpool", "Epsom", "Cheltenham"],
      "answer": "Aintree, near Liverpool"
    },
    {
      "question": "Where is Royal Ascot held?",
      "options": ["London", "Liverpool", "Berkshire", "Yorkshire"],
      "answer": "Berkshire"
    },
    {
      "question": "What is the most famous tennis tournament in the UK?",
      "options": ["The British Open", "Wimbledon", "The Davis Cup", "The Queen's Cup"],
      "answer": "Wimbledon"
    },
    {
      "question": "Which sport is particularly associated with Scotland?",
      "options": ["Football", "Cricket", "Golf", "Rugby"],
      "answer": "Golf"
    },
    {
      "question": "Where is the home of golf?",
      "options": ["Edinburgh", "St Andrews", "Glasgow", "Aberdeen"],
      "answer": "St Andrews"
    },
    {
      "question": "How many days can a Test Match last in cricket?",
      "options": ["1 day", "3 days", "Up to 5 days", "7 days"],
      "answer": "Up to 5 days"
    },
    {
      "question": "Which famous sailing event started in 1851?",
      "options": ["The Boat Race", "America's Cup", "The Admiral's Cup", "The Royal Regatta"],
      "answer": "America's Cup"
    },
    {
      "question": "Where is the Notting Hill Carnival held?",
      "options": ["Manchester", "Birmingham", "London", "Bristol"],
      "answer": "London"
    },
    {
      "question": "When does the Notting Hill Carnival take place?",
      "options": ["Every summer on a bank holiday weekend in August", "Every Christmas", "Every spring", "Every winter"],
      "answer": "Every summer on a bank holiday weekend in August"
    },
    {
      "question": "What is Hogmanay?",
      "options": ["A Scottish dance", "Scottish New Year celebrations", "A Scottish food", "A Scottish sport"],
      "answer": "Scottish New Year celebrations"
    },
    {
      "question": "What is Bonfire Night also called?",
      "options": ["Halloween", "Guy Fawkes Night", "May Day", "Easter"],
      "answer": "Guy Fawkes Night"
    },
    {
      "question": "When is Bonfire Night?",
      "options": ["31 October", "5 November", "25 December", "1 January"],
      "answer": "5 November"
    },
    {
      "question": "What happened on 5 November 1605?",
      "options": ["The Great Fire of London", "Guy Fawkes tried to blow up Parliament", "The Battle of Trafalgar", "The signing of the Magna Carta"],
      "answer": "Guy Fawkes tried to blow up Parliament"
    }
  ],
  
  "The UK government, the law and your role": [
    {
      "question": "What type of democracy is the UK?",
      "options": ["Presidential democracy", "Parliamentary democracy", "Direct democracy", "Socialist democracy"],
      "answer": "Parliamentary democracy"
    },
    {
      "question": "What type of monarchy does the UK have?",
      "options": ["Absolute monarchy", "Constitutional monarchy", "Elective monarchy", "No monarchy"],
      "answer": "Constitutional monarchy"
    },
    {
      "question": "What is the official home of the monarch in London?",
      "options": ["Windsor Castle", "Kensington Palace", "Buckingham Palace", "Hampton Court"],
      "answer": "Buckingham Palace"
    },
    {
      "question": "Where does the UK Parliament sit?",
      "options": ["Buckingham Palace", "Westminster", "Edinburgh", "Cardiff"],
      "answer": "Westminster"
    },
    {
      "question": "How many chambers does Parliament have?",
      "options": ["One", "Two", "Three", "Four"],
      "answer": "Two"
    },
    {
      "question": "What are the two chambers of Parliament?",
      "options": ["Senate and Congress", "House of Lords and House of Commons", "Upper House and Lower House", "Parliament and Assembly"],
      "answer": "House of Lords and House of Commons"
    },
    {
      "question": "Who sits in the House of Commons?",
      "options": ["Appointed members", "Members of Parliament (MPs)", "Lords", "Clergy"],
      "answer": "Members of Parliament (MPs)"
    },
    {
      "question": "How are MPs chosen?",
      "options": ["Appointed by the Queen", "Elected by voters", "Inherited", "Chosen by lottery"],
      "answer": "Elected by voters"
    },
    {
      "question": "How many parliamentary constituencies are there?",
      "options": ["450", "550", "646", "750"],
      "answer": "646"
    },
    {
      "question": "What is the maximum time between general elections?",
      "options": ["3 years", "4 years", "5 years", "7 years"],
      "answer": "5 years"
    },
    {
      "question": "What voting system is used for general elections?",
      "options": ["Proportional representation", "First past the post", "Ranked choice", "Approval voting"],
      "answer": "First past the post"
    },
    {
      "question": "Who can vote in a general election?",
      "options": ["Anyone over 16", "UK, Irish and Commonwealth citizens over 18", "Only UK citizens", "Anyone living in the UK"],
      "answer": "UK, Irish and Commonwealth citizens over 18"
    },
    {
      "question": "What is the leader of the government called?",
      "options": ["The President", "The Prime Minister", "The Chancellor", "The Speaker"],
      "answer": "The Prime Minister"
    },
    {
      "question": "What is the Prime Minister's residence in London?",
      "options": ["Buckingham Palace", "10 Downing Street", "Westminster Abbey", "The Houses of Parliament"],
      "answer": "10 Downing Street"
    },
    {
      "question": "Who chairs debates in the House of Commons?",
      "options": ["The Prime Minister", "The Speaker", "The monarch", "The oldest MP"],
      "answer": "The Speaker"
    },
    {
      "question": "What is Prime Minister's Questions (PMQs)?",
      "options": ["A TV quiz show", "When the PM answers questions from MPs", "A written exam", "A private meeting"],
      "answer": "When the PM answers questions from MPs"
    },
    {
      "question": "Can the House of Lords stop new laws?",
      "options": ["Yes, permanently", "No, they can only delay them", "Yes, if they vote unanimously", "No, they have no power"],
      "answer": "No, they can only delay them"
    },
    {
      "question": "What must all bills receive to become law?",
      "options": ["Public approval", "Royal Assent", "EU approval", "Supreme Court approval"],
      "answer": "Royal Assent"
    },
    {
      "question": "Which nations have devolved administrations?",
      "options": ["England", "Scotland, Wales and Northern Ireland", "All four nations", "None"],
      "answer": "Scotland, Wales and Northern Ireland"
    },
    {
      "question": "What is the highest court in the UK?",
      "options": ["The Crown Court", "The High Court", "The Supreme Court", "The Court of Appeal"],
      "answer": "The Supreme Court"
    },
    {
      "question": "What are the two principles of British criminal law?",
      "options": ["Guilty until proven innocent", "Innocent until proven guilty", "Everyone is guilty", "No one is guilty"],
      "answer": "Innocent until proven guilty"
    },
    {
      "question": "What is the emergency services number in the UK?",
      "options": ["911", "999", "111", "101"],
      "answer": "999"
    },
    {
      "question": "What is the number for non-emergency police matters?",
      "options": ["999", "101", "111", "911"],
      "answer": "101"
    },
    {
      "question": "At what age do people usually receive the state retirement pension?",
      "options": ["60", "65", "68", "70"],
      "answer": "68"
    },
    {
      "question": "What must drivers have by law?",
      "options": ["A new car", "Insurance", "A garage", "A mechanic"],
      "answer": "Insurance"
    }
  ]
};

// Add questions to existing topics
topicsData.forEach(topic => {
  const moreQuestions = additionalQuestions[topic.title];
  if (moreQuestions) {
    // Add new questions to existing ones
    topic.questions = [...topic.questions, ...moreQuestions];
    console.log(`Added ${moreQuestions.length} questions to: ${topic.title} (Total: ${topic.questions.length})`);
  }
});

// Write the updated data back
fs.writeFileSync('topics.json', JSON.stringify(topicsData, null, 2), 'utf8');

// Summary
console.log('\n=== FINAL QUESTION COUNTS ===');
let totalQuestions = 0;
topicsData.forEach(topic => {
  console.log(`${topic.title}: ${topic.questions.length} questions`);
  totalQuestions += topic.questions.length;
});
console.log(`\nTOTAL: ${totalQuestions} questions across all topics`);
