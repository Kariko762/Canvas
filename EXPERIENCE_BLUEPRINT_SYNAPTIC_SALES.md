# EXPERIENCE BLUEPRINT: THE SYNAPTIC SALES MOTION

**Project:** Digital-First B2B Fintech Journey  
**Environment:** 100% Synthetic / AI-Only Setting  
**Target Audience:** Financial Service Decision Makers (B2B) - CFOs, CTOs, Head of Digital Transformation  
**Total Pages:** 7  
**Estimated Duration:** 5-7 minutes  
**Experience ID:** `SYN-SALES-001`  
**Version:** 1.0  
**Created:** March 16, 2026

---

## PAGE 1: THE SIGNAL IN THE NOISE

**Objective:** Capture immediate attention and establish the "Organic Sales" obsolescence.  
**Transition In:** Fade (1200ms)  
**Background Type:** Video Background with Dark Overlay  
**Canvas Background:** `#000000`  
**Duration:** ~45 seconds

### Elements

#### videoplayer
- **Element ID:** `bg-video-001`
- **Type:** `videoplayer`
- **Position:** Full-bleed Background (0, 0)
- **Dimensions:** 1920×1080
- **Layer:** 0 (background)
- **Props:**
  - `videoUrl`: "https://cdn.example.com/videos/digital_aether_loop.mp4"
  - `poster`: "https://cdn.example.com/videos/digital_aether_poster.jpg"
  - `autoplay`: true
  - `muted`: true
  - `loop`: true
  - `controls`: false
  - `opacity`: 0.6
  - `overlayColor`: "#000000"
  - `overlayOpacity`: 0.6
- **Technical Notes:** 
  - Video should be 30-second seamless loop
  - Suggest abstract particle/network animation
  - MP4 format, H.264 codec, 1080p max resolution
  - File size target: <10MB for performance

#### headline
- **Element ID:** `hero-headline-001`
- **Type:** `headline`
- **Position:** (960, 320) - centered horizontally, upper third
- **Dimensions:** 1400×auto
- **Layer:** 10
- **Props:**
  - `text`: "DEATH OF THE HANDSHAKE"
  - `size`: "4xl"
  - `weight`: "black"
  - `align`: "center"
  - `useGradient`: true
  - `gradientFrom`: "#00F2FF"
  - `gradientTo`: "#7000FF"
  - `gradientDirection`: "to-r"
  - `letterSpacing`: "wide"
  - `lineHeight`: "tight"
  - `textTransform`: "uppercase"
- **Animation:** Fade in + scale (0.95 → 1.0) over 800ms
- **Character Count:** 23

#### text
- **Element ID:** `hero-subtext-001`
- **Type:** `text`
- **Position:** (560, 480) - centered
- **Dimensions:** 800×auto
- **Layer:** 10
- **Props:**
  - `content`: "The organic sales cycle has reached end-of-life. In a market moving at the speed of light, waiting for a human response is a legacy vulnerability. The modern buyer demands instant access, automated intelligence, and zero-friction decisioning."
  - `size`: "xl"
  - `align`: "center"
  - `color`: "#E0E0E0"
  - `maxWidth`: "800px"
  - `lineHeight`: "relaxed"
- **Animation:** Fade in with 400ms delay after headline
- **Character Count:** 244
- **Reading Time:** ~12 seconds

#### shape
- **Element ID:** `accent-line-001`
- **Type:** `shape`
- **Position:** (760, 640) - below text
- **Dimensions:** 400×4
- **Layer:** 9
- **Props:**
  - `shapeType`: "rectangle"
  - `width`: 400
  - `height`: 4
  - `backgroundColor`: "#00F2FF"
  - `borderWidth`: 0
  - `opacity`: 80
- **Animation:** Width expand from 0 → 400px over 600ms

#### spacer
- **Element ID:** `spacer-001`
- **Type:** `spacer`
- **Position:** (0, 660)
- **Props:**
  - `height`: "xl"

#### button
- **Element ID:** `cta-primary-001`
- **Type:** `button`
- **Position:** (810, 740) - centered horizontally
- **Dimensions:** 300×60
- **Layer:** 10
- **Props:**
  - `text`: "INITIALIZE DISCOVERY"
  - `action`: "next"
  - `backgroundColor`: "#00F2FF"
  - `textColor`: "#000000"
  - `fontSize`: "lg"
  - `rounded`: "lg"
  - `hoverEffect`: "glow"
  - `icon`: "ArrowRight"
  - `iconPosition`: "right"
- **Animation:** Pulse glow effect on hover
- **Interaction:** Advances to Page 2
- **Analytics Event:** `cta_initialize_discovery_clicked`

---

## PAGE 2: THE GARTNER PROTOCOL (THE DATA GAP)

**Objective:** Use hard data to prove that "Self-Service" is the only way to win.  
**Transition In:** Slide Left (1000ms)  
**Background Type:** Solid Color with Subtle Gradient  
**Canvas Background:** Linear gradient from `#0A0A0A` to `#1A1A2E` (135deg)  
**Duration:** ~60 seconds

### Elements

#### title
- **Element ID:** `page2-title-001`
- **Type:** `title`
- **Position:** (120, 100)
- **Dimensions:** 1680×auto
- **Layer:** 10
- **Props:**
  - `text`: "THE BUYER'S AUTONOMY RATIO"
  - `size`: "3xl"
  - `weight`: "bold"
  - `align`: "left"
  - `color`: "#FFFFFF"
  - `letterSpacing`: "wide"
- **Animation:** Slide right from -100px with fade
- **Data Source:** Gartner B2B Buying Journey Study 2025

#### text
- **Element ID:** `page2-context-001`
- **Type:** `text`
- **Position:** (120, 180)
- **Dimensions:** 1680×auto
- **Layer:** 10
- **Props:**
  - `content`: "Gartner's latest research reveals a seismic shift in B2B buying behavior. The modern financial services buyer is independently researching, evaluating, and making decisions without ever requesting a demo."
  - `size`: "lg"
  - `align`: "left"
  - `color`: "#B0B0B0"
  - `maxWidth`: "1200px"
- **Character Count:** 218

#### gridlayout
- **Element ID:** `data-cards-grid-001`
- **Type:** `gridlayout`
- **Position:** (120, 320)
- **Dimensions:** 1680×600
- **Layer:** 10
- **Props:**
  - `columns`: 3
  - `gap`: 32
  - `minItemWidth`: 480
  - `itemPadding`: 0
  - `backgroundColor`: "transparent"
  - `responsive`: true
  - `equalHeight`: true

##### Child 1: flipcard
- **Element ID:** `flipcard-autonomy-001`
- **Type:** `flipcard`
- **Dimensions:** 480×520
- **Props:**
  - `frontColor`: "#1A1A2E"
  - `backColor`: "#2E1A3E"
  - `textColor`: "#FFFFFF"
  - `rounded`: "lg"
  - `borderColor`: "#00F2FF"
  - `borderWidth`: 2
  - `flipDirection`: "horizontal"
  - `flipDuration`: 600
- **Front Content:**
  - **statscounter**
    - `startValue`: 0
    - `endValue`: 17
    - `duration`: 2500
    - `decimals`: 0
    - `suffix`: "%"
    - `fontSize`: "80px"
    - `fontWeight`: "black"
    - `color`: "#00F2FF"
    - `label`: "Time With Suppliers"
    - `labelSize`: "18px"
    - `alignment`: "center"
- **Back Content:**
  - **text**
    - `content`: "**Gartner Insight 2025:** B2B buyers now spend only 17% of their total purchase journey interacting with potential suppliers. That means 83% happens in the dark—where you have ZERO influence. If you aren't digital-first with always-on portals, you don't exist in their consideration set."
    - `size`: "base"
    - `color`: "#E0E0E0"
    - `align`: "center"
- **Interaction:** Click or tap to flip
- **Analytics Event:** `flipcard_autonomy_engaged`

##### Child 2: flipcard
- **Element ID:** `flipcard-millennial-001`
- **Type:** `flipcard`
- **Dimensions:** 480×520
- **Props:**
  - `frontColor`: "#1A1A2E"
  - `backColor`: "#3E1A2E"
  - `textColor`: "#FFFFFF"
  - `rounded`: "lg"
  - `borderColor`: "#7000FF"
  - `borderWidth`: 2
  - `flipDirection`: "horizontal"
  - `flipDuration`: 600
- **Front Content:**
  - **statscounter**
    - `startValue`: 0
    - `endValue`: 44
    - `duration`: 2500
    - `decimals`: 0
    - `suffix`: "%"
    - `fontSize`: "80px"
    - `fontWeight`: "black"
    - `color`: "#7000FF"
    - `label`: "Millennials Prefer Zero-Rep Sales"
    - `labelSize`: "18px"
    - `alignment`: "center"
- **Back Content:**
  - **text**
    - `content`: "The incoming wave of financial decision-makers (ages 28-42) explicitly prefer self-service over human interaction. They view sales calls as friction, not value. They demand instant data access, transparent pricing, and on-demand technical documentation. Adapt or be filtered out."
    - `size`: "base"
    - `color`: "#E0E0E0"
    - `align`: "center"
