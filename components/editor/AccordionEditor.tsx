'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer';
import { MechanicsToolbar } from '@/components/editor/MechanicsToolbar';
import { getMechanic, createMechanicInstance } from '@/lib/mechanics-registry';
import { ColorPicker } from '@/components/ui/ColorPicker';

interface AccordionSection {
  id: string;
  title: string;
  mechanics: MechanicInstance[];
}

interface MechanicInstance {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  layer: number;
  props: Record<string, any>;
}

interface AccordionEditorProps {
  sections: AccordionSection[];
  onSave: (sections: AccordionSection[]) => void;
  onClose: () => void;
}

export function AccordionEditor({ sections: initialSections, onSave, onClose }: AccordionEditorProps) {
  const [sections, setSections] = useState<AccordionSection[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialSections[0]?.id || null
  );
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);
  const [draggingMechanicId, setDraggingMechanicId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showMechanicPicker, setShowMechanicPicker] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const mechanics = selectedSection?.mechanics || [];
  const selectedMechanic = mechanics.find(m => m.id === selectedMechanicId);

  // Handle window-level mouse events for dragging
  useEffect(() => {
    if (!draggingMechanicId) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 50));
      const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 50));

      setSections(prev => prev.map(section =>
        section.id === selectedSectionId
          ? {
              ...section,
              mechanics: section.mechanics.map(m =>
                m.id === draggingMechanicId ? { ...m, x, y } : m
              )
            }
          : section
      ));
    };

    const handleWindowMouseUp = () => {
      setDraggingMechanicId(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggingMechanicId, dragOffset, selectedSectionId]);

  const handleAddSection = () => {
    const newSection: AccordionSection = {
      id: nanoid(),
      title: `Section ${sections.length + 1}`,
      mechanics: []
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
    const newSections = sections.filter(s => s.id !== sectionId);
    setSections(newSections);
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(newSections[0]?.id || null);
    }
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, title } : s
    ));
  };

  const handleAddMechanic = (type: string) => {
    if (!selectedSectionId) return;
    
    const maxLayer = mechanics.length > 0 ? Math.max(...mechanics.map(m => m.layer)) : 0;
    const newMechanic = {
      ...createMechanicInstance(type, nanoid(), 100, 100),
      layer: maxLayer + 1,
      width: 200,
      height: 100
    };
    setSections(prev => prev.map(section =>
      section.id === selectedSectionId
        ? { ...section, mechanics: [...section.mechanics, newMechanic] }
        : section
    ));
    setShowMechanicPicker(false);
  };

  const handleDeleteMechanic = (mechanicId: string) => {
    setSections(prev => prev.map(section =>
      section.id === selectedSectionId
        ? { ...section, mechanics: section.mechanics.filter(m => m.id !== mechanicId) }
        : section
    ));
    if (selectedMechanicId === mechanicId) {
      setSelectedMechanicId(null);
    }
  };

  const handleMechanicPropChange = (propName: string, value: any) => {
    if (!selectedMechanicId || !selectedSectionId) return;
    
    setSections(prev => prev.map(section =>
      section.id === selectedSectionId
        ? {
            ...section,
            mechanics: section.mechanics.map(m =>
              m.id === selectedMechanicId
                ? { ...m, props: { ...m.props, [propName]: value } }
                : m
            )
          }
        : section
    ));
  };

  const handleMechanicPositionChange = (mechanicId: string, prop: string, value: any) => {
    setSections(prev => prev.map(section =>
      section.id === selectedSectionId
        ? {
            ...section,
            mechanics: section.mechanics.map(m =>
              m.id === mechanicId ? { ...m, [prop]: value } : m
            )
          }
        : section
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Accordion Editor</h1>
          <span className="text-sm text-zinc-500">{sections.length} sections</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave(sections)}
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sections List */}
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleAddSection}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`mb-2 p-3 rounded cursor-pointer transition-colors ${
                  selectedSectionId === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
                onClick={() => {
                  setSelectedSectionId(section.id);
                  setSelectedMechanicId(null);
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs opacity-70 mb-1">Section {index + 1}</div>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleUpdateSectionTitle(section.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-full text-sm font-medium bg-transparent border-none outline-none ${
                        selectedSectionId === section.id ? 'text-white' : 'text-zinc-300'
                      }`}
                    />
                    <div className="text-xs opacity-60 mt-1">
                      {section.mechanics.length} elements
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
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

        {/* Center - Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          {selectedSection ? (
            <>
              {/* Toolbar */}
              <MechanicsToolbar
                onAddMechanic={(type) => {
                  handleAddMechanic(type);
                }}
              />

              {/* Canvas */}
              <div className="flex-1 overflow-auto p-8">
                <div
                  ref={canvasRef}
                  className="relative mx-auto bg-white"
                  style={{
                    width: '1200px',
                    height: '800px',
                    boxShadow: '0 0 60px rgba(0,0,0,0.5)'
                  }}
                  onClick={() => setSelectedMechanicId(null)}
                >
                  {mechanics.map((mechanic) => {
                    const isSelected = mechanic.id === selectedMechanicId;
                    const isDragging = mechanic.id === draggingMechanicId;
                    
                    return (
                      <div
                        key={mechanic.id}
                        className={`absolute ${isDragging ? 'opacity-70' : ''} ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{
                          left: mechanic.x,
                          top: mechanic.y,
                          width: mechanic.width || 200,
                          height: mechanic.height || 100,
                          cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMechanicId(mechanic.id);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDraggingMechanicId(mechanic.id);
                          setSelectedMechanicId(mechanic.id);
                          
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDragOffset({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top,
                          });
                        }}
                      >
                        <MechanicRenderer
                          mechanic={mechanic}
                          mode="edit"
                        />
                        {isSelected && (
                          <div className="absolute -top-6 left-0 text-xs bg-blue-600 text-white px-2 py-1 rounded pointer-events-none">
                            {mechanic.name || getMechanic(mechanic.type)?.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <p className="text-lg mb-2">No section selected</p>
                <p className="text-sm">Add a section to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          {selectedMechanic ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Properties</h2>
                  <p className="text-sm text-zinc-500 capitalize">{selectedMechanic.type}</p>
                </div>
                <button
                  onClick={() => handleDeleteMechanic(selectedMechanic.id)}
                  className="p-2 text-red-500 hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Object Name</label>
                  <input
                    type="text"
                    value={selectedMechanic.name}
                    onChange={(e) => handleMechanicPositionChange(selectedMechanic.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">X</label>
                    <input
                      type="number"
                      value={selectedMechanic.x}
                      onChange={(e) => handleMechanicPositionChange(selectedMechanic.id, 'x', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Y</label>
                    <input
                      type="number"
                      value={selectedMechanic.y}
                      onChange={(e) => handleMechanicPositionChange(selectedMechanic.id, 'y', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                    />
                  </div>
                </div>

                {/* Mechanic-Specific Properties */}
                {(() => {
                  const definition = getMechanic(selectedMechanic.type);
                  if (!definition) return null;
                  
                  const propertyEntries = Object.entries(definition.properties);
                  if (propertyEntries.length === 0) return null;
                  
                  return (
                    <div className="pt-4 border-t border-zinc-800 space-y-4">
                      {propertyEntries.map(([propName, propDef]) => (
                        <div key={propName}>
                          <label className="block text-sm font-medium mb-2">{propDef.label}</label>
                          
                          {propDef.type === 'text' && (
                            <input
                              type="text"
                              value={selectedMechanic.props[propName] || ''}
                              onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          )}
                          
                          {propDef.type === 'textarea' && (
                            <textarea
                              value={selectedMechanic.props[propName] || ''}
                              onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          )}
                          
                          {propDef.type === 'number' && (
                            <input
                              type="number"
                              value={selectedMechanic.props[propName] || 0}
                              onChange={(e) => handleMechanicPropChange(propName, parseFloat(e.target.value))}
                              min={propDef.min}
                              max={propDef.max}
                              step={propDef.step}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          )}
                          
                          {propDef.type === 'color' && (
                            <ColorPicker
                              value={selectedMechanic.props[propName] || '#ffffff'}
                              onChange={(color) => handleMechanicPropChange(propName, color)}
                            />
                          )}
                          
                          {propDef.type === 'select' && (
                            <select
                              value={selectedMechanic.props[propName] || propDef.defaultValue}
                              onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                            >
                              {propDef.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          )}
                          
                          {propDef.type === 'toggle' && (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedMechanic.props[propName] || false}
                                onChange={(e) => handleMechanicPropChange(propName, e.target.checked)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-zinc-400">Enabled</span>
                            </label>
                          )}
                          
                          {propDef.help && (
                            <p className="text-xs text-zinc-500 mt-1">{propDef.help}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : selectedSection ? (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Section Properties</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <input
                  type="text"
                  value={selectedSection.title}
                  onChange={(e) => handleUpdateSectionTitle(selectedSection.id, e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded"
                />
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-800 text-sm text-zinc-400">
                <p>Add elements to this section using the toolbar above.</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500">
              <p className="text-sm">Select a section or element to edit properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
