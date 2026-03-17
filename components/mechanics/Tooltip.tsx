import React, { useState } from 'react';

interface TooltipProps {
  text?: string;
  tooltipContent?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  backgroundColor?: string;
  textColor?: string;
  mode?: 'view' | 'edit';
}

export default function Tooltip({
  text = 'Hover me',
  tooltipContent = 'Additional information appears here',
  position = 'top',
  backgroundColor = '#1f2937',
  textColor = '#ffffff',
  mode = 'view'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-8',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-8',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-8',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-8'
  };

  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help underline decoration-dotted"
        style={{ color: textColor }}
      >
        {text}
      </span>
      
      {(isVisible || mode === 'edit') && (
        <div
          className={`
            absolute ${positionClasses[position]} z-50
            px-3 py-2 rounded-lg text-sm whitespace-nowrap
            shadow-lg transition-opacity
            ${isVisible ? 'opacity-100' : 'opacity-50'}
          `}
          style={{ backgroundColor, color: textColor }}
        >
          {tooltipContent}
          <div
            className={`absolute ${arrowClasses[position]} border-transparent`}
            style={{
              borderTopColor: position === 'top' ? backgroundColor : 'transparent',
              borderBottomColor: position === 'bottom' ? backgroundColor : 'transparent',
              borderLeftColor: position === 'left' ? backgroundColor : 'transparent',
              borderRightColor: position === 'right' ? backgroundColor : 'transparent'
            }}
          />
        </div>
      )}
    </div>
  );
}
