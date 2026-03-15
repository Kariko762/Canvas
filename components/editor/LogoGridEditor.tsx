'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { nanoid } from 'nanoid';

interface Logo {
  id: string;
  url: string;
  name: string;
  link?: string;
}

interface LogoGridEditorProps {
  logos: Logo[];
  onSave: (logos: Logo[]) => void;
  onClose: () => void;
}

export function LogoGridEditor({ logos: initialLogos, onSave, onClose }: LogoGridEditorProps) {
  const [logos, setLogos] = useState<Logo[]>(initialLogos);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(
    initialLogos[0]?.id || null
  );

  const selectedLogo = logos.find(l => l.id === selectedLogoId);

  const handleAddLogo = () => {
    const newLogo: Logo = {
      id: nanoid(),
      url: 'https://via.placeholder.com/150',
      name: `Logo ${logos.length + 1}`,
      link: ''
    };
    setLogos([...logos, newLogo]);
    setSelectedLogoId(newLogo.id);
  };

  const handleDeleteLogo = (logoId: string) => {
    const newLogos = logos.filter(l => l.id !== logoId);
    setLogos(newLogos);
    if (selectedLogoId === logoId) {
      setSelectedLogoId(newLogos[0]?.id || null);
    }
  };

  const handleUpdateLogo = (logoId: string, field: keyof Logo, value: string) => {
    setLogos(prev => prev.map(l =>
      l.id === logoId ? { ...l, [field]: value } : l
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Logo Grid Editor</h1>
          <span className="text-sm text-zinc-500">{logos.length} logos</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave(logos)}
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
        {/* Left Sidebar - Logos List */}
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleAddLogo}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Logo
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {logos.map((logo, index) => (
              <div
                key={logo.id}
                className={`mb-2 p-3 rounded cursor-pointer transition-colors ${
                  selectedLogoId === logo.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
                onClick={() => setSelectedLogoId(logo.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs opacity-70 mb-1">Logo {index + 1}</div>
                    <div className="text-sm font-medium truncate">{logo.name}</div>
                    {logo.url && (
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="w-full h-12 object-contain mt-2 bg-white rounded"
                      />
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLogo(logo.id);
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

        {/* Center - Preview Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold mb-6 text-white">Logo Grid Preview</h2>
              <div className="grid grid-cols-4 gap-6 p-8 bg-white rounded-lg">
                {logos.map((logo) => (
                  <div
                    key={logo.id}
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedLogoId === logo.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                    onClick={() => setSelectedLogoId(logo.id)}
                  >
                    {logo.url ? (
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="w-full h-20 object-contain grayscale hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <div className="w-full h-20 flex items-center justify-center bg-zinc-100 rounded text-zinc-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          {selectedLogo ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Logo Properties</h2>
                  <p className="text-sm text-zinc-500">Logo {logos.findIndex(l => l.id === selectedLogo.id) + 1}</p>
                </div>
                <button
                  onClick={() => handleDeleteLogo(selectedLogo.id)}
                  className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo Name</label>
                  <input
                    type="text"
                    value={selectedLogo.name}
                    onChange={(e) => handleUpdateLogo(selectedLogo.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <textarea
                    value={selectedLogo.url}
                    onChange={(e) => handleUpdateLogo(selectedLogo.id, 'url', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
                    rows={3}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-zinc-500 mt-1">URL to the logo image</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link (Optional)</label>
                  <input
                    type="text"
                    value={selectedLogo.link || ''}
                    onChange={(e) => handleUpdateLogo(selectedLogo.id, 'link', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
                    placeholder="https://company.com"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Optional link when logo is clicked</p>
                </div>

                {selectedLogo.url && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Preview</label>
                    <div className="w-full p-4 bg-white rounded border border-zinc-700">
                      <img
                        src={selectedLogo.url}
                        alt={selectedLogo.name}
                        className="w-full h-24 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500">
              <p className="text-sm">Select a logo to edit its properties</p>
              <p className="text-xs mt-2">or add a new logo using the button on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