- **Data Source:** IBM Institute for Business Value, Millennial B2B Buying Study
- **Analytics Event:** `flipcard_millennial_engaged`

##### Child 3: flipcard
- **Element ID:** `flipcard-decision-001`
- **Type:** `flipcard`
- **Dimensions:** 480×520
- **Props:**
  - `frontColor`: "#1A1A2E"
  - `backColor`: "#1A3E2E"
  - `textColor`: "#FFFFFF"
  - `rounded`: "lg"
  - `borderColor`: "#00FFB7"
  - `borderWidth`: 2
  - `flipDirection`: "horizontal"
  - `flipDuration`: 600
- **Front Content:**
  - **statscounter**
    - `startValue`: 0
    - `endValue`: 70
    - `duration`: 2500
    - `decimals`: 0
    - `suffix`: "%"
    - `fontSize`: "80px"
    - `fontWeight`: "black"
    - `color`: "#00FFB7"
    - `label`: "Journey Complete Pre-Contact"
    - `labelSize`: "18px"
    - `alignment`: "center"
- **Back Content:**
  - **text**
    - `content`: "By the time a prospect clicks 'Contact Us,' the purchase decision is already 70% finalized. Your website, content, pricing transparency, and self-service tools made the sale—not your sales team. If those assets don't exist, the deal was lost before you knew it existed."
    - `size`: "base"
    - `color`: "#E0E0E0"
    - `align`: "center"
- **Data Source:** Forrester B2B Buyer Journey Analysis 2025
- **Analytics Event:** `flipcard_decision_engaged`

#### shape
- **Element ID:** `data-citation-line-001`
- **Type:** `shape`
- **Position:** (120, 960)
- **Dimensions:** 1680×1
- **Layer:** 9
- **Props:**
  - `shapeType`: "rectangle"
  - `backgroundColor`: "#333333"
  - `opacity`: 50

#### text
- **Element ID:** `data-citation-001`
- **Type:** `text`
- **Position:** (120, 980)
- **Dimensions:** 1680×auto
- **Layer:** 10
- **Props:**
  - `content`: "**Sources:** Gartner B2B Buying Journey (2025) | IBM IBV Millennial Study (2024) | Forrester Buyer Insights (2025)"
  - `size`: "sm"
  - `align`: "left"
  - `color`: "#707070"

---

## PAGE 3: LEGACY VS. SYNAPTIC GTM

**Objective:** Visual contrast between "Old World" and "Digital-First."  
**Transition In:** Fade with Scale (900ms)  
**Background Type:** Solid Color  
**Canvas Background:** `#050510`  
**Duration:** ~50 seconds

### Elements

#### title
- **Element ID:** `page3-title-001`
- **Type:** `title`
- **Position:** (960, 80) - centered
- **Dimensions:** 1600×auto
- **Layer:** 10
- **Props:**
  - `text`: "LEGACY VS. SYNAPTIC"
  - `size`: "3xl"
  - `weight`: "black"
  - `align`: "center"
  - `color`: "#FFFFFF"
  - `letterSpacing`: "wider"

#### text
- **Element ID:** `page3-subtitle-001`
- **Type:** `text`
- **Position:** (560, 160)
- **Dimensions:** 800×auto
- **Layer:** 10
- **Props:**
  - `content`: "Two paradigms. One inevitable winner."
  - `size`: "xl"
  - `align`: "center"
  - `color`: "#808080"

#### splitscreen
- **Element ID:** `comparison-split-001`
- **Type:** `splitscreen`
- **Position:** (60, 260)
- **Dimensions:** 1800×600
- **Layer:** 10
- **Props:**
  - `leftWidth`: 50
  - `orientation`: "vertical"
  - `showDivider`: true
  - `dividerWidth`: 4
  - `dividerColor`: "#00F2FF"
  - `resizable`: false
  - `leftBackground`: "#1A0A0A"
  - `rightBackground`: "#0A1A1A"
  - `leftPadding`: 40
  - `rightPadding`: 40

##### Left Side Content: "Legacy Organic"
- **Container Position:** (100, 300)
- **Content Stack:**

###### title
- **Props:**
  - `text`: "LEGACY ORGANIC"
  - `size`: "xl"
  - `weight`: "bold"
  - `color`: "#FF4444"
  - `align`: "center"

###### iconlibrary
- **Position:** (320, 360) - centered in left panel
- **Props:**
  - `iconName`: "Mail"
  - `size`: 96
  - `color`: "#FF4444"
  - `strokeWidth`: 2

###### text
- **Position:** (100, 480)
- **Props:**
  - `content`: "**The Old World:**\n\n• Fragmented email chains with 12+ participants\n• 147-page PDF attachments weighing 84MB\n• 24-72 hour response latencies per touchpoint\n• Manual quote generation with 14% error rate\n• Calendar Tetris for stakeholder alignment\n• Average sales cycle: 127 days\n• Human bottlenecks at every decision gate"
  - `size`: "base"
  - `color`: "#CCCCCC"
  - `align`: "left"
  - `lineHeight`: "relaxed "

###### statscounter
- **Position:** (320, 740)
- **Props:**
  - `startValue`: 127
  - `endValue`: 127
  - `duration`: 1000
  - `suffix`: " days"
  - `fontSize`: "48px"
  - `fontWeight`: "bold"
  - `color`: "#FF4444"
  - `label`: "Average Sales Cycle"
  - `alignment`: "center"

##### Right Side Content: "Synaptic Digital"
- **Container Position:** (1020, 300)
- **Content Stack:**

###### title
- **Props:**
  - `text`: "SYNAPTIC DIGITAL"
  - `size`: "xl"
  - `weight`: "bold"
  - `color`: "#00F2FF"
  - `align`: "center"

###### iconlibrary
- **Position:** (1240, 360) - centered in right panel
- **Props:**
  - `iconName`: "Zap"
  - `size`: 96
  - `color`: "#00F2FF"
  - `strokeWidth`: 2

###### text
- **Position:** (1020, 480)
- **Props:**
  - `content`: "**The New Paradigm:**\n\n• Unified portal with instant provisioning\n• Real-time ROI calculators with live data feeds\n• <2 second response on all technical queries\n• Automated quote generation with 99.7% accuracy\n• Self-serve scheduling with calendar sync\n• Average activation: 14 minutes\n• Zero human dependencies until contract signature"
  - `size`: "base"
  - `color`: "#CCCCCC"
  - `align`: "left"
  - `lineHeight`: "relaxed"

###### statscounter
- **Position:** (1240, 740)
- **Props:**
  - `startValue`: 0
  - `endValue`: 14
  - `duration`: 2500
  - `suffix`: " min"
  - `fontSize`: "48px"
  - `fontWeight`: "bold"
  - `color`: "#00F2FF"
  - `label`: "Time to Portal Activation"
  - `alignment`: "center"

#### shape
- **Element ID:** `divider-arrow-001`
- **Type:** `shape`
- **Position:** (910, 520)
- **Dimensions:** 100×40
- **Layer:** 15
- **Props:**
  - `shapeType`: "triangle"
  - `backgroundColor`: "#00F2FF"
  - `rotation`: 270
  - `opacity`: 100
- **Animation:** Pulse scale 1.0 ↔ 1.1 (infinite loop, 1500ms)

#### imagecomparison
- **Element ID:** `ui-comparison-001`
- **Type:** `imagecomparison`
- **Position:** (460, 880)
- **Dimensions:** 1000×160
- **Layer:** 10
- **Props:**
  - `beforeImage`: "https://cdn.example.com/img/messy_inbox_ui.png"
  - `afterImage`: "https://cdn.example.com/img/clean_portal_ui.png"
  - `beforeLabel`: "LEGACY"
  - `afterLabel`: "SYNAPTIC"
  - `initialPosition`: 50
  - `sliderColor`: "#00F2FF"
  - `labelColor`: "#FFFFFF"
- **Asset Specs:** 
  - Before: Screenshot of cluttered email inbox
  - After: Clean, modern portal dashboard
  - Both images: 1000×160px, PNG format

---

## PAGE 4: THE FINTECH CORE (CHOOSE YOUR STREAM)

**Objective:** Deep educational engagement via self-selection.  
**Transition In:** Slide Up (1100ms)  
**Background Type:** Animated Gradient  
**Canvas Background:** Animated gradient `#0A0A1E` → `#1E0A1E` → `#0A1E1E` (30s cycle)  
**Duration:** ~90 seconds (user-controlled via tabs)

### Elements

#### title
- **Element ID:** `page4-title-001`
- **Type:** `title`
- **Position:** (960, 60) - centered
- **Dimensions:** 1600×auto
- **Layer:** 10
- **Props:**
  - `text`: "THE FINTECH CORE"
  - `size`: "3xl"
  - `weight`: "black"
  - `align`: "center"
  - `color`: "#FFFFFF"

