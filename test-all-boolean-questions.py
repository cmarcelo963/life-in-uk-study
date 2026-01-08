import json
import hashlib

# Load the questions
with open('topics_grouped.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# This is the exact logic from app.js renderQuestion() function
def transform_boolean_question(question_text):
    # Extract answer and question parts
    match_answer = question_text.split(' is the correct answer to: ')
    
    if len(match_answer) == 2:
        answer = match_answer[0]
        question_part = match_answer[1]
        
        # Determine if this question should be inverted (40% probability, deterministic)
        hash_val = int(hashlib.md5(question_text.encode()).hexdigest(), 16)
        should_invert = (hash_val % 100) < 40
        
        # Pattern matching logic from app.js
        if question_part.startswith("Who is ") or question_part.startswith("Who was "):
            prefix = "Who is " if question_part.startswith("Who is ") else "Who was "
            rest = question_part[len(prefix):]
            if should_invert:
                display_text = f"{rest.rstrip('?')} is NOT {answer}"
                rendered_answer = False
            else:
                display_text = f"{rest.rstrip('?')} is {answer}"
                rendered_answer = True
        elif question_part.startswith("What is ") or question_part.startswith("What was "):
            prefix = "What is " if question_part.startswith("What is ") else "What was "
            rest = question_part[len(prefix):]
            if should_invert:
                display_text = f"{rest.rstrip('?')} is NOT {answer}"
                rendered_answer = False
            else:
                display_text = f"{rest.rstrip('?')} is {answer}"
                rendered_answer = True
        elif question_part.startswith("Which "):
            if should_invert:
                display_text = f"It is FALSE that: {question_part.rstrip('?')}: {answer}"
                rendered_answer = False
            else:
                display_text = f"{question_part.rstrip('?')}: {answer}"
                rendered_answer = True
        elif question_part.startswith("When "):
            if should_invert:
                display_text = f"It is FALSE that: {question_part.rstrip('?')}: {answer}"
                rendered_answer = False
            else:
                display_text = f"{question_part.rstrip('?')}: {answer}"
                rendered_answer = True
        elif question_part.startswith("Why "):
            if should_invert:
                display_text = f"It is FALSE that: {question_part.rstrip('?')}: {answer}"
                rendered_answer = False
            else:
                display_text = f"{question_part.rstrip('?')}: {answer}"
                rendered_answer = True
        elif question_part.startswith("Where "):
            if should_invert:
                display_text = f"It is FALSE that: {question_part.rstrip('?')}: {answer}"
                rendered_answer = False
            else:
                display_text = f"{question_part.rstrip('?')}: {answer}"
                rendered_answer = True
        elif question_part.startswith("How many "):
            if should_invert:
                display_text = f"It is FALSE that: {question_part.rstrip('?')}: {answer}"
                rendered_answer = False
            else:
                display_text = f"{question_part.rstrip('?')}: {answer}"
                rendered_answer = True
        else:
            # Default pattern
            if should_invert:
                display_text = f"It is FALSE that: {question_part.rstrip('?')}: {answer}"
                rendered_answer = False
            else:
                display_text = f"{question_part.rstrip('?')}: {answer}"
                rendered_answer = True
                
        return display_text, rendered_answer, should_invert
    
    # If pattern doesn't match, check if it starts with "Question:"
    elif question_text.startswith("Question: "):
        statement = question_text[10:]  # Remove "Question: " prefix
        hash_val = int(hashlib.md5(question_text.encode()).hexdigest(), 16)
        should_invert = (hash_val % 100) < 40
        
        if should_invert:
            display_text = f"It is FALSE that: {statement}"
            rendered_answer = False
        else:
            display_text = statement
            rendered_answer = True
            
        return display_text, rendered_answer, should_invert
    
    # If no pattern matches
    elif question_text.startswith("Which TWO"):
        # Special case - not a standard boolean
        return question_text, True, False
    
    return question_text, True, False

# Collect all boolean questions
all_boolean_questions = []
question_count = 0
pattern_counts = {
    'Who is/was': 0,
    'What is/was': 0,
    'Which': 0,
    'When': 0,
    'Why': 0,
    'Where': 0,
    'How many': 0,
    'Question:': 0,
    'Which TWO': 0,
    'Other': 0
}

true_count = 0
false_count = 0

for group in data:
    if 'questionGroups' in group:
        for question_group in group['questionGroups']:
            if 'variations' in question_group:
                for variation in question_group['variations']:
                    if variation.get('type') == 'boolean' and variation.get('answer') == True:
                        question_count += 1
                        question_text = variation['question']
                        
                        # Categorize
                        if ' is the correct answer to: ' in question_text:
                            parts = question_text.split(' is the correct answer to: ')
                            if len(parts) == 2:
                                q_part = parts[1]
                                if q_part.startswith('Who is ') or q_part.startswith('Who was '):
                                    pattern_counts['Who is/was'] += 1
                                elif q_part.startswith('What is ') or q_part.startswith('What was '):
                                    pattern_counts['What is/was'] += 1
                                elif q_part.startswith('Which '):
                                    pattern_counts['Which'] += 1
                                elif q_part.startswith('When '):
                                    pattern_counts['When'] += 1
                                elif q_part.startswith('Why '):
                                    pattern_counts['Why'] += 1
                                elif q_part.startswith('Where '):
                                    pattern_counts['Where'] += 1
                                elif q_part.startswith('How many '):
                                    pattern_counts['How many'] += 1
                                else:
                                    pattern_counts['Other'] += 1
                        elif question_text.startswith('Question: '):
                            pattern_counts['Question:'] += 1
                        elif question_text.startswith('Which TWO'):
                            pattern_counts['Which TWO'] += 1
                        else:
                            pattern_counts['Other'] += 1
                        
                        # Transform and collect
                        display_text, rendered_answer, inverted = transform_boolean_question(question_text)
                        
                        if rendered_answer:
                            true_count += 1
                        else:
                            false_count += 1
                        
                        all_boolean_questions.append({
                            'original': question_text,
                            'transformed': display_text,
                            'answer': 'TRUE' if rendered_answer else 'FALSE',
                            'inverted': inverted
                        })

# Generate comprehensive report
print("=" * 100)
print("COMPREHENSIVE BOOLEAN QUESTION VALIDATION REPORT")
print("=" * 100)
print(f"\nTotal boolean questions found: {question_count}")
print(f"TRUE answers: {true_count} ({true_count/question_count*100:.1f}%)")
print(f"FALSE answers: {false_count} ({false_count/question_count*100:.1f}%)")
print("\nPattern Distribution:")
for pattern, count in pattern_counts.items():
    if count > 0:
        print(f"  {pattern}: {count}")

print("\n" + "=" * 100)
print("ALL TRANSFORMED QUESTIONS (First 50 for readability)")
print("=" * 100)

for i, q in enumerate(all_boolean_questions[:50], 1):
    print(f"\n#{i}")
    print(f"ORIGINAL: {q['original'][:150]}{'...' if len(q['original']) > 150 else ''}")
    print(f"TRANSFORMED: {q['transformed']}")
    print(f"ANSWER: {q['answer']}")

# Save full results to file
with open('all-boolean-questions-validation.json', 'w', encoding='utf-8') as f:
    json.dump({
        'summary': {
            'total_questions': question_count,
            'true_count': true_count,
            'false_count': false_count,
            'pattern_distribution': pattern_counts
        },
        'all_questions': all_boolean_questions
    }, f, indent=2, ensure_ascii=False)

print("\n" + "=" * 100)
print(f"Full results saved to: all-boolean-questions-validation.json")
print(f"Total questions processed: {question_count}")
print("=" * 100)

# Check for any problematic transformations
problematic = []
for q in all_boolean_questions:
    # Check if transformation looks incomplete or weird
    if len(q['transformed']) < 10:
        problematic.append(('Too short', q))
    elif q['transformed'] == q['original'] and 'is the correct answer to:' in q['original']:
        problematic.append(('Not transformed', q))

if problematic:
    print("\n⚠️  POTENTIAL ISSUES FOUND:")
    for issue_type, q in problematic[:10]:  # Show first 10
        print(f"\n{issue_type}:")
        print(f"  ORIGINAL: {q['original'][:100]}")
        print(f"  TRANSFORMED: {q['transformed'][:100]}")
else:
    print("\n✅ All questions appear to transform correctly!")
