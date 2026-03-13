'use client'

import React, { useCallback, useRef } from 'react'
import { X, Minus, Square } from 'lucide-react'
import { useWindowStore } from '@/features/windowManager/model/windowStore'
import { useDraggable } from '@/_shared/lib/hooks/useDraggable'

interface WindowProps {
  id: string
  title: string
  children: React.ReactNode
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition,
  initialSize,
}) => {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    restoreFromMaximize,
    updateWindowPosition,
    updateWindowSize,
    windows,
  } = useWindowStore()
  const windowData = windows.find((w) => w.id === id)
  const zIndex = windowData?.zIndex ?? 1
  const size = windowData?.size ?? initialSize
  const isMaximized = windowData?.isMaximized ?? false
  const startResizeRef = useRef<{
    mouseX: number
    mouseY: number
    width: number
    height: number
  } | null>(null)

  const { position, handleMouseDown, startDragAt } = useDraggable({
    initialPosition: windowData?.position ?? initialPosition,
    onDrag: (newPos) => updateWindowPosition(id, newPos),
  })

  const getDesktopViewport = useCallback(() => {
    const desktopRoot = document.querySelector('[data-desktop-root]') as HTMLElement | null
    const taskbar = document.querySelector('[data-taskbar-root]') as HTMLElement | null

    if (!desktopRoot) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }

    const rect = desktopRoot.getBoundingClientRect()
    const taskbarHeight = taskbar?.getBoundingClientRect().height ?? 0

    return {
      width: rect.width,
      height: Math.max(200, rect.height - taskbarHeight),
    }
  }, [])

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      startResizeRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        width: size.width,
        height: size.height,
      }

      const handleResizeMove = (event: MouseEvent) => {
        if (!startResizeRef.current) return

        const deltaX = event.clientX - startResizeRef.current.mouseX
        const deltaY = event.clientY - startResizeRef.current.mouseY

        updateWindowSize(id, {
          width: Math.max(320, startResizeRef.current.width + deltaX),
          height: Math.max(200, startResizeRef.current.height + deltaY),
        })
      }

      const handleResizeEnd = () => {
        startResizeRef.current = null
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }

      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
    },
    [id, size.height, size.width, updateWindowSize]
  )

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-window-control]')) {
        return
      }

      if (!isMaximized) {
        handleMouseDown(e)
        return
      }

      e.stopPropagation()

      const restoredSize = windowData?.restoreState?.size ?? { width: 700, height: 400 }
      const viewport = getDesktopViewport()
      const maxX = Math.max(0, viewport.width - restoredSize.width)
      const maxY = Math.max(0, viewport.height - restoredSize.height)
      const restoredPosition = {
        x: Math.min(maxX, Math.max(0, e.clientX - restoredSize.width / 2)),
        y: Math.min(maxY, Math.max(0, e.clientY - 18)),
      }

      restoreFromMaximize(id, restoredPosition)
      startDragAt(e, restoredPosition)
    },
    [
      getDesktopViewport,
      handleMouseDown,
      id,
      isMaximized,
      restoreFromMaximize,
      startDragAt,
      windowData?.restoreState?.size,
    ]
  )

  return (
    <div
      className="absolute bg-window border-raised shadow-lg pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between h-7 px-2 bg-title-bar-active border-b-2 border-b-border-dark cursor-move"
        onMouseDown={handleTitleMouseDown}
      >
        <span className="text-white font-bold text-sm">{title}</span>
        <div className="flex gap-1">
          <button
            data-window-control
            className="w-6 h-6 flex items-center justify-center bg-window border-raised active:border-sunken text-black"
            onClick={(e) => {
              e.stopPropagation()
              minimizeWindow(id)
            }}
          >
            <Minus size={14} />
          </button>
          <button
            data-window-control
            className="w-6 h-6 flex items-center justify-center bg-window border-raised active:border-sunken text-black"
            onClick={(e) => {
              e.stopPropagation()
              const viewport = getDesktopViewport()
              toggleMaximizeWindow(id, {
                width: viewport.width,
                height: viewport.height,
              })
            }}
          >
            <Square size={12} />
          </button>
          <button
            data-window-control
            className="w-6 h-6 flex items-center justify-center bg-window border-raised active:border-sunken text-black"
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(id)
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 h-[calc(100%-1.75rem)] overflow-auto">
        {children}
      </div>
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-window border-t-2 border-l-2 border-border-dark"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  )
}

