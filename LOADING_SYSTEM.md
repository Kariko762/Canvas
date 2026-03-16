# Loading Screen System

## Overview
The application features two professional loading screens to enhance the user experience during data loading and transitions.

## Available Loaders

### 1. **TechLoader** (Default)
Modern, technology-focused loading screen perfect for AI, FinTech, and Financial Services presentations.

**Features:**
- Animated geometric patterns with floating data nodes
- Triple concentric progress rings with gradient effects
- Real-time percentage display
- Stage-based status indicators (Analytics, AI Engine, Data Sync, Ready)
- Hexagonal tech icon with pulsing animation
- Animated grid background
- Corner accent frames

**Visual Style:**
- Dark gradient background (zinc/blue/purple)
- Neon-style glowing elements
- Modern tech aesthetic
- AI/neural network inspired animations

**Best for:**
- Main presentation loading
- Data processing screens
- Technology/FinTech contexts
- AI-driven features

---

### 2. **PresentationLoader**
Classic image-based loading screen with progressive reveal animation.

**Features:**
- Custom logo reveal from grayscale to color
- Linear progress bar
- Smooth fade-in transition
- Loading text with animated dots

**Visual Style:**
- Dark background (#010102)
- Image-based branding
- Clean and minimal
- Progressive color reveal

**Best for:**
- Brand-focused loading
- Traditional presentation contexts
- Logo showcase moments

---

## Usage

### Basic Usage (Automatic)
The system defaults to the **TechLoader** for all loading operations. No configuration needed.

```tsx
import { useGlobalLoading } from '@/components/ui/GlobalLoadingContext';

function MyComponent() {
  const { showLoading, hideLoading, setProgress } = useGlobalLoading();

  const handleLoad = async () => {
    showLoading(); // Uses TechLoader by default
    
    // Simulate loading with progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await delay(200);
    }
    
    hideLoading();
  };
}
```

### Explicit Loader Selection
You can explicitly choose which loader to use:

```tsx
// Use TechLoader (modern, animated)
showLoading('tech');

// Use PresentationLoader (image-based)
showLoading('presentation');
```

### Progress Updates
Both loaders support progress tracking (0-100):

```tsx
setProgress(0);   // 0%
setProgress(50);  // 50%
setProgress(100); // 100% - will auto-hide after 2 seconds
```

### Progress Stages (TechLoader)
The TechLoader has visual stages that correspond to progress ranges:

- **0-30%**: "Initializing Systems" - First ring fills
- **30-65%**: "Processing Data" - Second ring fills  
- **65-100%**: "Finalizing" - Third ring fills
- **100%**: "Complete" - All rings filled

### Status Indicators (TechLoader)
Four status indicators automatically light up based on progress:

- **Analytics**: Active at 10%+
- **AI Engine**: Active at 35%+
- **Data Sync**: Active at 60%+
- **Ready**: Active at 95%+

---

## Implementation Example

### Asset Loading (Current Implementation)
```tsx
// components/ui/AssetCard.tsx
const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();
  showLoading('tech'); // Modern loader for presentations
  router.push(`/admin/assets/${asset.id}`);
};
```

### Page Editor Loading
```tsx
// app/admin/assets/[id]/page.tsx
useEffect(() => {
  showLoading('tech');
  setProgress(0);
  
  // Load data with progress updates
  loadAssetAndPages();
}, []);
```

---

## Customization

### Changing Default Loader
Edit `GlobalLoadingContext.tsx`:

```tsx
const [loaderStyle, setLoaderStyle] = useState<LoaderStyle>('tech'); // or 'presentation'
```

### Adjusting Auto-Hide Delay
The loader automatically hides 2 seconds after reaching 100%. To change:

```tsx
setTimeout(() => {
  setIsLoading(false);
  setProgressState(0);
}, 2000); // Change this value (milliseconds)
```

---

## Animation Details

### TechLoader Animations
- **Grid Background**: 20s infinite scroll
- **Data Nodes**: 2s pulsing with randomized delays
- **Hexagon**: 8s continuous rotation
- **Center Pulse**: 2s infinite scale/opacity
- **Progress Rings**: Smooth stroke-dasharray transitions

### PresentationLoader Animations
- **Image Reveal**: Bottom-to-top clip-path animation
- **Progress Bar**: Linear transition
- **Loading Dots**: Staggered pulse (0ms, 200ms, 400ms delays)

---

## Technical Notes

- Both loaders render at z-index 9999 to overlay all content
- Progress is clamped between 0-100 internally
- Auto-hide triggers at 100% with 2-second delay
- Loaders are globally managed via React Context
- Animations use CSS transforms for performance

---

## Files

- `/components/ui/TechLoader.tsx` - Modern animated loader
- `/components/ui/PresentationLoader.tsx` - Image-based loader
- `/components/ui/GlobalLoadingContext.tsx` - Global loading state management
