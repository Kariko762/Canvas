'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Save, Star } from 'lucide-react';
import { nanoid } from 'nanoid';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
}

interface TestimonialEditorProps {
  testimonials: Testimonial[];
  onSave: (testimonials: Testimonial[]) => void;
  onClose: () => void;
}

export function TestimonialEditor({ testimonials: initialTestimonials, onSave, onClose }: TestimonialEditorProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(
    initialTestimonials[0]?.id || null
  );

  const selectedTestimonial = testimonials.find(t => t.id === selectedTestimonialId);

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: nanoid(),
      quote: 'Enter testimonial quote here...',
      author: 'Customer Name',
      role: 'Position, Company',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=' + (testimonials.length + 1)
    };
    setTestimonials([...testimonials, newTestimonial]);
    setSelectedTestimonialId(newTestimonial.id);
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    const newTestimonials = testimonials.filter(t => t.id !== testimonialId);
    setTestimonials(newTestimonials);
    if (selectedTestimonialId === testimonialId) {
      setSelectedTestimonialId(newTestimonials[0]?.id || null);
    }
  };

  const handleUpdateTestimonial = (testimonialId: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials(prev => prev.map(t =>
      t.id === testimonialId ? { ...t, [field]: value } : t
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Testimonial Editor</h1>
          <span className="text-sm text-zinc-500">{testimonials.length} testimonials</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave(testimonials)}
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
        {/* Left Sidebar - Testimonials List */}
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleAddTestimonial}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`mb-2 p-3 rounded cursor-pointer transition-colors ${
                  selectedTestimonialId === testimonial.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
                onClick={() => setSelectedTestimonialId(testimonial.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs opacity-70 mb-1">Testimonial {index + 1}</div>
                    <div className="text-sm font-medium truncate">{testimonial.author}</div>
                    <div className="text-xs opacity-70 truncate mt-1">{testimonial.role}</div>
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i < testimonial.rating ? 'fill-current' : 'opacity-30'}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTestimonial(testimonial.id);
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
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold mb-6 text-white">Testimonial Preview</h2>
              {selectedTestimonial && (
                <div className="p-8 rounded-xl bg-slate-800 text-white border border-white/10">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < selectedTestimonial.rating ? 'fill-current text-yellow-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <p className="text-lg mb-6 leading-relaxed italic">{selectedTestimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    {selectedTestimonial.image && (
                      <img
                        src={selectedTestimonial.image}
                        alt={selectedTestimonial.author}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{selectedTestimonial.author}</div>
                      <div className="text-sm opacity-70">{selectedTestimonial.role}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          {selectedTestimonial ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Testimonial Properties</h2>
                  <p className="text-sm text-zinc-500">Testimonial {testimonials.findIndex(t => t.id === selectedTestimonial.id) + 1}</p>
                </div>
                <button
                  onClick={() => handleDeleteTestimonial(selectedTestimonial.id)}
                  className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quote</label>
                  <textarea
                    value={selectedTestimonial.quote}
                    onChange={(e) => handleUpdateTestimonial(selectedTestimonial.id, 'quote', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                    rows={5}
                    placeholder="Enter testimonial quote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Author Name</label>
                  <input
                    type="text"
                    value={selectedTestimonial.author}
                    onChange={(e) => handleUpdateTestimonial(selectedTestimonial.id, 'author', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role/Title</label>
                  <input
                    type="text"
                    value={selectedTestimonial.role}
                    onChange={(e) => handleUpdateTestimonial(selectedTestimonial.id, 'role', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                    placeholder="Position, Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleUpdateTestimonial(selectedTestimonial.id, 'rating', i + 1)}
                        className="p-2 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <Star
                          size={24}
                          className={i < selectedTestimonial.rating ? 'fill-current text-yellow-400' : 'text-gray-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={selectedTestimonial.image || ''}
                    onChange={(e) => handleUpdateTestimonial(selectedTestimonial.id, 'image', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
                    placeholder="https://..."
                  />
                  {selectedTestimonial.image && (
                    <div className="mt-3">
                      <img
                        src={selectedTestimonial.image}
                        alt={selectedTestimonial.author}
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500">
              <p className="text-sm">Select a testimonial to edit</p>
              <p className="text-xs mt-2">or add a new one using the button on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
