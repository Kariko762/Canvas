'use client';

import React, { useState } from 'react';
import { Menu as MenuIcon, X, ChevronRight, ExternalLink } from 'lucide-react';

export interface MenuLink {
  id: string;
  icon?: string;
  title: string;
  url?: string;
  experienceId?: string;
  description?: string;
  type: 'experience' | 'external';
}

export interface MenuProps {
  // Core config
  enabled?: boolean;
  menuType?: 'vertical-expanding' | 'burger' | 'fullscreen-split';
  position?: 'top' | 'bottom' | 'left' | 'right';
  animation?: 'slide-down' | 'slide-out' | 'fade' | 'scale';
  
  // Styling
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  
  // Right panel items (editable)
  rightPanelItems?: MenuLink[];
  
  // Auto-generated pages (passed in for fullscreen left panel)
  pages?: Array<{ id: string; title: string; slug: string }>;
  currentPage?: string;
  
  // Behavior
  mode?: 'edit' | 'view';
}

export function Menu({
  enabled = true,
  menuType = 'vertical-expanding',
  position = 'left',
  animation = 'slide-out',
  backgroundColor = '#1a1a1a',
  textColor = '#ffffff',
  accentColor = '#3b82f6',
  rightPanelItems = [],
  pages = [],
  currentPage = '',
  mode = 'view'
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedVertical, setExpandedVertical] = useState(false);

  // Don't render if disabled
  if (!enabled) {
    return null;
  }

  // Edit mode: Show preview with instructions
  if (mode === 'edit') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded">
        <div className="text-center p-8">
          <MenuIcon className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
          <h3 className="text-lg font-medium mb-2">Menu Element</h3>
          <p className="text-sm text-zinc-500 mb-1">Type: {menuType.replace(/-/g, ' ')}</p>
          <p className="text-sm text-zinc-500">Position: {position}</p>
          <p className="text-xs text-zinc-600 mt-4">Preview available in Experience Viewer</p>
        </div>
      </div>
    );
  }

  // VERTICAL EXPANDING MENU
  if (menuType === 'vertical-expanding') {
    const isLeft = position === 'left';
    const isRight = position === 'right';
    const width = expandedVertical ? '280px' : '64px';

    return (
      <div
        className="fixed top-0 h-screen z-50 flex flex-col transition-all duration-300 shadow-lg"
        style={{
          [isRight ? 'right' : 'left']: 0,
          width,
          backgroundColor,
          color: textColor
        }}
        onMouseEnter={() => setExpandedVertical(true)}
        onMouseLeave={() => setExpandedVertical(false)}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <MenuIcon className="w-6 h-6" />
        </div>

        {/* Pages Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {pages.map((page) => (
              <a
                key={page.id}
                href={`#${page.slug}`}
                className="flex items-center gap-3 px-3 py-3 rounded hover:bg-white/10 transition-colors mb-1"
                style={{
                  backgroundColor: currentPage === page.slug ? `${accentColor}40` : 'transparent'
                }}
              >
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                {expandedVertical && <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{page.title}</span>}
              </a>
            ))}
          </div>

          {/* Right Panel Links */}
          {rightPanelItems.length > 0 && (
            <div className="border-t border-white/10 mt-4 pt-4 p-2">
              {rightPanelItems.map((link) => (
                <a
                  key={link.id}
                  href={link.url || `#${link.experienceId}`}
                  target={link.type === 'external' ? '_blank' : undefined}
                  rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 px-3 py-3 rounded hover:bg-white/10 transition-colors mb-1"
                >
                  {link.icon && <span className="text-lg flex-shrink-0">{link.icon}</span>}
                  {!link.icon && link.type === 'external' && <ExternalLink className="w-4 h-4 flex-shrink-0" />}
                  {expandedVertical && <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{link.title}</span>}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // BURGER MENU
  if (menuType === 'burger') {
    const positionClasses = {
      top: 'top-0 left-0 right-0',
      bottom: 'bottom-0 left-0 right-0',
      left: 'top-0 left-0',
      right: 'top-0 right-0'
    };

    return (
      <>
        {/* Burger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed z-50 p-4 transition-colors ${positionClasses[position]}`}
          style={{ color: textColor }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        {/* Menu Overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <div
              className={`fixed z-40 shadow-2xl transition-all duration-300 ${
                animation === 'slide-down' ? 'animate-slide-down' :
                animation === 'slide-out' ? 'animate-slide-left' :
                animation === 'fade' ? 'animate-fade-in' :
                'animate-scale-up'
              }`}
              style={{
                backgroundColor,
                color: textColor,
                ...(position === 'top' && { top: '64px', left: 0, right: 0, maxHeight: '80vh' }),
                ...(position === 'bottom' && { bottom: 0, left: 0, right: 0, maxHeight: '80vh' }),
                ...(position === 'left' && { top: 0, left: 0, bottom: 0, width: '320px' }),
                ...(position === 'right' && { top: 0, right: 0, bottom: 0, width: '320px' })
              }}
            >
              <div className="p-6 overflow-y-auto h-full">
                {/* Pages */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-3">Pages</h3>
                  <div className="space-y-1">
                    {pages.map((page) => (
                      <a
                        key={page.id}
                        href={`#${page.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        style={{
                          backgroundColor: currentPage === page.slug ? `${accentColor}40` : 'transparent'
                        }}
                      >
                        {page.title}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Custom Links */}
                {rightPanelItems.length > 0 && (
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-3">More</h3>
                    <div className="space-y-1">
                      {rightPanelItems.map((link) => (
                        <a
                          key={link.id}
                          href={link.url || `#${link.experienceId}`}
                          target={link.type === 'external' ? '_blank' : undefined}
                          rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                          {link.icon && <span className="text-2xl">{link.icon}</span>}
                          <div className="flex-1">
                            <div className="font-medium">{link.title}</div>
                            {link.description && (
                              <div className="text-xs opacity-60 mt-0.5">{link.description}</div>
                            )}
                          </div>
                          {link.type === 'external' && <ExternalLink className="w-4 h-4 opacity-40" />}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // FULLSCREEN SPLIT MENU
  if (menuType === 'fullscreen-split') {
    return (
      <>
        {/* Menu Button - Fixed Position */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed z-50 p-4 transition-colors ${
            position === 'top' ? 'top-4 right-4' :
            position === 'bottom' ? 'bottom-4 right-4' :
            position === 'left' ? 'top-4 left-4' :
            'top-4 right-4'
          }`}
          style={{ color: textColor }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        {/* Fullscreen Menu */}
        {isOpen && (
          <div
            className={`fixed inset-0 z-40 flex transition-opacity duration-300 ${
              animation === 'fade' ? 'animate-fade-in' : ''
            }`}
            style={{ backgroundColor }}
          >
            {/* Left Panel - Auto-generated Pages */}
            <div className="w-1/2 border-r border-white/10 flex flex-col">
              <div className="p-8 border-b border-white/10">
                <h2 className="text-2xl font-bold" style={{ color: textColor }}>Navigation</h2>
                <p className="text-sm opacity-60 mt-1" style={{ color: textColor }}>Explore this experience</p>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-2">
                  {pages.map((page, index) => (
                    <a
                      key={page.id}
                      href={`#${page.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-6 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                      style={{
                        backgroundColor: currentPage === page.slug ? `${accentColor}20` : 'transparent',
                        borderLeft: currentPage === page.slug ? `4px solid ${accentColor}` : '4px solid transparent'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs opacity-40 mb-1" style={{ color: textColor }}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="text-xl font-semibold" style={{ color: textColor }}>
                            {page.title}
                          </div>
                        </div>
                        <ChevronRight 
                          className="w-5 h-5 opacity-0 group-hover:opacity-60 transition-opacity" 
                          style={{ color: textColor }}
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Custom Links */}
            <div className="w-1/2 flex flex-col">
              <div className="p-8 border-b border-white/10">
                <h2 className="text-2xl font-bold" style={{ color: textColor }}>
                  {rightPanelItems.length > 0 ? 'More to Explore' : 'Additional Resources'}
                </h2>
                <p className="text-sm opacity-60 mt-1" style={{ color: textColor }}>
                  {rightPanelItems.length > 0 ? 'Other experiences and external links' : 'No additional links configured'}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                {rightPanelItems.length > 0 ? (
                  <div className="space-y-4">
                    {rightPanelItems.map((link) => (
                      <a
                        key={link.id}
                        href={link.url || `#${link.experienceId}`}
                        target={link.type === 'external' ? '_blank' : undefined}
                        rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
                        onClick={() => link.type !== 'external' && setIsOpen(false)}
                        className="block p-6 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                        style={{
                          border: `1px solid ${accentColor}20`
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {link.icon && (
                            <div className="text-4xl flex-shrink-0">{link.icon}</div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold" style={{ color: textColor }}>
                                {link.title}
                              </h3>
                              {link.type === 'external' && (
                                <ExternalLink className="w-4 h-4 opacity-40" style={{ color: textColor }} />
                              )}
                            </div>
                            {link.description && (
                              <p className="text-sm opacity-70 mt-1" style={{ color: textColor }}>
                                {link.description}
                              </p>
                            )}
                            <div 
                              className="inline-block mt-3 text-sm font-medium group-hover:translate-x-1 transition-transform"
                              style={{ color: accentColor }}
                            >
                              {link.type === 'external' ? 'Visit →' : 'View →'}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm opacity-40" style={{ color: textColor }}>
                      No additional links configured
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
