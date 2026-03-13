'use client'

import { useState } from 'react'

interface FlipCardProps {
  frontText?: string
  backText?: string
  frontColor?: string
  backColor?: string
  textColor?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg'
  mode?: 'edit' | 'view'
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg'
}

export function FlipCard({
  frontText = 'Click to flip',
  backText = 'Back content',
  frontColor = '#6366f1',
  backColor = '#8b5cf6',
  textColor = '#ffffff',
  rounded = 'lg',
  mode = 'view'
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    if (mode === 'edit') return // Don't flip in edit mode
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="w-full h-full p-2 perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleClick}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          cursor: mode === 'edit' ? 'default' : 'pointer'
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 ${roundedClasses[rounded]} flex items-center justify-center p-6 text-center backface-hidden shadow-lg`}
          style={{
            backgroundColor: frontColor,
            color: textColor,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <div className="whitespace-pre-wrap">{frontText}</div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 ${roundedClasses[rounded]} flex items-center justify-center p-6 text-center backface-hidden shadow-lg`}
          style={{
            backgroundColor: backColor,
            color: textColor,
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <div className="whitespace-pre-wrap">{backText}</div>
        </div>
      </div>
    </div>
  )
}
