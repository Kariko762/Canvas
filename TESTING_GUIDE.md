# Element Testing Guide

Quick reference for testing each mechanic element systematically.

## General Testing Protocol

For **every element**, follow this sequence:

### 1. Basic Rendering
- [ ] Add element to canvas via toolbar
- [ ] Element renders without errors
- [ ] Default properties display correctly
- [ ] Element appears in layer panel

### 2. Properties Panel
- [ ] Select element on canvas
- [ ] Properties panel shows correct controls
- [ ] Change each property value
- [ ] Visual updates reflect immediately
- [ ] Invalid values handled gracefully

### 3. Canvas Operations
- [ ] Drag element to new position
- [ ] Resize using corner/edge handles
- [ ] Lock position (if available)
- [ ] Change layer order (front/back)
- [ ] Duplicate element (if available)

### 4. Save/Load Cycle
- [ ] Save asset with element
- [ ] Reload page
- [ ] Element loads with all properties intact
- [ ] No console errors

---

## Element-Specific Tests

### Title
- Text updates immediately
- Font size changes visible
- Text alignment works (left/center/right)
- Color picker updates text color
- Font weight options work

### Text
- Multiline text renders
- Font size scaling
- Text color changes
- Line height adjustment
- Alignment options

### List
- Bullet/numbered/checkmark styles
- Add/remove items inline
- Custom bullet color
- Spacing options

### Quote
- Text with source attribution
- Border/accent styling
- Font size variations
- Background color options

### CodeBlock
- Syntax highlighting works
- Language selection applies
- Line numbers toggle
- Copy button (if present)
- Dark/light theme

### Container
- Background color applies
- Padding adjusts content
- Border radius rounds corners
- Shadow depth visible
- Border options work

### Columns
- 2, 3, 4 column layouts
- Gap between columns adjusts
- Content distribution even
- Responsive behavior

### Spacer
- Height creates vertical space
- Visible in edit mode
- Invisible in view mode
- Different sizes work

### Accordion
**External Editor Required**
- [ ] Click "Edit Accordion" opens editor
- [ ] Add section creates new item
- [ ] Edit section title updates
- [ ] Edit section content updates
- [ ] Remove section deletes
- [ ] Reorder sections works
- [ ] Save updates canvas
- [ ] Cancel discards changes
- [ ] Expand/collapse works in view

### Tabs
**External Editor Required**
- [ ] Click "Edit Tabs" opens editor
- [ ] Add tab creates new item
- [ ] Edit tab label updates
- [ ] Tab canvas for content works
- [ ] Remove tab deletes
- [ ] Reorder tabs works
- [ ] Tab style options apply
- [ ] Save updates canvas
- [ ] Tab switching works in view

### GridLayout
**External Editor Required**
- [ ] Click "Edit Grid" opens editor
- [ ] Add grid item works
- [ ] Edit item content
- [ ] Columns/rows adjust
- [ ] Gap spacing visible
- [ ] Save updates canvas

### Modal
- Trigger button configuration
- Modal content renders
- Open/close behavior
- Overlay opacity
- Size options

### Shape
- Rectangle/circle/triangle render
- Fill color applies
- Stroke color and width
- Opacity adjustment
- Rotation (if supported)

### Divider
- Line renders horizontally
- Thickness adjustment
- Color changes
- Style (solid/dashed/dotted)

### Image
- Image URL loads
- Border radius applies
- Shadow options
- Fit options (cover/contain)
- Alt text support

### VideoPlayer
- Video URL loads player
- Controls visible/hidden
- Autoplay toggle
- Loop toggle
- Poster image shows

### ImageGallery
- Multiple images display
- Gallery layout (grid/masonry)
- Lightbox opens on click
- Navigation arrows work
- Columns adjustment

### ImageComparison
- Before/after images load
- Slider moves smoothly
- Initial position adjusts
- Labels visible

### IconLibrary
- Icons grid displays
- Icon size adjusts
- Color applies to all icons
- Spacing options work

### LogoGrid
**External Editor Required**
- [ ] Click "Edit Logos" opens editor
- [ ] Add logo with URL
- [ ] Upload logo image
- [ ] Add logo link
- [ ] Remove logo works
- [ ] Reorder logos
- [ ] Greyscale filter toggle
- [ ] Save updates canvas

### AvatarCard
**External Editor Required**
- [ ] Click "Edit Avatar" opens editor
- [ ] Image URL updates preview
- [ ] Name/title fields update
- [ ] Bio text updates
- [ ] Social links add
- [ ] Layout toggle (vertical/horizontal)
- [ ] Save updates canvas

### Button
- Text content editable
- Action types (none/link/goto/modal) work
- Action value updates (URL/page/modal)
- Size options (sm/md/lg)
- Variant styles apply
- Hover effects visible

### FlipCard
- Front content displays
- Back content displays
- Flip on hover works
- Flip on click toggle
- Colors for both sides

### Badge
- Text updates
- 6 variants render correctly (default/primary/success/warning/error/info)
- 3 sizes adjust (small/medium/large)
- Outlined style toggles
- Custom color overrides

### Tooltip
- Trigger text displays
- Tooltip appears on hover
- 4 positions work (top/bottom/left/right)
- Arrow indicator points correctly
- Background/text colors apply
- Visible in edit mode for testing

