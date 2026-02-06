import json
import sys
from pathlib import Path
from collections import defaultdict

questions_file = Path(__file__).parent / 'data' / 'questions.json'

try:
    with open(questions_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    total_count = len(questions) if isinstance(questions, list) else 1
    
    print(f"\nTotal questions: {total_count}\n")
    
    # Check for duplicate IDs
    print("=== DUPLICATE ID CHECK ===")
    id_map = defaultdict(list)
    
    for idx, q in enumerate(questions):
        id_map[q['id']].append(idx)
    
    duplicate_ids = {id_val: indices for id_val, indices in id_map.items() if len(indices) > 1}
    
    if duplicate_ids:
        print(f"❌ Found {len(duplicate_ids)} duplicate ID(s):")
        for id_val, indices in sorted(duplicate_ids.items()):
            print(f"  ID '{id_val}' appears {len(indices)} times at indices: {indices}")
    else:
        print("✓ No duplicate IDs found\n")
    
    # Check for duplicate question text
    print("\n=== DUPLICATE QUESTION TEXT CHECK ===")
    question_map = defaultdict(list)
    
    for idx, q in enumerate(questions):
        question_text = q['question']
        question_map[question_text].append(idx)
    
    duplicate_questions = {q_text: indices for q_text, indices in question_map.items() if len(indices) > 1}
    
    if duplicate_questions:
        print(f"❌ Found {len(duplicate_questions)} duplicate question(s):")
        for question_text, indices in sorted(duplicate_questions.items()):
            print(f"\n  Question appears {len(indices)} times:")
            print(f"  \"{question_text[:80]}{'...' if len(question_text) > 80 else ''}\"")
            for idx in indices:
                print(f"    - Index {idx}: ID \"{questions[idx]['id']}\"")
    else:
        print("✓ No duplicate question text found\n")
    
    # Summary
    print("\n=== SUMMARY ===")
    print(f"Total questions: {total_count}")
    print(f"Duplicate IDs: {len(duplicate_ids)}")
    print(f"Duplicate questions: {len(duplicate_questions)}")
    
    if len(duplicate_ids) == 0 and len(duplicate_questions) == 0:
        print("\n✓ Audit complete: No duplicates found!\n")
    else:
        print("\n⚠️ Audit complete: Duplicates detected!\n")
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
