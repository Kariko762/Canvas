'use client'

interface TextBlockProps {
  content: string
  size?: 'sm' | 'base' | 'lg' | 'xl'
  align?: 'left' | 'center' | 'right' | 'justify'
  color?: string
  maxWidth?: 'full' | 'xl' | '2xl' | '4xl'
  mode?: 'edit' | 'view'
}

const sizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
}

const maxWidthClasses = {
  full: 'max-w-full',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl'
}

export function TextBlock({ 
  content, 
  size = 'base',
  align = 'left',
  color,
  maxWidth = 'full',
  mode = 'view'
}: TextBlockProps) {
  return (
    <div 
      className={`w-full h-full ${sizeClasses[size]} ${alignClasses[align]} whitespace-pre-wrap overflow-auto p-2`}
      style={{ color }}
    >
      {content}
    </div>
  )
}
