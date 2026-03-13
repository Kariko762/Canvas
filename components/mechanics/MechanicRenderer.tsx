'use client'

import { Title } from '@/components/mechanics/Title'
import { TextBlock } from '@/components/mechanics/Text'
import { Image } from '@/components/mechanics/Image'
import { Shape } from '@/components/mechanics/Shape'
import { Divider } from '@/components/mechanics/Divider'
import { Spacer } from '@/components/mechanics/Spacer'
import { Button } from '@/components/mechanics/Button'
import { FlipCard } from '@/components/mechanics/FlipCard'

interface MechanicInstance {
  id: string
  type: string
  width?: number
  height?: number
  props: Record<string, any>
}

interface MechanicRendererProps {
  mechanic: MechanicInstance
  mode?: 'edit' | 'view'
  onSelect?: () => void
  isSelected?: boolean
}

export function MechanicRenderer({
  mechanic,
  mode = 'view',
  onSelect,
  isSelected = false
}: MechanicRendererProps) {
  const { type, props, width, height } = mechanic

  // Add mode and dimensions to props
  const enhancedProps = { ...props, mode, width, height }

  // Render the appropriate component based on type
  const renderMechanic = () => {
    switch (type) {
      case 'title':
        return <Title {...enhancedProps as any} />
      case 'text':
        return <TextBlock {...enhancedProps as any} />
      case 'image':
        return <Image {...enhancedProps as any} />
      case 'shape':
        return <Shape {...enhancedProps as any} />
      case 'divider':
        return <Divider {...enhancedProps as any} />
      case 'spacer':
        return <Spacer {...enhancedProps as any} />
      case 'button':
        return <Button {...enhancedProps as any} />
      case 'flipcard':
        return <FlipCard {...enhancedProps as any} />
      default:
        return (
          <div className="p-4 bg-red-900/20 border border-red-800 text-red-400 rounded">
            Unknown mechanic type: {type}
          </div>
        )
    }
  }

  if (mode === 'edit') {
    return (
      <div
        onClick={onSelect}
        className="relative w-full h-full"
      >
        {renderMechanic()}
      </div>
    )
  }

  return <>{renderMechanic()}</>
}
