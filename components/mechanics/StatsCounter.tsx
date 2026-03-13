'use client';

import { useEffect, useState, useRef } from 'react';

interface StatsCounterProps {
  startValue?: number;
  endValue?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  label?: string;
  labelSize?: string;
  alignment?: 'left' | 'center' | 'right';
  mode?: 'edit' | 'view';
}

export function StatsCounter({
  startValue = 0,
  endValue = 100,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  fontSize = '48px',
  fontWeight = 'bold',
  color = '#3b82f6',
  label = 'Stat Label',
  labelSize = '16px',
  alignment = 'center',
  mode = 'view',
}: StatsCounterProps) {
  const [count, setCount] = useState(startValue);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === 'edit') {
      setCount(endValue);
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

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [mode, endValue, isVisible]);

  useEffect(() => {
    if (!isVisible || mode === 'edit') return;

    const range = endValue - startValue;
    const increment = range / (duration / 16);
    let current = startValue;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= endValue) || (increment < 0 && current <= endValue)) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, startValue, endValue, duration, mode]);

  const formatNumber = (num: number) => {
    const formatted = num.toFixed(decimals);
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div
      ref={counterRef}
      className="flex flex-col items-center justify-center h-full w-full"
      style={{ textAlign: alignment }}
    >
      <div
        style={{
          fontSize,
          fontWeight,
          color,
          lineHeight: '1.2',
        }}
      >
        {prefix}{formatNumber(count)}{suffix}
      </div>
      {label && (
        <div
          style={{
            fontSize: labelSize,
            color: '#9ca3af',
            marginTop: '8px',
            fontWeight: '500',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
