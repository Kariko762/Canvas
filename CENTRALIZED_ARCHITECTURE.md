# Centralized Editor Architecture

## Overview

We've established a centralized architecture for all editors (Modal, Pages, Tabs, Assets) to eliminate code duplication and ensure consistency.

## The Four Pillars

### 1. ✅ Element Registry (DONE)
**Location:** `lib/mechanics-registry.ts`

**Purpose:** Single source of truth for all mechanics/elements

**Features:**
- Defines all available mechanics (Title, Text, Image, Button, etc.)
- Property definitions with types (text, color, select, range, toggle, image, modalAsset)
- Category organization (content, media, decoration, layout, interactive, data)
- Default values and validation rules

**Usage:**
```typescript
import { getMechanic, getAllMechanics, createMechanicInstance } from '@/lib/mechanics-registry'

const mechanic = getMechanic('title')
const newInstance = createMechanicInstance('title', nanoid(), 100, 100)
```

---

### 2. ✅ Element Rendering (DONE)
**Location:** `components/mechanics/MechanicRenderer.tsx`

**Purpose:** Unified rendering for all mechanics across all editors

**Features:**
- Single renderer handles all mechanic types
- Mode-aware (edit vs view)
- Consistent styling and behavior

**Usage:**
```tsx
<MechanicRenderer 
  mechanic={mechanicInstance}
  mode="edit"
  onSelect={() => setSelectedId(mechanic.id)}
  isSelected={selectedId === mechanic.id}
/>
```

---

### 3. ✅ Element Properties & Property Rendering (DONE - NEW!)
**Location:** `components/editor/PropertyEditor.tsx`

**Purpose:** Unified property panel for editing mechanic properties

**Features:**
- Registry-driven (reads from mechanics-registry.ts)
- Specialized UI for each property type:
  - `text` → Text input
  - `textarea` → Multi-line textarea
  - `number` → Number input with min/max
  - `color` → Color picker + hex input
  - `select` → Dropdown with options
  - `toggle` → Checkbox with label
  - `range` → Slider with value display
  - `image` → URL input (can be extended to file upload)
  - `modalAsset` → Dropdown populated from API
- Transform controls (X, Y, Width, Height, Layer, Name)
- Conditional rendering (e.g., button shows modalAsset OR actionValue based on action type)
- Help text and labels from registry

**Usage:**
```tsx
<PropertyEditor
  mechanic={selectedMechanic}
  onPropertyChange={(prop, value) => updateMechanicProp(prop, value)}
  onPositionChange={(field, value) => updateMechanicPosition(field, value)}
  onDelete={() => deleteMechanic()}
  additionalData={{ modals: availableModals }} // Optional data for dropdowns
/>
```

**Benefits:**
- Add new mechanics → Properties automatically appear
- Add new property types → Update once, works everywhere
- Consistent UX across all editors
- No more copy-paste property rendering code

---

### 4. ✅ Editor Canvas Functionality (DONE - NEW!)
**Location:** `components/editor/CanvasEditor.tsx`

**Purpose:** Unified canvas interaction for all editors

**Features:**
- **Right-click + drag** → Pan canvas
- **Left-click + drag on object** → Move object
- **Resize handles** → 8-directional resizing (corners + edges)
- **Zoom controls** → Zoom in/out/fit with mouse wheel support
- **Selection state** → Visual feedback with blue ring
- **Layering** → Z-index management
- **Constraints** → minY support (e.g., modal title bar)
- **Empty state** → Helpful messaging when no mechanics
- **Toolbar integration** → Add mechanics from dropdown

**Usage:**
```tsx
<CanvasEditor
  mechanics={mechanics}
  selectedMechanicId={selectedId}
  canvasWidth={800}
  canvasHeight={600}
  onMechanicsChange={setMechanics}
  onSelectedMechanicChange={setSelectedId}
  onAddMechanic={handleAddMechanic}
  minY={48} // Optional constraint (e.g., modal title bar)
  showToolbar={true}
  backgroundColor="#ffffff"
/>
```

**Benefits:**
- Add new canvas features → Update once, works everywhere
- Consistent interaction across all editors
- Right-click pan now available everywhere
- Contextual menus can be added in one place
- Keyboard shortcuts can be added once
- Grid snap can be added once
- Guides/rulers can be added once

---

## Integration Example

Here's how an editor should be structured:

