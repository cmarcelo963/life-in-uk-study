// Script to add comprehensive questions to all topics
const fs = require('fs');

const topicsData = JSON.parse(fs.readFileSync('topics.json', 'utf8'));

const additionalQuestions = {
  "The values and principles of the UK": [
    {
      "question": "What is ESOL Entry Level 3 equivalent to in the Common European Framework?",
      "options": ["A2", "B1", "B2", "C1"],
      "answer": "B1"
    },
    {
      "question": "Which of the following is a responsibility of UK residents?",
      "options": ["To look after the area in which you live", "To join a political party", "To own property", "To speak only English"],
      "answer": "To look after the area in which you live"
    },
    {
      "question": "What pledge do new citizens make at the citizenship ceremony?",
      "options": ["To uphold democratic values and observe laws faithfully", "To serve in the military", "To learn all UK history", "To abandon previous citizenship"],
      "answer": "To uphold democratic values and observe laws faithfully"
    },
    {
      "question": "Is there a place for extremism in British society?",
      "options": ["Yes, if peaceful", "No", "Only in certain areas", "Yes, if legal"],
      "answer": "No"
    },
    {
      "question": "What is one of the rights offered by the UK?",
      "options": ["A right to a fair trial", "A right to free housing", "A right to avoid taxes", "A right to break laws"],
      "answer": "A right to a fair trial"
    },
    {
      "question": "Where can you book the Life in the UK test?",
      "options": ["At any library", "Online at www.gov.uk/life-in-the-uk-test", "At the post office", "At the Home Office"],
      "answer": "Online at www.gov.uk/life-in-the-uk-test"
    },
    {
      "question": "What language can the Life in the UK test be taken in besides English?",
      "options": ["Welsh or Scottish Gaelic", "French or German", "Irish or Manx", "Any language"],
      "answer": "Welsh or Scottish Gaelic"
    },
    {
      "question": "Will you need to remember dates of birth or death for the test?",
      "options": ["Yes", "No", "Only for monarchs", "Only for wars"],
      "answer": "No"
    },
    {
      "question": "How many test centres are there in the UK?",
      "options": ["Over 10", "Over 20", "Over 30", "Over 50"],
      "answer": "Over 30"
    },
    {
      "question": "What must you bring to take the Life in the UK test?",
      "options": ["Identification and proof of address", "Just your booking confirmation", "Only a passport", "Nothing is required"],
      "answer": "Identification and proof of address"
    }
  ],
  
  "What is the UK": [
    {
      "question": "What is the official name of the UK?",
      "options": ["Great Britain", "United Kingdom of Great Britain and Northern Ireland", "British Isles", "England and Wales"],
      "answer": "United Kingdom of Great Britain and Northern Ireland"
    },
    {
      "question": "Which parliament governs the UK?",
      "options": ["The parliament sitting in Westminster", "The European Parliament", "The Scottish Parliament", "Regional assemblies"],
      "answer": "The parliament sitting in Westminster"
    },
    {
      "question": "Do Scotland, Wales and Northern Ireland have their own parliaments or assemblies?",
      "options": ["Yes, with devolved powers", "No", "Only Scotland", "Only Wales"],
      "answer": "Yes, with devolved powers"
    },
    {
      "question": "What are St Helena and the Falkland Islands?",
      "options": ["Part of the UK", "Crown dependencies", "British overseas territories", "Independent countries"],
      "answer": "British overseas territories"
    },
    {
      "question": "Are the Channel Islands and Isle of Man part of the UK?",
      "options": ["Yes", "No, they are Crown dependencies", "Only the Channel Islands", "Only the Isle of Man"],
      "answer": "No, they are Crown dependencies"
    },
    {
      "question": "Which term refers to England, Scotland and Wales only?",
      "options": ["UK", "Great Britain", "British Isles", "United Kingdom"],
      "answer": "Great Britain"
    }
  ],
  
  "A long and illustrious history - Chapter 1: Early Britain": [
    {
      "question": "When did Britain become permanently separated from the continent?",
      "options": ["5,000 years ago", "10,000 years ago", "15,000 years ago", "20,000 years ago"],
      "answer": "10,000 years ago"
    },
    {
      "question": "What is Skara Brae?",
      "options": ["A Stone Age monument", "The best preserved prehistoric village in northern Europe", "A Roman fort", "A Viking settlement"],
      "answer": "The best preserved prehistoric village in northern Europe"
    },
    {
      "question": "Where is Skara Brae located?",
      "options": ["England", "Wales", "Orkney, Scotland", "Ireland"],
      "answer": "Orkney, Scotland"
    },
    {
      "question": "Around when did people learn to make bronze?",
      "options": ["2,000 years ago", "4,000 years ago", "6,000 years ago", "10,000 years ago"],
      "answer": "4,000 years ago"
    },
    {
      "question": "What is Maiden Castle?",
      "options": ["A Stone Age monument", "A Bronze Age tomb", "An Iron Age hill fort", "A Roman villa"],
      "answer": "An Iron Age hill fort"
    },
    {
      "question": "Where is Maiden Castle located?",
      "options": ["Yorkshire", "Kent", "Dorset", "Cornwall"],
      "answer": "Dorset"
    },
    {
      "question": "What language family did Iron Age people speak?",
      "options": ["Germanic", "Celtic", "Latin", "Norse"],
      "answer": "Celtic"
    },
    {
      "question": "When did Julius Caesar first invade Britain?",
      "options": ["55 BC", "AD 43", "AD 410", "1066"],
      "answer": "55 BC"
    },
    {
      "question": "Was Julius Caesar's invasion successful?",
      "options": ["Yes", "No", "Partially", "He never invaded"],
      "answer": "No"
    },
    {
      "question": "Which Roman Emperor successfully invaded Britain in AD 43?",
      "options": ["Julius Caesar", "Claudius", "Hadrian", "Augustus"],
      "answer": "Claudius"
    },
    {
      "question": "Where is there a statue of Boudicca?",
      "options": ["Trafalgar Square", "Westminster Bridge, London", "Edinburgh Castle", "Tower of London"],
      "answer": "Westminster Bridge, London"
    },
    {
      "question": "Who were the Picts?",
      "options": ["Roman soldiers", "Ancestors of the Scottish people", "Anglo-Saxon invaders", "Viking warriors"],
      "answer": "Ancestors of the Scottish people"
    },
    {
      "question": "Which forts are part of Hadrian's Wall?",
      "options": ["Dover and Canterbury", "Housesteads and Vindolanda", "York and Lincoln", "Bath and Chester"],
      "answer": "Housesteads and Vindolanda"
    },
    {
      "question": "How long did the Romans remain in Britain?",
      "options": ["200 years", "300 years", "400 years", "500 years"],
      "answer": "400 years"
    },
    {
      "question": "Which tribes invaded Britain after the Romans left?",
      "options": ["Celts, Picts and Scots", "Jutes, Angles and Saxons", "Vikings, Danes and Norse", "Normans, French and Bretons"],
      "answer": "Jutes, Angles and Saxons"
    },
    {
      "question": "What is the basis of modern-day English?",
      "options": ["Celtic languages", "Latin", "Languages spoken by Angles and Saxons", "Norman French"],
      "answer": "Languages spoken by Angles and Saxons"
    },
    {
      "question": "By when were Anglo-Saxon kingdoms established?",
      "options": ["AD 410", "AD 600", "AD 789", "AD 1066"],
      "answer": "AD 600"
    },
    {
      "question": "Where is Sutton Hoo?",
      "options": ["Yorkshire", "Suffolk", "Kent", "Cornwall"],
      "answer": "Suffolk"
    },
    {
      "question": "Who became the patron saint of Ireland?",
      "options": ["St Augustine", "St Columba", "St Patrick", "St David"],
      "answer": "St Patrick"
    },
    {
      "question": "Where did St Columba found a monastery?",
      "options": ["Canterbury", "Lindisfarne", "Iona", "Dublin"],
      "answer": "Iona"
    },
    {
      "question": "When did Vikings first visit Britain?",
      "options": ["AD 410", "AD 600", "AD 789", "AD 1066"],
      "answer": "AD 789"
    },
    {
      "question": "Where did Vikings come from?",
      "options": ["France, Spain and Italy", "Denmark, Norway and Sweden", "Germany, Poland and Russia", "Ireland, Scotland and Wales"],
      "answer": "Denmark, Norway and Sweden"
    },
    {
      "question": "Who defeated the Vikings?",
      "options": ["King Harold", "King Alfred the Great", "William the Conqueror", "Robert the Bruce"],
      "answer": "King Alfred the Great"
    },
    {
      "question": "What was the area of Viking settlement called?",
      "options": ["Mercia", "Wessex", "Danelaw", "Northumbria"],
      "answer": "Danelaw"
    },
    {
      "question": "Which Viking king ruled England?",
      "options": ["Harald Hardrada", "Cnut (Canute)", "Erik Bloodaxe", "Ragnar Lothbrok"],
      "answer": "Cnut (Canute)"
    },
    {
      "question": "Who united Scotland under one king?",
      "options": ["Robert the Bruce", "Kenneth MacAlpin", "William Wallace", "Macbeth"],
      "answer": "Kenneth MacAlpin"
    },
    {
      "question": "Who won the Battle of Hastings?",
      "options": ["King Harold", "William, Duke of Normandy", "King Alfred", "Edward the Confessor"],
      "answer": "William, Duke of Normandy"
    },
    {
      "question": "What records the Norman Conquest?",
      "options": ["The Domesday Book", "The Bayeux Tapestry", "The Canterbury Tales", "The Anglo-Saxon Chronicle"],
      "answer": "The Bayeux Tapestry"
    },
    {
      "question": "The Norman Conquest was the last successful foreign invasion of which country?",
      "options": ["Scotland", "Wales", "England", "Ireland"],
      "answer": "England"
    },
    {
      "question": "What influenced the development of modern English?",
      "options": ["Celtic languages", "Latin only", "Norman French and Anglo-Saxon", "Viking languages"],
      "answer": "Norman French and Anglo-Saxon"
    }
  ],
  
  "A long and illustrious history - Chapter 2: The Middle Ages": [
    {
      "question": "In which year did Edward I introduce the Statute of Rhuddlan?",
      "options": ["1215", "1284", "1314", "1415"],
      "answer": "1284"
    },
    {
      "question": "What did the Statute of Rhuddlan do?",
      "options": ["Freed Wales", "Annexed Wales to the Crown of England", "Created the Welsh Assembly", "Granted Welsh independence"],
      "answer": "Annexed Wales to the Crown of England"
    },
    {
      "question": "Which castles were built to maintain English power in Wales?",
      "options": ["Dover and Windsor", "Conwy and Caernarvon", "Edinburgh and Stirling", "Leeds and Warwick"],
      "answer": "Conwy and Caernarvon"
    },
    {
      "question": "What was the area around Dublin controlled by the English called?",
      "options": ["The Pale", "The March", "The Borderlands", "New England"],
      "answer": "The Pale"
    },
    {
      "question": "Who led the Scottish forces at Bannockburn?",
      "options": ["William Wallace", "Robert the Bruce", "King Edward I", "Kenneth MacAlpin"],
      "answer": "Robert the Bruce"
    },
    {
      "question": "What was the long war between England and France called?",
      "options": ["The Hundred Days War", "The Hundred Years War", "The Thirty Years War", "The Eighty Years War"],
      "answer": "The Hundred Years War"
    },
    {
      "question": "How long did the Hundred Years War actually last?",
      "options": ["100 years", "116 years", "98 years", "150 years"],
      "answer": "116 years"
    },
    {
      "question": "Who won the Battle of Agincourt?",
      "options": ["The French", "King Henry V of England", "The Scots", "The Spanish"],
      "answer": "King Henry V of England"
    },
    {
      "question": "What was the system of land ownership in the Middle Ages called?",
      "options": ["Democracy", "Feudalism", "Capitalism", "Socialism"],
      "answer": "Feudalism"
    },
    {
      "question": "What were peasants who could not move away from their lord's land called?",
      "options": ["Vassals", "Serfs", "Knights", "Freemen"],
      "answer": "Serfs"
    },
    {
      "question": "What fraction of England's population died in the Black Death?",
      "options": ["One quarter", "One third", "Half", "Two thirds"],
      "answer": "One third"
    },
    {
      "question": "What was the Black Death?",
      "options": ["A famine", "A war", "A plague", "A flood"],
      "answer": "A plague"
    },
    {
      "question": "What happened after the Black Death?",
      "options": ["Population increased", "Peasants demanded higher wages", "More wars broke out", "The economy collapsed"],
      "answer": "Peasants demanded higher wages"
    },
    {
      "question": "What did the Magna Carta establish?",
      "options": ["The king was above the law", "Even the king was subject to the law", "Only nobles had rights", "Parliament had no power"],
      "answer": "Even the king was subject to the law"
    },
    {
      "question": "Which king was forced to agree to the Magna Carta?",
      "options": ["King Henry VIII", "King John", "King Edward I", "King Richard I"],
      "answer": "King John"
    },
    {
      "question": "What did the Magna Carta restrict?",
      "options": ["The nobles' power", "The Church's power", "The king's power to collect taxes and make laws", "People's freedom"],
      "answer": "The king's power to collect taxes and make laws"
    },
    {
      "question": "Who sat in the House of Lords?",
      "options": ["Common people", "Nobility, great landowners and bishops", "All property owners", "Elected representatives"],
      "answer": "Nobility, great landowners and bishops"
    },
    {
      "question": "Who sat in the House of Commons?",
      "options": ["All citizens", "Knights and wealthy people from towns and cities", "Only nobles", "Religious leaders"],
      "answer": "Knights and wealthy people from towns and cities"
    },
    {
      "question": "How many Houses did the Scottish Parliament have?",
      "options": ["Two", "Three", "Four", "One"],
      "answer": "Three"
    },
    {
      "question": "What were the three Houses of the Scottish Parliament called?",
      "options": ["Lords, Commons and Clergy", "Estates", "Chambers", "Assemblies"],
      "answer": "Estates"
    },
    {
      "question": "What is common law?",
      "options": ["Laws for common people", "Law developed by judges through precedence", "Written laws", "European law"],
      "answer": "Law developed by judges through precedence"
    },
    {
      "question": "By when was English the preferred language of the royal court?",
      "options": ["1066", "1215", "1400", "1485"],
      "answer": "1400"
    },
    {
      "question": "What is The Canterbury Tales about?",
      "options": ["A war", "People on a pilgrimage to Canterbury", "The life of a king", "A love story"],
      "answer": "People on a pilgrimage to Canterbury"
    },
    {
      "question": "Who was the first person in England to print books using a printing press?",
      "options": ["Geoffrey Chaucer", "William Caxton", "John Barbour", "William Shakespeare"],
      "answer": "William Caxton"
    },
    {
      "question": "What did John Barbour write?",
      "options": ["The Canterbury Tales", "Beowulf", "The Bruce", "Paradise Lost"],
      "answer": "The Bruce"
    },
    {
      "question": "What was The Bruce about?",
      "options": ["The Norman Conquest", "The Battle of Hastings", "The Battle of Bannockburn", "The Wars of the Roses"],
      "answer": "The Battle of Bannockburn"
    },
    {
      "question": "Which cathedrals have famous stained glass windows?",
      "options": ["St Paul's and Westminster", "York Minster and Lincoln", "Canterbury and Durham", "Salisbury and Winchester"],
      "answer": "York Minster and Lincoln"
    },
    {
      "question": "What was England's most important export in the Middle Ages?",
      "options": ["Coal", "Wool", "Iron", "Grain"],
      "answer": "Wool"
    },
    {
      "question": "What was the symbol of the House of Lancaster?",
      "options": ["A white rose", "A red rose", "A lion", "A dragon"],
      "answer": "A red rose"
    },
    {
      "question": "What was the symbol of the House of York?",
      "options": ["A white rose", "A red rose", "A lion", "A dragon"],
      "answer": "A white rose"
    },
    {
      "question": "Who became king after the Battle of Bosworth Field?",
      "options": ["Richard III", "Edward IV", "Henry Tudor (Henry VII)", "Henry V"],
      "answer": "Henry Tudor (Henry VII)"
    },
    {
      "question": "What was the symbol of the House of Tudor?",
      "options": ["A white rose", "A red rose", "A red rose with a white rose inside", "A lion and unicorn"],
      "answer": "A red rose with a white rose inside"
    }
  ],
  
  "A long and illustrious history - Chapter 3: The Tudors and Stuarts": [
    {
      "question": "Who was Henry VIII's first wife?",
      "options": ["Anne Boleyn", "Catherine of Aragon", "Jane Seymour", "Catherine Parr"],
      "answer": "Catherine of Aragon"
    },
    {
      "question": "Who was the mother of Queen Elizabeth I?",
      "options": ["Catherine of Aragon", "Anne Boleyn", "Jane Seymour", "Catherine Howard"],
      "answer": "Anne Boleyn"
    },
    {
      "question": "Which wife gave Henry VIII a son, Edward?",
      "options": ["Anne Boleyn", "Jane Seymour", "Catherine Howard", "Catherine Parr"],
      "answer": "Jane Seymour"
    },
    {
      "question": "Which wife survived Henry VIII?",
      "options": ["Anne of Cleves", "Catherine Howard", "Catherine Parr", "Jane Seymour"],
      "answer": "Catherine Parr"
    },
    {
      "question": "Why did Henry VIII want to divorce Catherine of Aragon?",
      "options": ["She was unfaithful", "She couldn't give him a son to be his heir", "She was from Spain", "She was too old"],
      "answer": "She couldn't give him a son to be his heir"
    },
    {
      "question": "Who would have the power to appoint bishops in the Church of England?",
      "options": ["The Pope", "The Archbishop", "The king", "Parliament"],
      "answer": "The king"
    },
    {
      "question": "What was the Reformation?",
      "options": ["A war", "A movement against the authority of the Pope", "An economic change", "A political revolution"],
      "answer": "A movement against the authority of the Pope"
    },
    {
      "question": "What was written during Edward VI's reign for use in the Church of England?",
      "options": ["The Bible", "The Book of Common Prayer", "The King James Bible", "The Canterbury Tales"],
      "answer": "The Book of Common Prayer"
    },
    {
      "question": "Why was Mary I called 'Bloody Mary'?",
      "options": ["She was a warrior queen", "She persecuted Protestants", "She was murdered", "She had red hair"],
      "answer": "She persecuted Protestants"
    },
    {
      "question": "What was Mary I's religion?",
      "options": ["Protestant", "Catholic", "Anglican", "Presbyterian"],
      "answer": "Catholic"
    },
    {
      "question": "What was Elizabeth I's religion?",
      "options": ["Catholic", "Protestant", "Jewish", "Muslim"],
      "answer": "Protestant"
    },
    {
      "question": "Which fleet did England defeat in 1588?",
      "options": ["The French Armada", "The Spanish Armada", "The Dutch Fleet", "The Portuguese Fleet"],
      "answer": "The Spanish Armada"
    },
    {
      "question": "Who was in command of the English fleet at Trafalgar?",
      "options": ["Sir Francis Drake", "Admiral Nelson", "Duke of Wellington", "Sir Walter Raleigh"],
      "answer": "Admiral Nelson"
    },
    {
      "question": "What was Sir Francis Drake's ship called?",
      "options": ["HMS Victory", "The Golden Hind", "The Mayflower", "The Endeavour"],
      "answer": "The Golden Hind"
    },
    {
      "question": "Where did English settlers first begin to colonise in Elizabeth I's time?",
      "options": ["Australia", "India", "Eastern coast of America", "South Africa"],
      "answer": "Eastern coast of America"
    },
    {
      "question": "When did the Church of Scotland become Protestant?",
      "options": ["1485", "1534", "1560", "1603"],
      "answer": "1560"
    },
    {
      "question": "Who was Mary, Queen of Scots' son?",
      "options": ["James I of England", "James VI of Scotland", "Both of these", "Neither of these"],
      "answer": "Both of these"
    },
    {
      "question": "Why was Mary, Queen of Scots executed?",
      "options": ["For treason", "For plotting against Elizabeth I", "For murder", "For heresy"],
      "answer": "For plotting against Elizabeth I"
    },
    {
      "question": "Which Shakespeare play features 'To be or not to be'?",
      "options": ["Macbeth", "Hamlet", "Romeo and Juliet", "Othello"],
      "answer": "Hamlet"
    },
    {
      "question": "Where is the Globe Theatre?",
      "options": ["Edinburgh", "Manchester", "London", "Stratford-upon-Avon"],
      "answer": "London"
    },
    {
      "question": "What is the Globe Theatre?",
      "options": ["Shakespeare's birthplace", "A modern copy of theatres where Shakespeare's plays were performed", "The oldest theatre in England", "A royal palace"],
      "answer": "A modern copy of theatres where Shakespeare's plays were performed"
    },
    {
      "question": "Who succeeded Elizabeth I?",
      "options": ["James VI of Scotland", "Charles I", "Henry VIII", "Mary I"],
      "answer": "James VI of Scotland"
    },
    {
      "question": "What is the King James Bible also called?",
      "options": ["The Good News Bible", "The Authorised Version", "The New Testament", "The Geneva Bible"],
      "answer": "The Authorised Version"
    },
    {
      "question": "Where did many Protestants settle in Ireland during James I's reign?",
      "options": ["Dublin", "Cork", "Ulster", "Galway"],
      "answer": "Ulster"
    },
    {
      "question": "What were these settlements in Ireland called?",
      "options": ["Colonies", "Plantations", "Estates", "Farms"],
      "answer": "Plantations"
    },
    {
      "question": "What did Charles I believe in?",
      "options": ["Democracy", "The Divine Right of Kings", "Parliamentary supremacy", "Religious freedom"],
      "answer": "The Divine Right of Kings"
    },
    {
      "question": "For how many years did Charles I rule without Parliament?",
      "options": ["5 years", "11 years", "20 years", "Never"],
      "answer": "11 years"
    },
    {
      "question": "What were the Puritans?",
      "options": ["Catholics", "A group of Protestants advocating strict religious doctrine", "Supporters of the king", "Foreign invaders"],
      "answer": "A group of Protestants advocating strict religious doctrine"
    },
    {
      "question": "What nickname were supporters of the king called in the Civil War?",
      "options": ["Roundheads", "Cavaliers", "Puritans", "Parliamentarians"],
      "answer": "Cavaliers"
    },
    {
      "question": "What were supporters of Parliament called?",
      "options": ["Cavaliers", "Roundheads", "Monarchists", "Jacobites"],
      "answer": "Roundheads"
    },
    {
      "question": "Where was Charles I executed?",
      "options": ["Tower of London", "Whitehall", "Westminster Abbey", "Windsor Castle"],
      "answer": "Whitehall"
    },
    {
      "question": "What was England called after the execution of Charles I?",
      "options": ["The Kingdom", "The Commonwealth", "The Republic", "The Empire"],
      "answer": "The Commonwealth"
    },
    {
      "question": "Where did Charles II famously hide from Cromwell's forces?",
      "options": ["In a church", "In an oak tree", "In a cellar", "In a castle"],
      "answer": "In an oak tree"
    },
    {
      "question": "When was the Great Fire of London?",
      "options": ["1660", "1665", "1666", "1679"],
      "answer": "1666"
    },
    {
      "question": "When was there a major outbreak of plague in London?",
      "options": ["1660", "1665", "1666", "1679"],
      "answer": "1665"
    },
    {
      "question": "Who designed the new St Paul's Cathedral?",
      "options": ["Inigo Jones", "Sir Christopher Wren", "Robert Adam", "John Nash"],
      "answer": "Sir Christopher Wren"
    },
    {
      "question": "Who kept a famous diary recording the Great Fire and plague?",
      "options": ["Charles II", "Samuel Pepys", "Isaac Newton", "Christopher Wren"],
      "answer": "Samuel Pepys"
    },
    {
      "question": "When was the Habeas Corpus Act passed?",
      "options": ["1660", "1665", "1679", "1688"],
      "answer": "1679"
    },
    {
      "question": "What does the Habeas Corpus Act guarantee?",
      "options": ["Freedom of speech", "That no one can be held prisoner unlawfully", "The right to vote", "Freedom of religion"],
      "answer": "That no one can be held prisoner unlawfully"
    },
    {
      "question": "Which organisation promoted 'natural knowledge'?",
      "options": ["The British Museum", "The Royal Society", "The Royal Academy", "The British Library"],
      "answer": "The Royal Society"
    },
    {
      "question": "Who predicted the return of Halley's Comet?",
      "options": ["Isaac Newton", "Edmund Halley", "Robert Boyle", "Charles Darwin"],
      "answer": "Edmund Halley"
    },
    {
      "question": "What was Isaac Newton's most famous work?",
      "options": ["The Origin of Species", "Philosophiae Naturalis Principia Mathematica", "The Canterbury Tales", "Paradise Lost"],
      "answer": "Philosophiae Naturalis Principia Mathematica"
    },
    {
      "question": "What did Isaac Newton discover about white light?",
      "options": ["It's pure", "It's made up of the colours of the rainbow", "It's invisible", "It travels in waves"],
      "answer": "It's made up of the colours of the rainbow"
    },
    {
      "question": "What was James II's religion?",
      "options": ["Protestant", "Catholic", "Anglican", "Presbyterian"],
      "answer": "Catholic"
    },
    {
      "question": "Who was William of Orange married to?",
      "options": ["Mary, daughter of James II", "Anne", "Catherine", "Elizabeth"],
      "answer": "Mary, daughter of James II"
    },
    {
      "question": "Where did William of Orange defeat James II?",
      "options": ["Battle of Hastings", "Battle of the Boyne", "Battle of Bannockburn", "Battle of Waterloo"],
      "answer": "Battle of the Boyne"
    },
    {
      "question": "What were supporters of James II called?",
      "options": ["Cavaliers", "Roundheads", "Jacobites", "Royalists"],
      "answer": "Jacobites"
    }
  ],
  
  "A long and illustrious history - Chapter 4: A Global Power": [
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
      "question": "What is the name of Anne's husband?",
      "options": ["George of Denmark", "William of Orange", "Philip of Spain", "James Stuart"],
      "answer": "George of Denmark"
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
      "question": "Where did Charles Edward Stuart arrive in 1745?",
      "options": ["England", "Wales", "Scotland", "Ireland"],
      "answer": "Scotland"
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
      "question": "What developed during Robert Walpole's time in office?",
      "options": ["The monarchy", "The idea of a Prime Minister", "The House of Lords", "The Church"],
      "answer": "The idea of a Prime Minister"
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
      "question": "Which famous column in Trafalgar Square commemorates Admiral Nelson?",
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
      "question": "Who was the Enlightenment philosopher that influenced the American Declaration of Independence?",
      "options": ["David Hume", "Adam Smith", "John Locke", "Edmund Burke"],
      "answer": "John Locke"
    },
    {
      "question": "Who wrote The Wealth of Nations?",
      "options": ["David Hume", "Adam Smith", "John Locke", "Edmund Burke"],
      "answer": "Adam Smith"
    },
    {
      "question": "When was the Industrial Revolution?",
      "options": ["17th century", "18th and 19th centuries", "20th century", "16th century"],
      "answer": "18th and 19th centuries"
    },
    {
      "question": "What did Richard Arkwright develop?",
      "options": ["The steam engine", "Horse-drawn machinery", "The spinning jenny", "The power loom"],
      "answer": "Horse-drawn machinery"
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
    },
    {
      "question": "What was the Rocket?",
      "options": ["A ship", "An early steam locomotive", "A factory machine", "A weapon"],
      "answer": "An early steam locomotive"
    },
    {
      "question": "What was Isambard Kingdom Brunel famous for?",
      "options": ["Inventing the steam engine", "Being a famous engineer (bridges, tunnels, ships)", "Writing books", "Being Prime Minister"],
      "answer": "Being a famous engineer (bridges, tunnels, ships)"
    },
    {
      "question": "Where did Brunel's SS Great Britain sail between?",
      "options": ["England and France", "Britain and the West Indies", "London and Edinburgh", "Britain and Australia"],
      "answer": "Britain and the West Indies"
    },
    {
      "question": "What did the Industrial Revolution produce on a large scale?",
      "options": ["Food", "Iron and steel", "Gold", "Cloth only"],
      "answer": "Iron and steel"
    }
  ],
  
  "A long and illustrious history - Chapter 5: The Victorian Age": [
    {
      "question": "How old was Queen Victoria when she became queen?",
      "options": ["16", "18", "21", "25"],
      "answer": "18"
    },
    {
      "question": "How long did Queen Victoria reign?",
      "options": ["50 years", "60 years", "64 years", "70 years"],
      "answer": "64 years"
    },
    {
      "question": "Who did Queen Victoria marry?",
      "options": ["Prince Albert of Saxe-Coburg Gotha", "George of Denmark", "William of Orange", "Philip of Spain"],
      "answer": "Prince Albert of Saxe-Coburg Gotha"
    },
    {
      "question": "How many children did Victoria and Albert have?",
      "options": ["5", "7", "9", "11"],
      "answer": "9"
    },
    {
      "question": "What did Prince Albert introduce to Britain from Germany?",
      "options": ["Easter eggs", "The Christmas tree", "Halloween", "Fireworks"],
      "answer": "The Christmas tree"
    },
    {
      "question": "What did Prince Albert organise in 1851?",
      "options": ["The Olympic Games", "The Great Exhibition", "The World's Fair", "The Royal Show"],
      "answer": "The Great Exhibition"
    },
    {
      "question": "Where was the Great Exhibition held?",
      "options": ["The British Museum", "Hyde Park, London", "Crystal Palace", "Both B and C"],
      "answer": "Both B and C"
    },
    {
      "question": "What did Britain control during Victoria's reign?",
      "options": ["Most of Europe", "An empire covering a quarter of the world", "Just the British Isles", "North America"],
      "answer": "An empire covering a quarter of the world"
    },
    {
      "question": "Which country did Britain control in Victoria's time that is now independent?",
      "options": ["France", "India", "China", "Russia"],
      "answer": "India"
    },
    {
      "question": "What did Florence Nightingale do?",
      "options": ["She was a queen", "She founded modern nursing", "She was an explorer", "She was a scientist"],
      "answer": "She founded modern nursing"
    },
    {
      "question": "Where did Florence Nightingale become famous?",
      "options": ["In hospitals in London", "In the Crimean War", "In India", "In South Africa"],
      "answer": "In the Crimean War"
    },
    {
      "question": "What did Florence Nightingale found?",
      "options": ["The Red Cross", "The Nightingale Training School for nurses", "A hospital", "A charity"],
      "answer": "The Nightingale Training School for nurses"
    },
    {
      "question": "When did the Crimean War take place?",
      "options": ["1832-1835", "1853-1856", "1870-1873", "1899-1902"],
      "answer": "1853-1856"
    },
    {
      "question": "Who fought in the Crimean War?",
      "options": ["Britain and France against Russia", "Britain against France", "Britain against Germany", "Britain against Spain"],
      "answer": "Britain and France against Russia"
    },
    {
      "question": "Who wrote about the Irish famine?",
      "options": ["Charles Dickens", "The Brontë sisters", "Jane Austen", "Thomas Hardy"],
      "answer": "The Brontë sisters"
    },
    {
      "question": "What is another name for the Irish famine?",
      "options": ["The Great Famine", "The Potato Famine", "The Great Hunger", "All of these"],
      "answer": "All of these"
    },
    {
      "question": "How many Irish people migrated to England due to the famine?",
      "options": ["100,000", "500,000", "1.5 million", "5 million"],
      "answer": "1.5 million"
    },
    {
      "question": "When did free compulsory education begin in England?",
      "options": ["1832", "1853", "1870", "1901"],
      "answer": "1870"
    },
    {
      "question": "When was the Reform Act passed?",
      "options": ["1801", "1832", "1870", "1901"],
      "answer": "1832"
    },
    {
      "question": "What did the Reform Act do?",
      "options": ["Gave women the vote", "Gave middle-class men the vote", "Abolished slavery", "Created the NHS"],
      "answer": "Gave middle-class men the vote"
    },
    {
      "question": "What is the Chartist movement remembered for?",
      "options": ["Fighting for women's rights", "Campaigning for the vote for the working class", "Opposing slavery", "Promoting education"],
      "answer": "Campaigning for the vote for the working class"
    },
    {
      "question": "What did the Chartists take their name from?",
      "options": ["The Charter of Rights", "The People's Charter", "The Magna Carta", "The Reform Charter"],
      "answer": "The People's Charter"
    },
    {
      "question": "When was slavery abolished throughout the British Empire?",
      "options": ["1776", "1807", "1833", "1870"],
      "answer": "1833"
    },
    {
      "question": "When did it become illegal to trade slaves?",
      "options": ["1776", "1807", "1833", "1870"],
      "answer": "1807"
    },
    {
      "question": "Who was a prominent anti-slavery campaigner?",
      "options": ["William Wilberforce", "Florence Nightingale", "Emmeline Pankhurst", "Isambard Kingdom Brunel"],
      "answer": "William Wilberforce"
    },
    {
      "question": "What did trade unions campaign for?",
      "options": ["Better rights and conditions for workers", "Lower taxes", "Independence", "More factories"],
      "answer": "Better rights and conditions for workers"
    },
    {
      "question": "Who wrote Oliver Twist?",
      "options": ["Jane Austen", "Charles Dickens", "Thomas Hardy", "Robert Louis Stevenson"],
      "answer": "Charles Dickens"
    },
    {
      "question": "Who wrote Jane Eyre?",
      "options": ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Anne Brontë"],
      "answer": "Charlotte Brontë"
    },
    {
      "question": "Who wrote Wuthering Heights?",
      "options": ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Anne Brontë"],
      "answer": "Emily Brontë"
    },
    {
      "question": "Who wrote Pride and Prejudice?",
      "options": ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "George Eliot"],
      "answer": "Jane Austen"
    },
    {
      "question": "Who wrote Treasure Island and Kidnapped?",
      "options": ["Charles Dickens", "Robert Louis Stevenson", "Arthur Conan Doyle", "Thomas Hardy"],
      "answer": "Robert Louis Stevenson"
    },
    {
      "question": "Who created the character Sherlock Holmes?",
      "options": ["Charles Dickens", "Robert Louis Stevenson", "Sir Arthur Conan Doyle", "Rudyard Kipling"],
      "answer": "Sir Arthur Conan Doyle"
    }
  ],
  
  "A long and illustrious history - Chapter 6: The 20th Century": [
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
      "question": "On what day did WWI end?",
      "options": ["11 November", "25 December", "5 April", "1 July"],
      "answer": "11 November"
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
      "question": "What was the Battle of the Somme?",
      "options": ["A naval battle", "One of the worst battles where many died", "A French victory", "The last battle of WWI"],
      "answer": "One of the worst battles where many died"
    },
    {
      "question": "Who wrote war poems that are still remembered?",
      "options": ["William Shakespeare", "John Keats", "Rupert Brooke and Wilfred Owen", "Lord Byron"],
      "answer": "Rupert Brooke and Wilfred Owen"
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
      "question": "What was the Irish Free State later called?",
      "options": ["Republic of Ireland (also known as Eire)", "Eire", "Southern Ireland", "Ulster"],
      "answer": "Republic of Ireland (also known as Eire)"
    },
    {
      "question": "What remained part of the UK after 1921?",
      "options": ["All of Ireland", "Northern Ireland", "Southern Ireland", "Dublin"],
      "answer": "Northern Ireland"
    },
    {
      "question": "When did the Great Depression happen?",
      "options": ["1914-1918", "1920s", "1930s", "1940s"],
      "answer": "1930s"
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
      "question": "What were the allied forces that fought against Germany?",
      "options": ["UK, France, USA, Soviet Union", "UK, Germany, Italy", "UK, Japan, China", "UK, Spain, Portugal"],
      "answer": "UK, France, USA, Soviet Union"
    },
    {
      "question": "What important day happened on 6 June 1944?",
      "options": ["VE Day", "D-Day", "VJ Day", "Armistice Day"],
      "answer": "D-Day"
    },
    {
      "question": "What was D-Day?",
      "options": ["The end of the war", "The allied invasion of Europe", "The Battle of Britain", "The bombing of London"],
      "answer": "The allied invasion of Europe"
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
      "question": "Which British city was heavily bombed in the Blitz?",
      "options": ["Manchester only", "Coventry", "All major cities", "Both B and C"],
      "answer": "Both B and C"
    },
    {
      "question": "What did Alexander Fleming discover?",
      "options": ["DNA", "Penicillin", "The atom", "Gravity"],
      "answer": "Penicillin"
    }
  ],
  
  "A long and illustrious history - Chapter 7: Britain since 1945": [
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
      "question": "What happened to most British colonies after 1945?",
      "options": ["They were sold", "They became independent", "They were conquered", "Nothing changed"],
      "answer": "They became independent"
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
      "question": "Who is the head of the Commonwealth?",
      "options": ["The Prime Minister", "The Queen (monarch)", "The President", "The Commonwealth Secretary"],
      "answer": "The Queen (monarch)"
    },
    {
      "question": "When did Britain join the European Economic Community (EEC)?",
      "options": ["1945", "1957", "1973", "1992"],
      "answer": "1973"
    },
    {
      "question": "What was the EEC's main purpose?",
      "options": ["Military defense", "Economic cooperation", "Cultural exchange", "Space exploration"],
      "answer": "Economic cooperation"
    },
    {
      "question": "What did the EEC become?",
      "options": ["NATO", "The United Nations", "The European Union (EU)", "The Commonwealth"],
      "answer": "The European Union (EU)"
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
      "question": "What is the period after WWII when people came to the UK from overseas called?",
      "options": ["Migration and immigration", "Immigration", "Emigration", "Migration"],
      "answer": "Migration and immigration"
    },
    {
      "question": "Where did the 'Windrush generation' come from?",
      "options": ["India", "The Caribbean", "Africa", "Eastern Europe"],
      "answer": "The Caribbean"
    },
    {
      "question": "Why were people encouraged to come to the UK after WWII?",
      "options": ["For tourism", "To help rebuild the country", "For education", "To escape war"],
      "answer": "To help rebuild the country"
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
    },
    {
      "question": "Which nations have devolved administrations?",
      "options": ["Scotland only", "Wales only", "Northern Ireland only", "Scotland, Wales and Northern Ireland"],
      "answer": "Scotland, Wales and Northern Ireland"
    },
    {
      "question": "What can devolved administrations make decisions about?",
      "options": ["Foreign policy", "Defense", "Education and health", "All government matters"],
      "answer": "Education and health"
    }
  ],
  
  "A modern, thriving society - Chapter 1: The UK Today": [
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
      "question": "Where does the majority of the UK population live?",
      "options": ["Rural areas", "Small villages", "Towns and cities", "Coastal areas"],
      "answer": "Towns and cities"
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
      "question": "Is there an established Church in Wales or Northern Ireland?",
      "options": ["Yes", "No", "Only in Wales", "Only in Northern Ireland"],
      "answer": "No"
    },
    {
      "question": "What percentage of the population has a religious affiliation?",
      "options": ["40%", "50%", "60%", "70%"],
      "answer": "70%"
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
      "question": "What are the patron saints' days treated as in the UK?",
      "options": ["Public holidays", "Normal working days", "Bank holidays", "Religious festivals"],
      "answer": "Normal working days"
    },
    {
      "question": "What are traditional foods in the UK?",
      "options": ["Only fish and chips", "Roast dinners and fish and chips", "Only curry", "Pizza and pasta"],
      "answer": "Roast dinners and fish and chips"
    },
    {
      "question": "Which cuisines are popular in the UK?",
      "options": ["Only British food", "Food from all over the world", "Only European food", "Only Asian food"],
      "answer": "Food from all over the world"
    },
    {
      "question": "What are famous UK films?",
      "options": ["The Harry Potter series", "The James Bond films", "Both A and B", "Neither"],
      "answer": "Both A and B"
    },
    {
      "question": "Which city hosts an international film festival?",
      "options": ["London", "Manchester", "Edinburgh", "Belfast"],
      "answer": "Edinburgh"
    },
    {
      "question": "What is British comedy known for?",
      "options": ["Slapstick", "Satire and irony", "Physical comedy", "Romantic comedy"],
      "answer": "Satire and irony"
    },
    {
      "question": "Which famous British bands are mentioned?",
      "options": ["The Beatles", "The Rolling Stones", "Both A and B", "Neither"],
      "answer": "Both A and B"
    },
    {
      "question": "What major music festivals are held in the UK?",
      "options": ["Glastonbury", "The Proms", "Both A and B", "Neither"],
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
    },
    {
      "question": "Which famous building was designed by Norman Foster?",
      "options": ["Big Ben", "The Gherkin", "Buckingham Palace", "Tower Bridge"],
      "answer": "The Gherkin"
    },
    {
      "question": "Who designed the Scottish Parliament building?",
      "options": ["Norman Foster", "Zaha Hadid", "Enric Miralles", "Richard Rogers"],
      "answer": "Enric Miralles"
    },
    {
      "question": "What is a notable fashion event in the UK?",
      "options": ["Paris Fashion Week", "London Fashion Week", "Milan Fashion Week", "New York Fashion Week"],
      "answer": "London Fashion Week"
    }
  ],
  
  "A modern, thriving society - Chapter 2: UK Government, the Law and Your Role": [
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
      "question": "Who is the current monarch?",
      "options": ["Queen Elizabeth II", "King Charles III", "Prince William", "Queen Victoria"],
      "answer": "King Charles III"
    },
    {
      "question": "What is the official home of the monarch in London?",
      "options": ["Windsor Castle", "Kensington Palace", "Buckingham Palace", "Hampton Court"],
      "answer": "Buckingham Palace"
    },
    {
      "question": "Where does the monarch usually spend weekends?",
      "options": ["Buckingham Palace", "Windsor Castle", "Balmoral", "Sandringham"],
      "answer": "Windsor Castle"
    },
    {
      "question": "What constitutional role does the monarch have?",
      "options": ["Makes all laws", "Ceremonial role", "Rules the country", "Commands the military"],
      "answer": "Ceremonial role"
    },
    {
      "question": "What is the system of government in the UK called?",
      "options": ["Presidential system", "Parliamentary system", "Federal system", "Confederate system"],
      "answer": "Parliamentary system"
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
      "question": "Who cannot vote in the UK?",
      "options": ["Convicted prisoners", "Irish citizens", "Commonwealth citizens", "EU citizens"],
      "answer": "Convicted prisoners"
    },
    {
      "question": "Where do you register to vote?",
      "options": ["At the post office", "At the Electoral Register", "At the library", "At the police station"],
      "answer": "At the Electoral Register"
    },
    {
      "question": "What is the leader of the government called?",
      "options": ["The President", "The Prime Minister", "The Chancellor", "The Speaker"],
      "answer": "The Prime Minister"
    },
    {
      "question": "Who usually becomes Prime Minister?",
      "options": ["The oldest MP", "The leader of the party with the most MPs", "The monarch's choice", "The richest candidate"],
      "answer": "The leader of the party with the most MPs"
    },
    {
      "question": "What is the Prime Minister's residence in London?",
      "options": ["Buckingham Palace", "10 Downing Street", "Westminster Abbey", "The Houses of Parliament"],
      "answer": "10 Downing Street"
    },
    {
      "question": "What is the cabinet?",
      "options": ["A storage unit", "Senior MPs chosen by the PM to lead government departments", "All MPs", "The royal family"],
      "answer": "Senior MPs chosen by the PM to lead government departments"
    },
    {
      "question": "What is the opposition?",
      "options": ["The monarch", "The second largest party", "Protesters", "The media"],
      "answer": "The second largest party"
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
      "question": "How often does PMQs take place?",
      "options": ["Daily", "Every week", "Monthly", "Annually"],
      "answer": "Every week"
    },
    {
      "question": "How do people become members of the House of Lords?",
      "options": ["Election", "Appointment", "Inheritance", "Both B and C"],
      "answer": "Both B and C"
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
      "question": "What is the Welsh Assembly now called?",
      "options": ["Welsh Parliament", "Senedd Cymru", "Welsh Congress", "Both A and B"],
      "answer": "Both A and B"
    },
    {
      "question": "What is the Northern Ireland Assembly also known as?",
      "options": ["Stormont", "Belfast Assembly", "Ulster Parliament", "Irish Assembly"],
      "answer": "Stormont"
    },
    {
      "question": "What powers do local authorities have?",
      "options": ["Foreign policy", "Education and social services", "National defense", "Immigration"],
      "answer": "Education and social services"
    },
    {
      "question": "Who pays for local services?",
      "options": ["Only the government", "Council tax", "Only property owners", "Donations"],
      "answer": "Council tax"
    },
    {
      "question": "Who can stand as a candidate in local elections?",
      "options": ["Only UK citizens", "EU and Commonwealth citizens", "Anyone", "Only property owners"],
      "answer": "EU and Commonwealth citizens"
    },
    {
      "question": "What is the highest court in the UK?",
      "options": ["The Crown Court", "The High Court", "The Supreme Court", "The Court of Appeal"],
      "answer": "The Supreme Court"
    },
    {
      "question": "Where is the Supreme Court located?",
      "options": ["Edinburgh", "Cardiff", "London", "Belfast"],
      "answer": "London"
    },
    {
      "question": "What is the role of the Supreme Court?",
      "options": ["Making laws", "Interpreting the law", "Arresting criminals", "Running prisons"],
      "answer": "Interpreting the law"
    },
    {
      "question": "What is civil law concerned with?",
      "options": ["Crimes", "Disputes between individuals", "Government policies", "International relations"],
      "answer": "Disputes between individuals"
    },
    {
      "question": "What is criminal law concerned with?",
      "options": ["Disputes between individuals", "Crimes punishable by the state", "Business matters", "Property rights"],
      "answer": "Crimes punishable by the state"
    },
    {
      "question": "What are the two principles of British criminal law?",
      "options": ["Guilty until proven innocent", "Innocent until proven guilty", "Everyone is guilty", "No one is guilty"],
      "answer": "Innocent until proven guilty"
    },
    {
      "question": "What is the role of the police?",
      "options": ["To make laws", "To protect life and property, prevent crime", "To judge criminals", "To run prisons"],
      "answer": "To protect life and property, prevent crime"
    },
    {
      "question": "What should you do if stopped by the police?",
      "options": ["Run away", "Give your name and address", "Refuse to cooperate", "Ignore them"],
      "answer": "Give your name and address"
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
      "question": "What are fundamental principles of British life?",
      "options": ["Democracy and rule of law", "Tolerance and respect", "All of these", "None of these"],
      "answer": "All of these"
    },
    {
      "question": "What responsibilities do UK residents have?",
      "options": ["To obey the law", "To look after the environment", "To treat others with fairness", "All of these"],
      "answer": "All of these"
    },
    {
      "question": "What rights do UK residents have?",
      "options": ["Freedom of speech", "A right to a fair trial", "Both of these", "Neither"],
      "answer": "Both of these"
    },
    {
      "question": "What must you do if you employ someone?",
      "options": ["Nothing special", "Pay them minimum wage and follow employment law", "Pay them whatever you want", "You can't employ anyone"],
      "answer": "Pay them minimum wage and follow employment law"
    },
    {
      "question": "What is National Insurance used for?",
      "options": ["Military spending", "State retirement pension and unemployment benefits", "Education", "Healthcare only"],
      "answer": "State retirement pension and unemployment benefits"
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
    console.log(`Added ${moreQuestions.length} more questions to: ${topic.title} (Total: ${topic.questions.length})`);
  }
});

fs.writeFileSync('topics.json', JSON.stringify(topicsData, null, 2), 'utf8');
console.log('\nAll additional questions added successfully!');
