'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getMechanicsByCategory, type MechanicCategory } from '@/lib/mechanics-registry';

interface ToolbarProps {
  onAddMechanic: (type: string) => void;
}

export function MechanicsToolbar({ onAddMechanic }: ToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<MechanicCategory | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: { key: MechanicCategory; label: string }[] = [
    { key: 'content', label: 'Text' },
    { key: 'decoration', label: 'Shapes' },
    { key: 'media', label: 'Media' },
    { key: 'interactive', label: 'Interactive' },
    { key: 'layout', label: 'Layout' },
  ];

  return (
    <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-2" ref={dropdownRef}>
      <div className="flex items-center justify-center gap-1">
        {categories.map((category) => {
          const mechanics = getMechanicsByCategory(category.key);
          if (mechanics.length === 0) return null;

          const isOpen = openDropdown === category.key;

          return (
            <div key={category.key} className="relative">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : category.key)}
                className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                  isOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {category.label}
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50 min-w-[200px]">
                  {mechanics.map((mechanic) => (
                    <button
                      key={mechanic.type}
                      onClick={() => {
                        onAddMechanic(mechanic.type);
                        setOpenDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <div className="font-medium text-sm">{mechanic.name}</div>
                      <div className="text-xs text-zinc-400">{mechanic.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
