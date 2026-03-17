# Testing System Documentation

## Overview

The FIS-Presents project includes a comprehensive testing tracker system to monitor the quality and completeness of all 37 mechanic elements.

## Files

### 1. ELEMENT_TESTING_TRACKER.md
**Purpose:** Human-readable testing checklist  
**Format:** Markdown tables organized by category  
**Usage:** Manually update checkboxes and status as you test

**Status Legend:**
- ⬜ Not Tested
- 🟡 In Progress  
- ✅ Passed
- ❌ Failed
- 🔄 Retest (after fixes)

### 2. element-testing-tracker.json
**Purpose:** Machine-readable testing data  
**Format:** Structured JSON with nested categories  
**Usage:** Can be parsed by scripts or rendered in admin dashboard

**Structure:**
```json
{
  "testingMetadata": { ... },
  "categories": {
    "content": { "elements": [...] },
    "layout": { "elements": [...] },
    ...
  },
  "externalEditors": [...],
  "integrationTests": {...},
  "bugs": {
    "critical": [],
    "medium": [],
    "low": []
  }
}
```

### 3. TESTING_GUIDE.md
**Purpose:** Step-by-step testing procedures  
**Format:** Markdown checklists  
**Usage:** Reference while testing each element

**Contains:**
- General testing protocol (4 steps for all elements)
- Element-specific test cases
- External editor test procedures
- Edge case scenarios
- Bug reporting template

### 4. test-status.ps1
**Purpose:** Quick status report generator  
**Format:** PowerShell script  
**Usage:** Run from terminal to see current progress

## How to Use the Testing System

### Step 1: Start Testing an Element

1. Open **ELEMENT_TESTING_TRACKER.md**
2. Find the element you want to test
3. Change status from ⬜ to 🟡 (in progress)
4. Open **TESTING_GUIDE.md** for that element's test cases

### Step 2: Follow Test Protocol

For each element, test in this order:
1. **Render Test** - Add to canvas, verify it displays
2. **Props Test** - Change all properties, verify updates
3. **Edit Mode** - Test editing interactions
4. **View Mode** - Test viewer experience
5. **External Editor** (if applicable) - Test full editor workflow

### Step 3: Document Results

**In ELEMENT_TESTING_TRACKER.md:**
- Update column checkboxes (⬜ → ✅ or ❌)
- Add notes in Issues/Notes column
- Change status to ✅ Passed or ❌ Failed

**In element-testing-tracker.json:**
```json
{
  "id": "badge",
  "name": "Badge",
  "status": "passed",  // Change this
  "renderTest": true,  // Change these
  "propsTest": true,
  "editMode": true,
  "viewMode": true,
  "issues": [],        // Add issue objects if any
  "notes": "Works perfectly with all 6 variants"
}
```

**If bugs found:**
Add to appropriate section in ELEMENT_TESTING_TRACKER.md:
```markdown
| 1 | Badge | Text overflow on small size | Failed | Fixed in commit abc123 |
```

And in JSON:
```json
"bugs": {
  "critical": [
    {
      "id": 1,
      "element": "badge",
      "description": "Text overflow on small size",
      "status": "fixed",
      "resolution": "Added text truncation"
    }
  ]
}
```

### Step 4: Check Progress

Run the status script any time:
```powershell
# Basic overview
.\test-status.ps1

# Detailed view with all test columns
.\test-status.ps1 -Detailed

# Show only failed elements
.\test-status.ps1 -OnlyFailed

# Show specific category
.\test-status.ps1 -Category interactive
```

## Testing Priority

### Phase 1: Core Content (Week 1)
Test elements users will use most frequently:
- Title, Text, List, Quote, Image, Button

### Phase 2: Layout & Structure (Week 2)
Test organizational elements:
- Container, Columns, Accordion, Tabs, GridLayout

### Phase 3: Interactive & Data (Week 3)
Test complex elements:
- Table, FeatureGrid, PricingCard, Carousel, Testimonial

### Phase 4: Media & Effects (Week 4)
Test visual elements:
- VideoPlayer, ImageGallery, FlipCard, Shape, Badge, Tooltip

### Phase 5: Integration (Week 5)
Test system-wide functionality:
- MechanicRenderer completeness
- External editor triggers
- Canvas operations (drag/resize/layer)
- Save/load persistence

## Example Testing Session

```powershell
# Start testing session
.\test-status.ps1

# Pick an element (e.g., Badge)
# Open TESTING_GUIDE.md and follow Badge test cases
# Open admin UI: http://localhost:3000/admin
# Create test asset
# Add Badge element to canvas
# Test all 6 variants, 3 sizes, outlined mode
# Document results in tracker files

# Mark complete in JSON:
# Change "status": "not-tested" → "passed"
# Set all test flags to true

# Check updated status
.\test-status.ps1
```

## Quality Gates

Before marking an element as **Passed**:
- ✅ All properties tested and working
- ✅ No console errors
- ✅ Visual appearance matches design
- ✅ Save/load cycle preserves all data
- ✅ External editor working (if applicable)
- ✅ Responsive behavior acceptable
- ✅ No critical or high bugs

## Completion Criteria

Testing is complete when:
- All 37 elements: ✅ Passed
- All 10 external editors: ✅ Passed  
- All 6 integration tests: ✅ Passed
- All critical bugs: Fixed
- Pass rate: 100%

Run final report:
```powershell
.\test-status.ps1 -Detailed
```

## Tips

1. **Test systematically** - Don't skip elements
2. **Document everything** - Even minor issues
3. **Update tracker frequently** - After each element
4. **Use the script** - Quick progress checks
5. **Test edge cases** - Break things intentionally
6. **Cross-browser** - Test in Chrome, Firefox, Safari if possible
7. **Mobile views** - Test responsive behavior
8. **Performance** - Add many elements to test canvas performance

## Generate Daily Report

```powershell
# Save status to file
.\test-status.ps1 > test-report-$(Get-Date -Format 'yyyy-MM-dd').txt
```