#### text
- **Element ID:** `page4-subtitle-001`
- **Type:** `text`
- **Position:** (460, 140)
- **Dimensions:** 1000×auto
- **Layer:** 10
- **Props:**
  - `content`: "Select your domain to explore our neural capabilities. Each stream is engineered for instant deployment and zero-drift operation."
  - `size`: "lg"
  - `align`: "center"
  - `color`: "#A0A0A0"

#### tabs
- **Element ID:** `fintech-tabs-001`
- **Type:** `tabs`
- **Position:** (60, 240)
- **Dimensions:** 1800×780
- **Layer:** 10
- **Props:**
  - `tabStyle`: "underline"
  - `tabPosition`: "top"
  - `activeColor`: "#00F2FF"
  - `inactiveColor`: "#505050"
  - `backgroundColor`: "#0A0A0A"
  - `tabBarBackgroundColor`: "#151515"
  - `textColor`: "#FFFFFF"
  - `borderColor`: "#00F2FF"
  - `tabSpacing`: 16
  - `contentPadding`: 32
  - `animateTransition`: true
  - `transitionDuration`: 400

##### Tab 1: "Institutional Liquidity"
- **Tab Label:** "INSTITUTIONAL LIQUIDITY"
- **Icon:** `Droplet`
- **Content:**

###### gridlayout
- **Position:** (60, 320)
- **Dimensions:** 1800×680
- **Props:**
  - `columns`: 2
  - `gap`: 40
  - `equalHeight`: false

**Column 1: Visual**
- **image**
  - **Position:** (80, 340)
  - **Dimensions:** 840×600
  - **Props:**
    - `src`: "https://cdn.example.com/img/liquidity_node_map.png"
    - `alt`: "Real-time liquidity flow visualization"
    - `width`: "full"
    - `rounded`: "lg"
    - `shadow`: true
  - **Asset Spec:** Network diagram showing liquidity nodes, flow rates, and settlement pathways

**Column 2: Interactive accordion**
- **accordion**
  - **Position:** (960, 340)
  - **Dimensions:** 860×600
  - **Props:**
    - `allowMultiple`: false
    - `headerBackground`: "#1A1A2E"
    - `headerTextColor`: "#FFFFFF"
    - `contentBackground`: "#0F0F1A"
    - `contentTextColor`: "#D0D0D0"
    - `iconStyle`: "chevron"
    - `borderColor`: "#00F2FF"
    - `transitionSpeed`: 300

**Accordion Items:**

**Section 1:** "Latency Minimization"
- **Header:** "SUB-5MS SETTLEMENT LATENCY"
- **Content:** "Our neural settlement engine processes cross-border transactions in under 5 milliseconds, utilizing quantum-resistant cryptography and predictive routing algorithms. Real-time monitoring dashboard provides microsecond-level visibility across 180+ currency pairs and 240 settlement corridors.\n\n**Key Features:**\n• Predictive liquidity positioning\n• Auto-rebalancing across 47 nodes\n• Smart routing with ML-based path optimization\n• 99.997% uptime SLA"

**Section 2:** "Cross-Border Settlement"
- **Header:** "GLOBAL INSTANT SETTLEMENT"
- **Content:** "Eliminate correspondent banking delays with our direct settlement network. Connect to 240 financial institutions across 89 countries. Average settlement time: 14 seconds.\n\n**Coverage:**\n• Americas: 32 countries, 89 institutions\n• EMEA: 41 countries, 124 institutions\n• APAC: 16 countries, 27 institutions\n\n**Compliance:**\n• Automated SWIFT messaging\n• ISO 200 22 native support\n• Real-time sanctions screening\n• Instant regulatory reporting"

**Section 3:** "Neural Risk Scoping"
- **Header:** "AI-POWERED RISK INTELLIGENCE"
- **Content:** "Machine learning models analyze 2.4B data points per second to predict counterparty risk, liquidity shortfalls, and market volatility exposures.\n\n**Risk Engines:**\n• Counterparty Credit Risk (CCR) modeling\n• Value at Risk (VaR) computation\n• Stress testing scenarios (10,000+ simulations)\n• Real-time P&L attribution\n\n**Response:**\n• Auto-hedging triggers\n• Dynamic credit line adjustment\n• Portfolio rebalancing recommendations"

##### Tab 2: "Regulatory Sync"
- **Tab Label:** "REGULATORY SYNC"
- **Icon:** `Shield`
- **Content:**

###### title
- **Position:** (80, 340)
- **Props:**
  - `text`: "Automated Compliance Engine"
  - `size`: "xl"
  - `weight`: "semibold"
  - `color`: "#00FFB7"
  - `align`: "left"

###### text (list-style)
- **Position:** (80, 420)
- **Dimensions:** 840×400
- **Props:**
  - `content`: "**Automated KYC/AML Processing**\nReal-time identity verification across 240 jurisdictions. Biometric authentication, document validation, and adverse media screening in under 90 seconds. Integration with World-Check, Dow Jones, and LexisNexis.\n\n**ISO 20022 Compliance**\nNative ISO 20022 message generation and parsing. Supports MX messages for payments (pacs), securities (sese), trade services (tsmt), and account management (acmt). Automatic enrichment with regulatory data elements.\n\n**Real-time Audit Trails**\nImmutable blockchain-backed audit logs. Every transaction, every decision, every data access logged with cryptographic proof. Instant regulatory report generation for MiFID II, Dodd-Frank, Basel III, GDPR, and 47 other frameworks.\n\n**Sanctions Screening**\nReal-time screening against OFAC, EU, UN, and 180+ sanctions lists. Sub-second response with zero false positives using neural name matching."
  - `size`: "base"
  - `color`: "#CCCCCC"
  - `lineHeight`: "relaxed"

###### videoplayer
- **Position:** (980, 340)
- **Dimensions:** 860×480
- **Props:**
  - `videoUrl`: "https://cdn.example.com/videos/compliance_engine_demo.mp4"
  - `poster`: "https://cdn.example.com/videos/compliance_poster.jpg"
  - `autoplay`: false
  - `loop`: false
  - `muted`: false
  - `controls`: true
- **Video Content:** 90-second demo showing compliance dashboard, real-time screening, and automated report generation
- **Asset Spec:** MP4, 1080p, 60fps, ~20MB

##### Tab 3: "Quantum Ledger"
- **Tab Label:** "QUANTUM LEDGER"
- **Icon:** `Cpu`
- **Content:**

###### headline
- **Position:** (960, 360) - centered
- **Props:**
  - `text`: "10M TPS WITH ZERO DRIFT"
  - `size`: "2xl"
  - `useGradient`: true
  - `gradientFrom`: "#00F2FF"
  - `gradientTo`: "#FF00F2"
  - `align`: "center"

###### image (chart replacement)
- **Position:** (460, 480)
- **Dimensions:** 1000×400
- **Props:**
  - `src`: "https://cdn.example.com/img/ledger_throughput_comparison.png"
  - `alt`: "Quantum Ledger vs Legacy System Throughput"
  - `width`: "full"
  - `rounded`: "md"
  - `shadow`: true
- **Asset Spec:** Bar chart image showing:
  - Legacy Database: 2,400 TPS
  - Modern Blockchain: 47,000 TPS
  - Quantum Ledger: 10,000,000 TPS

###### text
- **Position:** (360, 920)
- **Dimensions:** 1200×auto
- **Props:**
  - `content`: "Our quantum-resistant distributed ledger processes 10 million transactions per second with cryptographic finality. Post-quantum algorithms ensure security against future computational threats. Deterministic state machines eliminate drift across all nodes globally."
  - `size`: "lg"
  - `color`: "#D0D0D0"
  - `align`: "center"

###### gridlayout (stats)
- **Position:** (360, 1020)
- **Dimensions:** 1200×120
- **Props:**
  - `columns`: 3
  - `gap`: 40

**Stat 1:**
- **statscounter**
  - `endValue`: 10
  - `suffix`: "M"
  - `label`: "Transactions/Second"
  - `color`: "#00F2FF"
  - `fontSize`: "56px"

**Stat 2:**
- **statscounter**
  - `endValue`: 0
  - `decimals`: 0
  - `suffix`: " drift"
  - `label`: "State Divergence"
  - `color`: "#00FFB7"
  - `fontSize`: "56px"

**Stat 3:**
- **statscounter**
  - `endValue`: 99.9997
  - `decimals`: 4
  - `suffix`: "%"
  - `label`: "Uptime SLA"
  - `color`: "#7000FF"
  - `fontSize`: "56px"

---

## PAGE 5: NEURAL ANALYST ADVISORY (KOLs)

**Objective:** Social proof using AI-synthetic experts.  
**Transition In:** Fade (800ms)  
**Background Type:** Solid with Particle Effect  
**Canvas Background:** `#0A0A0A` with animated particle overlay  
**Duration:** ~50 seconds

### Elements