```tsx
'use client'

import { useState } from 'react'
import { CanvasEditor } from '@/components/editor/CanvasEditor'
import { PropertyEditor } from '@/components/editor/PropertyEditor'
import { createMechanicInstance } from '@/lib/mechanics-registry'

export default function MyEditorPage() {
  const [mechanics, setMechanics] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  
  const handleAddMechanic = (type: string) => {
    const newMechanic = createMechanicInstance(type, nanoid(), 100, 100)
    setMechanics([...mechanics, newMechanic])
  }
  
  const handlePropertyChange = (prop: string, value: any) => {
    setMechanics(mechanics.map(m => 
      m.id === selectedId 
        ? { ...m, props: { ...m.props, [prop]: value } }
        : m
    ))
  }
  
  const handlePositionChange = (field: string, value: any) => {
    setMechanics(mechanics.map(m => 
      m.id === selectedId ? { ...m, [field]: value } : m
    ))
  }
  
  const selectedMechanic = mechanics.find(m => m.id === selectedId)
  
  return (
    <div className="flex h-screen">
      {/* Canvas */}
      <CanvasEditor
        mechanics={mechanics}
        selectedMechanicId={selectedId}
        canvasWidth={1200}
        canvasHeight={800}
        onMechanicsChange={setMechanics}
        onSelectedMechanicChange={setSelectedId}
        onAddMechanic={handleAddMechanic}
      />
      
      {/* Properties Panel */}
      <div className="w-80 border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
        {selectedMechanic ? (
          <PropertyEditor
            mechanic={selectedMechanic}
            onPropertyChange={handlePropertyChange}
            onPositionChange={handlePositionChange}
            onDelete={() => {
              setMechanics(mechanics.filter(m => m.id !== selectedId))
              setSelectedId(null)
            }}
          />
        ) : (
          <div className="p-6 text-center text-zinc-500">
            Select an element to edit properties
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## Next Steps

### Immediate (Required)
1. **Update Modal Editor** to use CanvasEditor and PropertyEditor
2. **Update Pages Editor** to use PropertyEditor (already has some mechanics rendering)
3. **Update Tabs Editor** to use both components

### Future Enhancements (Add Once, Works Everywhere)
- [ ] Contextual right-click menus
- [ ] Keyboard shortcuts (Delete, Undo, Copy/Paste, Arrow keys for nudging)
- [ ] Grid snap and alignment guides
- [ ] Rulers and measurements
- [ ] Multi-select with Shift/Cmd
- [ ] Copy/paste between editors
- [ ] Undo/redo history
- [ ] Layer panel for visibility/locking
- [ ] Group/ungroup mechanics
- [ ] Duplicate mechanic button

---

## Benefits Summary

### Before (Decentralized)
- ❌ Each editor had its own canvas logic
- ❌ Each editor had its own property panel
- ❌ Adding features required changing 3+ files
- ❌ Inconsistent UX between editors
- ❌ Copy-paste bugs and drift
- ❌ Different styling and behavior

### After (Centralized)
- ✅ Single canvas component
- ✅ Single property panel component
- ✅ Add features in ONE place
- ✅ Consistent UX everywhere
- ✅ Centralized quality and testing
- ✅ Uniform styling and behavior
- ✅ Easy to extend and maintain

---

## File Structure

```
lib/
  mechanics-registry.ts          # ✅ Element definitions
components/
  mechanics/
    MechanicRenderer.tsx         # ✅ Unified renderer
    Title.tsx, Text.tsx, etc.    # Individual mechanic components
  editor/
    PropertyEditor.tsx           # ✅ NEW - Shared properties panel
    CanvasEditor.tsx             # ✅ NEW - Shared canvas
    MechanicsToolbar.tsx         # Shared toolbar
app/
  admin/
    modals/[id]/page.tsx         # ⏳ TODO: Update to use shared components
    pages/[id]/page.tsx          # ⏳ TODO: Update to use PropertyEditor
    tabs/[id]/page.tsx           # ⏳ TODO: Update to use shared components
```

---

## Testing

To verify centralized architecture:

1. Add a new mechanic to registry
2. Component should automatically appear in:
   - MechanicsToolbar dropdown
   - Property panel (with correct inputs)
   - Canvas (draggable, resizable, selectable)
3. Should work in all editors without modification

To verify shared canvas:
1. Right-click + drag in any editor → Should pan
2. Left-click element → Should select with blue ring
3. Drag resize handles → Should resize
4. Mouse wheel → Should zoom
