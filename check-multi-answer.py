import json

with open('topics_grouped.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Looking for multipleAnswer questions...")
for group in data:
    for qg in group.get('questionGroups', []):
        for q in qg.get('variations', []):
            if q.get('type') == 'multipleAnswer':
                print(f"\nQuestion: {q['question']}")
                print(f"Options: {q['options']}")
                print(f"Current answer field: {q.get('answer')}")
                print(f"Has 'answers' field: {'answers' in q}")
