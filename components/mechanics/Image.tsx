'use client'

interface ImageProps {
  src: string
  alt?: string
  width?: 'sm' | 'md' | 'lg' | 'full'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadow?: boolean
  mode?: 'edit' | 'view'
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'w-full'
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
}

export function Image({ 
  src, 
  alt = '', 
  width = 'full',
  rounded = 'md',
  shadow = true,
  mode = 'view'
}: ImageProps) {
  return (
    <div className="w-full h-full p-2">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain ${roundedClasses[rounded]} ${shadow ? 'shadow-lg' : ''}`}
      />
    </div>
  )
}
