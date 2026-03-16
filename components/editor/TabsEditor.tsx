'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Save, Settings } from 'lucide-react';
import { nanoid } from 'nanoid';
import { MechanicsToolbar } from '@/components/editor/MechanicsToolbar';
import { getMechanic, createMechanicInstance } from '@/lib/mechanics-registry';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { CanvasEditor, type MechanicInstance } from '@/components/editor/CanvasEditor';
import { PropertyEditor } from '@/components/editor/PropertyEditor';

interface TabControlSettings {
  backgroundColor: string;
  pageWidth: number;
  pageHeight: number;
  tabBarBackgroundColor: string;
  tabStyle: 'underline' | 'pills' | 'rounded' | 'minimal';
  tabPosition: 'top' | 'bottom' | 'left' | 'right';
  activeColor: string;
  inactiveColor: string;
  textColor: string;
  borderColor: string;
  tabSpacing: number;
}

interface Tab {
  id: string;
  label: string;
  mechanics: MechanicInstance[];
}

interface TabsEditorProps {
  tabs: Tab[];
  settings?: Partial<TabControlSettings>;
  availableModals?: Array<{ id: string; title: string; slug: string }>;
  onSave: (tabs: Tab[], settings: TabControlSettings) => void;
  onClose: () => void;
}

