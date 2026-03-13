'use client';

interface ScrollContainerProps {
  content?: string;
  scrollDirection?: 'vertical' | 'horizontal' | 'both';
  maxHeight?: number;
  maxWidth?: number;
  backgroundColor?: string;
  scrollbarStyle?: 'default' | 'minimal' | 'hidden' | 'glow';
  scrollbarColor?: string;
  padding?: number;
  borderRadius?: number;
  mode?: 'edit' | 'view';
}

export function ScrollContainer({
  content = 'Add your scrollable content here. This container allows you to create scrollable regions within your page without affecting the main page scroll. Perfect for long text sections, terms & conditions, or data tables.',
  scrollDirection = 'vertical',
  maxHeight = 300,
  maxWidth = 400,
  backgroundColor = '#1f2937',
  scrollbarStyle = 'minimal',
  scrollbarColor = '#3b82f6',
  padding = 16,
  borderRadius = 8,
  mode = 'view',
}: ScrollContainerProps) {
  const getScrollbarStyles = () => {
    if (scrollbarStyle === 'hidden') {
      return {
        scrollbarWidth: 'none' as const,
        msOverflowStyle: 'none' as const,
      };
    }

    if (scrollbarStyle === 'minimal') {
      return {
        scrollbarWidth: 'thin' as const,
        scrollbarColor: `${scrollbarColor} ${backgroundColor}`,
      };
    }

    if (scrollbarStyle === 'glow') {
      return {
        scrollbarWidth: 'thin' as const,
        scrollbarColor: `${scrollbarColor} transparent`,
      };
    }

    return {};
  };

  const overflowX = scrollDirection === 'horizontal' || scrollDirection === 'both' ? 'auto' : 'hidden';
  const overflowY = scrollDirection === 'vertical' || scrollDirection === 'both' ? 'auto' : 'hidden';

  return (
    <div
      className="scroll-container"
      style={{
        width: '100%',
        height: '100%',
        maxHeight: scrollDirection === 'vertical' || scrollDirection === 'both' ? `${maxHeight}px` : 'none',
        maxWidth: scrollDirection === 'horizontal' || scrollDirection === 'both' ? `${maxWidth}px` : 'none',
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        overflowX,
        overflowY,
        ...getScrollbarStyles(),
      }}
    >
      <div style={{ color: '#d1d5db', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {content}
        {mode === 'edit' && content.length < 500 && (
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem', fontStyle: 'italic' }}>
            (Add more content to see scrolling in action)
          </div>
        )}
      </div>

      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          ${scrollbarStyle === 'hidden' ? 'display: none;' : 'width: 8px; height: 8px;'}
        }
        
        .scroll-container::-webkit-scrollbar-track {
          background: ${scrollbarStyle === 'glow' ? 'transparent' : backgroundColor};
          border-radius: 4px;
        }
        
        .scroll-container::-webkit-scrollbar-thumb {
          background: ${scrollbarColor};
          border-radius: 4px;
          ${scrollbarStyle === 'glow' ? `box-shadow: 0 0 10px ${scrollbarColor};` : ''}
        }
        
        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarColor}dd;
        }
      `}</style>
    </div>
  );
}
