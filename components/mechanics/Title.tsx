'use client'

interface TitleProps {
  text: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right'
  color?: string
  mode?: 'edit' | 'view'
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
  '2xl': 'text-6xl',
  '3xl': 'text-7xl'
}

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

export function Title({
  text,
  size = 'xl',
  weight = 'bold',
  align = 'center',
  color,
  mode = 'view'
}: TitleProps) {
  return (
    <h1 
      className={`w-full h-full flex items-center ${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} p-2`}
      style={{ color }}
    >
      <span className="w-full">{text}</span>
    </h1>
  )
}
