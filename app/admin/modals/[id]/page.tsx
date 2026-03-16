'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Eye, Settings } from 'lucide-react';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { useConfirm } from '@/components/ui/useConfirm';
import { useUnsavedChanges } from '@/components/ui/useUnsavedChanges';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { CircularLoader } from '@/components/ui/CircularLoader';
import { CanvasEditor, type MechanicInstance } from '@/components/editor/CanvasEditor';
import { PropertyEditor } from '@/components/editor/PropertyEditor';
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer';
import { 
  createMechanicInstance,
  getMechanic,
} from '@/lib/mechanics-registry';

interface Modal {
  id: string;
  workspace_id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  status: 'draft' | 'published';
  trigger_type?: 'manual' | 'auto' | 'timed' | 'interaction';
  trigger_config?: string;
  style?: {
    width?: string;
    max_width?: string;
    background_color?: string;
    border_radius?: string;
    padding?: string;
    title_bar_type?: 'gradient' | 'solid';
    title_bar_color?: string;
    title_bar_gradient_from?: string;
    title_bar_gradient_to?: string;
  };
  created_by: string;
  created_at: number;
  updated_at: number;
}

type ModalSize = 'small' | 'medium' | 'large' | 'xlarge';

const MODAL_SIZES = {
  small: { width: 400, height: 300 },
  medium: { width: 600, height: 450 },
  large: { width: 800, height: 600 },
  xlarge: { width: 1000, height: 750 }
};

const MODAL_TITLE_BAR_HEIGHT = 48; // Fixed height for modal title bar in pixels