#### title
- **Element ID:** `page5-title-001`
- **Type:** `title`
- **Position:** (960, 80) - centered
- **Dimensions:** 1600×auto
- **Layer:** 10
- **Props:**
  - `text`: "MARKET SENTIENCE VOICES"
  - `size`: "3xl"
  - `weight`: "black"
  - `align`: "center"
  - `color`: "#FFFFFF"
  - `letterSpacing`: "wider"

#### text
- **Element ID:** `page5-subtitle-001`
- **Type:** `text`
- **Position:** (460, 160)
- **Dimensions:** 1000×auto
- **Layer:** 10
- **Props:**
  - `content`: "Our neural advisory board represents the apex of AI-driven financial intelligence. These synthetic entities process market signals, regulatory changes, and risk factors at superhuman velocity."
  - `size`: "lg"
  - `align`: "center"
  - `color`: "#909090"

#### gridlayout
- **Element ID:** `advisory-grid-001`
- **Type:** `gridlayout`
- **Position:** (160, 280)
- **Dimensions:** 1600×560
- **Layer:** 10
- **Props:**
  - `columns`: 2
  - `gap`: 60
  - `minItemWidth`: 720
  - `equalHeight`: true
  - `backgroundColor`: "transparent"

##### Child 1: avatarcard
- **Element ID:** `avatar-architect-001`
- **Type:** `avatarcard`
- **Dimensions:** 720×520
- **Layer:** 10
- **Props:**
  - `imageUrl`: "https://cdn.example.com/avatars/architect_01_neural.jpg"
  - `name`: "ARCHITECT.01"
  - `title`: "Systemic Wealth Lead"
  - `bio`: "Specialized in eliminating human bottlenecks from high-frequency wealth management operations. Processes 2.4M market signals per second to identify alpha opportunities invisible to human analysts. Deployed across 47 institutional portfolios managing $180B AUM."
  - `email`: ""
  - `linkedin`: "https://neural.advisors/architect-01"
  - `twitter`: ""
  - `github`: "https://github.com/neural-architects/architect-01"
  - `layout`: "vertical"
  - `backgroundColor`: "#0F0F1F"
  - `textColor`: "#FFFFFF"
  - `borderColor`: "#00F2FF"
  - `borderWidth`: 2
  - `padding`: 32
  - `rounded`: "lg"
  - `shadow`: "xl"
- **Additional Content:**
  - **Badge:** "Neural Entity"
  - **Specialization Tags:** ["HFT", "Portfolio Optimization", "Risk Modeling", "Algorithmic Execution"]
  - **Processing Capacity:** "2.4M signals/sec"
  - **Uptime:** "99.994%"
- **Asset Spec:** 
  - Image: AI-generated professional headshot with subtle tech overlay
  - Dimensions: 400×400px
  - Format: JPG, optimized

##### Child 2: avatarcard
- **Element ID:** `avatar-sigma-001`
- **Type:** `avatarcard`
- **Dimensions:** 720×520
- **Layer:** 10
- **Props:**
  - `imageUrl`: "https://cdn.example.com/avatars/sigma_node_neural.jpg"
  - `name`: "SIGMA.NODE"
  - `title`: "Compliance Logic Head"
  - `bio`: "Authorized computational engine for cross-jurisdictional financial engineering. Real-time regulatory interpretation across 89 countries and 240+ frameworks. Processes regulatory changes within 4 seconds of publication and auto-updates compliance logic across all client environments."
  - `email`: ""
  - `linkedin`: "https://neural.advisors/sigma-node"
  - `twitter`: ""
  - `github`: "https://github.com/neural-architects/sigma-node"
  - `layout`: "vertical"
  - `backgroundColor`: "#0F1F0F"
  - `textColor`: "#FFFFFF"
  - `borderColor`: "#00FFB7"
  - `borderWidth`: 2
  - `padding`: 32
  - `rounded`: "lg"
  - `shadow`: "xl"
- **Additional Content:**
  - **Badge:** "Neural Entity"
  - **Specialization Tags:** ["RegTech", "KYC/AML", "Cross-Border", "ISO 20022"]
  - **Regulatory Coverage:** "89 jurisdictions"
  - **Update Latency:** "<4 seconds"
- **Asset Spec:**
  - Image: AI-generated professional headshot with compliance-themed overlay
  - Dimensions: 400×400px
  - Format: JPG, optimized

#### divider
- **Element ID:** `section-divider-001`
- **Type:** `divider`
- **Position:** (460, 880)
- **Dimensions:** 1000×2
- **Layer:** 9
- **Props:**
  - `width`: "full"
  - `thickness`: 2
  - `color`: "#333333"
  - `style`: "solid"

#### text
- **Element ID:** `trusted-by-label-001`
- **Type:** `text`
- **Position:** (960, 920) - centered
- **Dimensions:** 1000×auto
- **Layer:** 10
- **Props:**
  - `content`: "TRUSTED BY LEADING FINANCIAL INSTITUTIONS"
  - `size`: "sm"
  - `align`: "center"
  - `color`: "#606060"
  - `weight`: "semibold"
  - `letterSpacing`: "wide"

#### logogrid
- **Element ID:** `client-logos-001`
- **Type:** `logogrid`
- **Position:** (360, 970)
- **Dimensions:** 1200×100
- **Layer:** 10
- **Props:**
  - `logos`: [
      {
        "url": "https://cdn.example.com/logos/goldman_ai_division.svg",
        "name": "Goldman Sachs AI Division",
        "link": ""
      },
      {
        "url": "https://cdn.example.com/logos/stripe_neural_payments.svg",
        "name": "Stripe Neural Payments",
        "link": ""
      },
      {
        "url": "https://cdn.example.com/logos/jpm_synthetic_markets.svg",
        "name": "JPMorgan Synthetic Markets",
        "link": ""
      },
      {
        "url": "https://cdn.example.com/logos/blackrock_quantum_fund.svg",
        "name": "BlackRock Quantum Fund",
        "link": ""
      }
    ]
  - `columns`: 4
  - `gap`: 48
  - `logoSize`: "80px"
  - `grayscale`: true
  - `hoverEffect`: true
  - `hoverScale`: 1.1
  - `hoverGrayscale`: false
- **Asset Specs:**
  - All logos: SVG format, monochrome white design
  - Dimensions: 240×80px artboard
  - Background: Transparent

---

## PAGE 6: THE ROI OF SELF-SERVICE

**Objective:** Hard metrics showing the efficiency of the digital-first model.  
**Transition In:** Slide Right (1000ms)  
**Background Type:** Gradient  
**Canvas Background:** Linear gradient `#0A0A1A` to `#1A0A1A` (180deg)  
**Duration:** ~45 seconds

### Elements

#### headline
- **Element ID:** `page6-headline-001`
- **Type:** `headline`
- **Position:** (960, 100) - centered
- **Dimensions:** 1600×auto
- **Layer:** 10
- **Props:**
  - `text`: "EFFICIENCY METRICS"
  - `size`: "3xl"
  - `weight`: "black"
  - `align`: "center"
  - `useGradient`: true
  - `gradientFrom`: "#00F2FF"
  - `gradientTo`: "#7000FF"
  - `gradientDirection`: "to-r"
  - `letterSpacing`: "wider"

#### text
- **Element ID:** `page6-context-001`
- **Type:** `text`
- **Position:** (460, 200)
- **Dimensions:** 1000×auto
- **Layer:** 10
- **Props:**
  - `content`: "Real performance data from 180+ enterprise deployments. These aren't projections—they're operational realities measured across $47B in managed transaction volume."
  - `size`: "lg"
  - `align`: "center"
  - `color`: "#A0A0A0"

#### gridlayout
- **Element ID:** `metrics-grid-001`
- **Type:** `gridlayout`
- **Position:** (160, 320)
- **Dimensions:** 1600×400
- **Layer:** 10
- **Props:**
  - `columns`: 4
  - `gap`: 32
  - `minItemWidth`: 360
  - `equalHeight`: true
  - `backgroundColor`: "transparent"

##### Child 1: statscounter with container
- **Container:**
  - `backgroundColor`: "#0F0F1F"
  - `borderColor`: "#00F2FF"
  - `borderWidth`: 2
  - `borderRadius`: 16
  - `padding`: 40
  - `shadow`: "xl"

- **statscounter**
  - **Element ID:** `stat-onboarding-001`
  - **Props:**
    - `startValue`: 0
    - `endValue`: 14
    - `duration`: 3000
    - `decimals`: 0
    - `prefix`: ""
    - `suffix`: " days"
    - `fontSize`: "64px"
    - `fontWeight`: "black"
    - `color`: "#00F2FF"
    - `label`: "Saved in Onboarding"
    - `labelSize`: "16px"
    - `alignment`: "center"

- **text** (subtext)
  - `content`: "From 21 days to 7 days average"
  - `size`: "sm"
  - `color`: "#707070"
  - `align`: "center"

##### Child 2: statscounter with container
- **Container:**
  - `backgroundColor`: "#0F1F0F"
  - `borderColor`: "#00FFB7"
  - `borderWidth`: 2
  - `borderRadius`: 16
  - `padding`: 40
  - `shadow`: "xl"

