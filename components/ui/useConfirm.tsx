'use client'

import { useState, useCallback } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface ConfirmOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger'
  })
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions({
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'danger',
      ...opts
    })
    setIsOpen(true)

    return new Promise((resolve) => {
      setResolvePromise(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true)
    }
    setIsOpen(false)
  }, [resolvePromise])

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false)
    }
    setIsOpen(false)
  }, [resolvePromise])

  const ConfirmDialogComponent = useCallback(() => (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      {...options}
    />
  ), [isOpen, options, handleCancel, handleConfirm])

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent
  }
}
