#!/usr/bin/env python3
"""Fix questions with incorrect number of options"""
import json
from pathlib import Path

data = json.loads(Path('data/driving-theory-questions.json').read_text(encoding='utf-8'))

# Find and fix issues - add missing options
fixed_count = 0
for i, q in enumerate(data):
    if len(q['options']) == 2:
        # Add two more plausible options
        answer = q['answer']
        options = q['options']
        
        # Generate additional options based on question context
        if 'speed' in q['question'].lower():
            options.extend(['35 mph', '55 mph'])
        elif 'age' in q['question'].lower():
            options.extend(['18 years', '21 years'])
        elif 'distance' in q['question'].lower():
            options.extend(['1 meter', '5 meters'])
        elif 'time' in q['question'].lower():
            options.extend(['1 second', '5 seconds'])
        elif 'fine' in q['question'].lower():
            options.extend(['50 pounds', '200 pounds'])
        else:
            # Generic fallbacks
            if options[0].isdigit() or any(c.isdigit() for c in options[0]):
                options.extend(['50', '100'])
            else:
                options.extend(['Maybe', 'Not applicable'])
        
        q['options'] = options
        fixed_count += 1

print(f"Fixed {fixed_count} questions with missing options")

# Save
output_path = Path('data/driving-theory-questions.json')
output_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

# Verify
issues = []
for i, q in enumerate(data):
    if len(q['options']) != 4:
        issues.append(f"Q{i}: {q['id']} has {len(q['options'])} options")

if issues:
    print(f"Still have issues: {issues}")
else:
    print("All questions now have exactly 4 options")
    
print(f"Total questions: {len(data)}")
