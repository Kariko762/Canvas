'use client'

interface ButtonProps {
  text?: string
  action?: 'next' | 'prev' | 'goto' | 'link' | 'modal'
  actionValue?: string
  backgroundColor?: string
  textColor?: string
  fontSize?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  mode?: 'edit' | 'view'
}

const sizeClasses = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
  xl: 'text-xl px-10 py-5'
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
}

export function Button({
  text = 'Click Me',
  action = 'next',
  actionValue = '',
  backgroundColor = '#6366f1',
  textColor = '#ffffff',
  fontSize = 'md',
  rounded = 'md',
  mode = 'view'
}: ButtonProps) {
  const handleClick = () => {
    if (mode === 'edit') return // Don't trigger actions in edit mode
    
    switch (action) {
      case 'next':
        // Will be handled by viewer
        break
      case 'prev':
        // Will be handled by viewer
        break
      case 'goto':
        if (actionValue) {
          // Navigate to specific page
        }
        break
      case 'link':
        if (actionValue) {
          window.open(actionValue, '_blank')
        }
        break
      case 'modal':
        if (actionValue) {
          // Open modal - will be handled by modal system
          console.log('Open modal:', actionValue)
        }
        break
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <button
        onClick={handleClick}
        className={`${sizeClasses[fontSize]} ${roundedClasses[rounded]} font-medium transition-all hover:opacity-90 ${mode === 'edit' ? 'cursor-default' : 'cursor-pointer'}`}
        style={{
          backgroundColor,
          color: textColor,
        }}
      >
        {text}
      </button>
    </div>
  )
}
