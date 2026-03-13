# Mechanics System

## Overview
Mechanics are the building blocks for creating pages. Each mechanic is a reusable component with configurable properties.

## Available Mechanics

### Content Mechanics

#### 📝 Title
Large heading text for page titles
- **Text**: The title content
- **Size**: sm, md, lg, xl, 2xl, 3xl
- **Weight**: normal, medium, semibold, bold
- **Alignment**: left, center, right
- **Color**: Custom hex color

#### 📄 Text Block
Paragraph or body text
- **Content**: Multi-line text content
- **Size**: sm, base, lg, xl
- **Alignment**: left, center, right, justify
- **Color**: Custom hex color
- **Max Width**: full, xl, 2xl, 4xl (for readability)

### Media Mechanics

#### 🖼️ Image
Display an image
- **URL**: Image source URL
- **Alt Text**: Accessibility description
- **Width**: sm, md, lg, full
- **Rounded Corners**: none, sm, md, lg, full
- **Drop Shadow**: Toggle on/off

### Decoration Mechanics

#### ⬛ Shape
Geometric shapes for visual design
- **Shape Type**: rectangle, circle, triangle
- **Width**: 10-1000px
- **Height**: 10-1000px
- **Fill Color**: Custom hex color
- **Border Color**: Custom hex color
- **Border Width**: 0-20px
- **Opacity**: 0-100%

#### ➖ Divider
Horizontal line to separate content
- **Width**: 1/4, 1/2, 3/4, full
- **Thickness**: 1-10px
- **Color**: Custom hex color
- **Style**: solid, dashed, dotted

### Layout Mechanics

#### ↕️ Spacer
Vertical spacing between elements
- **Height**: xs, sm, md, lg, xl, 2xl

## Usage

### Creating a Mechanic Instance

```typescript
import { createMechanicInstance } from '@/lib/mechanics-registry'
import { nanoid } from 'nanoid'

const titleMechanic = createMechanicInstance('title', nanoid())
// Returns:
// {
//   id: "abc123",
//   type: "title",
//   props: {
//     text: "Your Title Here",
//     size: "xl",
//     weight: "bold",
//     align: "center",
//     color: "#ffffff"
//   }
// }
```

### Rendering a Mechanic

```typescript
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer'

// In view mode (public facing)
<MechanicRenderer 
  mechanic={mechanicInstance} 
  mode="view" 
/>

// In edit mode (page editor)
<MechanicRenderer 
  mechanic={mechanicInstance} 
  mode="edit"
  onSelect={() => handleSelect(mechanicInstance.id)}
  isSelected={selectedId === mechanicInstance.id}
/>
```

### Getting Mechanic Definitions

```typescript
import { 
  getMechanic, 
  getMechanicsByCategory, 
  getAllMechanics 
} from '@/lib/mechanics-registry'

// Get single mechanic definition
const titleDef = getMechanic('title')

// Get all mechanics in a category
const contentMechanics = getMechanicsByCategory('content')

// Get all mechanics
const allMechanics = getAllMechanics()
```

## Mechanic Data Structure

### Stored in Database (pages.mechanics field)
```json
[
  {
    "id": "mech-abc123",
    "type": "title",
    "props": {
      "text": "Welcome to Our Presentation",
      "size": "2xl",
      "weight": "bold",
      "align": "center",
      "color": "#ffffff"
    }
  },
  {
    "id": "mech-def456",
    "type": "text",
    "props": {
      "content": "This is our story...",
      "size": "lg",
      "align": "center",
      "color": "#ffffff",
      "maxWidth": "2xl"
    }
  },
  {
    "id": "mech-ghi789",
    "type": "image",
    "props": {
      "src": "https://example.com/image.jpg",
      "alt": "Our team",
      "width": "lg",
      "rounded": "md",
      "shadow": true
    }
  }
]
```

## Edit vs View Mode

### View Mode
- Clean presentation output
- No visual editing indicators
- Used in public viewer (`/e/[slug]`)

### Edit Mode
- Dashed outline around mechanics
- Hover and selection states
- Type label shown when selected
- Click to select
- Used in page editor (`/admin/pages/[id]`)

## Categories

Mechanics are grouped into categories for better organization in the UI:

- **content**: Text and titles
- **media**: Images and videos
- **decoration**: Shapes and dividers
- **layout**: Spacers and containers

## Next Steps

1. Build page editor UI to add/edit/remove mechanics
2. Create property editor panel for selected mechanic
3. Implement drag-to-reorder functionality
4. Add mechanic templates/presets
5. Build public viewer to render pages

## Adding New Mechanics

To add a new mechanic:

1. Define it in `lib/mechanics-registry.ts`
2. Create component in `components/mechanics/YourMechanic.tsx`
3. Export from `components/mechanics/index.ts`
4. Add to switch case in `components/mechanics/MechanicRenderer.tsx`
5. Update this documentation

Example component structure:
```typescript
'use client'

interface YourMechanicProps {
  // Your properties from registry
  someProp: string
  mode?: 'edit' | 'view'
}

export function YourMechanic({
  someProp,
  mode = 'view'
}: YourMechanicProps) {
  return (
    <div className={mode === 'edit' ? 'outline-dashed outline-2 outline-blue-500/30 p-2' : ''}>
      {/* Your component content */}
    </div>
  )
}
```
