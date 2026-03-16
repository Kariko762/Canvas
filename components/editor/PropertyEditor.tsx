'use client'

import { getMechanic } from '@/lib/mechanics-registry'
import type { MechanicInstance } from './CanvasEditor'

interface PropertyEditorProps {
  mechanic: MechanicInstance
  onPropertyChange: (property: string, value: any) => void
  onPositionChange: (property: 'x' | 'y' | 'width' | 'height' | 'layer' | 'name', value: any) => void
  onDelete: () => void
  additionalData?: {
    modals?: Array<{ id: string; title: string; slug: string }>
  }
}

export function PropertyEditor({ 
  mechanic, 
  onPropertyChange, 
  onPositionChange,
  onDelete,
  additionalData = {}
}: PropertyEditorProps) {
  const definition = getMechanic(mechanic.type)
  
  if (!definition) {
    return (
      <div className="p-6 text-center text-zinc-500">
        <p>Unknown mechanic type: {mechanic.type}</p>
      </div>
    )
  }

  // Check if this is a button and get the current action
  const isButton = mechanic.type === 'button'
  const currentAction = mechanic.props.action || 'next'

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Properties</h2>
          <p className="text-sm text-zinc-500 capitalize">{mechanic.type}</p>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
          title="Delete mechanic"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Position and Size Controls */}
      <div className="mb-6 pb-6 border-b border-zinc-800">
        <h3 className="text-sm font-semibold mb-3 text-zinc-400">Transform</h3>
        
        {mechanic.name !== undefined && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={mechanic.name || ''}
              onChange={(e) => onPositionChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">X</label>
            <input
              type="number"
              value={Math.round(mechanic.x)}
              onChange={(e) => onPositionChange('x', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Y</label>
            <input
              type="number"
              value={Math.round(mechanic.y)}
              onChange={(e) => onPositionChange('y', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm font-medium mb-2">Width</label>
            <input
              type="number"
              value={mechanic.width || 200}
              onChange={(e) => onPositionChange('width', parseInt(e.target.value) || 200)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <input
              type="number"
              value={mechanic.height || 100}
              onChange={(e) => onPositionChange('height', parseInt(e.target.value) || 100)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium mb-2">Layer</label>
          <input
            type="number"
            value={mechanic.layer}
            onChange={(e) => onPositionChange('layer', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white text-sm"
          />
        </div>
      </div>

      {/* Mechanic-Specific Properties */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold mb-3 text-zinc-400">Properties</h3>
        
        {Object.entries(definition.properties).map(([propName, propDef]) => {
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
                  value={mechanic.props[propName] || ''}
                  onChange={(e) => onPropertyChange(propName, e.target.value)}
                  placeholder={propDef.placeholder}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                />
              )}
              
              {propDef.type === 'textarea' && (
                <textarea
                  value={mechanic.props[propName] || ''}
                  onChange={(e) => onPropertyChange(propName, e.target.value)}
                  placeholder={propDef.placeholder}
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                />
              )}
              
              {propDef.type === 'number' && (
                <input
                  type="number"
                  value={mechanic.props[propName] || 0}
                  onChange={(e) => onPropertyChange(propName, parseFloat(e.target.value))}
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
                    value={mechanic.props[propName] || '#ffffff'}
                    onChange={(e) => onPropertyChange(propName, e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mechanic.props[propName] || '#ffffff'}
                    onChange={(e) => onPropertyChange(propName, e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
                  />
                </div>
              )}
              
              {propDef.type === 'select' && (
                <select
                  value={mechanic.props[propName] || propDef.defaultValue}
                  onChange={(e) => onPropertyChange(propName, e.target.value)}
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
                    checked={mechanic.props[propName] || false}
                    onChange={(e) => onPropertyChange(propName, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-zinc-400">Enabled</span>
                </label>
              )}
              
              {propDef.type === 'range' && (
                <div>
                  <input
                    type="range"
                    value={mechanic.props[propName] || propDef.defaultValue}
                    onChange={(e) => onPropertyChange(propName, parseFloat(e.target.value))}
                    min={propDef.min}
                    max={propDef.max}
                    step={propDef.step}
                    className="w-full"
                  />
                  <div className="text-sm text-zinc-500 text-center mt-1">
                    {mechanic.props[propName] || propDef.defaultValue}
                  </div>
                </div>
              )}
              
              {propDef.type === 'image' && (
                <input
                  type="text"
                  value={mechanic.props[propName] || ''}
                  onChange={(e) => onPropertyChange(propName, e.target.value)}
                  placeholder="Enter image URL"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                />
              )}
              
              {propDef.type === 'modalAsset' && (
                <select
                  value={mechanic.props[propName] || ''}
                  onChange={(e) => onPropertyChange(propName, e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                >
                  <option value="">-- Select Modal --</option>
                  {additionalData.modals?.map(modal => (
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
        })}
      </div>
    </div>
  )
}
