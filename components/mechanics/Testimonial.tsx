import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
}

interface TestimonialProps {
  testimonials?: Testimonial[] | string;
  displayStyle?: 'card' | 'quote' | 'compact';
  showRating?: boolean;
  showImage?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  mode?: 'view' | 'edit';
}

export default function Testimonial({
  testimonials = [
    {
      id: '1',
      quote: 'This product has transformed our business. Highly recommended!',
      author: 'Sarah Johnson',
      role: 'CEO, TechCorp',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=1'
    }
  ],
  displayStyle = 'card',
  showRating = true,
  showImage = true,
  backgroundColor = '#1e293b',
  textColor = '#ffffff',
  accentColor = '#fbbf24',
  mode = 'view'
}: TestimonialProps) {
  // Parse JSON if needed
  const parsedTestimonials = typeof testimonials === 'string' ? JSON.parse(testimonials) : testimonials;
  const testimonial = parsedTestimonials[0] || {
    quote: 'No testimonial data',
    author: 'Unknown',
    role: '',
    rating: 5,
    image: ''
  };

  const renderRating = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-current' : 'opacity-30'}
          style={{ color: accentColor }}
        />
      ))}
    </div>
  );

  if (displayStyle === 'quote') {
    return (
      <div className="p-8 rounded-xl" style={{ backgroundColor, color: textColor }}>
        <Quote size={40} style={{ color: accentColor }} className="opacity-50 mb-4" />
        <blockquote className="text-xl italic mb-6">{testimonial.quote}</blockquote>
        <div className="flex items-center gap-4">
          {showImage && testimonial.image && (
            <img
              src={testimonial.image}
              alt={testimonial.author}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold">{testimonial.author}</div>
            <div className="text-sm opacity-70">{testimonial.role}</div>
            {showRating && <div className="mt-1">{renderRating(testimonial.rating)}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (displayStyle === 'compact') {
    return (
      <div className="flex items-start gap-4 p-6 rounded-lg" style={{ backgroundColor, color: textColor }}>
        {showImage && testimonial.image && (
          <img
            src={testimonial.image}
            alt={testimonial.author}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <p className="text-sm mb-3 italic">{testimonial.quote}</p>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-semibold">{testimonial.author}</div>
              <div className="text-xs opacity-70">{testimonial.role}</div>
            </div>
            {showRating && <div>{renderRating(testimonial.rating)}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Default: card style
  return (
    <div className="p-8 rounded-xl border border-white/10" style={{ backgroundColor, color: textColor }}>
      {showRating && (
        <div className="mb-4">{renderRating(testimonial.rating)}</div>
      )}
      <p className="text-lg mb-6 leading-relaxed">{testimonial.quote}</p>
      <div className="flex items-center gap-4">
        {showImage && testimonial.image && (
          <img
            src={testimonial.image}
            alt={testimonial.author}
            className="w-14 h-14 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold">{testimonial.author}</div>
          <div className="text-sm opacity-70">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}
