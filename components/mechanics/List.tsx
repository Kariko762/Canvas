import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface ListProps {
  items?: string;
  listStyle?: 'bullet' | 'numbered' | 'checkmark' | 'arrow';
  size?: 'sm' | 'base' | 'lg' | 'xl';
  color?: string;
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  iconColor?: string;
  mode?: 'view' | 'edit';
}

export default function List({
  items = 'First item\nSecond item\nThird item',
  listStyle = 'bullet',
  size = 'base',
  color = '#ffffff',
  spacing = 'normal',
  iconColor = '#8b5cf6',
  mode = 'view'
}: ListProps) {
  const itemArray = items.split('\n').filter(item => item.trim());

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spacingClasses = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    relaxed: 'space-y-3',
    loose: 'space-y-4'
  };

  const renderMarker = (index: number) => {
    switch (listStyle) {
      case 'numbered':
        return (
          <span
            className="font-semibold mr-3 flex-shrink-0"
            style={{ color: iconColor }}
          >
            {index + 1}.
          </span>
        );
      case 'checkmark':
        return (
          <Check
            className="mr-3 flex-shrink-0 mt-0.5"
            size={size === 'sm' ? 16 : size === 'xl' ? 24 : 20}
            style={{ color: iconColor }}
          />
        );
      case 'arrow':
        return (
          <ChevronRight
            className="mr-3 flex-shrink-0 mt-0.5"
            size={size === 'sm' ? 16 : size === 'xl' ? 24 : 20}
            style={{ color: iconColor }}
          />
        );
      case 'bullet':
      default:
        return (
          <span
            className="mr-3 flex-shrink-0 text-xl leading-none"
            style={{ color: iconColor }}
          >
            •
          </span>
        );
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${spacingClasses[spacing]}`}>
      {itemArray.map((item, index) => (
        <div
          key={index}
          className="flex items-start"
          style={{ color }}
        >
          {renderMarker(index)}
          <span className="flex-1">{item}</span>
        </div>
      ))}
    </div>
  );
}