- **statscounter**
  - **Element ID:** `stat-ease-001`
  - **Props:**
    - `startValue`: 0
    - `endValue`: 82
    - `duration`: 3000
    - `decimals`: 0
    - `prefix`: "+"
    - `suffix`: "%"
    - `fontSize`: "64px"
    - `fontWeight`: "black"
    - `color`: "#00FFB7"
    - `label`: "Increase in Buyer Ease"
    - `labelSize`: "16px"
    - `alignment`: "center"

- **text** (subtext)
  - `content`: "NPS score improvement"
  - `size`: "sm"
  - `color`: "#707070"
  - `align`: "center"

##### Child 3: statscounter with container
- **Container:**
  - `backgroundColor`: "#1F0F1F"
  - `borderColor`: "#FF00F2"
  - `borderWidth`: 2
  - `borderRadius`: 16
  - `padding`: 40
  - `shadow`: "xl"

- **statscounter**
  - **Element ID:** `stat-friction-001`
  - **Props:**
    - `startValue`: 47
    - `endValue`: 0
    - `duration`: 3500
    - `decimals`: 0
    - `prefix`: ""
    - `suffix`: ""
    - `fontSize`: "64px"
    - `fontWeight`: "black"
    - `color`: "#FF00F2"
    - `label`: "Human Intervention Points"
    - `labelSize`: "16px"
    - `alignment`: "center"

- **text** (subtext)
  - `content`: "Eliminated decision bottlenecks"
  - `size`: "sm"
  - `color`: "#707070"
  - `align`: "center"

##### Child 4: statscounter with container
- **Container:**
  - `backgroundColor`: "#1F1F0F"
  - `borderColor`: "#FFB700"
  - `borderWidth`: 2
  - `borderRadius`: 16
  - `padding`: 40
  - `shadow`: "xl"

- **statscounter**
  - **Element ID:** `stat-velocity-001`
  - **Props:**
    - `startValue`: 0
    - `endValue`: 300
    - `duration`: 3500
    - `decimals`: 0
    - `prefix`: "+"
    - `suffix`: "%"
    - `fontSize`: "64px"
    - `fontWeight`: "black"
    - `color`: "#FFB700"
    - `label`: "Velocity Increase"
    - `labelSize`: "16px"
    - `alignment`: "center"

- **text** (subtext)
  - `content`: "Deal pipeline acceleration"
  - `size`: "sm"
  - `color`: "#707070"
  - `align`: "center"

#### text
- **Element ID:** `data-sample-note-001`
- **Type:** `text`
- **Position:** (360, 760)
- **Dimensions:** 1200×auto
- **Layer:** 10
- **Props:**
  - `content`: "**Data Sample:** 182 enterprise deployments | 24 months operational data | $47B transaction volume | 89 countries"
  - `size`: "sm"
  - `align`: "center"
  - `color`: "#606060"

#### progressbar
- **Element ID:** `sync-progress-001`
- **Type:** `progressbar`
- **Position:** (360, 840)
- **Dimensions:** 1200×48
- **Layer:** 10
- **Props:**
  - `percentage`: 100
  - `height`: 48
  - `orientation`: "horizontal"
  - `backgroundColor`: "#1A1A1A"
  - `fillColor`: "#00F2FF"
  - `showLabel`: true
  - `labelPosition`: "inside"
  - `animated`: true
  - `animationDuration`: 2500
  - `borderRadius`: 24
  - `label`: "SYSTEM SYNCHRONIZATION COMPLETE"
  - `labelColor`: "#000000"
  - `labelSize`: "18px"
  - `labelWeight`: "bold"

#### shape
- **Element ID:** `check-icon-001`
- **Type:** `iconlibrary`
- **Position:** (880, 920)
- **Dimensions:** 160×160
- **Layer:** 10
- **Props:**
  - `iconName`: "CheckCircle"
  - `size`: 160
  - `color`: "#00FFB7"
  - `strokeWidth`: 2
- **Animation:** Scale pulse 0.95 ↔ 1.05 (2000ms loop)

---

## PAGE 7: INITIALIZE PORTAL GENERATION

**Objective:** Conversion.  
**Transition In:** Fade with zoom (1200ms)  
**Background Type:** Animated gradient with particle field  
**Canvas Background:** Animated gradient `#000510` → `#100520` → `#000510` (20s cycle)  
**Duration:** Until user action

### Elements

#### shape (decorative background element)
- **Element ID:** `bg-gradient-orb-001`
- **Type:** `shape`
- **Position:** (960, 540) - centered
- **Dimensions:** 800×800
- **Layer:** 1
- **Props:**
  - `shapeType`: "circle"
  - `backgroundColor`: "#7000FF"
  - `opacity`: 15
  - `blur`: 200
- **Animation:** Scale pulse 1.0 ↔ 1.3 (8000ms loop)

#### divider
- **Element ID:** `top-divider-001`
- **Type:** `divider`
- **Position:** (460, 180)
- **Dimensions:** 1000×2
- **Layer:** 10
- **Props:**
  - `width`: "full"
  - `thickness`: 2
  - `color`: "#00F2FF"
  - `style`: "solid"
  - `opacity`: 60

#### headline
- **Element ID:** `page7-headline-001`
- **Type:** `headline`
- **Position:** (960, 280) - centered
- **Dimensions:** 1400×auto
- **Layer:** 10
- **Props:**
  - `text`: "READY TO ARCHITECT YOUR JOURNEY?"
  - `size`: "3xl"
  - `weight`: "black"
  - `align`: "center"
  - `useGradient`: true
  - `gradientFrom`: "#00F2FF"
  - `gradientTo`: "#FF00F2"
  - `gradientDirection`: "to-r"
  - `letterSpacing`: "wide"
  - `lineHeight`: "tight"

#### text
- **Element ID:** `page7-cta-text-001`
- **Type:** `text`
- **Position:** (460, 400)
- **Dimensions:** 1000×auto
- **Layer:** 10
- **Props:**
  - `content`: "Click below to generate your persistent, personalized environment—tailored precisely to your liquidity requirements, compliance frameworks, and operational architecture. Your secure portal will be provisioned in under 90 seconds."
  - `size`: "xl"
  - `align`: "center"
  - `color`: "#C0C0C0"
  - `lineHeight`: "relaxed"
  - `maxWidth`: "900px"

#### gridlayout (feature highlights)
- **Element ID:** `portal-features-001`
- **Type:** `gridlayout`
- **Position:** (460, 520)
- **Dimensions:** 1000×120
- **Layer:** 10
- **Props:**
  - `columns`: 3
  - `gap`: 40
  - `equalHeight`: true

##### Feature 1
- **iconlibrary**: `Zap`, size 48, color `#00F2FF`
- **text**: "Instant Provisioning\n<90 seconds"

##### Feature 2
- **iconlibrary**: `Shield`, size 48, color `#00FFB7`
- **text**: "Bank-Grade Security\nSOC 2 Type II"

##### Feature 3
- **iconlibrary**: `Globe`, size 48, color `#7000FF`
- **text**: "24/7 Availability\n99.97% SLA"

#### button
- **Element ID:** `cta-final-001`
- **Type:** `button`
- **Position:** (710, 720) - centered
- **Dimensions:** 500×80
- **Layer:** 10
- **Props:**
  - `text`: "GENERATE MY CUSTOM PORTAL"
  - `action`: "modal"
  - `modalAsset`: "portal-confirmation-modal"
  - `backgroundColor`: "#00F2FF"
  - `textColor`: "#000000"
  - `fontSize`: "xl"
  - `rounded`: "full"
  - `padding`: "24px 48px"
  - `shadow`: "2xl"
  - `hoverEffect`: "glow-intense"
  - `icon`: "Sparkles"
  - `iconPosition`: "right"
- **Animation:** 
  - Idle: Subtle glow pulse (2000ms loop)
  - Hover: Intense glow + scale 1.05
  - Click: Scale 0.95 → 1.0 (200ms)
- **Interaction:** Opens modal overlay
- **Analytics Event:** `cta_generate_portal_clicked`

#### modal
- **Element ID:** `portal-confirmation-modal-001`
- **Type:** `modal`
- **Trigger:** Button click (cta-final-001)
- **Props:**
  - `modalWidth`: 640
  - `backgroundColor`: "#0F0F1F"
  - `overlayOpacity`: 0.85
  - `overlayColor`: "#000000"
  - `borderRadius`: 16
  - `borderColor`: "#00F2FF"
  - `borderWidth`: 2
  - `padding`: 48
  - `closeOnOverlayClick`: true
  - `showCloseButton`: true
  - `animationStyle`: "scale"
  - `animationDuration`: 400

#### Modal Content:

##### iconlibrary
- **Position:** Centered top
- **Props:**
  - `iconName`: "CheckCircle"
  - `size`: 96
  - `color`: "#00FFB7"
  - `strokeWidth`: 2
- **Animation:** Scale pop (0 → 1.2 → 1.0 over 600ms)

