'use client';

import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ExternalLink, FileText, ChevronDown } from 'lucide-react';
import { nanoid } from 'nanoid';
import { ColorPicker } from '@/components/ui/ColorPicker';

export interface MenuLink {
  id: string;
  icon?: string;
  title: string;
  url?: string;
  experienceId?: string;
  description?: string;
  type: 'experience' | 'external';
}

export interface MenuConfig {
  enabled: boolean;
  menuType: 'vertical-expanding' | 'burger' | 'fullscreen-split';
  position: 'top' | 'bottom' | 'left' | 'right';
  animation: 'slide-down' | 'slide-out' | 'fade' | 'scale';
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  rightPanelItems: MenuLink[];
}

interface MenuEditorPanelProps {
  config: MenuConfig;
  onChange: (config: MenuConfig) => void;
  onSave: () => void;
  saving?: boolean;
  changed?: boolean;
  pages?: Array<{ id: string; title: string; slug: string }>;
  selectedPageId?: string;
  onPageSelect?: (pageId: string) => void;
}

export function MenuEditorPanel({
  config,
  onChange,
  onSave,
  saving = false,
  changed = false,
  pages = [],
  selectedPageId,
  onPageSelect
}: MenuEditorPanelProps) {
  const [customLinksExpanded, setCustomLinksExpanded] = useState(true);
  
  const updateConfig = (updates: Partial<MenuConfig>) => {
    onChange({ ...config, ...updates });
  };

  const addLink = () => {
    const newLink: MenuLink = {
      id: nanoid(),
      title: 'New Link',
      type: 'external',
      url: '',
      description: ''
    };
    updateConfig({
      rightPanelItems: [...config.rightPanelItems, newLink]
    });
  };

  const updateLink = (id: string, updates: Partial<MenuLink>) => {
    updateConfig({
      rightPanelItems: config.rightPanelItems.map(link =>
        link.id === id ? { ...link, ...updates } : link
      )
    });
  };

  const deleteLink = (id: string) => {
    updateConfig({
      rightPanelItems: config.rightPanelItems.filter(link => link.id !== id)
    });
  };

  const moveLink = (id: string, direction: 'up' | 'down') => {
    const currentIndex = config.rightPanelItems.findIndex(link => link.id === id);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === config.rightPanelItems.length - 1) return;

    const newItems = [...config.rightPanelItems];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];

    updateConfig({ rightPanelItems: newItems });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Preview Page Selector */}
          {pages.length > 0 && onPageSelect && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview Page</label>
              <select
                value={selectedPageId || ''}
                onChange={(e) => onPageSelect(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500 mt-1">
                Test menu on different page backgrounds
              </p>
            </div>
          )}

          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded border border-zinc-700">
            <div>
              <label className="block text-sm font-medium">Menu Status</label>
              <p className="text-xs text-zinc-500 mt-1">
                {config.enabled ? 'Menu is visible' : 'Menu is hidden'}
              </p>
            </div>
            <button
              onClick={() => updateConfig({ enabled: !config.enabled })}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                config.enabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
              }`}
            >
              {config.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Menu Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Menu Type</label>
            <select
              value={config.menuType}
              onChange={(e) => updateConfig({ menuType: e.target.value as any })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
            >
              <option value="vertical-expanding">Vertical Expanding Sidebar</option>
              <option value="burger">Burger Menu</option>
              <option value="fullscreen-split">Fullscreen Split</option>
            </select>
            <p className="text-xs text-zinc-500 mt-1">
              {config.menuType === 'vertical-expanding' && 'Slim sidebar that expands on hover'}
              {config.menuType === 'burger' && 'Hamburger menu with overlay'}
              {config.menuType === 'fullscreen-split' && 'Full-screen two-panel menu'}
            </p>
          </div>

          {/* Position - Only for burger and vertical-expanding */}
          {config.menuType !== 'fullscreen-split' && (
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                value={config.position}
                onChange={(e) => updateConfig({ position: e.target.value as any })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
              >
                {config.menuType === 'vertical-expanding' ? (
                  <>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </>
                ) : (
                  <>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </>
                )}
              </select>
              {config.menuType === 'vertical-expanding' && (
                <p className="text-xs text-zinc-500 mt-1">Side where sidebar appears</p>
              )}
              {config.menuType === 'burger' && (
                <p className="text-xs text-zinc-500 mt-1">Where burger button appears</p>
              )}
            </div>
          )}

          {/* Animation - Only for burger and vertical-expanding */}
          {config.menuType !== 'fullscreen-split' && (
            <div>
              <label className="block text-sm font-medium mb-2">Animation</label>
              <select
                value={config.animation}
                onChange={(e) => updateConfig({ animation: e.target.value as any })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
              >
                <option value="slide-down">Slide Down</option>
                <option value="slide-out">Slide Out</option>
                <option value="fade">Fade In</option>
                <option value="scale">Scale Up</option>
              </select>
              {config.menuType === 'burger' && (
                <p className="text-xs text-zinc-500 mt-1">How menu overlay appears</p>
              )}
              {config.menuType === 'vertical-expanding' && (
                <p className="text-xs text-zinc-500 mt-1">Expansion animation style</p>
              )}
            </div>
          )}

          {/* Colors */}
          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-medium mb-4">Menu Colors</h3>
            <div className="space-y-3">
              <ColorPicker
                label="Background"
                value={config.backgroundColor}
                onChange={(value) => updateConfig({ backgroundColor: value })}
              />
              <ColorPicker
                label="Text"
                value={config.textColor}
                onChange={(value) => updateConfig({ textColor: value })}
              />
              <ColorPicker
                label="Accent"
                value={config.accentColor}
                onChange={(value) => updateConfig({ accentColor: value })}
              />
            </div>
          </div>

          {/* Custom Links Section */}
          <div className="border-t border-zinc-800 pt-4">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer"
              onClick={() => setCustomLinksExpanded(!customLinksExpanded)}
            >
              <div className="flex items-center gap-2">
                <ChevronDown 
                  className={`w-4 h-4 text-zinc-500 transition-transform ${
                    customLinksExpanded ? '' : '-rotate-90'
                  }`}
                />
                <div>
                  <h3 className="text-sm font-medium">Custom Links</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {config.menuType === 'fullscreen-split' 
                      ? 'Displayed in right panel' 
                      : 'Shown below pages'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addLink();
                  setCustomLinksExpanded(true); // Auto-expand when adding
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Link
              </button>
            </div>

            {/* Links List - Collapsible */}
            {customLinksExpanded && (
              <>
                {config.rightPanelItems.length === 0 ? (
                  <div className="p-6 bg-zinc-800/50 rounded border border-zinc-700 border-dashed text-center">
                    <p className="text-xs text-zinc-500">No custom links yet</p>
                  </div>
                ) : (
              <div className="space-y-3">
                {config.rightPanelItems.map((link, index) => (
                  <div
                    key={link.id}
                    className="p-3 bg-zinc-800 rounded border border-zinc-700"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-zinc-600 cursor-move" />
                        <span className="text-xs text-zinc-400">Link {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveLink(link.id, 'up')}
                          disabled={index === 0}
                          className="px-1.5 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveLink(link.id, 'down')}
                          disabled={index === config.rightPanelItems.length - 1}
                          className="px-1.5 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-1 text-red-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Link Type */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-1.5">Link Type</label>
                      <select
                        value={link.type}
                        onChange={(e) => updateLink(link.id, { 
                          type: e.target.value as any,
                          ...(e.target.value === 'external' ? { experienceId: undefined } : { url: undefined })
                        })}
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm"
                      >
                        <option value="experience">Experience</option>
                        <option value="external">External URL</option>
                      </select>
                    </div>

                    {/* Icon (emoji) */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-1.5">Icon (Emoji)</label>
                      <input
                        type="text"
                        value={link.icon || ''}
                        onChange={(e) => updateLink(link.id, { icon: e.target.value })}
                        placeholder="🔗 (optional)"
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm"
                        maxLength={2}
                      />
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-1.5">Title</label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, { title: e.target.value })}
                        placeholder="Link title"
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm"
                      />
                    </div>

                    {/* URL or Experience ID */}
                    {link.type === 'external' ? (
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1.5">URL</label>
                        <input
                          type="url"
                          value={link.url || ''}
                          onChange={(e) => updateLink(link.id, { url: e.target.value })}
                          placeholder="https://example.com"
                          className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm font-mono"
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1.5">Experience ID</label>
                        <input
                          type="text"
                          value={link.experienceId || ''}
                          onChange={(e) => updateLink(link.id, { experienceId: e.target.value })}
                          placeholder="experience-slug"
                          className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm font-mono"
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Description</label>
                      <textarea
                        value={link.description || ''}
                        onChange={(e) => updateLink(link.id, { description: e.target.value })}
                        placeholder="Optional description"
                        rows={2}
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Save Button Footer */}
      <div className="border-t border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/50">
        <div className="text-xs text-zinc-500">
          {changed && '● Unsaved changes'}
        </div>
        <button
          onClick={onSave}
          disabled={saving || !changed}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {saving ? 'Saving...' : 'Save Menu'}
        </button>
      </div>
    </div>
  );
}
