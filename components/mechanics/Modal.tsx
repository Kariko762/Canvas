'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  mode?: 'edit' | 'view'
  triggerText?: string
  triggerStyle?: 'button' | 'link' | 'custom'
  triggerColor?: string
  title?: string
  content?: string
  modalWidth?: number
  modalMaxWidth?: string
  backgroundColor?: string
  overlayColor?: string
  overlayOpacity?: number
  borderRadius?: number
  padding?: number
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  closeButtonPosition?: 'inside' | 'outside'
  animationStyle?: 'fade' | 'scale' | 'slide-up' | 'slide-down'
  width?: number
  height?: number
}

export function Modal({
  mode = 'view',
  triggerText = 'Open Modal',
  triggerStyle = 'button',
  triggerColor = '#3b82f6',
  title = 'Modal Title',
  content = 'This is the modal content. You can add any text or information here.',
  modalWidth = 600,
  modalMaxWidth = '90vw',
  backgroundColor = '#ffffff',
  overlayColor = '#000000',
  overlayOpacity = 0.5,
  borderRadius = 12,
  padding = 24,
  closeOnOverlayClick = true,
  showCloseButton = true,
  closeButtonPosition = 'inside',
  animationStyle = 'scale',
  width,
  height
}: ModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => setIsOpen(false), 300)
  }

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      handleClose()
    }
  }

  const getTriggerStyle = () => {
    const baseStyle = {
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }

    switch (triggerStyle) {
      case 'button':
        return {
          ...baseStyle,
          padding: '10px 20px',
          backgroundColor: triggerColor,
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600
        }
      case 'link':
        return {
          ...baseStyle,
          color: triggerColor,
          textDecoration: 'underline',
          background: 'none',
          border: 'none',
          fontSize: '14px'
        }
      case 'custom':
        return {
          ...baseStyle,
          background: 'none',
          border: `2px solid ${triggerColor}`,
          color: triggerColor,
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '14px'
        }
    }
  }

  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayColor,
    opacity: isAnimating ? overlayOpacity : 0,
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  }

  const getModalStyle = () => {
    const baseStyle = {
      backgroundColor,
      borderRadius: `${borderRadius}px`,
      padding: `${padding}px`,
      width: `${modalWidth}px`,
      maxWidth: modalMaxWidth,
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative' as const,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease'
    }

    switch (animationStyle) {
      case 'scale':
        return {
          ...baseStyle,
          transform: isAnimating ? 'scale(1)' : 'scale(0.9)',
          opacity: isAnimating ? 1 : 0
        }
      case 'slide-up':
        return {
          ...baseStyle,
          transform: isAnimating ? 'translateY(0)' : 'translateY(50px)',
          opacity: isAnimating ? 1 : 0
        }
      case 'slide-down':
        return {
          ...baseStyle,
          transform: isAnimating ? 'translateY(0)' : 'translateY(-50px)',
          opacity: isAnimating ? 1 : 0
        }
      case 'fade':
      default:
        return {
          ...baseStyle,
          opacity: isAnimating ? 1 : 0
        }
    }
  }

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: closeButtonPosition === 'inside' ? `${padding}px` : `-${padding + 12}px`,
    right: closeButtonPosition === 'inside' ? `${padding}px` : `-${padding + 12}px`,
    background: closeButtonPosition === 'inside' ? 'transparent' : '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: closeButtonPosition === 'inside' ? '#64748b' : '#1f2937'
  }

  if (mode === 'edit') {
    return (
      <div style={{ width: width || 'auto', height: height || 'auto' }}>
        <button style={getTriggerStyle()}>
          {triggerText}
        </button>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
          (Modal preview in edit mode)
        </div>
      </div>
    )
  }

  return (
    <>
      <button 
        style={getTriggerStyle()}
        onClick={() => setIsOpen(true)}
      >
        {triggerText}
      </button>

      {isOpen && (
        <div style={overlayStyle} onClick={handleOverlayClick}>
          <div style={getModalStyle()} onClick={(e) => e.stopPropagation()}>
            {showCloseButton && (
              <button
                style={closeButtonStyle}
                onClick={handleClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                  e.currentTarget.style.backgroundColor = closeButtonPosition === 'inside' ? '#f3f4f6' : '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.backgroundColor = closeButtonPosition === 'inside' ? 'transparent' : '#ffffff'
                }}
              >
                <X size={20} />
              </button>
            )}
            
            {title && (
              <h2 style={{
                margin: 0,
                marginBottom: `${padding / 2}px`,
                fontSize: '24px',
                fontWeight: 700,
                color: '#1f2937'
              }}>
                {title}
              </h2>
            )}
            
            <div style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#4b5563'
            }}>
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
