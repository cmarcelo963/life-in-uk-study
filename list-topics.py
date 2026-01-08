import json

with open('topics_grouped.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total topics: {len(data)}\n")
for i, topic in enumerate(data, 1):
    print(f"{i}. {topic.get('title', 'No title')}")
