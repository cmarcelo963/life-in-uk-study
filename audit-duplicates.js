const fs = require('fs');
const path = require('path');

const questionsFile = path.join(__dirname, 'data', 'questions.json');

try {
  const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
  const totalCount = Array.isArray(questions) ? questions.length : 1;
  
  console.log(`\nTotal questions: ${totalCount}\n`);
  
  // Check for duplicate IDs
  console.log('=== DUPLICATE ID CHECK ===');
  const idMap = {};
  const duplicateIds = {};
  
  questions.forEach((q, idx) => {
    if (idMap[q.id]) {
      if (!duplicateIds[q.id]) {
        duplicateIds[q.id] = [idMap[q.id]];
      }
      duplicateIds[q.id].push(idx);
    } else {
      idMap[q.id] = idx;
    }
  });
  
  if (Object.keys(duplicateIds).length > 0) {
    console.log(`❌ Found ${Object.keys(duplicateIds).length} duplicate ID(s):`);
    Object.entries(duplicateIds).forEach(([id, indices]) => {
      console.log(`  ID "${id}" appears ${indices.length + 1} times at indices: ${indices.join(', ')}, ${Object.keys(idMap).indexOf(id) !== -1 ? idMap[id] : '?'}`);
    });
  } else {
    console.log('✓ No duplicate IDs found\n');
  }
  
  // Check for duplicate question text
  console.log('\n=== DUPLICATE QUESTION TEXT CHECK ===');
  const questionMap = {};
  const duplicateQuestions = {};
  
  questions.forEach((q, idx) => {
    const questionText = q.question;
    if (questionMap[questionText]) {
      if (!duplicateQuestions[questionText]) {
        duplicateQuestions[questionText] = [questionMap[questionText]];
      }
      duplicateQuestions[questionText].push(idx);
    } else {
      questionMap[questionText] = idx;
    }
  });
  
  if (Object.keys(duplicateQuestions).length > 0) {
    console.log(`❌ Found ${Object.keys(duplicateQuestions).length} duplicate question(s):`);
    Object.entries(duplicateQuestions).forEach(([questionText, indices]) => {
      console.log(`\n  Question appears ${indices.length + 1} times:`);
      console.log(`  "${questionText.substring(0, 80)}${questionText.length > 80 ? '...' : ''}"`);
      const allIndices = [questionMap[questionText], ...indices];
      allIndices.forEach(idx => {
        console.log(`    - Index ${idx}: ID "${questions[idx].id}"`);
      });
    });
  } else {
    console.log('✓ No duplicate question text found\n');
  }
  
  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total questions: ${totalCount}`);
  console.log(`Duplicate IDs: ${Object.keys(duplicateIds).length}`);
  console.log(`Duplicate questions: ${Object.keys(duplicateQuestions).length}`);
  
  if (Object.keys(duplicateIds).length === 0 && Object.keys(duplicateQuestions).length === 0) {
    console.log('\n✓ Audit complete: No duplicates found!\n');
  } else {
    console.log('\n⚠️ Audit complete: Duplicates detected!\n');
  }
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
