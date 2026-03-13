'use client'

import { Title } from '@/components/mechanics/Title'
import { TextBlock } from '@/components/mechanics/Text'
import { Image } from '@/components/mechanics/Image'
import { Shape } from '@/components/mechanics/Shape'
import { Divider } from '@/components/mechanics/Divider'
import { Spacer } from '@/components/mechanics/Spacer'
import { Button } from '@/components/mechanics/Button'
import { FlipCard } from '@/components/mechanics/FlipCard'
import { StatsCounter } from '@/components/mechanics/StatsCounter'
import { ProgressBar } from '@/components/mechanics/ProgressBar'
import { Headline } from '@/components/mechanics/Headline'
import { ScrollContainer } from '@/components/mechanics/ScrollContainer'
import { Accordion } from '@/components/mechanics/Accordion'
import { Tabs } from '@/components/mechanics/Tabs'
import { GridLayout } from '@/components/mechanics/GridLayout'
import { Modal } from '@/components/mechanics/Modal'
import { SplitScreen } from '@/components/mechanics/SplitScreen'
import { VideoPlayer } from '@/components/mechanics/VideoPlayer'
import { ImageGallery } from '@/components/mechanics/ImageGallery'
import { ImageComparison } from '@/components/mechanics/ImageComparison'
import { IconLibrary } from '@/components/mechanics/IconLibrary'
import { LogoGrid } from '@/components/mechanics/LogoGrid'
import { AvatarCard } from '@/components/mechanics/AvatarCard'

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
      case 'statscounter':
        return <StatsCounter {...enhancedProps as any} />
      case 'progressbar':
        return <ProgressBar {...enhancedProps as any} />
      case 'headline':
        return <Headline {...enhancedProps as any} />
      case 'scrollcontainer':
        return <ScrollContainer {...enhancedProps as any} />
      case 'accordion':
        return <Accordion {...enhancedProps as any} />
      case 'tabs':
        return <Tabs {...enhancedProps as any} />
      case 'gridlayout':
        return <GridLayout {...enhancedProps as any} />
      case 'modal':
        return <Modal {...enhancedProps as any} />
      case 'splitscreen':
        return <SplitScreen {...enhancedProps as any} />
      
      // Phase 3: Media
      case 'videoplayer':
        return <VideoPlayer {...enhancedProps as any} />
      case 'imagegallery':
        return <ImageGallery {...enhancedProps as any} images={props.images ? JSON.parse(props.images) : []} />
      case 'imagecomparison':
        return <ImageComparison {...enhancedProps as any} />
      case 'iconlibrary':
        return <IconLibrary {...enhancedProps as any} />
      case 'logogrid':
        return <LogoGrid {...enhancedProps as any} logos={props.logos ? JSON.parse(props.logos) : []} />
      case 'avatarcard':
        return <AvatarCard {...enhancedProps as any} />
      
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
