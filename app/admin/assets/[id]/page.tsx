'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Settings, Save, GripVertical, Layers, ChevronDown, ZoomIn, ZoomOut, Maximize2, Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { useConfirm } from '@/components/ui/useConfirm';
import { useUnsavedChanges } from '@/components/ui/useUnsavedChanges';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { PublishModal } from '@/components/ui/PublishModal';
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer';
import { LayerPanel } from '@/components/editor/LayerPanel';
import { MechanicsToolbar } from '@/components/editor/MechanicsToolbar';
import { AccordionEditor } from '@/components/editor/AccordionEditor';
import { TabsEditor } from '@/components/editor/TabsEditor';
import { GridEditor } from '@/components/editor/GridEditor';
import { LogoGridEditor } from '@/components/editor/LogoGridEditor';
import { AvatarCardEditor } from '@/components/editor/AvatarCardEditor';
import { TableEditor } from '@/components/editor/TableEditor';
import { TestimonialEditor } from '@/components/editor/TestimonialEditor';
import { FeatureGridEditor } from '@/components/editor/FeatureGridEditor';
import PricingCardEditor from '@/components/editor/PricingCardEditor';
import CarouselEditor from '@/components/editor/CarouselEditor';
import { useGlobalLoading } from '@/components/ui/GlobalLoadingContext';
import { Menu } from '@/components/mechanics/Menu';
import { MenuEditorPanel, type MenuConfig } from '@/components/editor/MenuEditorPanel';
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
  status: 'draft' | 'qa' | 'complete';
  transition_type?: 'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down';
  transition_duration?: number;
  canvas_background_color?: string;
  background_type?: 'colour' | 'gradient' | 'image' | 'animated-image';
  background_gradient_type?: 'linear' | 'radial';
  background_gradient_colors?: string;
  background_gradient_angle?: number;
  background_image_url?: string;
  background_image_size?: 'cover' | 'contain' | 'auto';
  background_image_position?: string;
  background_animation_type?: 'ken-burns' | 'parallax' | 'pulse';
  background_animation_duration?: number;
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

type ViewMode = 'asset' | 'page-editor' | 'page-properties' | 'menu-editor';

