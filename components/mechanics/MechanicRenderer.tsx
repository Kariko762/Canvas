'use client'

import { Title } from '@/components/mechanics/Title'
import { TextBlock } from '@/components/mechanics/Text'
import List from '@/components/mechanics/List'
import QuoteBlock from '@/components/mechanics/QuoteBlock'
import CodeBlock from '@/components/mechanics/CodeBlock'
import Container from '@/components/mechanics/Container'
import Columns from '@/components/mechanics/Columns'
import { Image } from '@/components/mechanics/Image'
import { Shape } from '@/components/mechanics/Shape'
import { Divider } from '@/components/mechanics/Divider'
import { Spacer } from '@/components/mechanics/Spacer'
import { Button } from '@/components/mechanics/Button'
import { FlipCard } from '@/components/mechanics/FlipCard'
import { StatsCounter } from '@/components/mechanics/StatsCounter'
import { ProgressBar } from '@/components/mechanics/ProgressBar'
import Table from '@/components/mechanics/Table'
import { Headline } from '@/components/mechanics/Headline'
import { ScrollContainer } from '@/components/mechanics/ScrollContainer'
import { Accordion } from '@/components/mechanics/Accordion'
import { Tabs } from '@/components/mechanics/Tabs'
import { GridLayout } from '@/components/mechanics/GridLayout'
import { Modal } from '@/components/mechanics/Modal'
import CTACard from '@/components/mechanics/CTACard'
import Alert from '@/components/mechanics/Alert'
import { SplitScreen } from '@/components/mechanics/SplitScreen'
import { VideoPlayer } from '@/components/mechanics/VideoPlayer'
import { ImageGallery } from '@/components/mechanics/ImageGallery'
import { ImageComparison } from '@/components/mechanics/ImageComparison'
import { IconLibrary } from '@/components/mechanics/IconLibrary'
import { LogoGrid } from '@/components/mechanics/LogoGrid'
import { AvatarCard } from '@/components/mechanics/AvatarCard'
import Testimonial from '@/components/mechanics/Testimonial'
import FeatureGrid from '@/components/mechanics/FeatureGrid'
import Badge from '@/components/mechanics/Badge'
import Tooltip from '@/components/mechanics/Tooltip'
import PricingCard from '@/components/mechanics/PricingCard'
import Carousel from '@/components/mechanics/Carousel'

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
      case 'list':
        return <List {...enhancedProps as any} />
      case 'quote':
        return <QuoteBlock {...enhancedProps as any} />
      case 'codeblock':
        return <CodeBlock {...enhancedProps as any} />
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
      case 'table':
        return <Table {...enhancedProps as any} headers={Array.isArray(props.headers) ? props.headers : (typeof props.headers === 'string' ? JSON.parse(props.headers) : ['Name', 'Role', 'Email'])} rows={Array.isArray(props.rows) ? props.rows : (typeof props.rows === 'string' ? JSON.parse(props.rows) : [['', '', '']])} />
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
      case 'container':
        return <Container {...enhancedProps as any} />
      case 'columns':
        return <Columns {...enhancedProps as any} />
      case 'modal':
        return <Modal {...enhancedProps as any} />
      case 'ctacard':
        return <CTACard {...enhancedProps as any} />
      case 'alert':
        return <Alert {...enhancedProps as any} />
      case 'splitscreen':
        return <SplitScreen {...enhancedProps as any} />
      
      // Phase 3: Media
      case 'videoplayer':
        return <VideoPlayer {...enhancedProps as any} />
      case 'imagegallery':
        return <ImageGallery {...enhancedProps as any} images={Array.isArray(props.images) ? props.images : (typeof props.images === 'string' ? JSON.parse(props.images) : [])} />
      case 'imagecomparison':
        return <ImageComparison {...enhancedProps as any} />
      case 'iconlibrary':
        return <IconLibrary {...enhancedProps as any} />
      case 'logogrid':
        return <LogoGrid {...enhancedProps as any} logos={Array.isArray(props.logos) ? props.logos : (typeof props.logos === 'string' ? JSON.parse(props.logos) : [])} />
      case 'avatarcard':
        return <AvatarCard {...enhancedProps as any} />
      case 'testimonial':
        return <Testimonial {...enhancedProps as any} testimonials={Array.isArray(props.testimonials) ? props.testimonials : (typeof props.testimonials === 'string' ? JSON.parse(props.testimonials) : [{id: '1', quote: 'Great!', author: 'User', role: 'Customer', rating: 5}])} />
      case 'featuregrid':
        return <FeatureGrid {...enhancedProps as any} features={Array.isArray(props.features) ? props.features : (typeof props.features === 'string' ? JSON.parse(props.features) : [{id: '1', icon: 'Zap', title: 'Feature', description: 'Description'}])} />
      case 'badge':
        return <Badge {...enhancedProps as any} />
      case 'tooltip':
        return <Tooltip {...enhancedProps as any} />
      case 'pricingcard':
        return <PricingCard {...enhancedProps as any} plans={Array.isArray(props.plans) ? props.plans : (typeof props.plans === 'string' ? JSON.parse(props.plans) : [{id: '1', name: 'Starter', price: '$29', period: 'per month', features: ['Feature 1'], highlighted: false, buttonText: 'Get Started', buttonLink: '#'}])} />
      case 'carousel':
        return <Carousel {...enhancedProps as any} slides={Array.isArray(props.slides) ? props.slides : (typeof props.slides === 'string' ? JSON.parse(props.slides) : [{id: '1', type: 'image', imageUrl: 'https://picsum.photos/800/400', caption: 'Slide 1'}])} />
      
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