export function TabsEditor({ tabs: initialTabs, settings: initialSettings, availableModals, onSave, onClose }: TabsEditorProps) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [viewMode, setViewMode] = useState<'control' | 'tab'>('control');
  const [selectedTabId, setSelectedTabId] = useState<string | null>(
    initialTabs[0]?.id || null
  );
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [tabControlSettings, setTabControlSettings] = useState<TabControlSettings>({
    backgroundColor: initialSettings?.backgroundColor || '#ffffff',
    pageWidth: initialSettings?.pageWidth || 1200,
    pageHeight: initialSettings?.pageHeight || 800,
    tabBarBackgroundColor: initialSettings?.tabBarBackgroundColor || '#f3f4f6',
    tabStyle: initialSettings?.tabStyle || 'underline',
    tabPosition: initialSettings?.tabPosition || 'top',
    activeColor: initialSettings?.activeColor || '#3b82f6',
    inactiveColor: initialSettings?.inactiveColor || '#64748b',
    textColor: initialSettings?.textColor || '#1f2937',
    borderColor: initialSettings?.borderColor || '#e5e7eb',
    tabSpacing: initialSettings?.tabSpacing || 8,
  });
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);

  const selectedTab = tabs.find(t => t.id === selectedTabId);
  const mechanics = selectedTab?.mechanics || [];
  const selectedMechanic = mechanics.find(m => m.id === selectedMechanicId);

  const handleTabControlChange = (key: keyof TabControlSettings, value: any) => {
    setTabControlSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddTab = () => {
    const newTab: Tab = {
      id: nanoid(),
      label: `Tab ${tabs.length + 1}`,
      mechanics: []
    };
    setTabs([...tabs, newTab]);
    setSelectedTabId(newTab.id);
    setViewMode('tab');
  };

  const handleDeleteTab = (tabId: string) => {
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (selectedTabId === tabId) {
      setSelectedTabId(newTabs[0]?.id || null);
    }
  };

  const handleUpdateTabLabel = (tabId: string, label: string) => {
    setTabs(prev => prev.map(t =>
      t.id === tabId ? { ...t, label } : t
    ));
  };

  const handleAddMechanic = (type: string) => {
    if (!selectedTabId) return;
    
    const maxLayer = mechanics.length > 0 ? Math.max(...mechanics.map(m => m.layer)) : 0;
    const newMechanic = {
      ...createMechanicInstance(type, nanoid(), 100, 100),
      layer: maxLayer + 1,
      width: 200,
      height: 100
    };
    setTabs(prev => prev.map(tab =>
      tab.id === selectedTabId
        ? { ...tab, mechanics: [...tab.mechanics, newMechanic] }
        : tab
    ));
  };

  const handleDeleteMechanic = (mechanicId: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === selectedTabId
        ? { ...tab, mechanics: tab.mechanics.filter(m => m.id !== mechanicId) }
        : tab
    ));
    if (selectedMechanicId === mechanicId) {
      setSelectedMechanicId(null);
    }
  };

  const handleMechanicPropChange = (propName: string, value: any) => {
    if (!selectedMechanicId || !selectedTabId) return;
    
    setTabs(prev => prev.map(tab =>
      tab.id === selectedTabId
        ? {
            ...tab,
            mechanics: tab.mechanics.map(m =>
              m.id === selectedMechanicId
                ? { ...m, props: { ...m.props, [propName]: value } }
                : m
            )
          }
        : tab
    ));
  };

  const handleMechanicsChange = (updatedMechanics: MechanicInstance[]) => {
    if (!selectedTabId) return;
    setTabs(prev => prev.map(tab =>
      tab.id === selectedTabId
        ? { ...tab, mechanics: updatedMechanics }
        : tab
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
      <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Tabs Editor</h1>
          <span className="text-sm text-zinc-500">{tabs.length} tabs</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave(tabs, tabControlSettings)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save & Close
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleAddTab}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Tab
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div
              className={`mb-2 p-3 rounded cursor-pointer transition-colors ${
                viewMode === 'control'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
              onClick={() => {
                setViewMode('control');
                setSelectedMechanicId(null);
              }}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">TAB CONTROL</div>
                  <div className="text-xs opacity-60 mt-0.5">Global Settings</div>
                </div>
              </div>
            </div>

            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`mb-2 p-3 rounded cursor-pointer transition-colors ${
                  viewMode === 'tab' && selectedTabId === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
                onClick={() => {
                  setViewMode('tab');
                  setSelectedTabId(tab.id);
                  setSelectedMechanicId(null);
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs opacity-70 mb-1">Tab {index + 1}</div>
                    {editingTabId === tab.id ? (
                      <input
                        type="text"
                        value={tab.label}
                        onChange={(e) => {
                          handleUpdateTabLabel(tab.id, e.target.value);
                        }}
                        onBlur={() => setEditingTabId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingTabId(null);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className={`w-full text-sm font-medium bg-zinc-700 border border-zinc-600 rounded px-2 py-1 outline-none focus:border-blue-500 ${
                          viewMode === 'tab' && selectedTabId === tab.id ? 'text-white' : 'text-zinc-300'
                        }`}
                      />
                    ) : (
                      <div
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingTabId(tab.id);
                        }}
                        className={`text-sm font-medium ${
                          viewMode === 'tab' && selectedTabId === tab.id ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {tab.label}
                      </div>
                    )}
                    <div className="text-xs opacity-60 mt-1">
                      {tab.mechanics.length} elements
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTab(tab.id);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          {viewMode === 'control' ? (
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Tab Control Settings</h2>
                <div className="bg-zinc-900 rounded-lg p-6 space-y-6">
                  {/* TAB PAGES SECTION */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tab Pages</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Dimensions</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Width (px)</label>
                            <input
                              type="number"
                              value={tabControlSettings.pageWidth}
                              onChange={(e) => handleTabControlChange('pageWidth', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Height (px)</label>
                            <input
                              type="number"
                              value={tabControlSettings.pageHeight}
                              onChange={(e) => handleTabControlChange('pageHeight', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          </div>
                        </div>
                      </div>
                      <ColorPicker
                        label="Pages Background"
                        value={tabControlSettings.backgroundColor}
                        onChange={(color) => handleTabControlChange('backgroundColor', color)}
                      />
                      <ColorPicker
                        label="Text Color"
                        value={tabControlSettings.textColor}
                        onChange={(color) => handleTabControlChange('textColor', color)}
                      />
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-zinc-700"></div>

                  {/* TAB BAR SECTION */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tab Bar</h3>
                    <div className="space-y-4">
                      <ColorPicker
                        label="Tab Bar Background"
                        value={tabControlSettings.tabBarBackgroundColor}
                        onChange={(color) => handleTabControlChange('tabBarBackgroundColor', color)}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">Tab Style</label>
                        <select
                          value={tabControlSettings.tabStyle}
                          onChange={(e) => handleTabControlChange('tabStyle', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                        >
                          <option value="underline">Underline</option>
                          <option value="pills">Pills</option>
                          <option value="rounded">Rounded</option>
                          <option value="minimal">Minimal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tab Position</label>
                        <select
                          value={tabControlSettings.tabPosition}
                          onChange={(e) => handleTabControlChange('tabPosition', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                        >
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tab Spacing (px)</label>
                        <input
                          type="number"
                          value={tabControlSettings.tabSpacing}
                          onChange={(e) => handleTabControlChange('tabSpacing', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                          min="0"
                          max="32"
                        />
                      </div>
                      <ColorPicker
                        label="Active Tab Color"
                        value={tabControlSettings.activeColor}
                        onChange={(color) => handleTabControlChange('activeColor', color)}
                      />
                      <ColorPicker
                        label="Inactive Tab Color"
                        value={tabControlSettings.inactiveColor}
                        onChange={(color) => handleTabControlChange('inactiveColor', color)}
                      />
                      <ColorPicker
                        label="Border Color"
                        value={tabControlSettings.borderColor}
                        onChange={(color) => handleTabControlChange('borderColor', color)}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Preview</h3>
                    <div 
                      className="border-2 border-zinc-700 rounded-lg overflow-hidden"
                    >
                      <div 
                        style={{ 
                          display: 'flex',
                          flexDirection: tabControlSettings.tabPosition === 'top' || tabControlSettings.tabPosition === 'bottom' ? 'row' : 'column',
                          borderBottom: (tabControlSettings.tabPosition === 'top' || tabControlSettings.tabPosition === 'bottom') && tabControlSettings.tabStyle === 'underline' ? `2px solid ${tabControlSettings.borderColor}` : 'none',
                          borderRight: (tabControlSettings.tabPosition === 'left' || tabControlSettings.tabPosition === 'right') && tabControlSettings.tabStyle === 'underline' ? `2px solid ${tabControlSettings.borderColor}` : 'none',
                          padding: `${tabControlSettings.tabSpacing}px`,
                          backgroundColor: tabControlSettings.tabBarBackgroundColor,
                        }}
                      >
                        {tabs.slice(0, 3).map((tab, index) => {
                          const isActive = index === 0;
                          const isHorizontal = tabControlSettings.tabPosition === 'top' || tabControlSettings.tabPosition === 'bottom';
                          
                          let buttonStyle: React.CSSProperties = {
                            padding: `${tabControlSettings.tabSpacing}px ${tabControlSettings.tabSpacing * 2}px`,
                            transition: 'all 0.3s ease',
                            color: isActive ? tabControlSettings.activeColor : tabControlSettings.inactiveColor,
                            fontWeight: isActive ? 600 : 400,
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                          };

                          switch (tabControlSettings.tabStyle) {
                            case 'pills':
                              buttonStyle = {
                                ...buttonStyle,
                                backgroundColor: isActive ? tabControlSettings.activeColor : 'transparent',
                                color: isActive ? '#ffffff' : tabControlSettings.inactiveColor,
                                borderRadius: '9999px',
                                marginRight: isHorizontal ? `${tabControlSettings.tabSpacing}px` : '0',
                                marginBottom: !isHorizontal ? `${tabControlSettings.tabSpacing}px` : '0'
                              };
                              break;
                            case 'rounded':
                              buttonStyle = {
                                ...buttonStyle,
                                backgroundColor: isActive ? tabControlSettings.activeColor : 'transparent',
                                color: isActive ? '#ffffff' : tabControlSettings.inactiveColor,
                                borderRadius: '8px',
                                marginRight: isHorizontal ? `${tabControlSettings.tabSpacing}px` : '0',
                                marginBottom: !isHorizontal ? `${tabControlSettings.tabSpacing}px` : '0'
                              };
                              break;
                            case 'minimal':
                              buttonStyle = {
                                ...buttonStyle,
                                color: isActive ? tabControlSettings.activeColor : tabControlSettings.inactiveColor,
                                fontWeight: isActive ? 700 : 400,
                                marginRight: isHorizontal ? `${tabControlSettings.tabSpacing * 2}px` : '0',
                                marginBottom: !isHorizontal ? `${tabControlSettings.tabSpacing}px` : '0'
                              };
                              break;
                            case 'underline':
                            default:
                              buttonStyle = {
                                ...buttonStyle,
                                color: isActive ? tabControlSettings.activeColor : tabControlSettings.inactiveColor,
                                borderBottom: isHorizontal ? `3px solid ${isActive ? tabControlSettings.activeColor : 'transparent'}` : 'none',
                                borderLeft: !isHorizontal ? `3px solid ${isActive ? tabControlSettings.activeColor : 'transparent'}` : 'none',
                                marginRight: isHorizontal ? `${tabControlSettings.tabSpacing}px` : '0',
                                marginBottom: !isHorizontal ? `${tabControlSettings.tabSpacing}px` : '0'
                              };
                          }

                          return (
                            <div
                              key={tab.id}
                              className="text-sm font-medium"
                              style={buttonStyle}
                            >
                              {tab.label}
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-8 text-center text-sm" style={{ color: tabControlSettings.textColor, backgroundColor: tabControlSettings.backgroundColor }}>
                        Content area with background color
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedTab ? (
            <>
              <MechanicsToolbar
                onAddMechanic={(type) => {
                  handleAddMechanic(type);
                }}
              />
              <CanvasEditor
                mechanics={mechanics}
                onMechanicsChange={handleMechanicsChange}
                selectedMechanicId={selectedMechanicId}
                onSelectMechanic={setSelectedMechanicId}
                canvasWidth={tabControlSettings.pageWidth}
                canvasHeight={tabControlSettings.pageHeight}
                backgroundColor={tabControlSettings.backgroundColor}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <p className="text-lg mb-2">No tab selected</p>
                <p className="text-sm">Add a tab to get started</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          {viewMode === 'control' ? (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tab Control Properties</h2>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>Configure global settings for all tabs in this component.</p>
                <div className="pt-4 border-t border-zinc-800">
                  <p className="font-medium text-zinc-300 mb-2">Current Settings:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• {tabs.length} tabs</li>
                    <li>• {tabControlSettings.pageWidth} × {tabControlSettings.pageHeight}px pages</li>
                    <li>• Style: {tabControlSettings.tabStyle}, Position: {tabControlSettings.tabPosition}</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : selectedMechanic ? (
            <PropertyEditor
              mechanic={selectedMechanic}
              onPropChange={handleMechanicPropChange}
              onMechanicChange={(updated) => {
                if (!selectedTabId) return;
                setTabs(prev => prev.map(tab =>
                  tab.id === selectedTabId
                    ? {
                        ...tab,
                        mechanics: tab.mechanics.map(m =>
                          m.id === updated.id ? updated : m
                        )
                      }
                    : tab
                ));
              }}
              onDelete={() => {
                if (!selectedMechanicId) return;
                handleDeleteMechanic(selectedMechanicId);
              }}
              additionalData={{ modals: availableModals }}
            />
          ) : selectedTab ? (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tab Properties</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Tab Label</label>
                <input
                  type="text"
                  value={selectedTab.label}
                  onChange={(e) => handleUpdateTabLabel(selectedTab.id, e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                />
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-800 text-sm text-zinc-400">
                <p>Add elements to this tab using the toolbar above.</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500">
              <p className="text-sm">Select a tab or element to edit properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
