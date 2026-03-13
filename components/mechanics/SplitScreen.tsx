'use client'

import { useState } from 'react'

interface SplitScreenProps {
  mode?: 'edit' | 'view'
  leftContent?: string
  rightContent?: string
  leftWidth?: number
  orientation?: 'horizontal' | 'vertical'
  showDivider?: boolean
  dividerWidth?: number
  dividerColor?: string
  resizable?: boolean
  leftBackground?: string
  rightBackground?: string
  leftTextColor?: string
  rightTextColor?: string
  leftPadding?: number
  rightPadding?: number
  gap?: number
  minPaneSize?: number
  width?: number
  height?: number
}

export function SplitScreen({
  mode = 'view',
  leftContent = 'Left panel content. Add your text, images, or other content here.',
  rightContent = 'Right panel content. This is the second column of your split screen layout.',
  leftWidth = 50,
  orientation = 'vertical',
  showDivider = true,
  dividerWidth = 2,
  dividerColor = '#e5e7eb',
  resizable = false,
  leftBackground = '#f9fafb',
  rightBackground = '#ffffff',
  leftTextColor = '#1f2937',
  rightTextColor = '#1f2937',
  leftPadding = 24,
  rightPadding = 24,
  gap = 0,
  minPaneSize = 20,
  width,
  height
}: SplitScreenProps) {
  const [splitPosition, setSplitPosition] = useState(leftWidth)
  const [isDragging, setIsDragging] = useState(false)

  const isVertical = orientation === 'vertical'

  const handleMouseDown = () => {
    if (resizable && mode === 'view') {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && resizable && mode === 'view') {
      const container = e.currentTarget.getBoundingClientRect()
      const position = isVertical
        ? ((e.clientX - container.left) / container.width) * 100
        : ((e.clientY - container.top) / container.height) * 100

      const clampedPosition = Math.max(minPaneSize, Math.min(100 - minPaneSize, position))
      setSplitPosition(clampedPosition)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const containerStyle = {
    width: width || '100%',
    height: height || '400px',
    display: 'flex',
    flexDirection: (isVertical ? 'row' : 'column') as 'row' | 'column',
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: isDragging ? (isVertical ? 'col-resize' : 'row-resize') : 'default',
    userSelect: isDragging ? 'none' as const : 'auto' as const
  }

  const leftPaneStyle = {
    width: isVertical ? `${splitPosition}${gap > 0 ? `% - ${gap / 2}px` : '%'}` : '100%',
    height: isVertical ? '100%' : `${splitPosition}${gap > 0 ? `% - ${gap / 2}px` : '%'}`,
    backgroundColor: leftBackground,
    color: leftTextColor,
    padding: `${leftPadding}px`,
    overflow: 'auto',
    flexShrink: 0,
    marginRight: isVertical && gap > 0 ? `${gap / 2}px` : '0',
    marginBottom: !isVertical && gap > 0 ? `${gap / 2}px` : '0'
  }

  const rightPaneStyle = {
    width: isVertical ? `${100 - splitPosition}${gap > 0 ? `% - ${gap / 2}px` : '%'}` : '100%',
    height: isVertical ? '100%' : `${100 - splitPosition}${gap > 0 ? `% - ${gap / 2}px` : '%'}`,
    backgroundColor: rightBackground,
    color: rightTextColor,
    padding: `${rightPadding}px`,
    overflow: 'auto',
    flex: 1,
    marginLeft: isVertical && gap > 0 ? `${gap / 2}px` : '0',
    marginTop: !isVertical && gap > 0 ? `${gap / 2}px` : '0'
  }

  const dividerStyle = {
    position: 'absolute' as const,
    backgroundColor: dividerColor,
    zIndex: 10,
    ...(isVertical ? {
      left: `${splitPosition}%`,
      top: 0,
      bottom: 0,
      width: `${dividerWidth}px`,
      transform: 'translateX(-50%)',
      cursor: resizable && mode === 'view' ? 'col-resize' : 'default'
    } : {
      top: `${splitPosition}%`,
      left: 0,
      right: 0,
      height: `${dividerWidth}px`,
      transform: 'translateY(-50%)',
      cursor: resizable && mode === 'view' ? 'row-resize' : 'default'
    }),
    transition: isDragging ? 'none' : 'all 0.1s ease'
  }

  const dividerHandleStyle = {
    position: 'absolute' as const,
    ...(isVertical ? {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${dividerWidth * 3}px`,
      height: '40px',
      borderRadius: '4px'
    } : {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40px',
      height: `${dividerWidth * 3}px`,
      borderRadius: '4px'
    }),
    backgroundColor: resizable ? dividerColor : 'transparent',
    transition: 'background-color 0.2s ease'
  }

  return (
    <div
      style={containerStyle}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={leftPaneStyle}>
        {leftContent}
      </div>

      {showDivider && (
        <div
          style={dividerStyle}
          onMouseDown={handleMouseDown}
        >
          {resizable && mode === 'view' && (
            <div style={dividerHandleStyle} />
          )}
        </div>
      )}

      <div style={rightPaneStyle}>
        {rightContent}
      </div>
    </div>
  )
}
