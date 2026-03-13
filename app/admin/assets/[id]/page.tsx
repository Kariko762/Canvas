'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Settings, Save, GripVertical, Layers, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { useConfirm } from '@/components/ui/useConfirm';
import { useUnsavedChanges } from '@/components/ui/useUnsavedChanges';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer';
import { LayerPanel } from '@/components/editor/LayerPanel';
import { MechanicsToolbar } from '@/components/editor/MechanicsToolbar';
import { 
  getAllMechanics, 
  getMechanicsByCategory,
  createMechanicInstance,
  getMechanic,
  type MechanicCategory 
} from '@/lib/mechanics-registry';

interface Asset {
  id: string;
  workspace_id: string;
  title: string;
  slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  canvas_background_color: string;
  canvas_text_color: string;
  created_at: string;
  updated_at: string;
}

interface Page {
  id: string;
  asset_id: string;
  title: string;
  slug: string;
  order: number;
  status: 'draft' | 'published';
  transition_type?: 'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down';
  transition_duration?: number;
  canvas_background_color?: string;
  mechanics: string | null;
  created_at: string;
  updated_at: string;
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

type ViewMode = 'asset' | 'page-editor' | 'page-properties';

export default function AssetEditorPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const { confirm, ConfirmDialog } = useConfirm();
  const { prompt: promptUnsaved, UnsavedChangesDialog: UnsavedDialog } = useUnsavedChanges();

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('asset');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  // Asset form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#ffffff');
  const [canvasTextColor, setCanvasTextColor] = useState('#000000');

