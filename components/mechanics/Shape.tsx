'use client'

interface ShapeProps {
  shapeType?: 'rectangle' | 'circle' | 'triangle'
  width?: number
  height?: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  opacity?: number
  mode?: 'edit' | 'view'
}

export function Shape({
  shapeType = 'rectangle',
  width = 200,
  height = 200,
  backgroundColor = '#6366f1',
  borderColor = '#ffffff',
  borderWidth = 0,
  opacity = 100,
  mode = 'view'
}: ShapeProps) {
  const getShapeStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor,
      borderColor,
      borderWidth: `${borderWidth}px`,
      borderStyle: borderWidth > 0 ? 'solid' : 'none',
      opacity: opacity / 100,
      display: 'block'
    }

    switch (shapeType) {
      case 'circle':
        return { ...baseStyles, borderRadius: '50%' }
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeft: `${width / 2}px solid transparent`,
          borderRight: `${width / 2}px solid transparent`,
          borderBottom: `${height}px solid ${backgroundColor}`,
          backgroundColor: 'transparent',
          display: 'inline-block',
          opacity: opacity / 100
        }
      default: // rectangle
        return baseStyles
    }
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={getShapeStyles()} />
    </div>
  )
}
