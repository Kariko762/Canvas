'use client'

import { useState, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { MechanicRenderer } from '@/components/mechanics/MechanicRenderer'
import { MechanicsToolbar } from '@/components/editor/MechanicsToolbar'

export interface MechanicInstance {
  id: string
  type: string
  name?: string
  x: number
  y: number
  width?: number
  height?: number
  layer: number
  props: Record<string, any>
}

interface CanvasEditorProps {
  mechanics: MechanicInstance[]
  selectedMechanicId: string | null
  canvasWidth: number
  canvasHeight: number
  onMechanicsChange: (mechanics: MechanicInstance[]) => void
  onSelectedMechanicChange: (id: string | null) => void
  onAddMechanic: (type: string) => void
  minY?: number // Optional minimum Y constraint (e.g. for modal title bar)
  titleBarTitle?: string // Optional title to display in the reserved area
  titleBarColor?: string // Optional title bar background color/gradient
  showToolbar?: boolean
  backgroundColor?: string
  borderRadius?: string
  className?: string
}

export function CanvasEditor({
  mechanics,
  selectedMechanicId,
  canvasWidth,
  canvasHeight,
  onMechanicsChange,
  onSelectedMechanicChange,
  onAddMechanic,
  minY = 0,
  titleBarTitle,
  titleBarColor,
  showToolbar = true,
  backgroundColor = 'transparent',
  borderRadius = '0px',
  className = ''
}: CanvasEditorProps) {
  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [draggingMechanicId, setDraggingMechanicId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizingMechanic, setResizingMechanic] = useState<{
    id: string
    startX: number
    startY: number
    startWidth: number
    startHeight: number
    startPosX: number
    startPosY: number
    direction: string
  } | null>(null)

  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Handle mouse events for dragging and resizing
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const scale = zoom / 100

      // Handle panning
      if (isPanning) {
        setPanOffset({
          x: panOffset.x + (e.clientX - panStart.x),
          y: panOffset.y + (e.clientY - panStart.y)
        })
        setPanStart({ x: e.clientX, y: e.clientY })
        return
      }

      // Handle resizing
      if (resizingMechanic) {
        const deltaX = (e.clientX - resizingMechanic.startX) / scale
        const deltaY = (e.clientY - resizingMechanic.startY) / scale

        let newWidth = resizingMechanic.startWidth
        let newHeight = resizingMechanic.startHeight
        let newX = resizingMechanic.startPosX
        let newY = resizingMechanic.startPosY

        const dir = resizingMechanic.direction

        // Handle width changes
        if (dir.includes('e')) {
          newWidth = Math.max(50, resizingMechanic.startWidth + deltaX)
        } else if (dir.includes('w')) {
          newWidth = Math.max(50, resizingMechanic.startWidth - deltaX)
          if (newWidth > 50) {
            newX = resizingMechanic.startPosX + deltaX
          }
        }

        // Handle height changes
        if (dir.includes('s')) {
          newHeight = Math.max(50, resizingMechanic.startHeight + deltaY)
        } else if (dir.includes('n')) {
          newHeight = Math.max(50, resizingMechanic.startHeight - deltaY)
          if (newHeight > 50) {
            newY = resizingMechanic.startPosY + deltaY
            // Apply minY constraint
            newY = Math.max(minY, newY)
          }
        }

        onMechanicsChange(
          mechanics.map(m =>
            m.id === resizingMechanic.id
              ? { ...m, width: newWidth, height: newHeight, x: newX, y: newY }
              : m
          )
        )
        return
      }

      // Handle dragging
      if (draggingMechanicId) {
        const x = Math.max(0, Math.min((e.clientX - rect.left) / scale - dragOffset.x, canvasWidth - 50))
        const y = Math.max(minY, Math.min((e.clientY - rect.top) / scale - dragOffset.y, canvasHeight - 50))

        onMechanicsChange(
          mechanics.map(m =>
            m.id === draggingMechanicId ? { ...m, x, y } : m
          )
        )
      }
    }

    const handleWindowMouseUp = () => {
      setDraggingMechanicId(null)
      setResizingMechanic(null)
      setIsPanning(false)
    }

    window.addEventListener('mousemove', handleWindowMouseMove)
    window.addEventListener('mouseup', handleWindowMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [
    draggingMechanicId,
    resizingMechanic,
    isPanning,
    dragOffset,
    panOffset,
    panStart,
    zoom,
    canvasWidth,
    canvasHeight,
    minY,
    mechanics,
    onMechanicsChange
  ])

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -5 : 5
    setZoom(Math.max(25, Math.min(200, zoom + delta)))
  }

  // Mouse down on mechanic (for dragging)
  const handleMouseDownOnMechanic = (e: React.MouseEvent, mechanicId: string) => {
    if (e.button === 2) return // Ignore right click

    e.stopPropagation()
    
    const mechanic = mechanics.find(m => m.id === mechanicId)
    if (!mechanic) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const scale = zoom / 100
    const offsetX = (e.clientX - rect.left) / scale - mechanic.x
    const offsetY = (e.clientY - rect.top) / scale - mechanic.y

    setDragOffset({ x: offsetX, y: offsetY })
    setDraggingMechanicId(mechanicId)
    onSelectedMechanicChange(mechanicId)
  }

  // Mouse down on resize handle
  const handleMouseDownOnResizeHandle = (
    e: React.MouseEvent,
    mechanicId: string,
    direction: string
  ) => {
    e.stopPropagation()

    const mechanic = mechanics.find(m => m.id === mechanicId)
    if (!mechanic) return

    setResizingMechanic({
      id: mechanicId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: mechanic.width || 200,
      startHeight: mechanic.height || 100,
      startPosX: mechanic.x,
      startPosY: mechanic.y,
      direction
    })
    onSelectedMechanicChange(mechanicId)
  }

  // Mouse down on canvas (for panning or deselecting)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click on background - deselect
      if (e.target === e.currentTarget) {
        onSelectedMechanicChange(null)
      }
    }
  }

  // Mouse down on container (for panning anywhere in the main section)
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      // Right click - start panning (works anywhere in container)
      e.preventDefault()
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Context menu prevention
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  // Zoom handlers
  const handleZoomIn = () => setZoom(Math.min(200, zoom + 10))
  const handleZoomOut = () => setZoom(Math.max(25, zoom - 10))
  const handleZoomFit = () => {
    if (!canvasContainerRef.current) return
    const container = canvasContainerRef.current
    const containerWidth = container.clientWidth - 48
    const containerHeight = container.clientHeight - 48

    const scaleX = containerWidth / canvasWidth
    const scaleY = containerHeight / canvasHeight
    const scale = Math.min(scaleX, scaleY, 1) * 100

    setZoom(Math.round(scale))
    setPanOffset({ x: 0, y: 0 })
  }

  return (
    <div className={`flex-1 flex flex-col overflow-hidden ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2">
          <MechanicsToolbar onAddMechanic={onAddMechanic} />
        </div>
      )}

      {/* Zoom Controls */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
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
          {canvasWidth}×{canvasHeight}px
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={canvasContainerRef}
        className="flex-1 overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleContainerMouseDown}
        onContextMenu={handleContextMenu}
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
          className="min-w-full min-h-full flex items-center justify-center p-12"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {/* Canvas */}
          <div
            ref={canvasRef}
            className="relative shadow-2xl"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              backgroundColor: backgroundColor,
              borderRadius: borderRadius,
              overflow: 'hidden'
            }}
            onMouseDown={handleCanvasMouseDown}
          >
            {/* Title Bar (if minY constraint exists) */}
            {minY > 0 && (
              <div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                  height: `${minY}px`,
                  background: titleBarColor || 'linear-gradient(135deg, rgba(67, 28, 91, 0.95) 0%, rgba(29, 31, 72, 0.95) 100%)',
                  borderBottom: '1px solid rgba(75, 205, 62, 0.2)',
                  borderTopLeftRadius: borderRadius,
                  borderTopRightRadius: borderRadius,
                  backdropFilter: 'blur(10px)',
                  zIndex: 9999
                }}
              >
                <div className="h-full flex items-center justify-between px-6">
                  <h2 className="text-lg font-semibold text-white tracking-tight">
                    {titleBarTitle || 'Modal Title'}
                  </h2>
                  <button
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                    style={{ pointerEvents: 'none' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Render Mechanics */}
            {mechanics
              .sort((a, b) => a.layer - b.layer)
              .map(mechanic => {
                const isSelected = selectedMechanicId === mechanic.id

                return (
                  <div
                    key={mechanic.id}
                    className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      left: `${mechanic.x}px`,
                      top: `${mechanic.y}px`,
                      width: `${mechanic.width}px`,
                      height: `${mechanic.height}px`,
                      zIndex: mechanic.layer
                    }}
                    onMouseDown={e => handleMouseDownOnMechanic(e, mechanic.id)}
                    onClick={e => e.stopPropagation()}
                  >
                    <MechanicRenderer mechanic={mechanic} mode="edit" />

                    {/* Resize Handles */}
                    {isSelected && (
                      <>
                        {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(dir => (
                          <div
                            key={dir}
                            className={`absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-${dir}-resize hover:scale-125 transition-transform`}
                            style={{
                              ...{
                                nw: { top: -6, left: -6 },
                                n: { top: -6, left: '50%', marginLeft: -6 },
                                ne: { top: -6, right: -6 },
                                e: { top: '50%', right: -6, marginTop: -6 },
                                se: { bottom: -6, right: -6 },
                                s: { bottom: -6, left: '50%', marginLeft: -6 },
                                sw: { bottom: -6, left: -6 },
                                w: { top: '50%', left: -6, marginTop: -6 }
                              }[dir]
                            }}
                            onMouseDown={e => handleMouseDownOnResizeHandle(e, mechanic.id, dir)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )
              })}

            {/* Empty State */}
            {mechanics.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                <div className="text-center">
                  <p className="text-sm">Click the toolbar above to add elements</p>
                  <p className="text-xs mt-1">or drag existing elements to reposition</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
