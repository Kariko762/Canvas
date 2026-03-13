'use client'

import { useState, useCallback } from 'react'
import { UnsavedChangesDialog } from '@/components/ui/UnsavedChangesDialog'

type UnsavedChangesAction = 'save' | 'saveAndContinue' | 'discard' | 'cancel'

export function useUnsavedChanges() {
  const [isOpen, setIsOpen] = useState(false)
  const [resolvePromise, setResolvePromise] = useState<((value: UnsavedChangesAction) => void) | null>(null)

  const prompt = useCallback((): Promise<UnsavedChangesAction> => {
    setIsOpen(true)

    return new Promise((resolve) => {
      setResolvePromise(() => resolve)
    })
  }, [])

  const handleSave = useCallback(() => {
    if (resolvePromise) {
      resolvePromise('save')
    }
    setIsOpen(false)
  }, [resolvePromise])

  const handleSaveAndContinue = useCallback(() => {
    if (resolvePromise) {
      resolvePromise('saveAndContinue')
    }
    setIsOpen(false)
  }, [resolvePromise])

  const handleDiscard = useCallback(() => {
    if (resolvePromise) {
      resolvePromise('discard')
    }
    setIsOpen(false)
  }, [resolvePromise])

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise('cancel')
    }
    setIsOpen(false)
  }, [resolvePromise])

  const UnsavedChangesDialogComponent = useCallback(() => (
    <UnsavedChangesDialog
      isOpen={isOpen}
      onClose={handleCancel}
      onSave={handleSave}
      onSaveAndContinue={handleSaveAndContinue}
      onDiscard={handleDiscard}
    />
  ), [isOpen, handleCancel, handleSave, handleSaveAndContinue, handleDiscard])

  return {
    prompt,
    UnsavedChangesDialog: UnsavedChangesDialogComponent
  }
}
