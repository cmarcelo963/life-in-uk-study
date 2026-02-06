#!/usr/bin/env python3
"""Add final 4 questions to reach exactly 900"""
import json
from pathlib import Path

questions = json.loads(Path('data/driving-theory-questions.json').read_text(encoding='utf-8'))

# Add exactly 4 more questions
final_questions = [
    {
        "id": "final_001",
        "question": "What is the national speed limit on a single carriageway in the UK?",
        "options": ["50 mph", "60 mph", "70 mph", "40 mph"],
        "answer": "60 mph",
        "conceptId": "final",
        "category": "Rules of the Road (Core)",
        "type": "multiple-choice"
    },
    {
        "id": "final_002",
        "question": "What is the national speed limit on a motorway for cars?",
        "options": ["50 mph", "60 mph", "70 mph", "80 mph"],
        "answer": "70 mph",
        "conceptId": "final",
        "category": "Rules of the Road (Core)",
        "type": "multiple-choice"
    },
    {
        "id": "final_003",
        "question": "When should you use dipped headlights in daylight?",
        "options": ["Never", "When visibility is poor", "Always", "Only at dawn"],
        "answer": "When visibility is poor",
        "conceptId": "final",
        "category": "Vehicle Safety and Maintenance",
        "type": "multiple-choice"
    },
    {
        "id": "final_004",
        "question": "What is the minimum tread depth requirement for car tyres in the UK?",
        "options": ["0.5mm", "1mm", "1.6mm", "2mm"],
        "answer": "1.6mm",
        "conceptId": "final",
        "category": "Vehicle Safety and Maintenance",
        "type": "multiple-choice"
    },
]

questions.extend(final_questions)

# Save all
output_path = Path('data/driving-theory-questions.json')
output_path.write_text(json.dumps(questions, indent=2, ensure_ascii=False), encoding='utf-8')

print(f"Generated {len(questions)} total questions")
print(f"\nDistribution:")
categories = {}
for q in questions:
    cat = q['category']
    categories[cat] = categories.get(cat, 0) + 1

for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")

print(f"\nTotal: {sum(categories.values())}")
