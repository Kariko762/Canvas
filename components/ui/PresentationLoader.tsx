'use client';

import { useEffect, useState } from 'react';

interface PresentationLoaderProps {
  progress?: number; // 0-100
}

export function PresentationLoader({ progress = 0 }: PresentationLoaderProps) {
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Fade in animation
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Handle completion pause
  useEffect(() => {
    if (progress >= 100 && !completed) {
      setCompleted(true);
    }
  }, [progress, completed]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#010102' }}>
      {/* Main logo container */}
      <div className={`relative flex flex-col items-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Stacked images - base grayscale */}
        <div className="relative inline-block">
          {/* Grayscale base image (always visible, more transparent) */}
          <img 
            src="/loading-menu-shadow.png" 
            alt="Loading"
            className="block"
            style={{ 
              maxHeight: '70vh', 
              maxWidth: '90vw',
              width: 'auto',
              height: 'auto',
              opacity: 0.4
            }}
          />
          
          {/* Color overlay image (reveals from bottom to top based on progress) */}
          <div 
            className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden transition-all duration-200 ease-linear"
            style={{
              clipPath: `inset(${100 - progress}% 0 0 0)`
            }}
          >
            <img 
              src="/loading-menu-color.png" 
              alt="Loading"
              className="block absolute top-0 left-0"
              style={{ 
                maxHeight: '70vh', 
                maxWidth: '90vw',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        </div>

        {/* Progress bar underneath image - matches image width */}
        <div 
          className="relative h-3 rounded-full overflow-hidden mt-6"
          style={{ 
            width: '100%',
            maxWidth: '90vw',
            backgroundColor: 'rgba(13, 13, 13, 0.5)'
          }}
        >
          <div
            className="h-full transition-all duration-200 ease-linear"
            style={{ 
              width: `${progress}%`,
              backgroundColor: '#4bcd3e'
            }}
          />
        </div>

        {/* Loading text */}
        <div className="text-center mt-6">
          <p className="text-gray-300 text-lg font-medium mb-2">Building Presentation</p>
          <div className="flex items-center justify-center gap-1">
            <span className="animate-pulse" style={{ animationDelay: '0ms', color: '#4bcd3e' }}>●</span>
            <span className="animate-pulse" style={{ animationDelay: '200ms', color: '#4bcd3e' }}>●</span>
            <span className="animate-pulse" style={{ animationDelay: '400ms', color: '#4bcd3e' }}>●</span>
          </div>
        </div>
      </div>
    </div>
  );
}
