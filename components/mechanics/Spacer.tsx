'use client'

interface SpacerProps {
  height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  mode?: 'edit' | 'view'
}

const heightClasses = {
  xs: 'h-2',   // 8px
  sm: 'h-4',   // 16px
  md: 'h-8',   // 32px
  lg: 'h-16',  // 64px
  xl: 'h-24',  // 96px
  '2xl': 'h-32' // 128px
}

export function Spacer({
  height = 'md',
  mode = 'view'
}: SpacerProps) {
  return (
    <div 
      className={`${heightClasses[height]} w-full ${mode === 'edit' ? 'bg-blue-500/10 border-2 border-dashed border-blue-500/30' : ''}`}
      aria-hidden="true"
    />
  )
}