export default function AssetEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { hideLoading, completeStep } = useGlobalLoading();
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
  const [pageStatus, setPageStatus] = useState<'draft' | 'qa' | 'complete'>('draft');
  const [pageTransitionType, setPageTransitionType] = useState<'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'>('fade');
  const [pageTransitionDuration, setPageTransitionDuration] = useState(300);
  const [pageBackgroundColor, setPageBackgroundColor] = useState('');
  const [pageBackgroundType, setPageBackgroundType] = useState<'colour' | 'gradient' | 'image' | 'animated-image'>('colour');
  const [pageBackgroundGradientType, setPageBackgroundGradientType] = useState<'linear' | 'radial'>('linear');
  const [pageBackgroundGradientColors, setPageBackgroundGradientColors] = useState('#000000,#ffffff');
  const [pageBackgroundGradientAngle, setPageBackgroundGradientAngle] = useState(180);
  const [pageBackgroundImageUrl, setPageBackgroundImageUrl] = useState('');
  const [pageBackgroundImageSize, setPageBackgroundImageSize] = useState<'cover' | 'contain' | 'auto'>('cover');
  const [pageBackgroundImagePosition, setPageBackgroundImagePosition] = useState('center');
  const [pageBackgroundAnimationType, setPageBackgroundAnimationType] = useState<'ken-burns' | 'parallax' | 'pulse'>('ken-burns');
  const [pageBackgroundAnimationDuration, setPageBackgroundAnimationDuration] = useState(10);
  const [savingPage, setSavingPage] = useState(false);
  const [pagePropertiesChanged, setPagePropertiesChanged] = useState(false);
  const [originalPageProperties, setOriginalPageProperties] = useState<string>('{}');

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
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Complex component editors state
  const [editingAccordion, setEditingAccordion] = useState<string | null>(null);
  const [editingTabs, setEditingTabs] = useState<string | null>(null);

  // Available modals for linking
  const [availableModals, setAvailableModals] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editingLogoGrid, setEditingLogoGrid] = useState<string | null>(null);
  const [editingAvatarCard, setEditingAvatarCard] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null);
  const [editingFeatureGrid, setEditingFeatureGrid] = useState<string | null>(null);
  const [editingPricingCard, setEditingPricingCard] = useState<string | null>(null);
  const [editingCarousel, setEditingCarousel] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Menu state
  const [menuConfig, setMenuConfig] = useState<MenuConfig>({
    enabled: true,
    menuType: 'burger',
    position: 'top',
    animation: 'slide-down',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#3b82f6',
    rightPanelItems: []
  });
  const [menuChanged, setMenuChanged] = useState(false);
  const [originalMenuConfig, setOriginalMenuConfig] = useState<string>('{}');
  const [savingMenu, setSavingMenu] = useState(false);
  const [menuPreviewPageId, setMenuPreviewPageId] = useState<string>('');
  const [menuPreviewMechanics, setMenuPreviewMechanics] = useState<MechanicInstance[]>([]);

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
        const scale = zoom / 100;
        const deltaX = (e.clientX - resizingMechanic.startX) / scale;
        const deltaY = (e.clientY - resizingMechanic.startY) / scale;
        
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
        const scale = zoom / 100;
        const x = Math.max(0, Math.min((e.clientX - rect.left) / scale - dragOffset.x, rect.width / scale - 50));
        const y = Math.max(0, Math.min((e.clientY - rect.top) / scale - dragOffset.y, rect.height / scale - 50));

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
  }, [draggingMechanicId, resizingMechanic, dragOffset, mechanics, zoom]);

  // Load asset and pages when component mounts
  useEffect(() => {
    // Step 1: Framework loaded (component mounted)
    completeStep('framework');
    
    // Start loading data
    loadAssetAndPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  // Auto-fit zoom when page is selected or menu editor is opened
  useEffect(() => {
    if (canvasContainerRef.current && ((selectedPage && viewMode === 'page-editor') || (viewMode === 'menu-editor' && menuPreviewPageId))) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        handleZoomFit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedPage?.id, viewMode, menuPreviewPageId]);

  // Track page properties changes
  useEffect(() => {
    if (!selectedPage || originalPageProperties === '{}') return;

    const currentProps = {
      title: pageTitle,
      slug: pageSlug,
      status: pageStatus,
      transition_type: pageTransitionType,
      transition_duration: pageTransitionDuration,
      canvas_background_color: pageBackgroundColor,
      background_type: pageBackgroundType,
      background_gradient_type: pageBackgroundGradientType,
      background_gradient_colors: pageBackgroundGradientColors,
      background_gradient_angle: pageBackgroundGradientAngle,
      background_image_url: pageBackgroundImageUrl,
      background_image_size: pageBackgroundImageSize,
      background_image_position: pageBackgroundImagePosition,
      background_animation_type: pageBackgroundAnimationType,
      background_animation_duration: pageBackgroundAnimationDuration,
    };

    const hasChanged = JSON.stringify(currentProps) !== originalPageProperties;
    setPagePropertiesChanged(hasChanged);
  }, [
    pageTitle, pageSlug, pageStatus, pageTransitionType, pageTransitionDuration,
    pageBackgroundColor, pageBackgroundType, pageBackgroundGradientType,
    pageBackgroundGradientColors, pageBackgroundGradientAngle, pageBackgroundImageUrl,
    pageBackgroundImageSize, pageBackgroundImagePosition, pageBackgroundAnimationType,
    pageBackgroundAnimationDuration, originalPageProperties, selectedPage
  ]);

  // Load available published modals for linking
  useEffect(() => {
    const loadModals = async () => {
      if (!asset?.workspace_id) return;
      
      try {
        const response = await fetch(`/api/modals?workspace_id=${asset.workspace_id}&status=published`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setAvailableModals(data.map((m: any) => ({
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
  }, [asset?.workspace_id]);

  const loadAssetAndPages = async () => {
    try {
      // Fetch asset, pages, and menu config
      const [assetRes, pagesRes, menuRes] = await Promise.all([
        fetch(`/api/assets/${assetId}`),
        fetch(`/api/assets/${assetId}/pages`),
        fetch(`/api/assets/${assetId}/menu`)
      ]);

      // Handle asset data
      if (!assetRes.ok) throw new Error('Failed to load asset');
      const assetData = await assetRes.json();
      const asset = assetData.asset;
      setAsset(asset);
      setTitle(asset.title);
      setSlug(asset.slug);
      setDescription(asset.description || '');
      setStatus(asset.status);
      setCanvasBackgroundColor(asset.canvas_background_color || '#ffffff');
      setCanvasTextColor(asset.canvas_text_color || '#000000');

      // Handle pages data
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        setPages(pagesData.pages || []);
      } else {
        setPages([]);
      }

      // Handle menu data
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuConfig(menuData.menuConfig);
        setOriginalMenuConfig(JSON.stringify(menuData.menuConfig));
      }
      
      // Step 2: Pages built
      completeStep('pages');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Step 3: Modals collated
      completeStep('modals');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Step 4: APIs tested
      completeStep('apis');
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (err) {
      setError('Failed to load asset');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
      // Hide global loading after brief pause
      setTimeout(() => hideLoading(), 500);
    }
  };

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

  const handleGlobalBackgroundColorChange = async (newColor: string) => {
    // Update the state immediately for preview
    setCanvasBackgroundColor(newColor);

    // Check if there are pages to update
    if (pages.length === 0) {
      return; // No pages, just update the asset setting
    }

    // Prompt user to confirm applying to all pages
    const confirmed = await confirm({
      title: 'Apply Background Color to All Pages?',
      description: `Do you want to apply the color ${newColor} to all ${pages.length} page(s)? You can still change individual page backgrounds later.`,
      confirmText: 'Apply to All Pages',
      cancelText: 'Just Asset Setting',
      variant: 'warning',
    });

    if (confirmed) {
      // Update all pages with the new background color
      try {
        const updatePromises = pages.map(page =>
          fetch(`/api/pages/${page.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              canvas_background_color: newColor,
              background_type: 'colour',
            }),
          })
        );

        await Promise.all(updatePromises);
        
        // Reload pages to reflect the changes
        await loadPages();
        
        // If a page is currently selected, update its background color in the state
        if (selectedPage) {
          setPageBackgroundColor(newColor);
          setPageBackgroundType('colour');
        }
      } catch (err) {
        console.error('Failed to update pages:', err);
        setError('Failed to apply background color to all pages');
      }
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
    setPageBackgroundType(page.background_type || 'colour');
    setPageBackgroundGradientType(page.background_gradient_type || 'linear');
    setPageBackgroundGradientColors(page.background_gradient_colors || '#000000,#ffffff');
    setPageBackgroundGradientAngle(page.background_gradient_angle || 180);
    setPageBackgroundImageUrl(page.background_image_url || '');
    setPageBackgroundImageSize(page.background_image_size || 'cover');
    setPageBackgroundImagePosition(page.background_image_position || 'center');
    setPageBackgroundAnimationType(page.background_animation_type || 'ken-burns');
    setPageBackgroundAnimationDuration(page.background_animation_duration || 10);
    
    // Capture original page properties for change tracking
    const pageProps = {
      title: page.title,
      slug: page.slug,
      status: page.status || 'draft',
      transition_type: page.transition_type || 'fade',
      transition_duration: page.transition_duration || 300,
      canvas_background_color: page.canvas_background_color || '',
      background_type: page.background_type || 'colour',
      background_gradient_type: page.background_gradient_type || 'linear',
      background_gradient_colors: page.background_gradient_colors || '#000000,#ffffff',
      background_gradient_angle: page.background_gradient_angle || 180,
      background_image_url: page.background_image_url || '',
      background_image_size: page.background_image_size || 'cover',
      background_image_position: page.background_image_position || 'center',
      background_animation_type: page.background_animation_type || 'ken-burns',
      background_animation_duration: page.background_animation_duration || 10,
    };
    setOriginalPageProperties(JSON.stringify(pageProps));
    setPagePropertiesChanged(false);
    
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

    // Show confirmation dialog if properties have changed
    if (pagePropertiesChanged) {
      const confirmed = await confirm({
        title: 'Save Page Properties?',
        description: 'Are you sure you want to save these changes to the page properties?',
        confirmText: 'Save Changes',
        cancelText: 'Cancel',
        variant: 'info',
      });

      if (!confirmed) {
        return;
      }
    }

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
          background_type: pageBackgroundType,
          background_gradient_type: pageBackgroundGradientType,
          background_gradient_colors: pageBackgroundGradientColors,
          background_gradient_angle: pageBackgroundGradientAngle,
          background_image_url: pageBackgroundImageUrl || null,
          background_image_size: pageBackgroundImageSize,
          background_image_position: pageBackgroundImagePosition,
          background_animation_type: pageBackgroundAnimationType,
          background_animation_duration: pageBackgroundAnimationDuration,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save page');
      }

      const data = await res.json();
      setSelectedPage(data.page);
      await loadPages();
      
      // Update original properties and reset changed flag
      const pageProps = {
        title: pageTitle,
        slug: pageSlug,
        status: pageStatus,
        transition_type: pageTransitionType,
        transition_duration: pageTransitionDuration,
        canvas_background_color: pageBackgroundColor || '',
        background_type: pageBackgroundType,
        background_gradient_type: pageBackgroundGradientType,
        background_gradient_colors: pageBackgroundGradientColors,
        background_gradient_angle: pageBackgroundGradientAngle,
        background_image_url: pageBackgroundImageUrl || '',
        background_image_size: pageBackgroundImageSize,
        background_image_position: pageBackgroundImagePosition,
        background_animation_type: pageBackgroundAnimationType,
        background_animation_duration: pageBackgroundAnimationDuration,
      };
      setOriginalPageProperties(JSON.stringify(pageProps));
      setPagePropertiesChanged(false);
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
    const scale = zoom / 100;
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

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

  const handleMoveLayer = (id: string, direction: 'up' | 'down', steps: number = 1) => {
    setMechanics(prevMechanics => {
      // Sort by layer to get visual order
      const sortedMechanics = [...prevMechanics].sort((a, b) => a.layer - b.layer);
      const currentIndex = sortedMechanics.findIndex(m => m.id === id);
      
      if (currentIndex === -1) return prevMechanics;
      
      // Calculate target index with bounds checking
      let targetIndex = direction === 'up' 
        ? Math.max(0, currentIndex - steps)
        : Math.min(sortedMechanics.length - 1, currentIndex + steps);
      
      // No change needed
      if (targetIndex === currentIndex) return prevMechanics;
      
      // Remove element from current position and insert at target
      const [movedElement] = sortedMechanics.splice(currentIndex, 1);
      sortedMechanics.splice(targetIndex, 0, movedElement);
      
      // Renumber all layers sequentially
      const layerMap = new Map<string, number>();
      sortedMechanics.forEach((mech, index) => {
        layerMap.set(mech.id, index + 1);
      });
      
      // Apply new layer numbers to all mechanics
      return prevMechanics.map(m => ({
        ...m,
        layer: layerMap.get(m.id) || m.layer
      }));
    });
    setMechanicsChanged(true);
  };

  const handleSendToFront = (id: string) => {
    setMechanics(prevMechanics => {
      const sortedMechanics = [...prevMechanics].sort((a, b) => a.layer - b.layer);
      const currentIndex = sortedMechanics.findIndex(m => m.id === id);
      
      if (currentIndex === -1 || currentIndex === 0) return prevMechanics; // Already at front
      
      // Remove element and insert at front (index 0)
      const [movedElement] = sortedMechanics.splice(currentIndex, 1);
      sortedMechanics.unshift(movedElement);
      
      // Renumber all layers sequentially
      const layerMap = new Map<string, number>();
      sortedMechanics.forEach((mech, index) => {
        layerMap.set(mech.id, index + 1);
      });
      
      // Apply new layer numbers to all mechanics
      return prevMechanics.map(m => ({
        ...m,
        layer: layerMap.get(m.id) || m.layer
      }));
    });
    setMechanicsChanged(true);
  };

  const handleSendToBack = (id: string) => {
    setMechanics(prevMechanics => {
      const sortedMechanics = [...prevMechanics].sort((a, b) => a.layer - b.layer);
      const currentIndex = sortedMechanics.findIndex(m => m.id === id);
      
      if (currentIndex === -1 || currentIndex === sortedMechanics.length - 1) return prevMechanics; // Already at back
      
      // Remove element and insert at back (end of array)
      const [movedElement] = sortedMechanics.splice(currentIndex, 1);
      sortedMechanics.push(movedElement);
      
      // Renumber all layers sequentially
      const layerMap = new Map<string, number>();
      sortedMechanics.forEach((mech, index) => {
        layerMap.set(mech.id, index + 1);
      });
      
      // Apply new layer numbers to all mechanics
      return prevMechanics.map(m => ({
        ...m,
        layer: layerMap.get(m.id) || m.layer
      }));
    });
    setMechanicsChanged(true);
  };

  const handleMoveMechanic = (index: number, direction: 'up' | 'down') => {
    // This function is now deprecated with absolute positioning
    // Keeping for backwards compatibility
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleZoomFit = () => {
    if (!canvasRef.current || !canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    
    const containerWidth = container.clientWidth - 64;
    const containerHeight = container.clientHeight - 64;
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    
    const scaleX = (containerWidth / canvasWidth) * 100;
    const scaleY = (containerHeight / canvasHeight) * 100;
    
    setZoom(Math.floor(Math.min(scaleX, scaleY)));
    setPanOffset({ x: 0, y: 0 });
  };

  const getCanvasBackgroundStyle = () => {
    const style: React.CSSProperties = {};
    
    if (pageBackgroundType === 'colour') {
      style.backgroundColor = pageBackgroundColor || '#000000';
    } else if (pageBackgroundType === 'gradient') {
      const colors = pageBackgroundGradientColors.split(',').map(c => c.trim());
      if (pageBackgroundGradientType === 'linear') {
        style.backgroundImage = `linear-gradient(${pageBackgroundGradientAngle}deg, ${colors.join(', ')})`;
      } else {
        style.backgroundImage = `radial-gradient(circle, ${colors.join(', ')})`;
      }
    } else if (pageBackgroundType === 'image' || pageBackgroundType === 'animated-image') {
      if (pageBackgroundImageUrl) {
        style.backgroundImage = `url(${pageBackgroundImageUrl})`;
        style.backgroundSize = pageBackgroundImageSize;
        style.backgroundPosition = pageBackgroundImagePosition;
        style.backgroundRepeat = 'no-repeat';
      } else {
        style.backgroundColor = '#000000';
      }
    } else {
      style.backgroundColor = '#18181b'; // zinc-900 default
    }
    
    return style;
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

  const handlePublish = async (publishAll: boolean) => {
    setShowPublishModal(false);
    setSaving(true);
    setError('');

    try {
      if (publishAll) {
        // Update all pages to complete status sequentially to avoid race conditions
        console.log(`Updating ${pages.length} pages to complete status...`);
        
        for (const page of pages) {
          const res = await fetch(`/api/pages/${page.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'complete',
            }),
          });
          
          if (!res.ok) {
            const data = await res.json();
            throw new Error(`Failed to update page "${page.title}": ${data.error || 'Unknown error'}`);
          }
          
          console.log(`Updated page "${page.title}" to complete`);
        }
        
        console.log('All pages updated successfully');
        await loadPages();
      }

      // Update asset status to published
      const res = await fetch(`/api/assets/${assetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          status: 'published',
          canvas_background_color: canvasBackgroundColor,
          canvas_text_color: canvasTextColor,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to publish');
      }

      const data = await res.json();
      setAsset(data.asset);
      setStatus('published');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    const confirmed = await confirm({
      title: 'Unpublish Asset',
      description: 'Are you sure you want to unpublish this asset? It will no longer be publicly accessible.',
      confirmText: 'Unpublish',
      variant: 'warning',
    });

    if (!confirmed) return;

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
          status: 'draft',
          canvas_background_color: canvasBackgroundColor,
          canvas_text_color: canvasTextColor,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to unpublish');
      }

      const data = await res.json();
      setAsset(data.asset);
      setStatus('draft');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMenu = async () => {
    setSavingMenu(true);
    setError('');

    try {
      const res = await fetch(`/api/assets/${assetId}/menu`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuConfig),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save menu');
      }

      const data = await res.json();
      setMenuConfig(data.menuConfig);
      setOriginalMenuConfig(JSON.stringify(data.menuConfig));
      setMenuChanged(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingMenu(false);
    }
  };

  const handleMenuConfigChange = (newConfig: MenuConfig) => {
    setMenuConfig(newConfig);
    setMenuChanged(JSON.stringify(newConfig) !== originalMenuConfig);
  };

  const handleMenuPreviewPageSelect = async (pageId: string) => {
    setMenuPreviewPageId(pageId);
    
    // Load mechanics for the selected page
    try {
      const res = await fetch(`/api/pages/${pageId}`);
      if (!res.ok) throw new Error('Failed to load page');
      const data = await res.json();
      const page = data.page;
      
      const loadedMechanics = page.mechanics ? JSON.parse(page.mechanics) : [];
      setMenuPreviewMechanics(loadedMechanics);
    } catch (err) {
      console.error('Failed to load preview page:', err);
      setMenuPreviewMechanics([]);
    }
  };

  // Auto-select first page when entering menu-editor mode
  useEffect(() => {
    if (viewMode === 'menu-editor' && pages.length > 0 && !menuPreviewPageId) {
      handleMenuPreviewPageSelect(pages[0].id);
    }
  }, [viewMode, pages]);

  const isValidHexColor = (color: string): boolean => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };

  // Show nothing while loading (global loader is visible)
  if (loading) {
    return null;
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#09090b' }}>
        <p className="text-zinc-400">Asset not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen text-white flex flex-col overflow-hidden" style={{ backgroundColor: '#09090b' }}>
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-xl font-semibold">{asset.title}</h1>
              <p className="text-sm text-zinc-500">
                {selectedPage ? `Editing: ${selectedPage.title}` : `/${asset.slug}`}
              </p>
            </div>
            {viewMode === 'page-editor' && (
              <button
                onClick={() => setViewMode('asset')}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                title="Asset Properties"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
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
        <>
          <div className="border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
            <MechanicsToolbar 
              onAddMechanic={(type) => handleAddMechanic(type, 100, 100)}
            />
          </div>
          
          {/* Zoom Controls */}
          <div className="h-10 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Zoom:</span>
                <button
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-white w-10 text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomFit}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                  title="Fit to Screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-xs text-zinc-500">
                Hold Right-Click to pan / Scroll to zoom in/out
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              {selectedPage?.canvas_width || 1920}×{selectedPage?.canvas_height || 1080}px
            </div>
          </div>
        </>
      )}

      {/* Three-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Pages */}
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
            <h2 className="font-semibold">Pages</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  // Switch to menu editor view
                  setViewMode('menu-editor');
                  setSelectedPage(null);
                  setSelectedMechanicId(null);
                }}
                className={`p-1 rounded transition-colors ${
                  viewMode === 'menu-editor' 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title="Menu Settings"
              >
                <MenuIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleCreatePage}
                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                title="Add Page"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
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
                        <div className="flex-1">
                          <div className="font-medium text-sm">{page.title}</div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-zinc-500">/{page.slug}</div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              page.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                              page.status === 'qa' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-zinc-700 text-zinc-400'
                            }`}>
                              {page.status === 'complete' ? 'Complete' : page.status === 'qa' ? 'QA' : 'Draft'}
                            </span>
                          </div>
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
          <div 
            ref={canvasContainerRef}
            className="flex-1 overflow-hidden relative"
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              if (e.button === 2) {
                e.preventDefault();
                setIsPanning(true);
                setPanStart({ x: e.clientX, y: e.clientY });
              }
            }}
            onMouseMove={(e) => {
              if (isPanning) {
                const deltaX = e.clientX - panStart.x;
                const deltaY = e.clientY - panStart.y;
                setPanOffset({
                  x: panOffset.x + deltaX,
                  y: panOffset.y + deltaY,
                });
                setPanStart({ x: e.clientX, y: e.clientY });
              }
            }}
            onMouseUp={() => {
              if (isPanning) setIsPanning(false);
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -5 : 5;
              setZoom(prev => Math.max(25, Math.min(200, prev + delta)));
            }}
            style={{
              cursor: isPanning ? 'grabbing' : 'default',
              backgroundColor: '#09090b',
              backgroundImage: `
                linear-gradient(rgba(75, 205, 62, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(75, 205, 62, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center p-8"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
              }}
            >
              <div 
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="relative border-2 border-zinc-800 rounded-lg overflow-hidden select-none"
                style={{ 
                  ...getCanvasBackgroundStyle(),
                  width: '1920px !important' as any,
                  height: '1080px !important' as any,
                  minWidth: '1920px',
                  maxWidth: '1920px',
                  minHeight: '1080px',
                  maxHeight: '1080px',
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center',
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
                      <option value="qa">QA</option>
                      <option value="complete">Complete</option>
                    </select>
                    <p className="text-xs text-zinc-500 mt-1">
                      Draft: Edit mode only • QA: Edit + Preview • Complete: Edit + Preview + Live
                    </p>
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

                  {/* Page Background Configuration */}
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-sm font-medium mb-4">Page Background</h3>
                    <p className="text-xs text-zinc-500 mb-3">Configure background appearance for this page</p>
                    
                    {/* Background Type Dropdown */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Background Type</label>
                      <select
                        value={pageBackgroundType}
                        onChange={(e) => setPageBackgroundType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                      >
                        <option value="colour">Solid Colour</option>
                        <option value="gradient">Gradient</option>
                        <option value="image">Image</option>
                        <option value="animated-image">Animated Image</option>
                      </select>
                    </div>

                    {/* Colour Configuration */}
                    {pageBackgroundType === 'colour' && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium">Color</label>
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
                    )}

                    {/* Gradient Configuration */}
                    {pageBackgroundType === 'gradient' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Gradient Type</label>
                          <select
                            value={pageBackgroundGradientType}
                            onChange={(e) => setPageBackgroundGradientType(e.target.value as any)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          >
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Colors (comma-separated hex)</label>
                          <input
                            type="text"
                            value={pageBackgroundGradientColors}
                            onChange={(e) => setPageBackgroundGradientColors(e.target.value)}
                            placeholder="#000000,#ffffff"
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
                          />
                          <p className="text-xs text-zinc-500 mt-1">Example: #ff0000,#00ff00,#0000ff</p>
                        </div>

                        {pageBackgroundGradientType === 'linear' && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Angle (degrees)</label>
                            <input
                              type="number"
                              value={pageBackgroundGradientAngle}
                              onChange={(e) => setPageBackgroundGradientAngle(Number(e.target.value))}
                              min="0"
                              max="360"
                              step="15"
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                            />
                            <p className="text-xs text-zinc-500 mt-1">0° = top to bottom, 90° = left to right</p>
                          </div>
                        )}

                        {/* Gradient Preview */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Preview</label>
                          <div 
                            className="w-full h-20 rounded border border-zinc-700"
                            style={{
                              background: pageBackgroundGradientType === 'linear'
                                ? `linear-gradient(${pageBackgroundGradientAngle}deg, ${pageBackgroundGradientColors.split(',').join(', ')})`
                                : `radial-gradient(circle, ${pageBackgroundGradientColors.split(',').join(', ')})`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Image Configuration */}
                    {pageBackgroundType === 'image' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Image URL</label>
                          <input
                            type="text"
                            value={pageBackgroundImageUrl}
                            onChange={(e) => setPageBackgroundImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Image Size</label>
                          <select
                            value={pageBackgroundImageSize}
                            onChange={(e) => setPageBackgroundImageSize(e.target.value as any)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          >
                            <option value="cover">Cover (fill area)</option>
                            <option value="contain">Contain (fit inside)</option>
                            <option value="auto">Auto (original size)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Image Position</label>
                          <select
                            value={pageBackgroundImagePosition}
                            onChange={(e) => setPageBackgroundImagePosition(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          >
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="top left">Top Left</option>
                            <option value="top right">Top Right</option>
                            <option value="bottom left">Bottom Left</option>
                            <option value="bottom right">Bottom Right</option>
                          </select>
                        </div>

                        {/* Image Preview */}
                        {pageBackgroundImageUrl && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Preview</label>
                            <div 
                              className="w-full h-32 rounded border border-zinc-700"
                              style={{
                                backgroundImage: `url(${pageBackgroundImageUrl})`,
                                backgroundSize: pageBackgroundImageSize,
                                backgroundPosition: pageBackgroundImagePosition,
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Animated Image Configuration */}
                    {pageBackgroundType === 'animated-image' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Image URL</label>
                          <input
                            type="text"
                            value={pageBackgroundImageUrl}
                            onChange={(e) => setPageBackgroundImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Animation Type</label>
                          <select
                            value={pageBackgroundAnimationType}
                            onChange={(e) => setPageBackgroundAnimationType(e.target.value as any)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          >
                            <option value="ken-burns">Ken Burns (slow zoom/pan)</option>
                            <option value="parallax">Parallax (scroll effect)</option>
                            <option value="pulse">Pulse (subtle scale)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Animation Duration (seconds)</label>
                          <input
                            type="number"
                            value={pageBackgroundAnimationDuration}
                            onChange={(e) => setPageBackgroundAnimationDuration(Number(e.target.value))}
                            min="1"
                            max="60"
                            step="1"
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Image Size</label>
                          <select
                            value={pageBackgroundImageSize}
                            onChange={(e) => setPageBackgroundImageSize(e.target.value as any)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-blue-600 focus:outline-none text-white"
                          >
                            <option value="cover">Cover (fill area)</option>
                            <option value="contain">Contain (fit inside)</option>
                            <option value="auto">Auto (original size)</option>
                          </select>
                        </div>

                        {/* Animated Preview */}
                        {pageBackgroundImageUrl && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Preview (static)</label>
                            <div 
                              className="w-full h-32 rounded border border-zinc-700"
                              style={{
                                backgroundImage: `url(${pageBackgroundImageUrl})`,
                                backgroundSize: pageBackgroundImageSize,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                            <p className="text-xs text-zinc-500 mt-1">Animation will be active in live preview</p>
                          </div>
                        )}
                      </div>
                    )}
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
        ) : viewMode === 'menu-editor' ? (
          /* Menu Editor Canvas with Zoom Controls */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Zoom Controls for Menu Editor */}
            <div className="h-10 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Zoom:</span>
                  <button
                    onClick={handleZoomOut}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-white w-10 text-center">{zoom}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleZoomFit}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                    title="Fit to Screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-zinc-500">
                  Hold Right-Click to pan / Scroll to zoom in/out
                </div>
              </div>
              <div className="text-xs text-zinc-500">
                1920×1080px
              </div>
            </div>
            
            {/* Menu Live Preview with Page Background */}
            <div 
              ref={canvasContainerRef}
              className="flex-1 overflow-hidden relative"
              onContextMenu={(e) => e.preventDefault()}
              onMouseDown={(e) => {
                if (e.button === 2) {
                  e.preventDefault();
                  setIsPanning(true);
                  setPanStart({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseMove={(e) => {
                if (isPanning) {
                  const deltaX = e.clientX - panStart.x;
                  const deltaY = e.clientY - panStart.y;
                  setPanOffset({
                    x: panOffset.x + deltaX,
                    y: panOffset.y + deltaY,
                  });
                  setPanStart({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseUp={() => {
                if (isPanning) setIsPanning(false);
              }}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -5 : 5;
                setZoom(prev => Math.max(25, Math.min(200, prev + delta)));
              }}
              style={{
                cursor: isPanning ? 'grabbing' : 'default',
                backgroundColor: '#09090b',
                backgroundImage: `
                  linear-gradient(rgba(75, 205, 62, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(75, 205, 62, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            >
              <div 
                className="absolute inset-0 flex items-center justify-center p-8"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                {menuPreviewPageId ? (
                  <div
                    className="relative border-2 border-zinc-800 rounded-lg overflow-hidden"
                    style={{
                      width: '1920px !important' as any,
                      height: '1080px !important' as any,
                      minWidth: '1920px',
                      maxWidth: '1920px',
                      minHeight: '1080px',
                      maxHeight: '1080px',
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'center',
                      ...(() => {
                        const previewPage = pages.find(p => p.id === menuPreviewPageId);
                        if (!previewPage) return { backgroundColor: '#000000' };
                        
                        const style: React.CSSProperties = {};
                        if (previewPage.background_type === 'gradient') {
                          const colors = previewPage.background_gradient_colors?.split(',') || ['#000', '#fff'];
                          if (previewPage.background_gradient_type === 'radial') {
                            style.background = `radial-gradient(circle, ${colors.join(', ')})`;
                          } else {
                            style.background = `linear-gradient(${previewPage.background_gradient_angle || 180}deg, ${colors.join(', ')})`;
                          }
                        } else if (previewPage.background_type === 'image' || previewPage.background_type === 'animated-image') {
                          if (previewPage.background_image_url) {
                            style.backgroundImage = `url(${previewPage.background_image_url})`;
                            style.backgroundSize = previewPage.background_image_size || 'cover';
                            style.backgroundPosition = previewPage.background_image_position || 'center';
                          }
                        } else {
                          style.backgroundColor = previewPage.canvas_background_color || '#000000';
                        }
                        return style;
                      })()
                    }}
                  >
                    {/* Render page mechanics */}
                    {menuPreviewMechanics.map((mechanic) => (
                      <div
                        key={mechanic.id}
                        style={{
                          position: 'absolute',
                          left: `${mechanic.x}px`,
                          top: `${mechanic.y}px`,
                          width: mechanic.width ? `${mechanic.width}px` : 'auto',
                          height: mechanic.height ? `${mechanic.height}px` : 'auto',
                          zIndex: mechanic.layer || 1
                        }}
                      >
                        <MechanicRenderer
                          mechanic={mechanic}
                          mode="view"
                        />
                      </div>
                    ))}

                    {/* Menu overlaid on top */}
                    <Menu
                      {...menuConfig}
                      pages={pages.map(p => ({ id: p.id, title: p.title, slug: p.slug }))}
                      currentPage={pages.find(p => p.id === menuPreviewPageId)?.slug || ''}
                      mode="view"
                    />
                  </div>
                ) : (
                  <div className="text-zinc-500 text-center">
                    <p>No pages available for preview</p>
                  </div>
                )}
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

                  {/* Status - Read Only with Publish/Unpublish Button */}
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <input
                        type="text"
                        value={status.charAt(0).toUpperCase() + status.slice(1)}
                        readOnly
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-400 cursor-not-allowed"
                      />
                    </div>
                    {/* Publish Button (only for draft) */}
                    {status === 'draft' && (
                      <div>
                        <button
                          onClick={() => setShowPublishModal(true)}
                          disabled={saving}
                          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
                        >
                          Publish
                        </button>
                      </div>
                    )}
                    {/* Unpublish Button (only for published) */}
                    {status === 'published' && (
                      <div>
                        <button
                          onClick={handleUnpublish}
                          disabled={saving}
                          className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
                        >
                          Unpublish
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Canvas Colors */}
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-sm font-medium mb-4">Global Background Color</h3>
                    <p className="text-xs text-zinc-500 mb-4">Changes will prompt to apply to all pages</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <ColorPicker
                        label="Background"
                        value={canvasBackgroundColor}
                        onChange={handleGlobalBackgroundColorChange}
                      />

                      <ColorPicker
                        label="Text"
                        value={canvasTextColor}
                        onChange={setCanvasTextColor}
                      />
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
                onSendToFront={handleSendToFront}
                onSendToBack={handleSendToBack}
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

                    {/* Page Background Configuration */}
                    <div className="border-t border-zinc-800 pt-4">
                      <h3 className="text-sm font-medium mb-3">Page Background</h3>
                      
                      {/* Background Type Dropdown */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-2">Background Type</label>
                        <select
                          value={pageBackgroundType}
                          onChange={(e) => setPageBackgroundType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
                        >
                          <option value="colour">Solid Colour</option>
                          <option value="gradient">Gradient</option>
                          <option value="image">Image</option>
                          <option value="animated-image">Animated Image</option>
                        </select>
                      </div>

                      {/* Colour Configuration */}
                      {pageBackgroundType === 'colour' && (
                        <ColorPicker
                          label="Color"
                          value={pageBackgroundColor || canvasBackgroundColor}
                          onChange={setPageBackgroundColor}
                        />
                      )}

                      {/* Gradient Configuration */}
                      {pageBackgroundType === 'gradient' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-2">Gradient Type</label>
                            <select
                              value={pageBackgroundGradientType}
                              onChange={(e) => setPageBackgroundGradientType(e.target.value as any)}
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
                            >
                              <option value="linear">Linear</option>
                              <option value="radial">Radial</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-2">Colors</label>
                            <input
                              type="text"
                              value={pageBackgroundGradientColors}
                              onChange={(e) => setPageBackgroundGradientColors(e.target.value)}
                              placeholder="#000,#fff"
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-xs font-mono"
                            />
                            <p className="text-[10px] text-zinc-500 mt-1">Comma-separated</p>
                          </div>

                          {pageBackgroundGradientType === 'linear' && (
                            <div>
                              <label className="block text-xs font-medium mb-2">Angle: {pageBackgroundGradientAngle}°</label>
                              <input
                                type="range"
                                value={pageBackgroundGradientAngle}
                                onChange={(e) => setPageBackgroundGradientAngle(Number(e.target.value))}
                                min="0"
                                max="360"
                                step="15"
                                className="w-full"
                              />
                            </div>
                          )}

                          {/* Gradient Preview */}
                          <div 
                            className="w-full h-16 rounded border border-zinc-700"
                            style={{
                              background: pageBackgroundGradientType === 'linear'
                                ? `linear-gradient(${pageBackgroundGradientAngle}deg, ${pageBackgroundGradientColors.split(',').join(', ')})`
                                : `radial-gradient(circle, ${pageBackgroundGradientColors.split(',').join(', ')})`
                            }}
                          />
                        </div>
                      )}

                      {/* Image Configuration */}
                      {pageBackgroundType === 'image' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-2">Image URL</label>
                            <input
                              type="text"
                              value={pageBackgroundImageUrl}
                              onChange={(e) => setPageBackgroundImageUrl(e.target.value)}
                              placeholder="https://..."
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-2">Size</label>
                            <select
                              value={pageBackgroundImageSize}
                              onChange={(e) => setPageBackgroundImageSize(e.target.value as any)}
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
                            >
                              <option value="cover">Cover</option>
                              <option value="contain">Contain</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-2">Position</label>
                            <select
                              value={pageBackgroundImagePosition}
                              onChange={(e) => setPageBackgroundImagePosition(e.target.value)}
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
                            >
                              <option value="center">Center</option>
                              <option value="top">Top</option>
                              <option value="bottom">Bottom</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>

                          {/* Image Preview */}
                          {pageBackgroundImageUrl && (
                            <div 
                              className="w-full h-24 rounded border border-zinc-700"
                              style={{
                                backgroundImage: `url(${pageBackgroundImageUrl})`,
                                backgroundSize: pageBackgroundImageSize,
                                backgroundPosition: pageBackgroundImagePosition,
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Animated Image Configuration */}
                      {pageBackgroundType === 'animated-image' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-2">Image URL</label>
                            <input
                              type="text"
                              value={pageBackgroundImageUrl}
                              onChange={(e) => setPageBackgroundImageUrl(e.target.value)}
                              placeholder="https://..."
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-2">Animation</label>
                            <select
                              value={pageBackgroundAnimationType}
                              onChange={(e) => setPageBackgroundAnimationType(e.target.value as any)}
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
                            >
                              <option value="ken-burns">Ken Burns</option>
                              <option value="parallax">Parallax</option>
                              <option value="pulse">Pulse</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-2">Duration: {pageBackgroundAnimationDuration}s</label>
                            <input
                              type="range"
                              value={pageBackgroundAnimationDuration}
                              onChange={(e) => setPageBackgroundAnimationDuration(Number(e.target.value))}
                              min="1"
                              max="60"
                              step="1"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-2">Size</label>
                            <select
                              value={pageBackgroundImageSize}
                              onChange={(e) => setPageBackgroundImageSize(e.target.value as any)}
                              className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
                            >
                              <option value="cover">Cover</option>
                              <option value="contain">Contain</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>

                          {/* Preview */}
                          {pageBackgroundImageUrl && (
                            <div>
                              <div 
                                className="w-full h-24 rounded border border-zinc-700"
                                style={{
                                  backgroundImage: `url(${pageBackgroundImageUrl})`,
                                  backgroundSize: pageBackgroundImageSize,
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                                }}
                              />
                              <p className="text-[10px] text-zinc-500 mt-1">Static preview</p>
                            </div>
                          )}
                        </div>
                      )}
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

                    {/* External Editor Buttons */}
                    {selectedMechanic && ['accordion', 'tabs', 'gridlayout', 'logogrid', 'avatarcard', 'table', 'testimonial', 'featuregrid', 'pricingcard', 'carousel'].includes(selectedMechanic.type) && (
                      <div className="pb-4 border-b border-zinc-800">
                        <button
                          onClick={() => {
                            if (selectedMechanic.type === 'accordion') setEditingAccordion(selectedMechanic.id);
                            else if (selectedMechanic.type === 'tabs') setEditingTabs(selectedMechanic.id);
                            else if (selectedMechanic.type === 'gridlayout') setEditingGrid(selectedMechanic.id);
                            else if (selectedMechanic.type === 'logogrid') setEditingLogoGrid(selectedMechanic.id);
                            else if (selectedMechanic.type === 'avatarcard') setEditingAvatarCard(selectedMechanic.id);
                            else if (selectedMechanic.type === 'table') setEditingTable(selectedMechanic.id);
                            else if (selectedMechanic.type === 'testimonial') setEditingTestimonial(selectedMechanic.id);
                            else if (selectedMechanic.type === 'featuregrid') setEditingFeatureGrid(selectedMechanic.id);
                            else if (selectedMechanic.type === 'pricingcard') setEditingPricingCard(selectedMechanic.id);
                            else if (selectedMechanic.type === 'carousel') setEditingCarousel(selectedMechanic.id);
                          }}
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
                        >
                          Edit {selectedMechanic.type === 'gridlayout' ? 'Grid' : selectedMechanic.type === 'logogrid' ? 'Logos' : selectedMechanic.type === 'avatarcard' ? 'Avatar' : selectedMechanic.type === 'featuregrid' ? 'Features' : selectedMechanic.type === 'pricingcard' ? 'Plans' : selectedMechanic.type === 'testimonial' ? 'Testimonials' : selectedMechanic.type === 'carousel' ? 'Slides' : selectedMechanic.type.charAt(0).toUpperCase() + selectedMechanic.type.slice(1)}
                        </button>
                      </div>
                    )}

                    {/* Mechanic-Specific Properties - Skip for complex components with dedicated editors */}
                    {selectedMechanic && !['tabs', 'accordion', 'gridlayout', 'logogrid', 'avatarcard', 'table', 'testimonial', 'featuregrid', 'pricingcard', 'carousel'].includes(selectedMechanic.type) && (() => {
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
                            // Special handling for Button actionValue
                            selectedMechanic.type === 'button' && propName === 'actionValue' ? (
                              // When action is "goto", show page dropdown
                              selectedMechanic.props.action === 'goto' ? (
                                <select
                                  value={selectedMechanic.props[propName] || ''}
                                  onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                                >
                                  <option value="">Select a page</option>
                                  {pages.filter(p => p.id !== selectedPage?.id).map(page => (
                                    <option key={page.id} value={page.slug}>
                                      {page.title} ({page.slug})
                                    </option>
                                  ))}
                                </select>
                              ) : selectedMechanic.props.action === 'modal' ? (
                                // When action is "modal", show modal dropdown (placeholder for now)
                                <div className="space-y-2">
                                  <select
                                    value={selectedMechanic.props[propName] || ''}
                                    onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                                  >
                                    <option value="">Select a modal</option>
                                    <option value="modal-1">Modal 1 (Coming Soon)</option>
                                    <option value="modal-2">Modal 2 (Coming Soon)</option>
                                  </select>
                                  <p className="text-xs text-zinc-500">
                                    Modal system will be implemented as workspace-level assets
                                  </p>
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={selectedMechanic.props[propName] || ''}
                                  onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                                  placeholder={propDef.placeholder}
                                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                                />
                              )
                            ) : (
                              <input
                                type="text"
                                value={selectedMechanic.props[propName] || ''}
                                onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                                placeholder={propDef.placeholder}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                              />
                            )
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
                          <ColorPicker
                            value={selectedMechanic.props[propName] || '#ffffff'}
                            onChange={(color) => handleMechanicPropChange(propName, color)}
                          />
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
                  </>
                )
              })()}

                    {/* Custom Array Editors for Complex Components */}
                    {(selectedMechanic.type === 'tabs' || selectedMechanic.type === 'accordion' || selectedMechanic.type === 'gridlayout' || selectedMechanic.type === 'logogrid' || selectedMechanic.type === 'avatarcard' || selectedMechanic.type === 'table' || selectedMechanic.type === 'testimonial' || selectedMechanic.type === 'featuregrid') && (
                      <div className="pt-4 mt-4 border-t border-zinc-800">
                        <button
                          onClick={() => {
                            if (selectedMechanic.type === 'tabs') setEditingTabs(selectedMechanic.id);
                            else if (selectedMechanic.type === 'accordion') setEditingAccordion(selectedMechanic.id);
                            else if (selectedMechanic.type === 'gridlayout') setEditingGrid(selectedMechanic.id);
                            else if (selectedMechanic.type === 'logogrid') setEditingLogoGrid(selectedMechanic.id);
                            else if (selectedMechanic.type === 'avatarcard') setEditingAvatarCard(selectedMechanic.id);
                            else if (selectedMechanic.type === 'table') setEditingTable(selectedMechanic.id);
                            else if (selectedMechanic.type === 'testimonial') setEditingTestimonial(selectedMechanic.id);
                            else if (selectedMechanic.type === 'featuregrid') setEditingFeatureGrid(selectedMechanic.id);
                          }}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Settings className="w-4 h-4" />
                          Edit {selectedMechanic.type === 'tabs' ? 'Tabs' : selectedMechanic.type === 'accordion' ? 'Accordion' : selectedMechanic.type === 'gridlayout' ? 'Grid Layout' : selectedMechanic.type === 'logogrid' ? 'Logo Grid' : selectedMechanic.type === 'avatarcard' ? 'Avatar Card' : selectedMechanic.type === 'table' ? 'Table' : selectedMechanic.type === 'testimonial' ? 'Testimonial' : 'Feature Grid'}
                        </button>
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                          Opens a dedicated editor for managing {selectedMechanic.type === 'tabs' ? 'tab' : selectedMechanic.type === 'accordion' ? 'accordion' : selectedMechanic.type === 'gridlayout' ? 'grid' : selectedMechanic.type === 'logogrid' ? 'logo' : selectedMechanic.type === 'avatarcard' ? 'avatar card' : selectedMechanic.type === 'table' ? 'table' : selectedMechanic.type === 'testimonial' ? 'testimonial' : 'feature'} properties
                        </p>
                      </div>
                    )}

                    {selectedMechanic.type === 'tabs_OLD_INLINE_EDITOR' && (
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

                    {selectedMechanic.type === 'accordion_OLD_INLINE_EDITOR' && (
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

                    {selectedMechanic.type === 'gridlayout_OLD_INLINE_EDITOR' && (
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
                  </div>
                </div>
              ) : null}
              </div>
            </div>
          )
        ) : viewMode === 'menu-editor' ? (
          /* Menu Editor Panel */
          <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
            <MenuEditorPanel
              config={menuConfig}
              onChange={handleMenuConfigChange}
              onSave={handleSaveMenu}
              saving={savingMenu}
              changed={menuChanged}
              pages={pages.map(p => ({ id: p.id, title: p.title, slug: p.slug }))}
              selectedPageId={menuPreviewPageId}
              onPageSelect={handleMenuPreviewPageSelect}
            />
          </div>
        ) : null}
      </div>

      <ConfirmDialog />
      <UnsavedDialog />

      {/* Complex Component Editors */}
      {editingAccordion && selectedMechanic && selectedMechanic.type === 'accordion' && (
        <AccordionEditor
          sections={(selectedMechanic.props.items || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            mechanics: [] // TODO: Load mechanics if stored
          }))}
          onSave={(sections) => {
            handleMechanicPropChange('items', sections.map(s => ({
              id: s.id,
              title: s.title,
              content: '' // This will be replaced by mechanics
            })));
            setEditingAccordion(null);
          }}
          onClose={() => setEditingAccordion(null)}
        />
      )}

      {editingTabs && selectedMechanic && selectedMechanic.type === 'tabs' && (
        <TabsEditor
          tabs={(selectedMechanic.props.tabs || []).map((tab: any) => ({
            id: tab.id,
            label: tab.label,
            mechanics: tab.mechanics || []
          }))}
          settings={{
            backgroundColor: selectedMechanic.props.backgroundColor,
            pageWidth: selectedMechanic.props.pageWidth || 1200,
            pageHeight: selectedMechanic.props.pageHeight || 800,
            tabBarBackgroundColor: selectedMechanic.props.tabBarBackgroundColor,
            tabStyle: selectedMechanic.props.tabStyle,
            tabPosition: selectedMechanic.props.tabPosition,
            activeColor: selectedMechanic.props.activeColor,
            inactiveColor: selectedMechanic.props.inactiveColor,
            textColor: selectedMechanic.props.textColor,
            borderColor: selectedMechanic.props.borderColor,
            tabSpacing: selectedMechanic.props.tabSpacing,
          }}
          availableModals={availableModals}
          onSave={(tabs, settings) => {
            // Update all properties at once to avoid state batching issues
            if (!selectedMechanicId) return;
            
            setMechanics(mechanics.map(m => 
              m.id === selectedMechanicId 
                ? { 
                    ...m, 
                    props: { 
                      ...m.props,
                      tabs: tabs.map(t => ({
                        id: t.id,
                        label: t.label,
                        mechanics: t.mechanics
                      })),
                      backgroundColor: settings.backgroundColor,
                      tabBarBackgroundColor: settings.tabBarBackgroundColor,
                      pageWidth: settings.pageWidth,
                      pageHeight: settings.pageHeight,
                      tabStyle: settings.tabStyle,
                      tabPosition: settings.tabPosition,
                      activeColor: settings.activeColor,
                      inactiveColor: settings.inactiveColor,
                      textColor: settings.textColor,
                      borderColor: settings.borderColor,
                      tabSpacing: settings.tabSpacing,
                    } 
                  }
                : m
            ));
            setMechanicsChanged(true);
            setEditingTabs(null);
          }}
          onClose={() => setEditingTabs(null)}
        />
      )}

      {editingGrid && selectedMechanic && selectedMechanic.type === 'gridlayout' && (
        <GridEditor
          items={(selectedMechanic.props.items || []).map((item: any) => ({
            id: item.id,
            name: item.content || `Item ${item.id}`,
            mechanics: []
          }))}
          onSave={(items) => {
            handleMechanicPropChange('items', items.map(i => ({
              id: i.id,
              content: i.name,
              backgroundColor: '#f3f4f6',
              textColor: '#1f2937'
            })));
            setEditingGrid(null);
          }}
          onClose={() => setEditingGrid(null)}
        />
      )}

      {editingLogoGrid && selectedMechanic && selectedMechanic.type === 'logogrid' && (
        <LogoGridEditor
          logos={(() => {
            try {
              return JSON.parse(selectedMechanic.props.logos || '[]');
            } catch {
              return [];
            }
          })()}
          onSave={(logos) => {
            handleMechanicPropChange('logos', JSON.stringify(logos));
            setEditingLogoGrid(null);
          }}
          onClose={() => setEditingLogoGrid(null)}
        />
      )}

      {editingAvatarCard && selectedMechanic && selectedMechanic.type === 'avatarcard' && (
        <AvatarCardEditor
          imageUrl={selectedMechanic.props.imageUrl || ''}
          name={selectedMechanic.props.name || 'Team Member'}
          title={selectedMechanic.props.title || 'Position'}
          bio={selectedMechanic.props.bio || ''}
          email={selectedMechanic.props.email || ''}
          linkedin={selectedMechanic.props.linkedin || ''}
          twitter={selectedMechanic.props.twitter || ''}
          github={selectedMechanic.props.github || ''}
          layout={selectedMechanic.props.layout || 'vertical'}
          backgroundColor={selectedMechanic.props.backgroundColor || '#18181b'}
          textColor={selectedMechanic.props.textColor || '#ffffff'}
          onSave={(data) => {
            Object.entries(data).forEach(([key, value]) => {
              handleMechanicPropChange(key, value);
            });
            setEditingAvatarCard(null);
          }}
          onClose={() => setEditingAvatarCard(null)}
        />
      )}

      {editingTable && selectedMechanic && selectedMechanic.type === 'table' && (
        <TableEditor
          headers={(() => {
            try {
              return JSON.parse(selectedMechanic.props.headers || '[]');
            } catch {
              return ['Name', 'Role', 'Email'];
            }
          })()}
          rows={(() => {
            try {
              return JSON.parse(selectedMechanic.props.rows || '[]');
            } catch {
              return [['', '', '']];
            }
          })()}
          onSave={(headers, rows) => {
            handleMechanicPropChange('headers', JSON.stringify(headers));
            handleMechanicPropChange('rows', JSON.stringify(rows));
            setEditingTable(null);
          }}
          onClose={() => setEditingTable(null)}
        />
      )}

      {editingTestimonial && selectedMechanic && selectedMechanic.type === 'testimonial' && (
        <TestimonialEditor
          testimonials={(() => {
            try {
              return JSON.parse(selectedMechanic.props.testimonials || '[]');
            } catch {
              return [{id: '1', quote: 'Great!', author: 'User', role: 'Customer', rating: 5, image: ''}];
            }
          })()}
          onSave={(testimonials) => {
            handleMechanicPropChange('testimonials', JSON.stringify(testimonials));
            setEditingTestimonial(null);
          }}
          onClose={() => setEditingTestimonial(null)}
        />
      )}

      {editingFeatureGrid && selectedMechanic && selectedMechanic.type === 'featuregrid' && (
        <FeatureGridEditor
          features={(() => {
            try {
              return JSON.parse(selectedMechanic.props.features || '[]');
            } catch {
              return [{id: '1', icon: 'Zap', title: 'Feature', description: 'Description'}];
            }
          })()}
          onSave={(features) => {
            handleMechanicPropChange('features', JSON.stringify(features));
            setEditingFeatureGrid(null);
          }}
          onClose={() => setEditingFeatureGrid(null)}
        />
      )}

      {editingPricingCard && selectedMechanic && selectedMechanic.type === 'pricingcard' && (
        <PricingCardEditor
          plans={(() => {
            try {
              return JSON.parse(selectedMechanic.props.plans || '[]');
            } catch {
              return [{id: '1', name: 'Starter', price: '$29', period: 'per month', features: ['Feature 1'], highlighted: false, buttonText: 'Get Started', buttonLink: '#'}];
            }
          })()}
          onSave={(plans) => {
            handleMechanicPropChange('plans', JSON.stringify(plans));
            setEditingPricingCard(null);
          }}
          onClose={() => setEditingPricingCard(null)}
        />
      )}

      {editingCarousel && selectedMechanic && selectedMechanic.type === 'carousel' && (
        <CarouselEditor
          slides={(() => {
            try {
              return JSON.parse(selectedMechanic.props.slides || '[]');
            } catch {
              return [{id: '1', type: 'image', imageUrl: 'https://picsum.photos/800/400', caption: 'Slide 1'}];
            }
          })()}
          onSave={(slides) => {
            handleMechanicPropChange('slides', JSON.stringify(slides));
            setEditingCarousel(null);
          }}
          onClose={() => setEditingCarousel(null)}
        />
      )}

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
      />
    </div>
  );
}
