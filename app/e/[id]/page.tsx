'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowLeftCircle, Maximize, Minimize } from 'lucide-react'
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer'
import { Menu, type MenuProps } from '@/components/mechanics/Menu'

const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080

interface Asset {
  id: string
  workspace_id: string
  title: string
  slug: string
  description?: string
  status: string
  canvas_background_color?: string
  canvas_text_color?: string
  canvas_background_image?: string
}

interface Page {
  id: string
  asset_id: string
  title: string
  slug: string
  order: number
  status: 'draft' | 'qa' | 'complete'
  transition_type?: string
  transition_duration?: number
  canvas_background_color?: string
  canvas_background_image?: string
  background_type?: string
  background_gradient_type?: string
  background_gradient_colors?: string
  background_gradient_angle?: number
  background_image_url?: string
  background_image_size?: string
  background_image_position?: string
  background_animation_type?: string
  background_animation_duration?: number
  mechanics: string
}

interface MechanicInstance {
  id: string
  type: string
  x: number
  y: number
  width?: number
  height?: number
  name?: string
  layer?: number
  props: Record<string, any>
}

export default function AssetViewerPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const assetId = params.id as string
  const returnTo = searchParams.get('from') // 'editor' or null (defaults to dashboard)

  const [asset, setAsset] = useState<Asset | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [canvasScale, setCanvasScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [menuConfig, setMenuConfig] = useState<Omit<MenuProps, 'pages' | 'currentPage'> | null>(null)

  // Calculate canvas scale to fit viewport - prioritize height
  useEffect(() => {
    const calculateScale = () => {
      // Use height to determine scale (fills vertical space)
      const scaleY = window.innerHeight / CANVAS_HEIGHT
      setCanvasScale(scaleY)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  useEffect(() => {
    loadAssetAndPages()
  }, [assetId])

  const loadAssetAndPages = async () => {
    try {
      setLoading(true)
      
      // Load asset, pages, and menu config
      const [assetRes, pagesRes, menuRes] = await Promise.all([
        fetch(`/api/assets/${assetId}`),
        fetch(`/api/assets/${assetId}/pages`),
        fetch(`/api/assets/${assetId}/menu`)
      ])
      
      if (!assetRes.ok) throw new Error('Failed to load asset')
      const assetData = await assetRes.json()
      setAsset(assetData)

      // Load pages
      if (!pagesRes.ok) throw new Error('Failed to load pages')
      const pagesData = await pagesRes.json()
      const pagesList = pagesData.pages || []
      
      // Filter pages based on viewing context
      let filteredPages = pagesList
      if (returnTo === 'editor') {
        // Preview mode: Show QA + Complete pages
        filteredPages = pagesList.filter((p: Page) => p.status === 'qa' || p.status === 'complete')
      } else {
        // Live mode: Show only Complete pages
        filteredPages = pagesList.filter((p: Page) => p.status === 'complete')
      }
      
      setPages(filteredPages)

      // Load menu config
      if (menuRes.ok) {
        const menuData = await menuRes.json()
        setMenuConfig(menuData.menuConfig)
      }
      
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (returnTo === 'editor') {
      // Go back to the specific page editor if we have page info
      const currentPage = pages[currentPageIndex]
      if (currentPage) {
        router.push(`/admin/pages/${currentPage.id}`)
      } else {
        router.push(`/admin/assets/${assetId}`)
      }
    } else {
      // Go to dashboard
      router.push('/admin')
    }
  }

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Track fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNextPage()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevPage()
      } else if (e.key === 'Escape') {
        handleBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPageIndex, pages.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!asset || pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No pages found</div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentPage = pages[currentPageIndex]
  let mechanics: MechanicInstance[] = []
  try {
    mechanics = currentPage.mechanics ? JSON.parse(currentPage.mechanics) : []
  } catch (e) {
    console.error('Failed to parse mechanics:', e)
  }

  // Determine background style
  const getBackgroundStyle = () => {
    const style: React.CSSProperties = {}
    
    if (currentPage.background_type === 'gradient') {
      const colors = currentPage.background_gradient_colors?.split(',') || ['#000000', '#ffffff']
      const angle = currentPage.background_gradient_angle || 45
      if (currentPage.background_gradient_type === 'radial') {
        style.background = `radial-gradient(circle, ${colors.join(', ')})`
      } else {
        style.background = `linear-gradient(${angle}deg, ${colors.join(', ')})`
      }
    } else if (currentPage.background_type === 'image' || currentPage.background_type === 'animated-image') {
      if (currentPage.background_image_url) {
        style.backgroundImage = `url(${currentPage.background_image_url})`
        style.backgroundSize = currentPage.background_image_size || 'cover'
        style.backgroundPosition = currentPage.background_image_position || 'center'
        style.backgroundRepeat = 'no-repeat'
      }
    } else {
      style.backgroundColor = currentPage.canvas_background_color || asset.canvas_background_color || '#000000'
    }
    
    return style
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Menu Component - Rendered on top of everything */}
      {menuConfig && (
        <Menu
          {...menuConfig}
          pages={pages.map(p => ({ id: p.id, title: p.title, slug: p.slug }))}
          currentPage={currentPage.slug}
          mode="view"
        />
      )}

      {/* Back Button - subtle until hover */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/70 text-white/40 hover:text-white rounded-lg backdrop-blur-sm transition-all"
      >
        <ArrowLeftCircle className="w-5 h-5" />
        <span>Back to {returnTo === 'editor' ? 'Editor' : 'Dashboard'}</span>
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={handleFullscreen}
        className="absolute top-4 right-4 z-50 p-3 bg-black/20 hover:bg-black/70 text-white/40 hover:text-white rounded-lg backdrop-blur-sm transition-all"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>

      {/* Fixed Canvas Container - 1920x1080 scaled to fit viewport */}
      <div 
        style={{
          position: 'relative',
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `scale(${canvasScale})`,
          transformOrigin: 'center',
          ...getBackgroundStyle(),
        }}
      >
        {/* Mechanics positioned at their absolute coordinates */}
        {mechanics.map((mechanic) => (
          <div
            key={mechanic.id}
            style={{
              position: 'absolute',
              left: `${mechanic.x}px`,
              top: `${mechanic.y}px`,
              width: mechanic.width ? `${mechanic.width}px` : 'auto',
              height: mechanic.height ? `${mechanic.height}px` : 'auto',
            }}
          >
            <MechanicRenderer
              mechanic={mechanic}
              mode="view"
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls - subtle until hover */}
      {pages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 group">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="p-3 bg-black/20 group-hover:bg-black/70 text-white/40 group-hover:text-white rounded-full backdrop-blur-sm transition-all disabled:opacity-10 disabled:cursor-not-allowed"
              title="Previous (← or Left Arrow)"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-2">
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPageIndex
                      ? 'bg-white/60 group-hover:bg-white w-8'
                      : 'bg-white/20 group-hover:bg-white/50 hover:bg-white/70'
                  }`}
                  title={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === pages.length - 1}
              className="p-3 bg-black/20 group-hover:bg-black/70 text-white/40 group-hover:text-white rounded-full backdrop-blur-sm transition-all disabled:opacity-10 disabled:cursor-not-allowed"
              title="Next (→ or Space)"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Page Indicator - bottom right */}
      <div className="absolute bottom-4 right-4 z-50 px-3 py-1.5 bg-black/20 hover:bg-black/70 text-white/40 hover:text-white text-sm rounded backdrop-blur-sm transition-all">
        {currentPageIndex + 1} / {pages.length}
      </div>
    </div>
  )
}
