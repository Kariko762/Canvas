# FIS Presents - Element Expansion Plan
**Status:** Ready for Implementation
**Date:** March 13, 2026

---

## Phase 1: Core Text & Typography (EXPAND EXISTING)
**Status:** Partially implemented (Title + Text exist)

### To Add:
1. **Headline Component** - Hero text with gradient fills, stroke outlines
2. **Callout/Quote** - Highlighted text blocks with accent borders
3. **Numbered List / Bullet List** - Auto-numbered with custom icons
4. **Code Block** - Monospace with syntax highlighting themes

**Properties to Add:**
- Font upload system (Google Fonts API integration)
- Text gradient fills (linear, radial)
- Text stroke/outline
- Drop shadows with blur
- Text animations: typewriter, fade-in-up, split-text-reveal

---

## Phase 2: Enhanced Shapes & Visual Elements
**Status:** Basic shape exists

### To Add:
1. **Blob/Organic Shapes** - Animated morphing blobs
2. **Gradient Backgrounds** - Multi-stop gradients with angle control
3. **Pattern Fills** - Dots, grids, waves
4. **Progress Bars** - Horizontal/Vertical with percentage
5. **Gauge/Dial Charts** - Circular progress indicators
6. **Divider Lines** - Animated horizontal rules with icons

**Properties to Add:**
- Glassmorphism controls (blur, opacity, border)
- Neumorphism styling
- Gradient animation (rotating gradients)
- Glow/neon effects

---

## Phase 3: Media & Rich Content
**Status:** Image exists, needs expansion

### To Add:
1. **Video Player** - Embedded with custom controls
2. **Background Video** - Full-width/height video backgrounds
3. **Image Gallery** - Grid/carousel layouts
4. **Image Comparison Slider** - Before/after drag reveal
5. **Lightbox Modal** - Click to expand images
6. **Icon Library** - Built-in icon sets (Lucide icons)
7. **Logo Grid** - Client/partner logo showcases
8. **Avatar/Profile Card** - Team member cards with hover effects

**Properties:**
- Lazy loading
- Image filters (blur, grayscale, sepia, brightness)
- Parallax scroll effects
- Ken Burns effect (slow zoom/pan)
- Hover zoom/tilt effects

---

## Phase 4: Layout & Container Systems ⭐ CRITICAL
**Status:** Not implemented

### To Add:
1. **Scroll Container** - Vertical/horizontal scrollable regions
2. **Accordion** - Expandable content sections
3. **Tabs** - Horizontal tab navigation
4. **Collapsible Sections** - Show/hide content blocks
5. **Grid Layout** - Auto-arranging item grids
6. **Split Screen** - Two-column layouts with divider
7. **Sticky Header/Footer** - Fixed position elements
8. **Modal/Overlay** - Popup content windows
9. **Drawer/Sidebar** - Slide-in navigation panels

**Properties:**
- Max height with scroll
- Custom scrollbar styling
- Animation triggers (scroll percentage)
- Nested container support

---

## Phase 5: Interactive & Dynamic Elements ⭐ GAME CHANGERS

### Navigation & Menus:
1. **Navbar** - Horizontal menu with dropdowns
2. **Split Navigation** - Dual-purpose menu (internal/external)
3. **Breadcrumb Trail** - Page hierarchy navigation
4. **Pagination** - Multi-page content navigation
5. **Table of Contents** - Auto-generated from headlines

### Data Visualization:
1. **Line Chart** - Time series data
2. **Bar Chart** - Comparative data
3. **Pie/Donut Chart** - Percentage breakdowns
4. **Gauge/Speedometer** - Single metric display
5. **Stats Counter** - Animated counting numbers
6. **Progress Ring** - Circular progress indicators

### Interactive Tools:
1. **ROI Calculator** - Formula-based calculations
2. **Comparison Table** - Feature comparison grids
3. **Pricing Table** - Tiered pricing display
4. **Timeline** - Chronological events
5. **Process Steps** - Numbered sequential steps
6. **Interactive Hotspots** - Clickable markers on images
7. **Org Chart** - Hierarchical tree structure

### Forms & Input:
1. **Contact Form** - Email collection
2. **Survey/Poll** - Multi-choice questions
3. **Slider Input** - Range selectors for calculators
4. **Toggle Switch** - Binary options
5. **Star Rating** - 5-star selectors

