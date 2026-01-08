import json

# Load the validation results
with open('all-boolean-questions-validation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

all_questions = data['all_questions']
summary = data['summary']

print("=" * 100)
print("DETAILED ANALYSIS OF ALL 336 BOOLEAN QUESTION TRANSFORMATIONS")
print("=" * 100)

print(f"\n📊 SUMMARY:")
print(f"   Total Questions: {summary['total_questions']}")
print(f"   TRUE Answers: {summary['true_count']} ({summary['true_count']/summary['total_questions']*100:.1f}%)")
print(f"   FALSE Answers: {summary['false_count']} ({summary['false_count']/summary['total_questions']*100:.1f}%)")

print("\n📋 PATTERN DISTRIBUTION:")
for pattern, count in sorted(summary['pattern_distribution'].items(), key=lambda x: x[1], reverse=True):
    if count > 0:
        print(f"   {pattern}: {count}")

# Analyze specific concerns
print("\n" + "=" * 100)
print("🔍 QUALITY CHECK - Looking for potential issues:")
print("=" * 100)

issues_found = []

# Check 1: Questions that might be confusing
for i, q in enumerate(all_questions):
    trans = q['transformed']
    
    # Issue 1: Very long transformations
    if len(trans) > 200:
        issues_found.append(('Very Long (>200 chars)', i, q))
    
    # Issue 2: Contains "is NOT" or "FALSE" - check if grammatically sound
    if ' is NOT ' in trans or 'It is FALSE that:' in trans:
        # These are inverted - make sure they make sense
        if trans.count(':') > 2:  # Too many colons might be confusing
            issues_found.append(('Too many colons in FALSE statement', i, q))
    
    # Issue 3: Missing question context (too short)
    if len(trans) < 30 and 'Which TWO' not in q['original']:
        issues_found.append(('Very Short (<30 chars)', i, q))
    
    # Issue 4: Double colons or weird punctuation
    if '::' in trans or ': :' in trans:
        issues_found.append(('Double colons', i, q))

if issues_found:
    print(f"\n⚠️  Found {len(issues_found)} potential issues:\n")
    for issue_type, idx, q in issues_found[:20]:  # Show first 20
        print(f"Issue Type: {issue_type}")
        print(f"Question #{idx + 1}")
        print(f"TRANSFORMED: {q['transformed']}")
        print(f"ANSWER: {q['answer']}")
        print("-" * 80)
else:
    print("\n✅ No major issues found in transformations!")

# Sample each pattern type
print("\n" + "=" * 100)
print("📚 SAMPLE TRANSFORMATIONS BY PATTERN:")
print("=" * 100)

# Organize by pattern
pattern_examples = {
    'Who is/was': [],
    'What is/was': [],
    'Which': [],
    'When': [],
    'Why': [],
    'Where': [],
    'How many': [],
    'Other': []
}

for q in all_questions:
    orig = q['original']
    if ' is the correct answer to: ' in orig:
        parts = orig.split(' is the correct answer to: ')
        if len(parts) == 2:
            q_part = parts[1]
            if q_part.startswith('Who is ') or q_part.startswith('Who was '):
                pattern_examples['Who is/was'].append(q)
            elif q_part.startswith('What is ') or q_part.startswith('What was '):
                pattern_examples['What is/was'].append(q)
            elif q_part.startswith('Which '):
                pattern_examples['Which'].append(q)
            elif q_part.startswith('When '):
                pattern_examples['When'].append(q)
            elif q_part.startswith('Why '):
                pattern_examples['Why'].append(q)
            elif q_part.startswith('Where '):
                pattern_examples['Where'].append(q)
            elif q_part.startswith('How many '):
                pattern_examples['How many'].append(q)
            else:
                pattern_examples['Other'].append(q)

# Show examples of each pattern (both TRUE and FALSE versions)
for pattern, questions in pattern_examples.items():
    if not questions:
        continue
    
    print(f"\n{pattern} Pattern:")
    print("-" * 80)
    
    # Find one TRUE and one FALSE example
    true_example = next((q for q in questions if q['answer'] == 'TRUE'), None)
    false_example = next((q for q in questions if q['answer'] == 'FALSE'), None)
    
    if true_example:
        print(f"  TRUE Example:")
        print(f"    → {true_example['transformed']}")
    
    if false_example:
        print(f"  FALSE Example:")
        print(f"    → {false_example['transformed']}")

print("\n" + "=" * 100)
print("📄 FULL LIST OUTPUT")
print("=" * 100)
print("\nAll 336 questions have been processed and saved to:")
print("  all-boolean-questions-validation.json")
print("\nYou can review the complete list in that file.")

# Create a human-readable text file with all questions
with open('all-boolean-questions-readable.txt', 'w', encoding='utf-8') as f:
    f.write("=" * 100 + "\n")
    f.write("ALL 336 BOOLEAN QUESTIONS - TRANSFORMED FORMAT\n")
    f.write("=" * 100 + "\n\n")
    
    for i, q in enumerate(all_questions, 1):
        f.write(f"#{i}\n")
        f.write(f"ANSWER: {q['answer']}\n")
        f.write(f"QUESTION: {q['transformed']}\n")
        f.write("-" * 100 + "\n\n")

print("\nA readable text file has also been created:")
print("  all-boolean-questions-readable.txt")

print("\n" + "=" * 100)
print("✅ VALIDATION COMPLETE")
print("=" * 100)
