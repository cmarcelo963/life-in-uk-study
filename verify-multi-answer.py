import json

with open('topics_grouped.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Checking multipleAnswer questions with answers...")
for group in data:
    for qg in group.get('questionGroups', []):
        for q in qg.get('variations', []):
            if q.get('type') == 'multipleAnswer':
                print(f"\nQuestion: {q['question']}")
                print(f"Options: {q['options']}")
                print(f"Correct Answers: {q.get('answers', 'NOT SET')}")
                print(f"Number of answers required: {len(q.get('answers', []))}")
