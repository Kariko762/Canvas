'use client'

import { useState } from 'react'
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer'

interface MechanicInstance {
  id: string
  type: string
  name: string
  x: number
  y: number
  width?: number
  height?: number
  layer: number
  props: Record<string, any>
}

interface TabItem {
  id: string
  label: string
  content?: string
  mechanics?: MechanicInstance[]
}

interface TabsProps {
  mode?: 'edit' | 'view'
  tabs?: TabItem[]
  defaultTab?: number
  tabStyle?: 'underline' | 'pills' | 'rounded' | 'minimal'
  tabPosition?: 'top' | 'bottom' | 'left' | 'right'
  activeColor?: string
  inactiveColor?: string
  backgroundColor?: string
  tabBarBackgroundColor?: string
  textColor?: string
  borderColor?: string
  tabSpacing?: number
  contentPadding?: number
  animateTransition?: boolean
  width?: number
  height?: number
  pageWidth?: number
  pageHeight?: number
}

export function Tabs({
  mode = 'view',
  tabs = [
    { id: '1', label: 'Tab 1', content: 'Content for tab 1', mechanics: [] },
    { id: '2', label: 'Tab 2', content: 'Content for tab 2', mechanics: [] },
    { id: '3', label: 'Tab 3', content: 'Content for tab 3', mechanics: [] }
  ],
  defaultTab = 0,
  tabStyle = 'underline',
  tabPosition = 'top',
  activeColor = '#3b82f6',
  inactiveColor = '#64748b',
  backgroundColor = '#ffffff',
  tabBarBackgroundColor = '#f3f4f6',
  textColor = '#1f2937',
  borderColor = '#e5e7eb',
  tabSpacing = 8,
  contentPadding = 16,
  animateTransition = true,
  width,
  height,
  pageWidth = 1200,
  pageHeight = 800
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const isHorizontal = tabPosition === 'top' || tabPosition === 'bottom'

  const getTabButtonStyle = (isActive: boolean) => {
    const baseStyle = {
      padding: `${tabSpacing}px ${tabSpacing * 2}px`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: isActive ? activeColor : inactiveColor,
      fontWeight: isActive ? 600 : 400,
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      whiteSpace: 'nowrap' as const
    }

    switch (tabStyle) {
      case 'pills':
        return {
          ...baseStyle,
          backgroundColor: isActive ? activeColor : 'transparent',
          color: isActive ? '#ffffff' : inactiveColor,
          borderRadius: '9999px',
          marginRight: isHorizontal ? `${tabSpacing}px` : '0',
          marginBottom: !isHorizontal ? `${tabSpacing}px` : '0'
        }
      case 'rounded':
        return {
          ...baseStyle,
          backgroundColor: isActive ? activeColor : 'transparent',
          color: isActive ? '#ffffff' : inactiveColor,
          borderRadius: '8px',
          marginRight: isHorizontal ? `${tabSpacing}px` : '0',
          marginBottom: !isHorizontal ? `${tabSpacing}px` : '0'
        }
      case 'minimal':
        return {
          ...baseStyle,
          color: isActive ? activeColor : inactiveColor,
          fontWeight: isActive ? 700 : 400,
          marginRight: isHorizontal ? `${tabSpacing * 2}px` : '0',
          marginBottom: !isHorizontal ? `${tabSpacing}px` : '0'
        }
      case 'underline':
      default:
        return {
          ...baseStyle,
          color: isActive ? activeColor : inactiveColor,
          borderBottom: isHorizontal ? `3px solid ${isActive ? activeColor : 'transparent'}` : 'none',
          borderLeft: !isHorizontal ? `3px solid ${isActive ? activeColor : 'transparent'}` : 'none',
          marginRight: isHorizontal ? `${tabSpacing}px` : '0',
          marginBottom: !isHorizontal ? `${tabSpacing}px` : '0'
        }
    }
  }

  const containerStyle = {
    width: width || '100%',
    height: height || 'auto',
    display: 'flex',
    flexDirection: (isHorizontal ? 'column' : 'row') as 'column' | 'row',
    borderRadius: '8px',
    overflow: 'hidden'
  }

  const tabListStyle = {
    display: 'flex',
    flexDirection: (isHorizontal ? 'row' : 'column') as 'row' | 'column',
    borderBottom: isHorizontal && tabStyle === 'underline' ? `2px solid ${borderColor}` : 'none',
    borderRight: !isHorizontal && tabStyle === 'underline' ? `2px solid ${borderColor}` : 'none',
    padding: `${tabSpacing}px`,
    backgroundColor: tabBarBackgroundColor,
    flexShrink: 0,
    order: tabPosition === 'bottom' || tabPosition === 'right' ? 2 : 1
  }

  const contentStyle = {
    padding: `${contentPadding}px`,
    backgroundColor,
    color: textColor,
    flex: 1,
    overflow: 'auto',
    transition: animateTransition ? 'opacity 0.3s ease' : 'none',
    order: tabPosition === 'bottom' || tabPosition === 'right' ? 1 : 2
  }

  if (mode === 'edit') {
    return (
      <div style={containerStyle}>
        <div style={tabListStyle}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              style={getTabButtonStyle(index === activeTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={contentStyle}>
          {tabs[activeTab]?.mechanics && tabs[activeTab].mechanics!.length > 0 ? (
            <div style={{ position: 'relative', width: `${pageWidth}px`, height: `${pageHeight}px` }}>
              {tabs[activeTab].mechanics!.map((mechanic) => (
                <div
                  key={mechanic.id}
                  style={{
                    position: 'absolute',
                    left: mechanic.x,
                    top: mechanic.y,
                    width: mechanic.width || 200,
                    height: mechanic.height || 100,
                  }}
                >
                  <MechanicRenderer
                    mechanic={mechanic}
                    mode="edit"
                  />
                </div>
              ))}
            </div>
          ) : (
            tabs[activeTab]?.content || 'No content'
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={tabListStyle}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            style={getTabButtonStyle(index === activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={contentStyle}>
        {tabs[activeTab]?.mechanics && tabs[activeTab].mechanics!.length > 0 ? (
          <div style={{ position: 'relative', width: `${pageWidth}px`, height: `${pageHeight}px` }}>
            {tabs[activeTab].mechanics!.map((mechanic) => (
              <div
                key={mechanic.id}
                style={{
                  position: 'absolute',
                  left: mechanic.x,
                  top: mechanic.y,
                  width: mechanic.width || 200,
                  height: mechanic.height || 100,
                }}
              >
                <MechanicRenderer
                  mechanic={mechanic}
                  mode="view"
                />
              </div>
            ))}
          </div>
        ) : (
          tabs[activeTab]?.content || 'No content'
        )}
      </div>
    </div>
  )
}