---

## Phase 6: Advanced Visual Effects

### Animations:
1. **Parallax Layers** - Depth on scroll
2. **Particle Background** - Floating dots/shapes
3. **Gradient Animation** - Flowing color shifts
4. **Morphing Blobs** - Organic shape animations
5. **Lottie Animations** - JSON animation player
6. **Scroll-triggered Animations** - Reveal on scroll

### Effects:
1. **3D Card Flip** - Enhanced flip card (already have basic)
2. **Tilt on Hover** - 3D perspective tilt
3. **Glass Card** - Glassmorphism containers
4. **Neon Glow** - Pulsing neon borders
5. **Liquid Distortion** - WebGL effects
6. **Magnetic Cursor** - Elements attracted to cursor

---

## Phase 7: Content Blocks (Compositions)

### Pre-built Sections:
1. **Hero Section** - Large header with CTA
2. **Feature Grid** - 3-column feature showcase
3. **Testimonial Carousel** - Rotating reviews
4. **FAQ Section** - Accordion-based Q&A
5. **Team Grid** - Employee showcase
6. **Stats Banner** - 4-metric highlights
7. **CTA Banner** - Call-to-action section
8. **Footer** - Multi-column footer template

---

## Phase 8: Fintech-Specific Elements 💰

### Financial Tools:
1. **Stock Ticker** - Real-time/animated price display
2. **Currency Converter** - Exchange rate calculator
3. **Loan/Mortgage Calculator** - Payment estimator
4. **Compound Interest Graph** - Growth visualization
5. **Portfolio Tracker** - Investment allocation pie chart
6. **Transaction Timeline** - Payment history list
7. **Balance Display** - Large formatted numbers with + animations

### Trust Builders:
1. **Security Badge** - Certification logos
2. **Trust Indicators** - SSL, encrypted, verified badges
3. **Compliance Footer** - Legal disclaimers
4. **Award Showcase** - Industry recognition display

---

## Implementation Priority

### 🔴 Phase 1 (Next 2 hours) - Foundation
- [ ] Headline component with gradients
- [ ] Progress bars (horizontal/vertical)
- [ ] Stats counter with animation
- [ ] Scroll container
- [ ] Accordion/collapsible

### 🟡 Phase 2 (Next session) - Layouts
- [ ] Tabs component
- [ ] Grid layout system
- [ ] Modal/overlay
- [ ] Split screen layout

### 🟢 Phase 3 (Future) - Advanced
- [ ] Charts (line, bar, pie)
- [ ] Calculator components
- [ ] Timeline/process steps
- [ ] Video player
- [ ] Form elements

### 🔵 Phase 4 (Polish) - Effects
- [ ] Parallax layers
- [ ] Particle backgrounds
- [ ] 3D tilt effects
- [ ] Lottie animations

---

## Technical Considerations

### Performance:
- Use CSS `transform` and `opacity` for animations (GPU accelerated)
- Lazy load images and videos
- Debounce scroll listeners
- Use `will-change` sparingly

### Accessibility:
- Keyboard navigation for all interactive elements
- ARIA labels for custom controls
- Focus indicators
- Screen reader support

### Responsive:
- All elements must work on mobile (375px) to desktop (1920px+)
- Touch-friendly hit areas (min 44px)
- Responsive typography scales
- Mobile-optimized animations (reduced motion support)

---

## Data Structure Addition to mechanics-registry.ts

Each new element needs:
```typescript
{
  type: 'element-name',
  name: 'Display Name',
  category: 'text' | 'shapes' | 'media' | 'layout' | 'interactive' | 'data',
  icon: LucideIcon,
  defaultSize: { width, height },
  properties: {
    // Configurable props
  }
}
```

---

## Next Steps

1. **Review & Approve**: Confirm which elements to prioritize
2. **Create Components**: Build React components for each element
3. **Update Registry**: Add to mechanics-registry.ts
4. **Test Canvas**: Ensure drag-drop, resize, layers work
5. **Build Property Panels**: Create configuration UIs
6. **Add Animations**: Implement entrance/exit effects

**Question for you:** Which Phase should we tackle first? I recommend starting with Phase 1 (Foundation) as it gives immediate value with stats counters, progress bars, and scroll containers - all highly requested features.
