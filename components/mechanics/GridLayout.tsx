'use client'

interface GridItem {
  id: string
  content: string
  backgroundColor?: string
  textColor?: string
}

interface GridLayoutProps {
  mode?: 'edit' | 'view'
  items?: GridItem[]
  columns?: number
  gap?: number
  minItemWidth?: number
  itemHeight?: number | 'auto'
  itemPadding?: number
  backgroundColor?: string
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  equalHeight?: boolean
  alignItems?: 'start' | 'center' | 'stretch'
  justifyItems?: 'start' | 'center' | 'stretch'
  responsive?: boolean
  width?: number
  height?: number
}

export function GridLayout({
  mode = 'view',
  items = [
    { id: '1', content: 'Grid Item 1', backgroundColor: '#f3f4f6', textColor: '#1f2937' },
    { id: '2', content: 'Grid Item 2', backgroundColor: '#f3f4f6', textColor: '#1f2937' },
    { id: '3', content: 'Grid Item 3', backgroundColor: '#f3f4f6', textColor: '#1f2937' },
    { id: '4', content: 'Grid Item 4', backgroundColor: '#f3f4f6', textColor: '#1f2937' },
    { id: '5', content: 'Grid Item 5', backgroundColor: '#f3f4f6', textColor: '#1f2937' },
    { id: '6', content: 'Grid Item 6', backgroundColor: '#f3f4f6', textColor: '#1f2937' }
  ],
  columns = 3,
  gap = 16,
  minItemWidth = 200,
  itemHeight = 'auto',
  itemPadding = 16,
  backgroundColor = 'transparent',
  borderRadius = 8,
  borderWidth = 1,
  borderColor = '#e5e7eb',
  equalHeight = false,
  alignItems = 'stretch',
  justifyItems = 'stretch',
  responsive = true,
  width,
  height
}: GridLayoutProps) {
  const containerStyle = {
    width: width || '100%',
    height: height || 'auto',
    backgroundColor,
    padding: `${gap}px`,
    borderRadius: `${borderRadius}px`
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: responsive 
      ? `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))` 
      : `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    alignItems: equalHeight ? 'stretch' : alignItems,
    justifyItems
  }

  const getItemStyle = (item: GridItem) => ({
    backgroundColor: item.backgroundColor || '#f3f4f6',
    color: item.textColor || '#1f2937',
    padding: `${itemPadding}px`,
    borderRadius: `${borderRadius}px`,
    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
    height: itemHeight === 'auto' ? 'auto' : `${itemHeight}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: mode === 'view' ? 'pointer' : 'default'
  })

  const handleItemHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'view') {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  }

  const handleItemLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'view') {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }
  }

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {items.map((item) => (
          <div
            key={item.id}
            style={getItemStyle(item)}
            onMouseEnter={handleItemHover}
            onMouseLeave={handleItemLeave}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
