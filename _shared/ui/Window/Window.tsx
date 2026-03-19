'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { X, Minus, Square } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { selectWindowById, useWindowStore } from '@/features/windowManager/model/windowStore'
import { useDraggable } from '@/_shared/lib/hooks/useDraggable'

interface WindowProps {
  id: string
  children: React.ReactNode
}

const MIN_WINDOW_WIDTH = 280
const MIN_WINDOW_HEIGHT = 220
const WINDOW_EDGE_GAP = 8

type WindowViewport = {
  width: number
  height: number
}

const clampWindowSize = (size: { width: number; height: number }, viewport: WindowViewport) => ({
  width: Math.min(Math.max(MIN_WINDOW_WIDTH, size.width), Math.max(MIN_WINDOW_WIDTH, viewport.width)),
  height: Math.min(Math.max(MIN_WINDOW_HEIGHT, size.height), Math.max(MIN_WINDOW_HEIGHT, viewport.height)),
})

const clampWindowPosition = (
  position: { x: number; y: number },
  size: { width: number; height: number },
  viewport: WindowViewport,
) => {
  const maxX = Math.max(WINDOW_EDGE_GAP, viewport.width - size.width - WINDOW_EDGE_GAP)
  const maxY = Math.max(WINDOW_EDGE_GAP, viewport.height - size.height - WINDOW_EDGE_GAP)

  return {
    x: Math.min(maxX, Math.max(WINDOW_EDGE_GAP, position.x)),
    y: Math.min(maxY, Math.max(WINDOW_EDGE_GAP, position.y)),
  }
}

