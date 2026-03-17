import React from 'react';

interface ColumnsProps {
  columnCount?: '2' | '3' | '4';
  gap?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  columnWidth?: 'equal' | '30-70' | '40-60' | '60-40' | '70-30';
  verticalAlign?: 'start' | 'center' | 'end' | 'stretch';
  responsive?: boolean;
  mode?: 'view' | 'edit';
}

export default function Columns({
  columnCount = '2',
  gap = 'medium',
  columnWidth = 'equal',
  verticalAlign = 'start',
  responsive = true,
  mode = 'view'
}: ColumnsProps) {
  const gapClasses = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    xlarge: 'gap-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const getGridClasses = () => {
    const count = parseInt(columnCount);
    
    if (columnWidth !== 'equal') {
      const [left, right] = columnWidth.split('-');
      return `grid-cols-[${left}fr_${right}fr]`;
    }

    // Responsive grid that stacks on mobile
    if (responsive) {
      return `grid-cols-1 md:grid-cols-${count}`;
    }

    return `grid-cols-${count}`;
  };

  const renderColumnPlaceholder = (index: number) => (
    <div
      key={index}
      className="min-h-[150px] border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center"
    >
      <span className="text-white/40 text-sm">Column {index + 1}</span>
    </div>
  );

  return (
    <div className={`grid ${getGridClasses()} ${gapClasses[gap]} ${alignClasses[verticalAlign]} w-full`}>
      {mode === 'edit' ? (
        Array.from({ length: parseInt(columnCount) }).map((_, i) => renderColumnPlaceholder(i))
      ) : (
        Array.from({ length: parseInt(columnCount) }).map((_, i) => (
          <div key={i} className="text-white/40 text-sm text-center py-8 border border-white/10 rounded">
            Column {i + 1} content
          </div>
        ))
      )}
    </div>
  );
}
