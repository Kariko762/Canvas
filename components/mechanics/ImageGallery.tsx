'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

interface GalleryImage {
  url: string
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  layout?: 'grid' | 'carousel'
  columns?: number
  gap?: number
  aspectRatio?: string
  showCaptions?: boolean
}

export function ImageGallery({ 
  images = [], 
  layout = 'grid',
  columns = 3,
  gap = 16,
  aspectRatio = '1/1',
  showCaptions = true
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % images.length)
  }

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 rounded-lg">
        <p>No images</p>
      </div>
    )
  }

  if (layout === 'carousel') {
    return (
      <>
        <div className="relative w-full h-full bg-zinc-900 rounded-lg overflow-hidden group">
          <img
            src={images[carouselIndex].url}
            alt={images[carouselIndex].caption || `Image ${carouselIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openLightbox(carouselIndex)}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevCarousel}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextCarousel}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === carouselIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Caption */}
          {showCaptions && images[carouselIndex].caption && (
            <div className="absolute bottom-12 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-center">{images[carouselIndex].caption}</p>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption || `Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {showCaptions && images[lightboxIndex].caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-lg">{images[lightboxIndex].caption}</p>
              </div>
            )}
          </div>
        )}
      </>
    )
  }

  // Grid layout
  return (
    <>
      <div 
        className="w-full h-full overflow-auto p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
            style={{ aspectRatio }}
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.url}
              alt={image.caption || `Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            {showCaptions && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          <img
            src={images[lightboxIndex].url}
            alt={images[lightboxIndex].caption || `Image ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {showCaptions && images[lightboxIndex].caption && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-lg">{images[lightboxIndex].caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