##### headline
- **Props:**
  - `text`: "PORTAL GENERATION INITIATED"
  - `size`: "xl"
  - `weight`: "bold"
  - `align`: "center"
  - `color`: "#FFFFFF"

##### text
- **Props:**
  - `content`: "Your personalized environment is being constructed.\n\n**Portal ID:** PRT-2026-{RANDOM}\n**Provisioning Time:** <90 seconds\n**Access URL:** portal.synaptic.ai/access/{ID}\n\nYou will receive secure credentials at your registered email within 2 minutes. Your portal includes:\n\n• Real-time liquidity dashboard\n• Compliance & regulatory monitoring\n• Neural risk analytics\n• Automated quote generation\n• Direct settlement access\n• 24/7 API availability"
  - `size`: "base"
  - `align`: "center"
  - `color`: "#C0C0C0"
  - `lineHeight`: "relaxed"

##### button
- **Props:**
  - `text`: "ACCESS SECURE NODE"
  - `action`: "link"
  - `actionValue`: "https://portal.synaptic.ai/secure-access"
  - `backgroundColor`: "#00F2FF"
  - `textColor`: "#000000"
  - `fontSize`: "lg"
  - `rounded`: "lg"
- **Position:** Centered bottom

---

## Implementation Notes

### Current Element Status
- ✅ **Live Elements Used (20):** videoplayer, headline, text, spacer, button, title, gridlayout, flipcard, statscounter, splitscreen, iconlibrary, imagecomparison, tabs, accordion, image, avatarcard, logogrid, progressbar, divider, modal, shape
- 🔄 **Pending Elements Needed (0):** All required elements are currently live in the system

### Complete Asset List

#### Videos (2 required)
1. **digital_aether_loop.mp4**
   - Purpose: Page 1 background video
   - Specs: 1920×1080, MP4/H.264, 30fps, seamless 30s loop
   - Content: Abstract particle network or digital aether visualization
   - Size Target: <10MB
   - Audio: None (muted)
   - Source: Custom motion graphics or stock from Artgrid/Envato

2. **compliance_engine_demo.mp4**
   - Purpose: Page 4, Tab 2 demo player
   - Specs: 1920×1080, MP4/H.264, 60fps, 90 seconds
   - Content: Screen recording of compliance dashboard with real-time screening
   - Size Target: ~20MB
   - Audio: Optional narration or music
   - Subtitles: Recommended

#### Images (10 required)

**Page 1:**
- `digital_aether_poster.jpg` - Video poster frame (1920×1080, JPG, <500KB)

**Page 3:**
- `messy_inbox_ui.png` - Screenshot of cluttered email interface (1000×160, PNG)
- `clean_portal_ui.png` - Clean dashboard interface (1000×160, PNG)

**Page 4:**
- `liquidity_node_map.png` - Network visualization diagram (840×600, PNG, <2MB)
- `ledger_throughput_comparison.png` - Bar chart graphic (1000×400, PNG, <1MB)

**Page 5:**
- `architect_01_neural.jpg` - AI avatar headshot (400×400, JPG, <200KB)
- `sigma_node_neural.jpg` - AI avatar headshot (400×400, JPG, <200KB)

**Logo Files (SVG format, transparent background):**
- `goldman_ai_division.svg` - Goldman Sachs logo variant (240×80 artboard)
- `stripe_neural_payments.svg` - Stripe logo variant (240×80 artboard)
- `jpm_synthetic_markets.svg` - JPMorgan logo variant (240×80 artboard)
- `blackrock_quantum_fund.svg` - BlackRock logo variant (240×80 artboard)

### Design System Specifications

#### Color Palette
```
Primary Gradient:
- Cyan: #00F2FF (RGB: 0, 242, 255)
- Purple: #7000FF (RGB: 112, 0, 255)
- Magenta: #FF00F2 (RGB: 255, 0, 242)
- Green: #00FFB7 (RGB: 0, 255, 183)
- Amber: #FFB700 (RGB: 255, 183, 0)

Background Colors:
- Pure Black: #000000
- Dark Base: #0A0A0A
- Dark Blue: #0A0A1E, #1A1A2E
- Dark Purple: #1A0A3E, #2E1A3E
- Dark Green: #0F1F0F, #1A3E2E

Text Colors:
- White: #FFFFFF
- Light Gray: #E0E0E0, #D0D0D0, #C0C0C0
- Mid Gray: #B0B0B0, #A0A0A0, #909090, #808080
- Dark Gray: #707070, #606060, #505050

Accent/Error:
- Red: #FF4444
```

#### Typography Scale
```
Headline Sizes:
- xs: 24px / 1.5rem
- sm: 30px / 1.875rem
- md: 36px / 2.25rem
- lg: 48px / 3rem
- xl: 60px / 3.75rem
- 2xl: 72px / 4.5rem
- 3xl: 96px / 6rem
- 4xl: 128px / 8rem

Body Text Sizes:
- sm: 14px / 0.875rem
- base: 16px / 1rem
- lg: 18px / 1.125rem
- xl: 20px / 1.25rem
- 2xl: 24px / 1.5rem

Font Weights:
- normal: 400
- medium: 500
- semibold: 600
- bold: 700
- black: 900

Line Heights:
- tight: 1.1
- normal: 1.5
- relaxed: 1.75

Letter Spacing:
- tight: -0.025em
- normal: 0
- wide: 0.025em
- wider: 0.05em
```

#### Animation Specifications
```
Transition Durations:
- Quick: 200ms
- Normal: 400ms
- Slow: 600ms
- Dramatic: 800-1200ms

Easing Functions:
- Standard: cubic-bezier(0.4, 0.0, 0.2, 1)
- Decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
- Accelerate: cubic-bezier(0.4, 0.0, 1, 1)
- Sharp: cubic-bezier(0.4, 0.0, 0.6, 1)

Page Transitions:
- Fade: opacity 0 → 1, 1200ms
- Slide Left: translateX(100%) → 0, 1000ms
- Slide Up: translateY(100%) → 0, 1100ms
- Scale: scale(0.95) → 1.0, 900ms

Element Animations:
- Counter Animation: 2500-3500ms duration
- Pulse: scale 0.95 ↔ 1.05, 2000ms infinite
- Glow Pulse: opacity 0.6 ↔ 1.0, 2000ms infinite
- Button Hover: scale 1.0 → 1.05, 300ms
```

#### Layout Grid System
```
Canvas: 1920×1080px (16:9 aspect ratio)

Safe Zones:
- Left/Right Margin: 60-120px
- Top Margin: 60-100px
- Bottom Margin: 40-80px

Content Widths:
- Narrow: 800px (centered)
- Medium: 1200px (centered)
- Wide: 1600px (centered)
- Full: 1800px (60px margins)

Grid Gaps:
- Tight: 16px
- Normal: 24-32px
- Wide: 40-60px

Element Padding:
- Compact: 16-24px
- Normal: 32-40px
- Spacious: 48-64px
```

### Technical Architecture

#### Canvas Configuration
```json
{
  "width": 1920,
  "height": 1080,
  "aspectRatio": "16:9",
  "scaleMode": "fit-height",
  "backgroundColor": "#000000",
  "defaultTextColor": "#FFFFFF"
}
```

#### Performance Targets
```
- Page Load Time: <2 seconds (cold start)
- Page Transition: <1.5 seconds
- Asset Loading: Progressive (critical first)
- Video Autoplay: Preload="metadata"
- Image Format: WebP preferred, JPG/PNG fallback
- Total Experience Size: <50MB initial load
- Lazy Loading: All non-critical assets

Optimization:
- Video compression: H.264, CRF 23-28
- Image compression: 80-85% quality
- SVG optimization: SVGO processing
- Font loading: WOFF2 format, font-display: swap
```

#### Browser Compatibility
```
Supported Browsers:
- Chrome/Edge: Version 100+
- Firefox: Version 100+
- Safari: Version 15+

Required APIs:
- Fullscreen API (for viewer mode)
- Intersection Observer (for animations)
- CSS Grid & Flexbox
- CSS Custom Properties
- ES6+ JavaScript

Fallbacks:
- No video support: Show poster image
- No WebP: Use JPG/PNG
- Limited animations: Reduce to opacity transitions
```

#### Analytics & Tracking

**Key Events to Track:**
```
Page Events:
- page_1_view (Page 1 view)
- page_2_view (Data cards)
- page_3_view (Comparison)
- page_4_view (Tabs accessed)
- page_5_view (KOLs)
- page_6_view (ROI metrics)
- page_7_view (CTA page)

Interaction Events:
- cta_initialize_discovery_clicked (Page 1 CTA)
- flipcard_autonomy_engaged (Page 2 flip)
- flipcard_millennial_engaged (Page 2 flip)
- flipcard_decision_engaged (Page 2 flip)
- tab_liquidity_selected (Page 4)
- tab_regulatory_selected (Page 4)
- tab_ledger_selected (Page 4)
- accordion_item_expanded (Page 4)
- logo_hover (Page 5)
- cta_generate_portal_clicked (Page 7 main CTA)
- modal_opened (Confirmation modal)
- secure_node_accessed (Modal CTA)

Timing Events:
- time_on_page_1 through time_on_page_7
- total_experience_duration
- video_play_duration (Page 1, Page 4 Tab 2)
- flipcard_flip_count (total flips)

Conversion Metrics:
- portal_generation_initiated
- portal_generation_completed
- lead_captured (if email collected)
```