export default function ModalEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalId = params.id as string;
  const workspaceId = searchParams.get('workspace');
  
  const [modal, setModal] = useState<Modal | null>(null);
  const [mounting, setMounting] = useState(true); // Immediate loading state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { confirm, ConfirmDialog } = useConfirm();
  const { prompt: promptUnsaved, UnsavedChangesDialog } = useUnsavedChanges();

  // Modal form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  
  // Modal style state
  const [modalSize, setModalSize] = useState<ModalSize>('medium');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState('8px');
  const [padding, setPadding] = useState('24px');
  const [titleBarType, setTitleBarType] = useState<'gradient' | 'solid'>('gradient');
  const [titleBarColor, setTitleBarColor] = useState('#431C5B');
  const [titleBarGradientFrom, setTitleBarGradientFrom] = useState('#431C5B');
  const [titleBarGradientTo, setTitleBarGradientTo] = useState('#1d1f48');

  // Mechanics editor state
  const [mechanics, setMechanics] = useState<MechanicInstance[]>([]);
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);
  const [mechanicsChanged, setMechanicsChanged] = useState(false);
  const [originalMechanics, setOriginalMechanics] = useState<string>('[]');

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  // Available modals for linking
  const [availableModals, setAvailableModals] = useState<Array<{ id: string; title: string; slug: string }>>([]);

  const selectedMechanic = mechanics.find(m => m.id === selectedMechanicId);
  const { width: modalWidth, height: modalHeight } = MODAL_SIZES[modalSize];

  // Clear mounting state after component mounts (immediate loading screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounting(false);
    }, 100); // Small delay to ensure loading screen shows
    return () => clearTimeout(timer);
  }, []);

  // Load modal data
  useEffect(() => {
    const loadModal = async () => {
      try {
        const response = await fetch(`/api/modals/${modalId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to load modal');
        }

        const data = await response.json();
        setModal(data);
        
        // Populate form
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || '');
        setStatus(data.status);
        
        // Populate styles
        if (data.style) {
          setBackgroundColor(data.style.background_color || '#ffffff');
          setBorderRadius(data.style.border_radius || '8px');
          setPadding(data.style.padding || '24px');
          setTitleBarType(data.style.title_bar_type || 'gradient');
          setTitleBarColor(data.style.title_bar_color || '#431C5B');
          setTitleBarGradientFrom(data.style.title_bar_gradient_from || '#431C5B');
          setTitleBarGradientTo(data.style.title_bar_gradient_to || '#1d1f48');
          
          // Determine size from max_width
          const maxWidth = data.style.max_width || '600px';
          const width = parseInt(maxWidth);
          if (width <= 400) setModalSize('small');
          else if (width <= 600) setModalSize('medium');
          else if (width <= 800) setModalSize('large');
          else setModalSize('xlarge');
        }
        
        // Load mechanics from content
        if (data.content) {
          try {
            const parsed = JSON.parse(data.content);
            if (Array.isArray(parsed)) {
              const migratedMechanics = parsed.map((m: any, index: number) => {
                const mechDef = getMechanic(m.type);
                return {
                  ...m,
                  name: m.name || `${mechDef?.name || 'Object'} ${m.id.slice(0, 4)}`,
                  x: m.x ?? 100 + (index * 20),
                  y: m.y ?? 100 + (index * 20),
                  layer: m.layer ?? index + 1,
                  width: m.width ?? 200,
                  height: m.height ?? 100
                };
              });
              setMechanics(migratedMechanics);
              setOriginalMechanics(data.content);
            }
          } catch (e) {
            console.error('Failed to parse mechanics:', e);
            setMechanics([]);
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load modal');
        setLoading(false);
      }
    };

    loadModal();
  }, [modalId]);

  // Load available published modals for linking
  useEffect(() => {
    const loadModals = async () => {
      if (!workspaceId) return;
      
      try {
        const response = await fetch(`/api/modals?workspace_id=${workspaceId}&status=published`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setAvailableModals(data.map((m: Modal) => ({
            id: m.id,
            title: m.title,
            slug: m.slug
          })));
        }
      } catch (err) {
        console.error('Failed to load available modals:', err);
      }
    };
    
    loadModals();
  }, [workspaceId]);

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/modals/${modalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          content: JSON.stringify(mechanics),
          status,
          style: {
            max_width: `${MODAL_SIZES[modalSize].width}px`,
            background_color: backgroundColor,
            border_radius: borderRadius,
            padding: padding,
            title_bar_type: titleBarType,
            title_bar_color: titleBarColor,
            title_bar_gradient_from: titleBarGradientFrom,
            title_bar_gradient_to: titleBarGradientTo
          }
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save modal');
      }

      const updatedModal = await response.json();
      setModal(updatedModal);
      setOriginalMechanics(JSON.stringify(mechanics));
      setMechanicsChanged(false);
      setSaving(false);
      
      // Show brief success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = 'Modal saved successfully';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save modal');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Modal',
      description: 'Are you sure you want to delete this modal? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger'
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/modals/${modalId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete modal');
      }

      router.push(`/admin?workspace=${workspaceId}&view=modals`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete modal');
    }
  };

  // Mechanics handlers
  const handleAddMechanic = (type: string) => {
    const maxLayer = mechanics.length > 0 ? Math.max(...mechanics.map(m => m.layer)) : 0;
    const { width: modalWidth, height: modalHeight } = MODAL_SIZES[modalSize];
    
    const newMechanic = {
      ...createMechanicInstance(
        type, 
        nanoid(), 
        modalWidth / 2 - 100, 
        modalHeight / 2 - 50 + MODAL_TITLE_BAR_HEIGHT / 2
      ),
      layer: maxLayer + 1,
      width: 200,
      height: 100
    };
    setMechanics([...mechanics, newMechanic]);
    setSelectedMechanicId(newMechanic.id);
    setMechanicsChanged(true);
  };

  const handleDeleteMechanic = async () => {
    if (!selectedMechanicId) return;
    
    const confirmed = await confirm({
      title: 'Delete Element',
      description: 'Are you sure you want to delete this element?',
      confirmText: 'Delete',
      variant: 'danger',
    });

    if (!confirmed) return;

    setMechanics(mechanics.filter(m => m.id !== selectedMechanicId));
    setSelectedMechanicId(null);
    setMechanicsChanged(true);
  };

  const handleMechanicPropChange = (propName: string, value: any) => {
    if (!selectedMechanicId) return;
    
    setMechanics(mechanics.map(m => 
      m.id === selectedMechanicId 
        ? { ...m, props: { ...m.props, [propName]: value } }
        : m
    ));
    setMechanicsChanged(true);
  };

  const handleMechanicPositionChange = (field: 'x' | 'y' | 'width' | 'height' | 'name' | 'layer', value: any) => {
    if (!selectedMechanicId) return;
    
    setMechanics(mechanics.map(m => 
      m.id === selectedMechanicId ? { ...m, [field]: value } : m
    ));
    setMechanicsChanged(true);
  };

  const handleMechanicsChange = (updatedMechanics: MechanicInstance[]) => {
    setMechanics(updatedMechanics);
    setMechanicsChanged(true);
  };

  // Show immediate loading screen (before compilation completes)
  if (mounting || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#09090b' }}>
        <CircularLoader 
          size={120}
          message={mounting ? "Initializing Modal Editor..." : "Loading modal data..."}
        />
      </div>
    );
  }

  if (!modal) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Modal not found</p>
          <Link 
            href={`/admin?workspace=${workspaceId}&view=modals`}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Modals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      <ConfirmDialog />
      <UnsavedChangesDialog />

      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin?workspace=${workspaceId}&view=modals`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">{title || 'Untitled Modal'}</h1>
              <p className="text-xs text-zinc-500">/{slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mechanicsChanged && (
              <span className="text-xs text-orange-400 mr-2">Unsaved changes</span>
            )}
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 bg-red-900/20 hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-2 bg-red-900/20 border border-red-800 text-red-400 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Custom Modal Canvas with Title Bar */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <CanvasEditor
            mechanics={mechanics}
            selectedMechanicId={selectedMechanicId}
            canvasWidth={modalWidth}
            canvasHeight={modalHeight}
            onMechanicsChange={handleMechanicsChange}
            onSelectedMechanicChange={setSelectedMechanicId}
            onAddMechanic={handleAddMechanic}
            minY={MODAL_TITLE_BAR_HEIGHT}
            titleBarTitle={title}
            titleBarColor={
              titleBarType === 'solid'
                ? titleBarColor
                : `linear-gradient(135deg, ${titleBarGradientFrom} 0%, ${titleBarGradientTo} 100%)`
            }
            showToolbar={true}
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            className="flex-1"
          />
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-6">
            {/* Modal Properties - Only show when no object is selected */}
            {!selectedMechanic && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <h2 className="font-semibold text-white">Modal Properties</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                      className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Modal Size
                    </label>
                    <select
                      value={modalSize}
                      onChange={(e) => setModalSize(e.target.value as ModalSize)}
                      className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="small">Small (400x300)</option>
                      <option value="medium">Medium (600x450)</option>
                      <option value="large">Large (800x600)</option>
                      <option value="xlarge">Extra Large (1000x750)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Title Bar Style
                    </label>
                    <select
                      value={titleBarType}
                      onChange={(e) => setTitleBarType(e.target.value as 'gradient' | 'solid')}
                      className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="gradient">Gradient</option>
                      <option value="solid">Solid Color</option>
                    </select>
                  </div>

                  {titleBarType === 'solid' ? (
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Title Bar Color
                      </label>
                      <ColorPicker
                        value={titleBarColor}
                        onChange={setTitleBarColor}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Gradient Start Color
                        </label>
                        <ColorPicker
                          value={titleBarGradientFrom}
                          onChange={setTitleBarGradientFrom}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Gradient End Color
                        </label>
                        <ColorPicker
                          value={titleBarGradientTo}
                          onChange={setTitleBarGradientTo}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Background Color
                    </label>
                    <ColorPicker
                      value={backgroundColor}
                      onChange={setBackgroundColor}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Border Radius
                    </label>
                    <input
                      type="text"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(e.target.value)}
                      placeholder="8px"
                      className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Padding
                    </label>
                    <input
                      type="text"
                      value={padding}
                      onChange={(e) => setPadding(e.target.value)}
                      placeholder="24px"
                      className="w-full px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Selected Element Properties - Replace Modal Properties when object is selected */}
            {selectedMechanic && (
              <div>
                <PropertyEditor
                  mechanic={selectedMechanic}
                  onPropertyChange={handleMechanicPropChange}
                  onPositionChange={handleMechanicPositionChange}
                  onDelete={handleDeleteMechanic}
                  additionalData={{ modals: availableModals }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div
            className="relative"
            style={{
              width: `${modalWidth}px`,
              height: `${modalHeight}px`,
              backgroundColor: backgroundColor,
              borderRadius: borderRadius,
              padding: padding,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-lg z-10"
            >
              ✕
            </button>
            {mechanics.map((mechanic) => (
              <div
                key={mechanic.id}
                className="absolute"
                style={{
                  left: `${mechanic.x}px`,
                  top: `${mechanic.y}px`,
                  width: `${mechanic.width}px`,
                  height: `${mechanic.height}px`,
                  zIndex: mechanic.layer
                }}
              >
                <MechanicRenderer mechanic={mechanic} mode="view" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(9, 9, 11, 0.9)' }}>
          <CircularLoader 
            size={120}
            message="Saving modal..."
          />
        </div>
      )}
    </div>
  );
}
