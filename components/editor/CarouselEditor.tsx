import React, { useState } from 'react';
import { X, Plus, Trash2, MoveUp, MoveDown, Image as ImageIcon } from 'lucide-react';

interface Slide {
  id: string;
  type: 'image';
  imageUrl: string;
  caption?: string;
}

interface CarouselEditorProps {
  slides: Slide[];
  onSave: (slides: Slide[]) => void;
  onClose: () => void;
}

export default function CarouselEditor({ slides, onSave, onClose }: CarouselEditorProps) {
  const [localSlides, setLocalSlides] = useState<Slide[]>(slides);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type: 'image',
      imageUrl: 'https://picsum.photos/800/400?random=' + Date.now(),
      caption: 'New Slide'
    };
    setLocalSlides([...localSlides, newSlide]);
    setSelectedSlideIndex(localSlides.length);
  };

  const removeSlide = (index: number) => {
    const updated = localSlides.filter((_, i) => i !== index);
    setLocalSlides(updated);
    if (selectedSlideIndex >= updated.length) {
      setSelectedSlideIndex(Math.max(0, updated.length - 1));
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === localSlides.length - 1)) return;
    const updated = [...localSlides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setLocalSlides(updated);
    setSelectedSlideIndex(newIndex);
  };

  const updateSlide = (index: number, field: keyof Slide, value: any) => {
    const updated = [...localSlides];
    updated[index] = { ...updated[index], [field]: value };
    setLocalSlides(updated);
  };

  const handleSave = () => {
    onSave(localSlides);
    onClose();
  };

  const selectedSlide = localSlides[selectedSlideIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex">
      {/* Left Sidebar - Slide List */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Slides</h2>
          <button
            onClick={addSlide}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
            title="Add Slide"
          >
            <Plus size={20} className="text-zinc-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {localSlides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => setSelectedSlideIndex(index)}
              className={`p-3 border-b border-zinc-800 cursor-pointer transition-colors ${
                selectedSlideIndex === index ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={16} className="text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white text-sm truncate block">
                    {slide.caption || `Slide ${index + 1}`}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveSlide(index, 'up'); }}
                    disabled={index === 0}
                    className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30"
                  >
                    <MoveUp size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveSlide(index, 'down'); }}
                    disabled={index === localSlides.length - 1}
                    className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30"
                  >
                    <MoveDown size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSlide(index); }}
                    className="p-1 hover:bg-red-900/50 rounded"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Live Preview */}
      <div className="flex-1 bg-zinc-950 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            {localSlides.length === 0 ? (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-500">
                <p>No slides added</p>
              </div>
            ) : (
              <>
                <img
                  src={selectedSlide.imageUrl}
                  alt={selectedSlide.caption || `Slide ${selectedSlideIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {selectedSlide.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 text-white text-center">
                    {selectedSlide.caption}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {localSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlideIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedSlideIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedSlide && (
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Image URL</label>
              <input
                type="text"
                value={selectedSlide.imageUrl}
                onChange={(e) => updateSlide(selectedSlideIndex, 'imageUrl', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Image Preview</label>
              {selectedSlide.imageUrl ? (
                <div className="w-full h-32 bg-zinc-800 rounded overflow-hidden">
                  <img
                    src={selectedSlide.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-32 bg-zinc-800 rounded flex items-center justify-center">
                  <ImageIcon size={32} className="text-zinc-600" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Caption (Optional)</label>
              <textarea
                value={selectedSlide.caption || ''}
                onChange={(e) => updateSlide(selectedSlideIndex, 'caption', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm resize-none"
                rows={3}
                placeholder="Optional caption text..."
              />
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500">
                Slide {selectedSlideIndex + 1} of {localSlides.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
