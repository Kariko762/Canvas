import React from 'react';
import { Quote } from 'lucide-react';

interface QuoteBlockProps {
  quote?: string;
  author?: string;
  role?: string;
  size?: 'base' | 'lg' | 'xl' | '2xl';
  quoteColor?: string;
  authorColor?: string;
  accentColor?: string;
  style?: 'default' | 'bordered' | 'card';
  mode?: 'view' | 'edit';
}

export default function QuoteBlock({
  quote = 'The best way to predict the future is to invent it.',
  author = 'Alan Kay',
  role = 'Computer Scientist',
  size = 'lg',
  quoteColor = '#ffffff',
  authorColor = '#94a3b8',
  accentColor = '#8b5cf6',
  style = 'default',
  mode = 'view'
}: QuoteBlockProps) {
  const sizeClasses = {
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const containerClasses = {
    default: '',
    bordered: 'border-l-4 pl-6',
    card: 'bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10'
  };

  return (
    <div className={containerClasses[style]} style={style === 'bordered' ? { borderLeftColor: accentColor } : {}}>
      <div className="flex items-start gap-4">
        <Quote
          size={size === 'base' ? 32 : size === 'lg' ? 40 : size === 'xl' ? 48 : 56}
          style={{ color: accentColor }}
          className="flex-shrink-0 opacity-50"
        />
        <div className="flex-1">
          <blockquote
            className={`${sizeClasses[size]} italic mb-4 leading-relaxed`}
            style={{ color: quoteColor }}
          >
            {quote}
          </blockquote>
          {(author || role) && (
            <div className="flex flex-col gap-1">
              {author && (
                <div
                  className="font-semibold text-sm"
                  style={{ color: authorColor }}
                >
                  {author}
                </div>
              )}
              {role && (
                <div
                  className="text-sm opacity-70"
                  style={{ color: authorColor }}
                >
                  {role}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
