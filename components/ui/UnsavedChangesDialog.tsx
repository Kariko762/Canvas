'use client'

import { useEffect } from 'react'
import { Save, X, Trash2 } from 'lucide-react'

interface UnsavedChangesDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  onSaveAndContinue: () => void
  onDiscard: () => void
}

export function UnsavedChangesDialog({
  isOpen,
  onClose,
  onSave,
  onSaveAndContinue,
  onDiscard
}: UnsavedChangesDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 text-yellow-500">
            <Save className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Unsaved Changes
          </h3>
        </div>

        {/* Description */}
        <p className="text-zinc-400 mb-6">
          You have unsaved changes. What would you like to do?
        </p>

        {/* Actions - Stacked for visibility */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onSave()
              onClose()
            }}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save & Stay
          </button>
          
          <button
            onClick={() => {
              onSaveAndContinue()
              onClose()
            }}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save & Continue
          </button>
          
          <button
            onClick={() => {
              onDiscard()
              onClose()
            }}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Discard Changes
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-sm font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
