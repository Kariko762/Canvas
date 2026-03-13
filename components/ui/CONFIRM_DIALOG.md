# Reusable Confirm Dialog System

This project includes a reusable confirmation dialog system that can be used anywhere in the application.

## Components

### 1. `ConfirmDialog` Component
Located at: `components/ui/ConfirmDialog.tsx`

A modal dialog component for user confirmations with customizable styling.

**Features:**
- Keyboard support (ESC to close)
- Backdrop click to dismiss
- Three variants: `danger`, `warning`, `info`
- Customizable text and actions

### 2. `useConfirm` Hook
Located at: `components/ui/useConfirm.tsx`

A React hook that provides a promise-based API for showing confirmation dialogs.

## Usage

### Basic Example

```tsx
'use client'

import { useConfirm } from '@/components/ui/useConfirm'

export default function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirm()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item? This cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    })

    if (!confirmed) return

    // Proceed with deletion
    console.log('User confirmed deletion')
  }

  return (
    <div>
      <button onClick={handleDelete}>Delete Item</button>
      
      {/* Add the dialog component */}
      <ConfirmDialog />
    </div>
  )
}
```

### Advanced Example with Different Variants

```tsx
const handleWarning = async () => {
  const confirmed = await confirm({
    title: 'Warning',
    description: 'This action may have unintended consequences. Continue?',
    confirmText: 'Yes, Continue',
    variant: 'warning'
  })
  
  if (confirmed) {
    // Do something
  }
}

const handleInfo = async () => {
  const confirmed = await confirm({
    title: 'Info',
    description: 'Would you like to proceed with this action?',
    confirmText: 'Proceed',
    variant: 'info'
  })
  
  if (confirmed) {
    // Do something
  }
}
```

## API

### `useConfirm()` Returns

- `confirm(options)`: Async function that shows the dialog and returns a Promise<boolean>
- `ConfirmDialog`: React component to render in your JSX

### Confirm Options

```typescript
interface ConfirmOptions {
  title: string                              // Dialog title
  description: string                         // Dialog message
  confirmText?: string                        // Confirm button text (default: "Confirm")
  cancelText?: string                         // Cancel button text (default: "Cancel")
  variant?: 'danger' | 'warning' | 'info'    // Visual variant (default: "danger")
}
```

### Variants

- **`danger`**: Red styling - for destructive actions (delete, remove, etc.)
- **`warning`**: Yellow styling - for potentially risky actions
- **`info`**: Blue styling - for informational confirmations

## Benefits

1. **No Duplicate Code**: Single source of truth for all confirmations
2. **Promise-based**: Clean async/await syntax
3. **Type-safe**: Full TypeScript support
4. **Accessible**: Keyboard navigation and focus management
5. **Customizable**: Multiple variants and customizable text
6. **Lightweight**: No external dependencies beyond React

## Example in Production

See `app/admin/assets/[id]/page.tsx` for a real-world example of deleting assets with confirmation.