export const Window: React.FC<WindowProps> = ({ id, children }) => {
  const selectWindow = useMemo(() => selectWindowById(id), [id])
  const windowData = useWindowStore(selectWindow)
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    restoreFromMaximize,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore(
    useShallow((state) => ({
      closeWindow: state.closeWindow,
      focusWindow: state.focusWindow,
      minimizeWindow: state.minimizeWindow,
      restoreFromMaximize: state.restoreFromMaximize,
      toggleMaximizeWindow: state.toggleMaximizeWindow,
      updateWindowPosition: state.updateWindowPosition,
      updateWindowSize: state.updateWindowSize,
    })),
  )
  const [isResizing, setIsResizing] = useState(false)
  const [draftSize, setDraftSize] = useState(windowData?.size ?? { width: 700, height: 400 })
  const draftSizeRef = useRef(windowData?.size ?? { width: 700, height: 400 })
  const resizeStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    size: { width: number; height: number }
  } | null>(null)

  const getDesktopViewport = useCallback(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
      }
    }

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
      height: Math.max(MIN_WINDOW_HEIGHT, rect.height - taskbarHeight),
    }
  }, [])

  const { position, handlePointerDown, startDragAt } = useDraggable({
    initialPosition: windowData?.position ?? { x: 120, y: 120 },
    disabled: !windowData || windowData.isMaximized,
    onDragEnd: (nextPosition) => {
      if (!windowData) {
        return
      }

      const viewport = getDesktopViewport()
      const safeSize = clampWindowSize(windowData.size, viewport)
      updateWindowPosition(id, clampWindowPosition(nextPosition, safeSize, viewport))
    },
  })

  const effectiveWindow = useMemo(() => {
    if (!windowData) {
      return null
    }

    const viewport = getDesktopViewport()
    const baseSize = isResizing ? draftSize : windowData.size
    const safeSize = clampWindowSize(baseSize, viewport)

    return {
      ...windowData,
      size: safeSize,
      position: clampWindowPosition(position, safeSize, viewport),
    }
  }, [draftSize, getDesktopViewport, isResizing, position, windowData])

  const handleResizeStart = useCallback(
    (event: React.PointerEvent) => {
      if (!effectiveWindow) {
        return
      }

      if (event.pointerType !== 'touch' && event.button !== 0) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      setIsResizing(true)
      resizeStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        size: effectiveWindow.size,
      }

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!resizeStateRef.current || moveEvent.pointerId !== resizeStateRef.current.pointerId) {
          return
        }

        const viewport = getDesktopViewport()
        const deltaX = moveEvent.clientX - resizeStateRef.current.startX
        const deltaY = moveEvent.clientY - resizeStateRef.current.startY

        setDraftSize(
          clampWindowSize(
            {
              width: resizeStateRef.current.size.width + deltaX,
              height: resizeStateRef.current.size.height + deltaY,
            },
            viewport,
          ),
        )
        draftSizeRef.current = clampWindowSize(
          {
            width: resizeStateRef.current.size.width + deltaX,
            height: resizeStateRef.current.size.height + deltaY,
          },
          viewport,
        )
      }

      const handlePointerEnd = (pointerEvent: PointerEvent) => {
        if (!resizeStateRef.current || pointerEvent.pointerId !== resizeStateRef.current.pointerId) {
          return
        }

        const viewport = getDesktopViewport()
        const nextSize = clampWindowSize(draftSizeRef.current, viewport)

        setIsResizing(false)
        resizeStateRef.current = null
        updateWindowSize(id, nextSize)
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerEnd)
        window.removeEventListener('pointercancel', handlePointerEnd)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerEnd)
      window.addEventListener('pointercancel', handlePointerEnd)
    },
    [effectiveWindow, getDesktopViewport, id, updateWindowSize],
  )

  const handleTitlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-window-control]')) {
        return
      }

      if (!windowData) {
        return
      }

      if (!windowData.isMaximized) {
        handlePointerDown(event)
        return
      }

      event.stopPropagation()

      const viewport = getDesktopViewport()
      const restoredSize = clampWindowSize(
        windowData.restoreState?.size ?? { width: 700, height: 400 },
        viewport,
      )
      const restoredPosition = clampWindowPosition(
        {
          x: event.clientX - restoredSize.width / 2,
          y: event.clientY - 18,
        },
        restoredSize,
        viewport,
      )

      restoreFromMaximize(id, restoredPosition)
      startDragAt(event, restoredPosition)
    },
    [getDesktopViewport, handlePointerDown, id, restoreFromMaximize, startDragAt, windowData],
  )

  if (!effectiveWindow) {
    return null
  }

  return (
    <div
      className="absolute bg-window border-raised shadow-lg pointer-events-auto touch-none"
      style={{
        left: effectiveWindow.position.x,
        top: effectiveWindow.position.y,
        width: effectiveWindow.size.width,
        height: effectiveWindow.size.height,
        zIndex: effectiveWindow.zIndex,
      }}
      onPointerDown={() => focusWindow(id)}
    >
      <div
        className="flex h-7 cursor-move touch-none items-center justify-between border-b-2 border-b-border-dark bg-title-bar-active px-2"
        onPointerDown={handleTitlePointerDown}
      >
        <span className="text-sm font-bold text-white">{effectiveWindow.title}</span>
        <div className="flex gap-1">
          <button
            data-window-control
            type="button"
            className="flex h-6 w-6 items-center justify-center border-raised bg-window text-black active:border-sunken"
            onClick={(event) => {
              event.stopPropagation()
              minimizeWindow(id)
            }}
          >
            <Minus size={14} />
          </button>
          <button
            data-window-control
            type="button"
            className="flex h-6 w-6 items-center justify-center border-raised bg-window text-black active:border-sunken"
            onClick={(event) => {
              event.stopPropagation()
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
            type="button"
            className="flex h-6 w-6 items-center justify-center border-raised bg-window text-black active:border-sunken"
            onClick={(event) => {
              event.stopPropagation()
              closeWindow(id)
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-1.75rem)] overflow-auto p-2">{children}</div>

      {!effectiveWindow.isMaximized ? (
        <div
          className="absolute bottom-0 right-0 h-5 w-5 cursor-se-resize border-l-2 border-t-2 border-border-dark bg-window touch-none"
          onPointerDown={handleResizeStart}
        />
      ) : null}
    </div>
  )
}