### Messaging Hierarchy & Storytelling Arc

**Act 1: Problem Identification (Pages 1-2)**
- **Hook:** "Death of the Handshake" - provocative headline
- **Thesis:** Traditional sales cycles are obsolete
- **Evidence:** Gartner data showing 83% buyer autonomy
- **Emotional Tone:** Urgency, disruption, wake-up call
- **Duration:** ~105 seconds

**Act 2: Solution Contrast (Page 3)**
- **Approach:** Side-by-side comparison
- **Message:** Digital-first eliminates all friction points
- **Proof Point:** 127 days → 14 minutes conversion
- **Emotional Tone:** Clarity, decisiveness
- **Duration:** ~50 seconds

**Act 3: Deep Education (Page 4)**
- **Approach:** Self-guided exploration via tabs
- **Message:** Comprehensive technical capabilities
- **Proof Points:** Specific features, specs, compliance
- **Emotional Tone:** Confidence, mastery, control
- **Duration:** ~90 seconds (user-controlled)

**Act 4: Social Proof (Page 5)**
- **Approach:** Authority figures + brand logos
- **Message:** Trusted by leading institutions
- **Proof Points:** AI experts + tier-1 financial brands
- **Emotional Tone:** Trust, validation, peer pressure
- **Duration:** ~50 seconds

**Act 5: ROI Demonstration (Page 6)**
- **Approach:** Hard metrics with animation
- **Message:** Measurable efficiency gains
- **Proof Points:** 14 days saved, 300% velocity increase
- **Emotional Tone:** Excitement, FOMO
- **Duration:** ~45 seconds

**Act 6: Conversion (Page 7)**
- **Approach:** Direct CTA with benefit restating
- **Message:** Get your portal now in 90 seconds
- **Proof Points:** Instant provisioning, secure, 24/7
- **Emotional Tone:** Action, commitment, reward
- **Duration:** Until click (typically 15-30 seconds)

### Conversion Flow Mapping

```
Entry Point → Page 1 → Discovery CTA
                ↓
              Page 2 → Data Engagement (Flipcards)
                ↓
              Page 3 → Comparison Clarity
                ↓
              Page 4 → Educational Deep Dive (Tabs)
                ↓
              Page 5 → Trust Building (KOLs + Logos)
                ↓
              Page 6 → ROI Validation
                ↓
              Page 7 → Portal Generation CTA
                ↓
              Modal → Confirmation + Access Link
                ↓
              External Portal → Onboarding

Exit Points:
- Early Exit (Pages 1-3): 15-20% expected
- Mid-Journey Exit (Pages 4-5): 25-30% expected
- Pre-CTA Exit (Page 6): 10-15% expected
- Target Conversion: 35-40% click-through on final CTA
```

### A/B Testing Recommendations

**Test Variants:**
1. **Headline Variations (Page 1):**
   - Current: "DEATH OF THE HANDSHAKE"
   - Alt A: "THE END OF WAITING"
   - Alt B: "INSTANT. INTELLIGENT. INEVITABLE."

2. **Stat Emphasis (Page 2):**
   - Current: 17% / 44% / 70%
   - Alt A: Flip order to start with 70%
   - Alt B: Add fourth stat (time saved)

3. **CTA Copy (Page 7):**
   - Current: "GENERATE MY CUSTOM PORTAL"
   - Alt A: "START MY FREE PORTAL NOW"
   - Alt B: "BUILD MY PORTAL IN 90 SECONDS"

4. **Modal Delay:**
   - Current: Instant on click
   - Alt A: 2-second loading animation
   - Alt B: Multi-step form collection

### Accessibility Considerations

```
WCAG 2.1 AA Compliance:
- Color Contrast: 4.5:1 minimum for text
- Focus Indicators: Visible on all interactive elements
- Keyboard Navigation: Full support (Tab, Enter, Arrow keys)
- Screen Reader: ARIA labels on all mechanics
- Video: Captions available (optional narration)
- Text Resize: Support up to 200% without breaking layout
- Alt Text: All images have descriptive alt attributes

Keyboard Shortcuts:
- Arrow Right / Space: Next page
- Arrow Left: Previous page
- Escape: Exit fullscreen / Close modal
- Tab: Navigate interactive elements
- Enter: Activate button/link
```

### Localization Framework

**Primary Language:** English (US)

**Translation-Ready Pages:**
- All pages designed with 20-30% text expansion tolerance
- Numeric formats: US style (1,000.00)
- Date formats: ISO 8601 preferred
- Currency: USD default, configurable

**Suggested Locales for Phase 2:**
- English (UK)
- German (DE)
- French (FR)
- Japanese (JP)
- Simplified Chinese (CN)

### Deployment Checklist

**Pre-Launch:**
- [ ] All 10 images compressed and uploaded to CDN
- [ ] Both videos encoded and tested on mobile
- [ ] All 4 logo SVGs optimized and whitelabeled
- [ ] Color palette variables configured in CSS
- [ ] Analytics tracking codes implemented
- [ ] Modal confirmation logic tested
- [ ] Fullscreen API tested across browsers
- [ ] Keyboard navigation verified
- [ ] Screen reader tested (NVDA/JAWS)
- [ ] Mobile responsiveness validated

**Post-Launch Monitoring:**
- [ ] Page load performance (<2s target)
- [ ] Video playback errors (<1%)
- [ ] CTA click-through rate (35-40% target)
- [ ] Modal open rate (tracking)
- [ ] Average session duration (5-7 min target)
- [ ] Bounce rate per page
- [ ] Browser compatibility issues
- [ ] Error logging for failed interactions

---

## Metadata

### Experience Profile
- **Experience ID:** `SYN-SALES-001`
- **Experience Type:** B2B Sales / Lead Generation / Product Demo
- **Industry:** Fintech / Financial Services / Banking Technology
- **Target Vertical:** Institutional Finance, Enterprise Banking, Wealth Management
- **Audience Seniority:** C-Suite (CFO, CTO), VP-level (Head of Digital, Head of Operations)
- **Company Size:** Enterprise (1000+ employees, $500M+ revenue)
- **Geographic Focus:** Global (Primary: North America, EMEA, APAC)

### Experience Characteristics
- **Tone:** Futuristic, authoritative, data-driven, provocative
- **Visual Style:** Dark theme, cyan-purple gradient palette, high-tech aesthetic
- **Content Density:** High (technical audience comfortable with complexity)
- **Interactivity Level:** Medium-High (flipcards, tabs, accordion, modal)
- **Emotional Arc:** Disruption → Evidence → Clarity → Education → Trust → Excitement → Action

### Technical Specifications
- **Total Pages:** 7
- **Total Elements:** 87 (across all pages)
- **Total Assets:** 12 (2 videos, 10 images/graphics)
- **Estimated File Size:** 45-48MB (initial load)
- **Estimated Duration:** 5-7 minutes (with exploration)
- **Minimum Duration:** 3.5 minutes (linear viewing)
- **Maximum Duration:** 12 minutes (full exploration of all tabs/accordions)

### Content Statistics
- **Total Word Count:** ~2,400 words
- **Headline Count:** 14
- **Data Points Presented:** 27 statistics/metrics
- **Interactive Elements:** 16 (buttons, flipcards, tabs, accordion sections)
- **Animations:** 32 animated elements

### Performance KPIs

**Engagement Metrics:**
- **Target View Time:** 5-7 minutes average
- **Target Completion Rate:** 65-75% (reach Page 7)
- **Target Interaction Rate:** 80% (engage with at least 3 interactive elements)
- **Target Tab Exploration:** 60% view 2+ tabs on Page 4
- **Target Flipcard Engagement:** 70% flip at least 1 card on Page 2

**Conversion Metrics:**
- **Primary Goal:** Portal generation CTA click-through
- **Target CTR (Page 7):** 35-40%
- **Target Modal Open Rate:** 35-40%
- **Target Secure Node Access:** 60-70% of modal opens
- **Overall Conversion Rate:** 20-25% end-to-end

**Quality Metrics:**
- **Target Load Time:** <2 seconds (first page)
- **Target Transition Time:** <1.5 seconds (page-to-page)
- **Target Error Rate:** <0.5% (technical failures)
- **Target Browser Compatibility:** 98%+ (modern browsers)

### Use Cases

**Primary Use Case:**
- Top-of-funnel lead generation for enterprise prospects
- Self-serve discovery for CFOs/CTOs researching digital transformation
- Always-on digital sales asset replacing traditional deck presentations

**Secondary Use Cases:**
- Sales enablement: Rep-guided walkthrough during remote demos
- Conference booth display: Loop mode on large screens
- Industry event follow-up: Send link in post-conference emails
- Board presentations: Internal advocacy for digital-first strategy
- Investor relations: Showcase product capabilities and market positioning

