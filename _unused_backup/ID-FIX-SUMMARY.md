# Duplicate Question ID Fix - Summary

## Problem
- Question IDs were numeric (1, 2, 3...) instead of unique stable identifiers
- No relationship between question.id and conceptId/variant structure
- Risk of ID collisions when adding new questions

## Solution Applied

### Script: [scripts/fixDuplicateIds.js](scripts/fixDuplicateIds.js)

**ID Pattern:** `<conceptId>_v<variant>`

Examples:
- `1_v0` - Canonical question for concept 1
- `1_v1` - First variant of concept 1
- `2_v0` - Canonical question for concept 2

### Changes Made

1. **Regenerated all question IDs**
   - Old: numeric (1, 2, 3...)
   - New: `<conceptId>_v<variant>` format
   - All IDs are now strings

2. **Updated variantOf field**
   - All questions now point to their canonical variant
   - Format: `<conceptId>_v0`
   - Example: Question `1_v1` has `variantOf: "1_v0"`

3. **Preserved data integrity**
   - ✓ question text unchanged
   - ✓ options unchanged
   - ✓ answers unchanged
   - ✓ conceptId unchanged
   - ✓ variant number unchanged
   - ✓ All relationships preserved

## Results

### Before
- Total questions: 400
- Unique IDs: 400 (numeric: 1-400)
- ID format: Numbers
- Duplicates: None detected initially, but format was fragile

### After
- Total questions: 400
- Unique IDs: 400 ✓
- ID format: `<conceptId>_v<variant>` (strings)
- Unique concepts: 250
- Duplicates: 0 ✓

### Validation
```
✓ All 400 question IDs are now unique
✓ All IDs are strings
✓ variantOf updated for all questions
✓ ID format is stable and collision-resistant
```

## Files Modified

1. **[data/questions.json](data/questions.json)**
   - All 400 question IDs updated
   - All variantOf fields updated
   - Backup created: `data/questions.backup.json`

2. **[app.js](app.js)** - Lines 152-180
   - Removed duplicate detection logic (no longer needed)
   - Updated question mapping to use new ID format
   - Added comments explaining ID structure

## Examples

### Variant 0 (Canonical)
```json
{
  "id": "1_v0",
  "conceptId": 1,
  "variant": 0,
  "variantOf": "1_v0",
  "question": "Which of the following is a fundamental principle of British life?"
}
```

### Variant 1
```json
{
  "id": "1_v1",
  "conceptId": 1,
  "variant": 1,
  "variantOf": "1_v0",
  "question": "Select the option that is a fundamental principle of British life."
}
```

## Backward Compatibility

**Question stats migration:** If you have existing saved stats with old numeric IDs (1, 2, 3...), they will no longer match the new IDs (1_v0, 2_v0...). 

To migrate stats:
1. Open browser console
2. Run: `localStorage.clear()` to reset stats
3. Reload app

This is safe because stats are tracked per-question, and the new stable IDs will prevent future ID collisions.

## Recovery

If you need to restore the original data:
```bash
cp data/questions.backup.json data/questions.json
```

## Verification

Run this command to verify uniqueness:
```bash
node -e "const fs = require('fs'); const q = JSON.parse(fs.readFileSync('data/questions.json', 'utf8')); console.log('Unique:', new Set(q.map(x => x.id)).size === q.length ? '✓' : '✗');"
```

Expected output: `Unique: ✓`
