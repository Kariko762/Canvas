'use client'

interface DividerProps {
  width?: '1/4' | '1/2' | '3/4' | 'full'
  thickness?: number
  color?: string
  style?: 'solid' | 'dashed' | 'dotted'
  mode?: 'edit' | 'view'
}

const widthClasses = {
  '1/4': 'w-1/4',
  '1/2': 'w-1/2',
  '3/4': 'w-3/4',
  full: 'w-full'
}

export function Divider({
  width = 'full',
  thickness = 2,
  color = '#ffffff',
  style = 'solid',
  mode = 'view'
}: DividerProps) {
  return (
    <div className={`${widthClasses[width]} mx-auto ${mode === 'edit' ? 'outline-dashed outline-2 outline-blue-500/30 p-1' : ''}`}>
      <hr
        style={{
          height: `${thickness}px`,
          backgroundColor: style === 'solid' ? color : 'transparent',
          borderTop: style !== 'solid' ? `${thickness}px ${style} ${color}` : 'none',
          border: 'none',
          margin: 0
        }}
      />
    </div>
  )
}