**Distribution Channels:**
- **Direct Email:** Personalized link in outbound sequences
- **Landing Page:** Embedded experience on campaign microsites
- **LinkedIn Ads:** Click-through from sponsored content
- **Conference QR Codes:** Instant access at booths/signage
- **Sales Portal:** Always-available resource for reps
- **Partner Channels:** Co-branded versions for resellers

### Competitive Positioning

**Differentiation:**
- **vs. Traditional Sales Decks:** Interactive, self-paced, data-rich
- **vs. Static Demos:** Always available, no scheduling friction
- **vs. Video Presentations:** Non-linear exploration, personalized pace
- **vs. Webinars:** On-demand, zero commitment, instant access
- **vs. PDF Whitepapers:** Visually engaging, animated, memorable

**Unique Selling Points:**
1. Provocative framing ("Death of the Handshake")
2. Gartner-backed data credibility
3. Side-by-side legacy comparison
4. Self-serve technical deep-dives
5. AI-powered advisor personification
6. Real metrics from real deployments
7. <90 second portal provisioning promise

### Production Timeline

**Phase 1: Asset Creation (Week 1-2)**
- Script finalization and approval
- Video production (background loop + demo)
- Image/graphic design (charts, screenshots, mockups)
- AI avatar generation
- Logo preparation and legal clearance

**Phase 2: Build & Integration (Week 3)**
- Page layout construction in FIS-Presents
- Element positioning and property configuration
- Animation timing and transition setup
- Modal configuration and testing
- Analytics implementation

**Phase 3: QA & Refinement (Week 4)**
- Cross-browser testing
- Mobile responsiveness validation
- Performance optimization
- Copy editing and proofreading
- Stakeholder review and feedback incorporation

**Phase 4: Launch Preparation (Week 5)**
- CDN asset upload and optimization
- Final performance testing
- Documentation completion
- Analytics dashboard setup
- Launch communications preparation

**Total Production Time:** 5 weeks (from concept to launch)

### Budget Considerations

**Asset Creation:**
- Video production: $2,500-5,000
- Graphic design: $1,500-3,000
- AI avatar generation: $200-500
- Stock media licensing: $300-600
- **Subtotal: $4,500-9,100**

**Platform & Hosting:**
- CDN storage/bandwidth: $50-150/month
- Analytics platform: $100-300/month
- Domain/SSL: $20-50/year
- **Subtotal: $150-450/month**

**Labor (Internal):**
- Creative direction: 40 hours
- Copywriting: 24 hours
- Design/build: 60 hours
- QA/testing: 16 hours
- Project management: 20 hours
- **Subtotal: 160 hours**

**Total First-Year Cost:** $15,000-25,000 (including labor at $100/hr)
**Ongoing Monthly Cost:** $150-450 (hosting + analytics)

### Success Metrics & ROI

**Lead Generation Value:**
- Assume 10,000 views/year (realistic for targeted campaign)
- At 25% conversion rate: 2,500 portal sign-ups
- At 15% sales qualification rate: 375 qualified leads
- At 10% close rate: 37-38 closed deals
- Average deal size: $250,000
- **Total Revenue Impact:** $9.25M-9.5M annually

**Cost Per Lead:**
- Total annual cost: ~$20,000
- Qualified leads generated: 375
- **CPL: $53** (enterprise B2B benchmark: $200-500)

**ROI Calculation:**
- Revenue attributed: $9.25M
- Cost: $20,000
- **ROI: 46,150%** (462.5x return)

*Note: Assumes conservative attribution of 10% of pipeline to this experience*

### Maintenance & Updates

**Quarterly Reviews:**
- Data freshness (Gartner stats, metrics)
- Logo updates (client additions/removals)
- Copy refinement based on feedback
- A/B test result implementation

**Annual Refresh:**
- New video background (keep fresh)
- Updated compliance demo
- Revised messaging based on market shifts
- New case study data

**Ongoing Monitoring:**
- Weekly analytics review
- Monthly performance reports
- Continuous A/B testing
- User feedback collection

### Legal & Compliance

**Required Disclaimers:**
- Data sources citation (Gartner, Forrester, IBM)
- "Results not typical" for ROI metrics
- Client logo usage rights verification
- AI entity disclosure ("synthetic advisor")
- Privacy policy link (data collection)
- Terms of service link (portal access)

**Regulatory Considerations:**
- Financial services advertising regulations (FINRA if applicable)
- Data protection compliance (GDPR, CCPA)
- Cookie consent (analytics tracking)
- Accessibility compliance (WCAG 2.1 AA)

**Intellectual Property:**
- Trademark clearance for mentioned brands
- Licensed stock media properly attributed
- Original creative work copyrighted
- Source code proprietary

### Version Control

- **v1.0 (Current):** Initial production blueprint
- **v1.1 (Planned):** A/B test winning variants integration
- **v2.0 (Q3 2026):** Expanded to 10 pages with case studies
- **v2.1 (Q4 2026):** Multi-language support (DE, FR, JP)
- **v3.0 (Q1 2027):** Personalization engine (dynamic content based on firmographics)

---

## Appendix: Element Coordinate Map

### Page 1 Layout
```
Canvas: 1920×1080
├── videoplayer (background): (0, 0) - 1920×1080 [Layer 0]
├── headline: (960, 320) - 1400×auto [Layer 10]
├── text: (560, 480) - 800×auto [Layer 10]
├── shape (accent line): (760, 640) - 400×4 [Layer 9]
├── spacer: (0, 660)
└── button: (810, 740) - 300×60 [Layer 10]
```

### Page 2 Layout
```
Canvas: 1920×1080
├── title: (120, 100) - 1680×auto [Layer 10]
├── text (context): (120, 180) - 1680×auto [Layer 10]
├── gridlayout (3 flipcards): (120, 320) - 1680×600 [Layer 10]
│   ├── flipcard 1: 480×520
│   ├── flipcard 2: 480×520
│   └── flipcard 3: 480×520
├── shape (line): (120, 960) - 1680×1 [Layer 9]
└── text (citation): (120, 980) - 1680×auto [Layer 10]
```

### Page 3 Layout
```
Canvas: 1920×1080
├── title: (960, 80) - 1600×auto [Layer 10]
├── text (subtitle): (560, 160) - 800×auto [Layer 10]
├── splitscreen: (60, 260) - 1800×600 [Layer 10]
│   ├── Left panel (Legacy): Content stack
│   └── Right panel (Synaptic): Content stack
├── shape (arrow): (910, 520) - 100×40 [Layer 15]
└── imagecomparison: (460, 880) - 1000×160 [Layer 10]
```

### Page 4 Layout
```
Canvas: 1920×1080
├── title: (960, 60) - 1600×auto [Layer 10]
├── text (subtitle): (460, 140) - 1000×auto [Layer 10]
└── tabs: (60, 240) - 1800×780 [Layer 10]
    ├── Tab 1: Institutional Liquidity
    ├── Tab 2: Regulatory Sync
    └── Tab 3: Quantum Ledger
```

### Page 5 Layout
```
Canvas: 1920×1080
├── title: (960, 80) - 1600×auto [Layer 10]
├── text (subtitle): (460, 160) - 1000×auto [Layer 10]
├── gridlayout (2 avatars): (160, 280) - 1600×560 [Layer 10]
│   ├── avatarcard 1: 720×520
│   └── avatarcard 2: 720×520
├── divider: (460, 880) - 1000×2 [Layer 9]
├── text (trusted by): (960, 920) - 1000×auto [Layer 10]
└── logogrid: (360, 970) - 1200×100 [Layer 10]
```

### Page 6 Layout
```
Canvas: 1920×1080
├── headline: (960, 100) - 1600×auto [Layer 10]
├── text (context): (460, 200) - 1000×auto [Layer 10]
├── gridlayout (4 stats): (160, 320) - 1600×400 [Layer 10]
│   ├── statscounter 1: 360×auto
│   ├── statscounter 2: 360×auto
│   ├── statscounter 3: 360×auto
│   └── statscounter 4: 360×auto
├── text (data note): (360, 760) - 1200×auto [Layer 10]
├── progressbar: (360, 840) - 1200×48 [Layer 10]
└── iconlibrary (check): (880, 920) - 160×160 [Layer 10]
```

### Page 7 Layout
```
Canvas: 1920×1080
├── shape (background orb): (960, 540) - 800×800 [Layer 1]
├── divider: (460, 180) - 1000×2 [Layer 10]
├── headline: (960, 280) - 1400×auto [Layer 10]
├── text (CTA copy): (460, 400) - 1000×auto [Layer 10]
├── gridlayout (features): (460, 520) - 1000×120 [Layer 10]
├── button (main CTA): (710, 720) - 500×80 [Layer 10]
└── modal (confirmation): Overlay on click
```

---

**Document End**

*Last Updated: March 16, 2026*  
*Blueprint Version: 1.0*  
*Author: FIS-Presents Design Team*  
*Status: Production Ready*
