import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  type: 'image';
  imageUrl: string;
  caption?: string;
}

interface CarouselProps {
  slides?: Slide[] | string;
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: 'small' | 'medium' | 'large' | 'xlarge';
  mode?: 'view' | 'edit';
}

export default function Carousel({
  slides = [
    { id: '1', type: 'image', imageUrl: 'https://picsum.photos/800/400?random=1', caption: 'Slide 1' },
    { id: '2', type: 'image', imageUrl: 'https://picsum.photos/800/400?random=2', caption: 'Slide 2' },
    { id: '3', type: 'image', imageUrl: 'https://picsum.photos/800/400?random=3', caption: 'Slide 3' }
  ],
  autoplay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  height = 'medium',
  mode = 'view'
}: CarouselProps) {
  const parsedSlides = typeof slides === 'string' ? JSON.parse(slides) : slides;
  const [currentIndex, setCurrentIndex] = useState(0);

  const heightClasses = {
    small: 'h-[300px]',
    medium: 'h-[400px]',
    large: 'h-[500px]',
    xlarge: 'h-[600px]'
  };

  useEffect(() => {
    if (!autoplay || mode === 'edit') return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % parsedSlides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, parsedSlides.length, mode]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + parsedSlides.length) % parsedSlides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % parsedSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (parsedSlides.length === 0) {
    return (
      <div className={`${heightClasses[height]} bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500`}>
        <p>No slides added</p>
      </div>
    );
  }

  const currentSlide = parsedSlides[currentIndex];

  return (
    <div className={`relative ${heightClasses[height]} rounded-lg overflow-hidden group`}>
      {/* Slides */}
      <div className="relative w-full h-full">
        {parsedSlides.map((slide: Slide, index: number) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.caption || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {slide.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 text-white text-center">
                {slide.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && parsedSlides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && parsedSlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {parsedSlides.map((slide: Slide, index: number) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
