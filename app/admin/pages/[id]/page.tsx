'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Save, Trash2, GripVertical, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { nanoid } from 'nanoid'
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer'
import { 
  getAllMechanics, 
  getMechanicsByCategory,
  createMechanicInstance,
  getMechanic,
  type MechanicCategory 
} from '@/lib/mechanics-registry'
import { useConfirm } from '@/components/ui/useConfirm'
import { CircularLoader } from '@/components/ui/CircularLoader'

interface Page {
  id: string
  asset_id: string
  title: string
  slug: string
  order: number
  status: 'draft' | 'qa' | 'complete'
  mechanics: string | null
  created_at: string
  updated_at: string
}

interface MechanicInstance {
  id: string
  type: string
  props: Record<string, any>
}

interface Modal {
  id: string
  title: string
  slug: string
  workspace_id: string
  status: string
}

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string
  
  const [page, setPage] = useState<Page | null>(null)
  const [mechanics, setMechanics] = useState<MechanicInstance[]>([])
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null)
  const [mounting, setMounting] = useState(true) // Immediate loading state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showMechanicPicker, setShowMechanicPicker] = useState(false)
  const [modals, setModals] = useState<Modal[]>([])
  
  const { confirm, ConfirmDialog } = useConfirm()
  
  const selectedMechanic = mechanics.find(m => m.id === selectedMechanicId)
  const availableMechanics = getAllMechanics()

  // Clear mounting state after component mounts (immediate loading screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounting(false);
    }, 100); // Small delay to ensure loading screen shows
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadPage()
  }, [pageId])

  useEffect(() => {
    if (page) {
      loadModals()
    }
  }, [page])

  const loadModals = async () => {
    try {
      // Get workspace_id from page or use default
      const workspaceId = page?.asset_id || 'default'
      const res = await fetch(`/api/modals?workspace_id=${workspaceId}&status=published`)
      if (res.ok) {
        const data = await res.json()
        setModals(data || [])
      }
    } catch (err) {
      console.error('Failed to load modals:', err)
    }
  }

  const loadPage = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}`)
      if (!res.ok) throw new Error('Failed to load page')
      const data = await res.json()
      setPage(data.page)
      
      // Parse mechanics JSON
      if (data.page.mechanics) {
        try {
          const parsed = JSON.parse(data.page.mechanics)
          setMechanics(Array.isArray(parsed) ? parsed : [])
        } catch (e) {
          console.error('Failed to parse mechanics:', e)
          setMechanics([])
        }
      }
    } catch (err) {
      setError('Failed to load page')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mechanics: JSON.stringify(mechanics)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      const data = await res.json()
      setPage(data.page)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddMechanic = (type: string) => {
    const newMechanic = createMechanicInstance(type, nanoid())
    setMechanics([...mechanics, newMechanic])
    setSelectedMechanicId(newMechanic.id)
    setShowMechanicPicker(false)
  }

  const handleDeleteMechanic = async () => {
    if (!selectedMechanicId) return
    
    const confirmed = await confirm({
      title: 'Delete Mechanic',
      description: 'Are you sure you want to delete this mechanic?',
      confirmText: 'Delete',
      variant: 'danger'
    })

    if (!confirmed) return

    setMechanics(mechanics.filter(m => m.id !== selectedMechanicId))
    setSelectedMechanicId(null)
  }

  const handleMechanicPropChange = (propName: string, value: any) => {
    if (!selectedMechanicId) return
    
    setMechanics(mechanics.map(m => 
      m.id === selectedMechanicId 
        ? { ...m, props: { ...m.props, [propName]: value } }
        : m
    ))
  }

  const handleMoveMechanic = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= mechanics.length) return
    
    const newMechanics = [...mechanics]
    const temp = newMechanics[index]
    newMechanics[index] = newMechanics[newIndex]
    newMechanics[newIndex] = temp
    setMechanics(newMechanics)
  }

  // Show immediate loading screen (before compilation completes)
  if (mounting || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#09090b' }}>
        <CircularLoader 
          size={120}
          message={mounting ? "Initializing Page Editor..." : "Loading page data..."}
        />
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#09090b' }}>
        <p className="text-zinc-400">Page not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#09090b' }}>
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-900">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/assets/${page.asset_id}`}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{page.title}</h1>
            <p className="text-sm text-zinc-500">Edit Page</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/e/${page.asset_id}?from=editor`, '_blank')}
            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors flex items-center gap-2"
            title="Preview Live Version"
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setShowMechanicPicker(!showMechanicPicker)}
            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Mechanic
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-900/20 border border-red-800 text-red-400 rounded">
          {error}
        </div>
      )}

      {/* Mechanic Picker Modal */}
      {showMechanicPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMechanicPicker(false)}>
          <div className="bg-zinc-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Add Mechanic</h2>
            
            {(['content', 'media', 'decoration', 'layout'] as MechanicCategory[]).map(category => {
              const categoryMechanics = getMechanicsByCategory(category)
              if (categoryMechanics.length === 0) return null
              
              return (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 capitalize text-zinc-400">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryMechanics.map(mech => (
                      <button
                        key={mech.type}
                        onClick={() => handleAddMechanic(mech.type)}
                        className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left transition-colors"
                      >
                        <div className="font-semibold mb-1">{mech.name}</div>
                        <div className="text-sm text-zinc-400">{mech.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div 
          className="flex-1 overflow-y-auto p-8"
          style={{
            backgroundColor: '#09090b',
            backgroundImage: `
              linear-gradient(rgba(75, 205, 62, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(75, 205, 62, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        >
          <div className="max-w-4xl mx-auto">
            {mechanics.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-500 mb-4">No mechanics yet</p>
                <button
                  onClick={() => setShowMechanicPicker(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Mechanic
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {mechanics.map((mechanic, index) => (
                  <div key={mechanic.id} className="relative group">
                    {/* Reorder buttons */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveMechanic(index, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <GripVertical className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => handleMoveMechanic(index, 'down')}
                        disabled={index === mechanics.length - 1}
                        className="p-1 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <MechanicRenderer
                      mechanic={mechanic}
                      mode="edit"
                      onSelect={() => setSelectedMechanicId(mechanic.id)}
                      isSelected={selectedMechanicId === mechanic.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          {selectedMechanic ? (
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
                {selectedMechanic && (() => {
                  const definition = getMechanic(selectedMechanic.type)
                  if (!definition) return null
                  
                  // Check if this is a button and get the current action
                  const isButton = selectedMechanic.type === 'button'
                  const currentAction = selectedMechanic.props.action || 'next'
                  
                  return Object.entries(definition.properties).map(([propName, propDef]) => {
                    // For button mechanic, conditionally show actionValue or modalAsset based on action
                    if (isButton && propName === 'actionValue' && currentAction === 'modal') {
                      return null // Hide actionValue when action is modal
                    }
                    if (isButton && propName === 'modalAsset' && currentAction !== 'modal') {
                      return null // Hide modalAsset when action is not modal
                    }
                    
                    return (
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
                      
                      {propDef.type === 'modalAsset' && (
                        <select
                          value={selectedMechanic.props[propName] || ''}
                          onChange={(e) => handleMechanicPropChange(propName, e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                        >
                          <option value="">-- Select Modal --</option>
                          {modals.map(modal => (
                            <option key={modal.id} value={modal.id}>
                              {modal.title} ({modal.slug})
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {propDef.help && (
                        <p className="text-xs text-zinc-500 mt-1">{propDef.help}</p>
                      )}
                    </div>
                  )
                  })
                })()}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500">
              <p>Select a mechanic to edit its properties</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog />

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(9, 9, 11, 0.9)' }}>
          <CircularLoader 
            size={120}
            message="Saving page..."
          />
        </div>
      )}
    </div>
  )
}
