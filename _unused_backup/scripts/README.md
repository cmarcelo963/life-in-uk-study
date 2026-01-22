# Replace Questions Script

## Purpose
Replaces all questions in `topics_grouped.json` with questions from `life_in_the_uk_full_question_bank_with_variants.json` while preserving topic structure (title and content).

## Prerequisites
- Node.js installed
- `life_in_the_uk_full_question_bank_with_variants.json` must be in the root directory

## Usage

```bash
node scripts/replaceQuestions.js
```

## What It Does

1. **Reads existing topics** from `topics_grouped.json`
2. **Creates backup** as `topics_grouped.backup.json`
3. **Reads new question bank** from `life_in_the_uk_full_question_bank_with_variants.json`
4. **Transforms each question** into app schema:
   ```javascript
   {
     type: "multiple",
     id: "{conceptId}_v{variant}",
     question: "...",
     options: [...],
     answer: "...",
     generated: true,
     feedback: {
       fact: "...",
       whyCorrect: ""
     },
     conceptId: "...",
     variantOf: "{conceptId}_v0"
   }
   ```
5. **Maps questions to topics** using category field:
   - Case-insensitive matching
   - Predefined mapping table for common variations
   - Unmapped questions go to "Imported questions" topic
6. **Replaces topic.questions** arrays completely
7. **Preserves topic.title and topic.content**
8. **Overwrites** `topics_grouped.json`
9. **Logs statistics**

## Category Mapping

The script maps new question categories to existing topic titles:

| New Question Category | → | Existing Topic Title |
|----------------------|---|---------------------|
| "History of the UK" | → | "A long and illustrious history" |
| "Government, law and your role" | → | "The UK government, the law and your role" |
| "A modern, thriving society" | → | "A modern, thriving society" |
| "Values and principles" | → | "The values and principles of the UK" |
| "What is the UK" | → | "What is the UK?" |

Additional partial matching is performed if exact matches fail.

## Output

The script prints:
- Progress updates
- Number of topics
- Total questions inserted
- Questions per topic
- Number of unmapped questions

Example output:
```
=== Starting Question Replacement ===

Reading existing topics...
Creating backup...
✓ Backup saved to: topics_grouped.backup.json

Reading new question bank...
✓ Loaded 1500 new questions

Processing questions...
  Processed 100/1500 questions...
  Processed 200/1500 questions...
  ...
✓ Processed all 1500 questions

Replacing questions in topics...
  A long and illustrious history: 250 questions
  The UK government, the law and your role: 300 questions
  ...

=== SUMMARY ===
Total topics: 14
Total questions inserted: 1500

Questions per topic:
  A long and illustrious history: 250
  The UK government, the law and your role: 300
  ...

✓ Question replacement complete!
```

## Recovery

If something goes wrong, restore from backup:
```bash
cp topics_grouped.backup.json topics_grouped.json
```

Or manually:
1. Delete `topics_grouped.json`
2. Rename `topics_grouped.backup.json` to `topics_grouped.json`

## Notes

- **ID Format**: Questions use `{conceptId}_v{variant}` as stable IDs
- **variantOf**: Variant 0 questions point to themselves; other variants point to `{conceptId}_v0`
- **generated**: All imported questions are marked `generated: true`
- **feedback.whyCorrect**: Left empty (not provided in new data)
- **Unmapped Questions**: Any questions whose category can't be mapped are placed in "Imported questions" topic (created automatically if needed)

## Next Steps

After running:
1. Review `topics_grouped.json` to verify structure
2. Test the app in browser (http://localhost:3000)
3. Check that questions display correctly
4. Verify scoring system works with new question IDs
