import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTACardProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  mode?: 'view' | 'edit';
}

export default function CTACard({
  headline = 'Ready to Get Started?',
  description = 'Join thousands of customers who trust us to deliver exceptional results.',
  buttonText = 'Get Started',
  buttonLink = '#',
  alignment = 'center',
  backgroundColor = '#1e293b',
  textColor = '#ffffff',
  buttonColor = '#8b5cf6',
  buttonTextColor = '#ffffff',
  borderRadius = 'lg',
  mode = 'view'
}: CTACardProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  return (
    <div
      className={`p-12 flex flex-col gap-6 ${alignmentClasses[alignment]} ${radiusClasses[borderRadius]}`}
      style={{ backgroundColor, color: textColor }}
    >
      <h2 className="text-4xl font-bold">{headline}</h2>
      <p className="text-lg opacity-90 max-w-2xl">{description}</p>
      <button
        onClick={() => {
          if (mode === 'view' && buttonLink !== '#') {
            window.location.href = buttonLink;
          }
        }}
        className={`px-8 py-4 ${radiusClasses[borderRadius]} font-semibold flex items-center gap-2 transition-transform hover:scale-105`}
        style={{
          backgroundColor: buttonColor,
          color: buttonTextColor
        }}
      >
        {buttonText}
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
