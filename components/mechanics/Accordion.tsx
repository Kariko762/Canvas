'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  headerBackground?: string;
  headerTextColor?: string;
  contentBackground?: string;
  contentTextColor?: string;
  iconStyle?: 'chevron' | 'plus-minus';
  borderColor?: string;
  transitionSpeed?: number;
  mode?: 'edit' | 'view';
}

export function Accordion({
  items = [
    { id: '1', title: 'Accordion Item 1', content: 'This is the content for the first accordion item. Click to expand and collapse.' },
    { id: '2', title: 'Accordion Item 2', content: 'This is the content for the second accordion item. You can add as many items as you need.' },
    { id: '3', title: 'Accordion Item 3', content: 'This is the content for the third accordion item. Each item can have different content lengths.' },
  ],
  allowMultiple = false,
  headerBackground = '#1f2937',
  headerTextColor = '#ffffff',
  contentBackground = '#111827',
  contentTextColor = '#d1d5db',
  iconStyle = 'chevron',
  borderColor = '#374151',
  transitionSpeed = 300,
  mode = 'view',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  const Icon = iconStyle === 'chevron' ? ChevronDown : (openItems.has('') ? Minus : Plus);

  return (
    <div className="w-full h-full overflow-y-auto" style={{ padding: '8px' }}>
      <div className="space-y-2">
        {items.map((item) => {
          const isOpen = openItems.has(item.id);
          
          return (
            <div
              key={item.id}
              style={{
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <button
                onClick={() => mode === 'view' && toggleItem(item.id)}
                className="w-full flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: headerBackground,
                  color: headerTextColor,
                  padding: '12px 16px',
                  cursor: mode === 'view' ? 'pointer' : 'default',
                }}
              >
                <span className="font-medium text-left">{item.title}</span>
                {iconStyle === 'chevron' ? (
                  <ChevronDown
                    className="flex-shrink-0 transition-transform"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transitionDuration: `${transitionSpeed}ms`,
                    }}
                    size={20}
                  />
                ) : (
                  <div className="flex-shrink-0">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                )}
              </button>

              {/* Content */}
              <div
                style={{
                  maxHeight: isOpen || mode === 'edit' ? '500px' : '0',
                  overflow: 'hidden',
                  transition: `max-height ${transitionSpeed}ms ease-in-out`,
                }}
              >
                <div
                  style={{
                    backgroundColor: contentBackground,
                    color: contentTextColor,
                    padding: '16px',
                    lineHeight: '1.6',
                  }}
                >
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
