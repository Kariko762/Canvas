'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Save, Search } from 'lucide-react';
import { nanoid } from 'nanoid';
import * as LucideIcons from 'lucide-react';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridEditorProps {
  features: Feature[];
  onSave: (features: Feature[]) => void;
  onClose: () => void;
}

// Popular icon options
const POPULAR_ICONS = [
  'Zap', 'Shield', 'Users', 'Target', 'TrendingUp', 'Award',
  'CheckCircle', 'Lock', 'Clock', 'Globe', 'Heart', 'Star',
  'Rocket', 'Settings', 'Code', 'Database', 'Cloud', 'Cpu',
  'BarChart', 'PieChart', 'LineChart', 'Activity', 'Bell', 'Mail'
];

export function FeatureGridEditor({ features: initialFeatures, onSave, onClose }: FeatureGridEditorProps) {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    initialFeatures[0]?.id || null
  );
  const [iconSearch, setIconSearch] = useState('');

  const selectedFeature = features.find(f => f.id === selectedFeatureId);

  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: nanoid(),
      icon: 'Box',
      title: `Feature ${features.length + 1}`,
      description: 'Enter feature description here...'
    };
    setFeatures([...features, newFeature]);
    setSelectedFeatureId(newFeature.id);
  };

  const handleDeleteFeature = (featureId: string) => {
    const newFeatures = features.filter(f => f.id !== featureId);
    setFeatures(newFeatures);
    if (selectedFeatureId === featureId) {
      setSelectedFeatureId(newFeatures[0]?.id || null);
    }
  };

  const handleUpdateFeature = (featureId: string, field: keyof Feature, value: string) => {
    setFeatures(prev => prev.map(f =>
      f.id === featureId ? { ...f, [field]: value } : f
    ));
  };

  const filteredIcons = POPULAR_ICONS.filter(icon =>
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Feature Grid Editor</h1>
          <span className="text-sm text-zinc-500">{features.length} features</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave(features)}
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
        {/* Left Sidebar - Features List */}
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleAddFeature}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {features.map((feature, index) => {
              const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Box;

              return (
                <div
                  key={feature.id}
                  className={`mb-2 p-3 rounded cursor-pointer transition-colors ${
                    selectedFeatureId === feature.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                  onClick={() => setSelectedFeatureId(feature.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs opacity-70 mb-1">Feature {index + 1}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent size={16} />
                        <div className="text-sm font-medium truncate">{feature.title}</div>
                      </div>
                      <div className="text-xs opacity-70 line-clamp-2">{feature.description}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFeature(feature.id);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center - Preview Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-lg font-semibold mb-6 text-white">Feature Grid Preview</h2>
              <div className="grid grid-cols-3 gap-6">
                {features.map((feature) => {
                  const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Box;

                  return (
                    <div
                      key={feature.id}
                      className={`p-6 rounded-lg bg-slate-800 border transition-all cursor-pointer ${
                        selectedFeatureId === feature.id
                          ? 'border-blue-500 ring-2 ring-blue-500'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => setSelectedFeatureId(feature.id)}
                    >
                      <div className="mb-4">
                        <IconComponent size={40} className="text-purple-500" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-white/80 leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          {selectedFeature ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Feature Properties</h2>
                  <p className="text-sm text-zinc-500">Feature {features.findIndex(f => f.id === selectedFeature.id) + 1}</p>
                </div>
                <button
                  onClick={() => handleDeleteFeature(selectedFeature.id)}
                  className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
                      placeholder="Search icons..."
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-zinc-800 rounded">
                    {filteredIcons.map((iconName) => {
                      const IconComponent = (LucideIcons as any)[iconName];
                      const isSelected = selectedFeature.icon === iconName;
                      
                      return (
                        <button
                          key={iconName}
                          onClick={() => handleUpdateFeature(selectedFeature.id, 'icon', iconName)}
                          className={`p-3 rounded transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                          }`}
                          title={iconName}
                        >
                          <IconComponent size={20} />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Selected: {selectedFeature.icon}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedFeature.title}
                    onChange={(e) => handleUpdateFeature(selectedFeature.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                    placeholder="Feature title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={selectedFeature.description}
                    onChange={(e) => handleUpdateFeature(selectedFeature.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                    rows={4}
                    placeholder="Feature description"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500">
              <p className="text-sm">Select a feature to edit</p>
              <p className="text-xs mt-2">or add a new one using the button on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
