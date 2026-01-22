import json

with open('topics_grouped.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Checking multipleAnswer questions with answers/correctOptions...")
for group in data:
    for qg in group.get('questionGroups', []):
        for q in qg.get('variations', []):
            if q.get('type') == 'multipleAnswer':
                correct = q.get('correctOptions')
                legacy = q.get('answers')
                num_required = q.get('numRequired')

                print(f"\nQuestion: {q['question']}")
                print(f"Options: {q.get('options')}")
                if correct:
                    print(f"Correct Options: {correct}")
                    print(f"Number of answers required: {num_required if num_required is not None else len(correct)}")
                else:
                    print(f"Correct Answers (legacy): {legacy if legacy else 'NOT SET'}")
                    print(f"Number of answers required: {len(legacy) if legacy else 0}")
