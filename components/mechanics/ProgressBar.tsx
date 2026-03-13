'use client';

import { useEffect, useState, useRef } from 'react';

interface ProgressBarProps {
  percentage?: number;
  height?: number;
  orientation?: 'horizontal' | 'vertical';
  backgroundColor?: string;
  fillColor?: string;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  animated?: boolean;
  animationDuration?: number;
  borderRadius?: number;
  label?: string;
  mode?: 'edit' | 'view';
}

export function ProgressBar({
  percentage = 75,
  height = 24,
  orientation = 'horizontal',
  backgroundColor = '#1f2937',
  fillColor = '#3b82f6',
  showLabel = true,
  labelPosition = 'inside',
  animated = true,
  animationDuration = 1500,
  borderRadius = 12,
  label = '',
  mode = 'view',
}: ProgressBarProps) {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === 'edit') {
      setCurrentPercentage(percentage);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, [mode, percentage, isVisible]);

  useEffect(() => {
    if (!isVisible || !animated || mode === 'edit') return;

    const increment = percentage / (animationDuration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setCurrentPercentage(percentage);
        clearInterval(timer);
      } else {
        setCurrentPercentage(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, percentage, animated, animationDuration, mode]);

  const isHorizontal = orientation === 'horizontal';
  const displayPercentage = Math.round(currentPercentage);

  return (
    <div
      ref={progressRef}
      className="flex flex-col items-center justify-center w-full h-full gap-2"
    >
      {label && labelPosition === 'outside' && (
        <div className="text-sm font-medium text-gray-300">{label}</div>
      )}
      
      <div
        className="relative"
        style={{
          width: isHorizontal ? '100%' : `${height}px`,
          height: isHorizontal ? `${height}px` : '100%',
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            [isHorizontal ? 'width' : 'height']: `${displayPercentage}%`,
            [isHorizontal ? 'height' : 'width']: '100%',
            backgroundColor: fillColor,
            transition: animated ? 'all 0.3s ease-out' : 'none',
            [isHorizontal ? 'left' : 'bottom']: 0,
          }}
        />
        
        {showLabel && labelPosition === 'inside' && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
            style={{
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {label || `${displayPercentage}%`}
          </div>
        )}
      </div>
      
      {showLabel && labelPosition === 'outside' && (
        <div className="text-sm font-semibold" style={{ color: fillColor }}>
          {displayPercentage}%
        </div>
      )}
    </div>
  );
}