### CTACard
- Headline text updates
- Description text updates
- Button text/link work
- Alignment options (left/center/right)
- Background color applies
- Button color customizable
- Hover scale animation

### Alert
- Message text updates
- 4 types render (info/success/warning/error)
- Icons match type
- Dismissible toggle works
- Dismiss button functions
- Bordered option works
- Custom icon toggle

### SplitScreen
- Left/right content areas
- Split ratio adjustment
- Reverse layout toggle
- Background colors for each side
- Responsive stacking

### Table
**External Editor Required**
- [ ] Click "Edit Table" opens editor
- [ ] Add column header
- [ ] Remove column
- [ ] Add row
- [ ] Remove row
- [ ] Edit cell values
- [ ] Reorder columns/rows
- [ ] Save updates canvas
- [ ] Striped rows toggle
- [ ] Bordered toggle

### StatsCounter
- Number displays
- Prefix/suffix text
- Animated counting (view mode)
- Duration adjustment
- Color customization
- Icon support

### ProgressBar
- Percentage value displays
- Value updates bar width
- Color customization
- Height adjustment
- Label text option
- Animated fill (view mode)

### Testimonial
**External Editor Required**
- [ ] Click "Edit Testimonials" opens editor
- [ ] Add testimonial item
- [ ] Edit quote text (textarea)
- [ ] Edit author name
- [ ] Edit author role
- [ ] Set rating (1-5 stars)
- [ ] Add author image URL
- [ ] Image preview updates
- [ ] Remove testimonial
- [ ] Reorder testimonials
- [ ] Save updates canvas
- [ ] Display style options (card/quote/compact)
- [ ] Rating stars render correctly
- [ ] Show rating toggle
- [ ] Show image toggle

### FeatureGrid
**External Editor Required**
- [ ] Click "Edit Features" opens editor
- [ ] Add feature item
- [ ] Select icon from 24 options
- [ ] Icon search filter works
- [ ] Edit title and description
- [ ] Remove feature
- [ ] Reorder features
- [ ] Save updates canvas
- [ ] Columns adjustment (2-4)
- [ ] Icon size adjustment
- [ ] Icon color applies
- [ ] Gap spacing works

### PricingCard
**External Editor Required**
- [ ] Click "Edit Plans" opens editor
- [ ] Add pricing plan
- [ ] Edit plan name
- [ ] Edit price and period
- [ ] Add feature to plan
- [ ] Edit feature text
- [ ] Remove feature
- [ ] Remove plan
- [ ] Reorder plans
- [ ] Toggle "highlighted" flag
- [ ] Star icon shows for highlighted
- [ ] Edit button text and link
- [ ] Save updates canvas
- [ ] Columns adjustment (2-4)
- [ ] Highlight color applies
- [ ] Card hover scale works

### Carousel
**External Editor Required**
- [ ] Click "Edit Slides" opens editor
- [ ] Add slide
- [ ] Edit image URL
- [ ] Image preview loads
- [ ] Edit caption (optional)
- [ ] Remove slide
- [ ] Reorder slides (up/down)
- [ ] Save updates canvas
- [ ] Autoplay toggle works
- [ ] Interval adjustment
- [ ] Show dots toggle
- [ ] Show arrows toggle
- [ ] Height options (small/medium/large/xlarge)
- [ ] Navigation works in view mode
- [ ] Caption overlay displays

---

## Edge Case Testing

### For All Elements
1. **Empty Values**: Leave required fields blank
2. **Long Text**: Use 500+ character strings
3. **Special Characters**: Use emojis, unicode, HTML entities
4. **Invalid URLs**: Use malformed image/video URLs
5. **Color Values**: Try #rgb, #rrggbb, rgba(), named colors
6. **Extreme Numbers**: Min/max values, negatives, decimals
7. **Multiple Instances**: Add 10+ of same element type
8. **Z-index Conflicts**: Overlapping elements

### For External Editors
1. **Empty Data**: Start with no items
2. **Maximum Items**: Add 50+ items (performance)
3. **Rapid Edits**: Quick add/remove cycles
4. **Cancel Without Save**: Ensure no state leak
5. **Malformed JSON**: If editing JSON directly

---

## Bug Reporting Template

When you find an issue, document it with:

```
Element: [element-name]
Severity: Critical | High | Medium | Low
Status: New | In Progress | Fixed | Won't Fix
Browser: [if applicable]

Description:
[What happened]

Expected Behavior:
[What should happen]

Steps to Reproduce:
1. [Step one]
2. [Step two]
3. [Result]

Screenshots/Console Errors:
[If available]

Resolution:
[Once fixed, document the solution]
```

---

## Testing Progress Goals

- **Week 1**: Content + Decoration mechanics (8 elements)
- **Week 2**: Layout mechanics (9 elements)
- **Week 3**: Interactive mechanics (6 elements)
- **Week 4**: Media + Data mechanics (14 elements)
- **Week 5**: Integration testing + bug fixes

---

## Sign-Off Checklist

Before marking element as ✅ **Passed**:
- [ ] All properties tested
- [ ] Edit mode works
- [ ] View mode works
- [ ] Save/load verified
- [ ] No console errors
- [ ] Visual appearance correct
- [ ] Responsive behavior acceptable
- [ ] Performance acceptable
- [ ] External editor working (if applicable)
- [ ] Documentation accurate