  // Page properties state
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageStatus, setPageStatus] = useState<'draft' | 'published'>('draft');
  const [pageTransitionType, setPageTransitionType] = useState<'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'>('fade');
  const [pageTransitionDuration, setPageTransitionDuration] = useState(300);
  const [pageBackgroundColor, setPageBackgroundColor] = useState('');
  const [savingPage, setSavingPage] = useState(false);

  // Mechanics editor state
  const [mechanics, setMechanics] = useState<MechanicInstance[]>([]);
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);
  const [showMechanicPicker, setShowMechanicPicker] = useState(false);
  const [mechanicsChanged, setMechanicsChanged] = useState(false);
  const [originalMechanics, setOriginalMechanics] = useState<string>('[]');
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [draggingMechanicId, setDraggingMechanicId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingMechanic, setResizingMechanic] = useState<{ 
    id: string; 
    startX: number; 
    startY: number; 
    startWidth: number; 
    startHeight: number;
    startPosX: number;
    startPosY: number;
    direction: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedMechanic = mechanics.find(m => m.id === selectedMechanicId);

  // Handle window-level mouse events for dragging and resizing
  useEffect(() => {
    if (!draggingMechanicId && !resizingMechanic) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      // Handle resizing
      if (resizingMechanic) {
        const deltaX = e.clientX - resizingMechanic.startX;
        const deltaY = e.clientY - resizingMechanic.startY;
        
        let newWidth = resizingMechanic.startWidth;
        let newHeight = resizingMechanic.startHeight;
        let newX = resizingMechanic.startPosX;
        let newY = resizingMechanic.startPosY;
        
        const dir = resizingMechanic.direction;
        
        // Handle width changes
        if (dir.includes('e')) {
          newWidth = Math.max(50, resizingMechanic.startWidth + deltaX);
        } else if (dir.includes('w')) {
          newWidth = Math.max(50, resizingMechanic.startWidth - deltaX);
          if (newWidth > 50) {
            newX = resizingMechanic.startPosX + deltaX;
          }
        }
        
        // Handle height changes
        if (dir.includes('s')) {
          newHeight = Math.max(50, resizingMechanic.startHeight + deltaY);
        } else if (dir.includes('n')) {
          newHeight = Math.max(50, resizingMechanic.startHeight - deltaY);
          if (newHeight > 50) {
            newY = resizingMechanic.startPosY + deltaY;
          }
        }

        setMechanics(prev => prev.map(m =>
          m.id === resizingMechanic.id ? { ...m, width: newWidth, height: newHeight, x: newX, y: newY } : m
        ));
        setMechanicsChanged(true);
        return;
      }

      // Handle dragging
      if (draggingMechanicId) {
        const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 50));
        const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 50));

        setMechanics(prev => prev.map(m =>
          m.id === draggingMechanicId ? { ...m, x, y } : m
        ));
        setMechanicsChanged(true);
      }
    };

    const handleWindowMouseUp = () => {
      setDraggingMechanicId(null);
      setResizingMechanic(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggingMechanicId, resizingMechanic, dragOffset, mechanics]);

  useEffect(() => {
    loadAsset();
    loadPages();
  }, [assetId]);

  const loadAsset = async () => {
    try {
      const res = await fetch(`/api/assets/${assetId}`);
      if (!res.ok) throw new Error('Failed to load asset');
      const data = await res.json();
      const assetData = data.asset;
      setAsset(assetData);
      setTitle(assetData.title);
      setSlug(assetData.slug);
      setDescription(assetData.description || '');
      setStatus(assetData.status);
      setCanvasBackgroundColor(assetData.canvas_background_color || '#ffffff');
      setCanvasTextColor(assetData.canvas_text_color || '#000000');
    } catch (err) {
      setError('Failed to load asset');
    } finally {
      setLoading(false);
    }
  };

  const loadPages = async () => {
    try {
      const res = await fetch(`/api/assets/${assetId}/pages`);
      if (!res.ok) throw new Error('Failed to load pages');
      const data = await res.json();
      setPages(data.pages || []);
    } catch (err) {
      console.error('Failed to load pages:', err);
      setPages([]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          status,
          canvas_background_color: canvasBackgroundColor,
          canvas_text_color: canvasTextColor,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await res.json();
      setAsset(data.asset);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Asset',
      description: `Are you sure you want to delete "${asset?.title}"? This will delete all pages and cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete asset');

      // Navigate back to dashboard
      router.push('/admin');
    } catch (err) {
      setError('Failed to delete asset');
    }
  };

  const handleCreatePage = async () => {
    const pageNumber = pages.length + 1;
    const pageTitle = `Page ${pageNumber}`;
    const pageSlug = `page-${pageNumber}`;

    try {
      const res = await fetch(`/api/assets/${assetId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageTitle,
          slug: pageSlug,
          order: pageNumber,
          status: 'draft',
          transition_type: 'fade',
          transition_duration: 300,
        }),
      });

      if (!res.ok) throw new Error('Failed to create page');

      await loadPages(); // Reload pages
    } catch (err) {
      setError('Failed to create page');
    }
  };

  const handleSelectPage = async (page: Page) => {
    // Check for unsaved changes
    if (mechanicsChanged && selectedPage) {
      const action = await promptUnsaved();

      if (action === 'save') {
        // Save and stay on current page
        await handleSaveMechanics();
        return;
      } else if (action === 'saveAndContinue') {
        // Save and continue to new page
        await handleSaveMechanics();
      } else if (action === 'discard') {
        // Discard changes and continue
        setMechanicsChanged(false);
      } else if (action === 'cancel') {
        // Stay on current page
        return;
      }
    }

    setSelectedPage(page);
    setViewMode('page-editor');
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageStatus(page.status || 'draft');
    setPageTransitionType(page.transition_type || 'fade');
    setPageTransitionDuration(page.transition_duration || 300);
    setPageBackgroundColor(page.canvas_background_color || '');
    
    // Load mechanics
    if (page.mechanics) {
      try {
        const parsed = JSON.parse(page.mechanics);
        // Migrate legacy mechanics to new format with x/y/name/layer/width/height
        const migratedMechanics = Array.isArray(parsed) 
          ? parsed.map((m: any, index: number) => {
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
            })
          : [];
        setMechanics(migratedMechanics);
        setOriginalMechanics(page.mechanics);
      } catch (e) {
        console.error('Failed to parse mechanics:', e);
        setMechanics([]);
        setOriginalMechanics('[]');
      }
    } else {
      setMechanics([]);
      setOriginalMechanics('[]');
    }
    
    setMechanicsChanged(false);
    setSelectedMechanicId(null);
  };

  const handleShowPageProperties = () => {
    setViewMode('page-properties');
  };

  const handleClosePageView = async () => {
    // Check for unsaved changes
    if (mechanicsChanged) {
      const confirmed = await confirm({
        title: 'Unsaved Changes',
        description: 'You have unsaved changes. Do you want to save before closing?',
        confirmText: 'Save & Close',
        cancelText: 'Discard Changes',
        variant: 'warning',
      });

      if (confirmed) {
        await handleSaveMechanics();
      }
    }

    setSelectedPage(null);
    setViewMode('asset');
    setMechanics([]);
    setMechanicsChanged(false);
    setSelectedMechanicId(null);
  };

  const handleSavePageProperties = async () => {
    if (!selectedPage) return;

    setSavingPage(true);
    setError('');

    try {
      const res = await fetch(`/api/pages/${selectedPage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageTitle,
          slug: pageSlug,
          status: pageStatus,
          transition_type: pageTransitionType,
          transition_duration: pageTransitionDuration,
          canvas_background_color: pageBackgroundColor || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save page');
      }

      const data = await res.json();
      setSelectedPage(data.page);
      await loadPages();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingPage(false);
    }
  };

  const handleDeletePage = async () => {
    if (!selectedPage) return;

    const confirmed = await confirm({
      title: 'Delete Page',
      description: `Are you sure you want to delete "${selectedPage.title}"? This cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/pages/${selectedPage.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete page');

      setSelectedPage(null);
      await loadPages();
    } catch (err) {
      setError('Failed to delete page');
    }
  };

  // Mechanics editor handlers
  const handleAddMechanic = (type: string, x?: number, y?: number) => {
    const maxLayer = mechanics.length > 0 ? Math.max(...mechanics.map(m => m.layer)) : 0;
    const newMechanic = {
      ...createMechanicInstance(type, nanoid(), x, y),
      layer: maxLayer + 1,
      width: 200,
      height: 100
    };
    setMechanics([...mechanics, newMechanic]);
    setSelectedMechanicId(newMechanic.id);
    setShowMechanicPicker(false);
    setMechanicsChanged(true);
  };

  const handleDeleteMechanic = async () => {
    if (!selectedMechanicId) return;
    
    const confirmed = await confirm({
      title: 'Delete Mechanic',
      description: 'Are you sure you want to delete this mechanic?',
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

  const handleMechanicPositionChange = (id: string, field: 'x' | 'y' | 'name' | 'layer', value: any) => {
    setMechanics(mechanics.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
    setMechanicsChanged(true);
  };

  const handleMouseDownOnMechanic = (e: React.MouseEvent, mechanicId: string) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    e.stopPropagation();
    
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (!mechanic || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDraggingMechanicId(mechanicId);
    setSelectedMechanicId(mechanicId);
    setDragOffset({
      x: mouseX - mechanic.x,
      y: mouseY - mechanic.y
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas (not on a mechanic)
    if (e.target === e.currentTarget) {
      setSelectedMechanicId(null);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, mechanicId: string, direction: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w') => {
    e.stopPropagation();
    e.preventDefault();
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (!mechanic) return;

    setResizingMechanic({
      id: mechanicId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: mechanic.width || 200,
      startHeight: mechanic.height || 100,
      startPosX: mechanic.x,
      startPosY: mechanic.y,
      direction,
    });
    setSelectedMechanicId(mechanicId);
  };

  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    const sortedMechanics = [...mechanics].sort((a, b) => a.layer - b.layer);
    const currentIndex = sortedMechanics.findIndex(m => m.id === id);
    
    if (currentIndex === -1) return;
    
    if (direction === 'up' && currentIndex === 0) return; // Already at front
    if (direction === 'down' && currentIndex === sortedMechanics.length - 1) return; // Already at back
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentMechanic = sortedMechanics[currentIndex];
    const targetMechanic = sortedMechanics[targetIndex];
    
    // Swap layer values
    setMechanics(mechanics.map(m => {
      if (m.id === currentMechanic.id) return { ...m, layer: targetMechanic.layer };
      if (m.id === targetMechanic.id) return { ...m, layer: currentMechanic.layer };
      return m;
    }));
    setMechanicsChanged(true);
  };

  const handleMoveMechanic = (index: number, direction: 'up' | 'down') => {
    // This function is now deprecated with absolute positioning
    // Keeping for backwards compatibility
  };

  const handleSaveMechanics = async () => {
    if (!selectedPage) return;

    setSaving(true);
    setError('');
    
    try {
      const res = await fetch(`/api/pages/${selectedPage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mechanics: JSON.stringify(mechanics)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await res.json();
      setSelectedPage(data.page);
      setOriginalMechanics(JSON.stringify(mechanics));
      setMechanicsChanged(false);
      await loadPages();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isValidHexColor = (color: string): boolean => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">Asset not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{asset.title}</h1>
            <p className="text-sm text-zinc-500">
              {selectedPage ? `Editing: ${selectedPage.title}` : `/${asset.slug}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {viewMode === 'page-editor' && (
            <>
              <button
                onClick={() => setShowLayerPanel(!showLayerPanel)}
                className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                  showLayerPanel 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                Layers
              </button>
              <button
                onClick={handleSaveMechanics}
                disabled={saving || !mechanicsChanged}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : mechanicsChanged ? 'Save Changes' : 'Saved'}
              </button>
            </>
          )}
          {viewMode === 'asset' && (
            <>
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-600/10 text-red-500 rounded hover:bg-red-600/20 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !isValidHexColor(canvasBackgroundColor) || !isValidHexColor(canvasTextColor)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-900/20 border border-red-800 text-red-400 rounded flex-shrink-0">
          {error}
        </div>
      )}

      {/* Mechanics Toolbar */}
      {viewMode === 'page-editor' && selectedPage && (
        <div className="border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
          <MechanicsToolbar 
            onAddMechanic={(type) => handleAddMechanic(type, 100, 100)}
          />
        </div>
      )}

      {/* Three-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Pages */}
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
            <h2 className="font-semibold">Pages</h2>
            <button
              onClick={handleCreatePage}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
              title="Add Page"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {pages.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">
                No pages yet. Click + to add one.
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => handleSelectPage(page)}
                    className={`relative px-3 py-2 rounded cursor-pointer transition-colors ${
                      selectedPage?.id === page.id ? 'bg-blue-600' : 'hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-center gap-2">
                        <div>
                          <div className="font-medium text-sm">{page.title}</div>
                          <div className="text-xs text-zinc-500">/{page.slug}</div>
                        </div>
                        {selectedPage?.id === page.id && mechanicsChanged && (
                          <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" title="Unsaved changes" />
                        )}
                      </div>
                      {selectedPage?.id === page.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowPageProperties();
                          }}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                          title="Page Settings"
                        >
                          <Settings className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center panel */}
        {viewMode === 'page-editor' && selectedPage ? (
          /* Mechanics Canvas */
          <div className="flex-1 bg-zinc-950 flex items-center justify-center p-8 overflow-hidden">
            <div 
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="relative w-full max-w-[1200px] bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden select-none"
              style={{ 
                aspectRatio: '16/9',
                cursor: draggingMechanicId ? 'move' : resizingMechanic ? `${resizingMechanic.direction}-resize` : 'default'
              }}
            >
              {mechanics.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-zinc-500 mb-2">No mechanics yet</p>
                    <p className="text-xs text-zinc-600">Use the toolbar above to add mechanics</p>
                  </div>
                </div>
              ) : (
                <>
                  {(() => {
                    const maxLayer = Math.max(...mechanics.map(m => m.layer));
                    return mechanics
                      .slice()
                      .sort((a, b) => b.layer - a.layer) // Sort by layer descending for rendering order
                      .map((mechanic) => {
                        const zIndex = maxLayer - mechanic.layer + 1; // Invert: layer 1 = highest z-index
                        const width = mechanic.width || 200;
                        const height = mechanic.height || 100;
                        
                        return (
                          <div
                            key={mechanic.id}
                            onMouseDown={(e) => handleMouseDownOnMechanic(e, mechanic.id)}
                            className={`absolute cursor-move group ${
                              selectedMechanicId === mechanic.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            style={{
                              left: `${mechanic.x}px`,
                              top: `${mechanic.y}px`,
                              width: `${width}px`,
                              height: `${height}px`,
                              zIndex: zIndex,
                            }}
                          >
                            <MechanicRenderer
                              mechanic={mechanic}
                              mode="edit"
                              onSelect={() => setSelectedMechanicId(mechanic.id)}
                              isSelected={selectedMechanicId === mechanic.id}
                            />
                            
                            {/* Resize Handles */}
                            {selectedMechanicId === mechanic.id && (
                              <>
                                {/* Corner Handles */}
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 'nw')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-nw-resize hover:bg-blue-100"
                                  style={{ top: '-4px', left: '-4px' }}
                                />
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 'ne')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-ne-resize hover:bg-blue-100"
                                  style={{ top: '-4px', right: '-4px' }}
                                />
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 'sw')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-sw-resize hover:bg-blue-100"
                                  style={{ bottom: '-4px', left: '-4px' }}
                                />
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 'se')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-se-resize hover:bg-blue-100"
                                  style={{ bottom: '-4px', right: '-4px' }}
                                />
                                
                                {/* Edge Handles */}
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 'n')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-n-resize hover:bg-blue-100"
                                  style={{ top: '-4px', left: '50%', transform: 'translateX(-50%)' }}
                                />
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 's')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-s-resize hover:bg-blue-100"
                                  style={{ bottom: '-4px', left: '50%', transform: 'translateX(-50%)' }}
                                />
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 'w')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-w-resize hover:bg-blue-100"
                                  style={{ top: '50%', left: '-4px', transform: 'translateY(-50%)' }}
                                />
                                <div
                                  onMouseDown={(e) => handleResizeStart(e, mechanic.id, 'e')}
                                  className="absolute w-2 h-2 bg-white border border-blue-500 cursor-e-resize hover:bg-blue-100"
                                  style={{ top: '50%', right: '-4px', transform: 'translateY(-50%)' }}
                                />
                              </>
                            )}
                          </div>
                        );
                      });
                  })()}
                </>
              )}
            </div>
          </div>
        ) : viewMode === 'page-properties' && selectedPage ? (
          /* Page Properties */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Page Properties</h2>
                  <p className="text-sm text-zinc-500 mt-1">Configure page settings and transitions</p>
                </div>
                <button
                  onClick={() => setViewMode('page-editor')}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Back to editor"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Title</label>
                    <input
                      type="text"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <input
                      type="text"
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Used in URL: /{asset.slug}/{pageSlug}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={pageStatus}
                      onChange={(e) => setPageStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  {/* Transition Settings */}
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-sm font-medium mb-4">Page Transitions</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Transition Type</label>
                        <select
                          value={pageTransitionType}
                          onChange={(e) => setPageTransitionType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                        >
                          <option value="none">None</option>
                          <option value="fade">Fade</option>
                          <option value="slide-left">Slide Left</option>
                          <option value="slide-right">Slide Right</option>
                          <option value="slide-up">Slide Up</option>
                          <option value="slide-down">Slide Down</option>
                        </select>
                        <p className="text-xs text-zinc-500 mt-1">How this page transitions in</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Transition Duration (ms)
                        </label>
                        <input
                          type="number"
                          value={pageTransitionDuration}
                          onChange={(e) => setPageTransitionDuration(Number(e.target.value))}
                          min="0"
                          max="5000"
                          step="50"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Page Background Color (optional override) */}
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-sm font-medium mb-4">Page Background</h3>
                    <p className="text-xs text-zinc-500 mb-3">Override asset background for this page (optional)</p>
                    
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={pageBackgroundColor || canvasBackgroundColor}
                        onChange={(e) => setPageBackgroundColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={pageBackgroundColor}
                        onChange={(e) => setPageBackgroundColor(e.target.value)}
                        placeholder="Leave empty to use asset default"
                        className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-zinc-800 pt-6 flex items-center justify-between">
                    <button
                      onClick={handleDeletePage}
                      className="px-4 py-2 bg-red-600/10 text-red-500 rounded hover:bg-red-600/20 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Page
                    </button>
                    
                    <button
                      onClick={handleSavePageProperties}
                      disabled={savingPage}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {savingPage ? 'Saving...' : 'Save Properties'}
                    </button>
                  </div>
                </div>
            </div>
          </div>
        ) : (
          /* Asset Properties */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl">
                <h2 className="text-lg font-semibold mb-6">Asset Properties</h2>
                
                <div className="space-y-6">
                  {/* 2-Column Grid for Title and Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Slug</label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* Description - Full Width */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                    />
                  </div>

                  {/* Status - Single Column */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Canvas Colors */}
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-sm font-medium mb-4">Canvas Colors</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Background</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={canvasBackgroundColor}
                            onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={canvasBackgroundColor}
                            onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                            className="flex-1 px-2 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white text-sm font-mono"
                          />
                        </div>
                        {!isValidHexColor(canvasBackgroundColor) && (
                          <p className="text-xs text-red-400 mt-1">Invalid hex</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Text</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={canvasTextColor}
                            onChange={(e) => setCanvasTextColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={canvasTextColor}
                            onChange={(e) => setCanvasTextColor(e.target.value)}
                            className="flex-1 px-2 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white text-sm font-mono"
                          />
                        </div>
                        {!isValidHexColor(canvasTextColor) && (
                          <p className="text-xs text-red-400 mt-1">Invalid hex</p>
                        )}
                      </div>
                    </div>

                    {/* Compact Color Preview */}
                    <div 
                      className="w-full h-16 rounded border border-zinc-800 flex items-center justify-center mt-4"
                      style={{ 
                        backgroundColor: isValidHexColor(canvasBackgroundColor) ? canvasBackgroundColor : '#ffffff',
                        color: isValidHexColor(canvasTextColor) ? canvasTextColor : '#000000'
                      }}
                    >
                      <span className="font-medium">Preview</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* Right sidebar */}
        {viewMode === 'page-editor' && selectedPage ? (
          showLayerPanel ? (
            /* Layer Panel */
            <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <LayerPanel
                mechanics={mechanics}
                selectedMechanicId={selectedMechanicId}
                onSelectMechanic={(id) => setSelectedMechanicId(id)}
                onDeleteMechanic={async (id) => {
 const mech = mechanics.find(m => m.id === id);
                  if (!mech) return;
                  
                  const mechName = getMechanic(mech.type)?.name || 'mechanic';
                  const confirmed = await confirm({
                    title: `Delete ${mechName}?`,
                    description: 'This action cannot be undone.',
                    confirmText: 'Delete',
                    variant: 'danger'
                  });
                  if (confirmed) {
                    const newMechanics = mechanics.filter(m => m.id !== id);
                    setMechanics(newMechanics);
                    if (selectedMechanicId === id) {
                      setSelectedMechanicId(null);
                    }
                    setMechanicsChanged(true);
                  }
                }}
                onMoveLayer={handleMoveLayer}
              />
              </div>
            </div>
          ) : (
            /* Properties Panel */
            <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                {!selectedMechanic ? (
                /* Page Properties */
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Page Properties</h2>
                  
                  <div className="space-y-4">
                    {/* Page Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Page Title</label>
                      <input
                        type="text"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                      />
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={pageBackgroundColor || '#000000'}
                          onChange={(e) => setPageBackgroundColor(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={pageBackgroundColor || ''}
                          onChange={(e) => setPageBackgroundColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
                        />
                      </div>
                    </div>

                    {/* Transition Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Transition</label>
                      <select
                        value={pageTransitionType}
                        onChange={(e) => setPageTransitionType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                      >
                        <option value="none">None</option>
                        <option value="fade">Fade</option>
                        <option value="slide-left">Slide Left</option>
                        <option value="slide-right">Slide Right</option>
                        <option value="slide-up">Slide Up</option>
                        <option value="slide-down">Slide Down</option>
                      </select>
                    </div>

                    {/* Transition Duration */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Transition Duration (ms)</label>
                      <input
                        type="number"
                        value={pageTransitionDuration}
                        onChange={(e) => setPageTransitionDuration(Number(e.target.value))}
                        min={100}
                        max={2000}
                        step={100}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-zinc-800">
                      <button
                        onClick={handleSavePageProperties}
                        disabled={savingPage}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {savingPage ? 'Saving...' : 'Save Page Properties'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedMechanic ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold">Properties</h2>
                      <p className="text-sm text-zinc-500 capitalize">{selectedMechanic.type}</p>
                    </div>
                    <button
                      onClick={handleDeleteMechanic}
                      className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                      title="Delete mechanic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Position & Layer Controls */}
                    <div className="pb-4 border-b border-zinc-800 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Object Name</label>
                        <input
                          type="text"
                          value={selectedMechanic.name}
                          onChange={(e) => handleMechanicPositionChange(selectedMechanic.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                          placeholder="Object name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">X Position</label>
                          <input
                            type="number"
                            value={selectedMechanic.x}
                            onChange={(e) => handleMechanicPositionChange(selectedMechanic.id, 'x', Number(e.target.value))}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                            step="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Y Position</label>
                          <input
                            type="number"
                            value={selectedMechanic.y}
                            onChange={(e) => handleMechanicPositionChange(selectedMechanic.id, 'y', Number(e.target.value))}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                            step="1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mechanic-Specific Properties */}
                    {selectedMechanic && (() => {
                      const definition = getMechanic(selectedMechanic.type);
                      if (!definition) return null;
                      
                      const propertyEntries = Object.entries(definition.properties);
                      if (propertyEntries.length === 0) return null;
                      
                      return (
                        <>
                          <div className="pt-4 mb-2">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                              {definition.name} Settings
                            </h3>
                          </div>
                          {propertyEntries.map(([propName, propDef]) => (
                        <div key={propName}>
                          <label className="block text-sm font-medium mb-2">
                            {propDef.label}
                          </label>
                          
                          {propDef.type === 'text' && (
                            <input
                              type="text"
                              value={selectedMechanic.props[propName] || ''}
                              onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                              placeholder={propDef.placeholder}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                            />
                          )}
                          
                          {propDef.type === 'textarea' && (
                            <textarea
                              value={selectedMechanic.props[propName] || ''}
                              onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                              placeholder={propDef.placeholder}
                              rows={4}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
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
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                            />
                          )}
                        
                        {propDef.type === 'color' && (
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={selectedMechanic.props[propName] || '#ffffff'}
                              onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                              className="w-12 h-10 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={selectedMechanic.props[propName] || '#ffffff'}
                              onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
                            />
                          </div>
                        )}
                        
                        {propDef.type === 'select' && (
                          <select
                            value={selectedMechanic.props[propName] || propDef.defaultValue}
                            onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                          >
                            {propDef.options?.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
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
                        
                        {propDef.type === 'range' && (
                          <div>
                            <input
                              type="range"
                              value={selectedMechanic.props[propName] || propDef.defaultValue}
                              onChange={(e) => handleMechanicPropChange(propName, parseFloat(e.target.value))}
                              min={propDef.min}
                              max={propDef.max}
                              step={propDef.step}
                              className="w-full"
                            />
                            <div className="text-sm text-zinc-500 text-center mt-1">
                              {selectedMechanic.props[propName] || propDef.defaultValue}
                            </div>
                          </div>
                        )}
                        
                        {propDef.help && (
                          <p className="text-xs text-zinc-500 mt-1">{propDef.help}</p>
                        )}
                      </div>
                    ))}

                    {/* Custom Array Editors for Complex Components */}
                    {selectedMechanic.type === 'tabs' && (
                      <div className="pt-4 mt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Tab Items</h3>
                          <button
                            onClick={() => {
                              const currentTabs = selectedMechanic.props.tabs || [];
                              handleMechanicPropChange('tabs', [
                                ...currentTabs,
                                { id: nanoid(), label: `Tab ${currentTabs.length + 1}`, content: 'Content here' }
                              ]);
                            }}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                          >
                            + Add Tab
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(selectedMechanic.props.tabs || []).map((tab: any, index: number) => (
                            <div key={tab.id} className="p-3 bg-zinc-800 rounded border border-zinc-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-zinc-400">Tab {index + 1}</span>
                                <button
                                  onClick={() => {
                                    const currentTabs = [...(selectedMechanic.props.tabs || [])];
                                    currentTabs.splice(index, 1);
                                    handleMechanicPropChange('tabs', currentTabs);
                                  }}
                                  className="text-red-500 hover:text-red-400 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                value={tab.label}
                                onChange={(e) => {
                                  const currentTabs = [...(selectedMechanic.props.tabs || [])];
                                  currentTabs[index] = { ...tab, label: e.target.value };
                                  handleMechanicPropChange('tabs', currentTabs);
                                }}
                                placeholder="Tab label"
                                className="w-full mb-2 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                              />
                              <textarea
                                value={tab.content}
                                onChange={(e) => {
                                  const currentTabs = [...(selectedMechanic.props.tabs || [])];
                                  currentTabs[index] = { ...tab, content: e.target.value };
                                  handleMechanicPropChange('tabs', currentTabs);
                                }}
                                placeholder="Tab content"
                                rows={3}
                                className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMechanic.type === 'accordion' && (
                      <div className="pt-4 mt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Accordion Items</h3>
                          <button
                            onClick={() => {
                              const currentItems = selectedMechanic.props.items || [];
                              handleMechanicPropChange('items', [
                                ...currentItems,
                                { id: nanoid(), title: `Section ${currentItems.length + 1}`, content: 'Content here' }
                              ]);
                            }}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                          >
                            + Add Section
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(selectedMechanic.props.items || []).map((item: any, index: number) => (
                            <div key={item.id} className="p-3 bg-zinc-800 rounded border border-zinc-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-zinc-400">Section {index + 1}</span>
                                <button
                                  onClick={() => {
                                    const currentItems = [...(selectedMechanic.props.items || [])];
                                    currentItems.splice(index, 1);
                                    handleMechanicPropChange('items', currentItems);
                                  }}
                                  className="text-red-500 hover:text-red-400 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const currentItems = [...(selectedMechanic.props.items || [])];
                                  currentItems[index] = { ...item, title: e.target.value };
                                  handleMechanicPropChange('items', currentItems);
                                }}
                                placeholder="Section title"
                                className="w-full mb-2 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                              />
                              <textarea
                                value={item.content}
                                onChange={(e) => {
                                  const currentItems = [...(selectedMechanic.props.items || [])];
                                  currentItems[index] = { ...item, content: e.target.value };
                                  handleMechanicPropChange('items', currentItems);
                                }}
                                placeholder="Section content"
                                rows={3}
                                className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMechanic.type === 'gridlayout' && (
                      <div className="pt-4 mt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Grid Items</h3>
                          <button
                            onClick={() => {
                              const currentItems = selectedMechanic.props.items || [];
                              handleMechanicPropChange('items', [
                                ...currentItems,
                                { id: nanoid(), content: `Item ${currentItems.length + 1}`, backgroundColor: '#f3f4f6', textColor: '#1f2937' }
                              ]);
                            }}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                          >
                            + Add Item
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(selectedMechanic.props.items || []).map((item: any, index: number) => (
                            <div key={item.id} className="p-3 bg-zinc-800 rounded border border-zinc-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-zinc-400">Item {index + 1}</span>
                                <button
                                  onClick={() => {
                                    const currentItems = [...(selectedMechanic.props.items || [])];
                                    currentItems.splice(index, 1);
                                    handleMechanicPropChange('items', currentItems);
                                  }}
                                  className="text-red-500 hover:text-red-400 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                              <textarea
                                value={item.content}
                                onChange={(e) => {
                                  const currentItems = [...(selectedMechanic.props.items || [])];
                                  currentItems[index] = { ...item, content: e.target.value };
                                  handleMechanicPropChange('items', currentItems);
                                }}
                                placeholder="Item content"
                                rows={2}
                                className="w-full mb-2 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-zinc-500">Background</label>
                                  <input
                                    type="color"
                                    value={item.backgroundColor || '#f3f4f6'}
                                    onChange={(e) => {
                                      const currentItems = [...(selectedMechanic.props.items || [])];
                                      currentItems[index] = { ...item, backgroundColor: e.target.value };
                                      handleMechanicPropChange('items', currentItems);
                                    }}
                                    className="w-full h-8 rounded cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-zinc-500">Text Color</label>
                                  <input
                                    type="color"
                                    value={item.textColor || '#1f2937'}
                                    onChange={(e) => {
                                      const currentItems = [...(selectedMechanic.props.items || [])];
                                      currentItems[index] = { ...item, textColor: e.target.value };
                                      handleMechanicPropChange('items', currentItems);
                                    }}
                                    className="w-full h-8 rounded cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                        </>
                      );
                  })()}
                  </div>
                </div>
              ) : null}
              </div>
            </div>
          )
        ) : null}
      </div>

      <ConfirmDialog />
      <UnsavedDialog />
    </div>
  );
}
