import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

interface UseDraggableProps {
  initialPosition: { x: number; y: number }
  disabled?: boolean
  onDragStart?: () => void
  onDragEnd?: (position: { x: number; y: number }) => void
}

const canStartPointerDrag = (event: ReactPointerEvent) =>
  event.pointerType === 'touch' || event.button === 0

export const useDraggable = ({
  initialPosition,
  disabled = false,
  onDragStart,
  onDragEnd,
}: UseDraggableProps) => {
  const [dragPosition, setDragPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const latestPositionRef = useRef(initialPosition)
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: -1,
    offset: { x: 0, y: 0 },
  })
  const moveListenerRef = useRef<((event: PointerEvent) => void) | null>(null)
  const endListenerRef = useRef<((event: PointerEvent) => void) | null>(null)
  const onDragStartRef = useRef(onDragStart)
  const onDragEndRef = useRef(onDragEnd)

  useEffect(() => {
    onDragStartRef.current = onDragStart
  }, [onDragStart])

  useEffect(() => {
    onDragEndRef.current = onDragEnd
  }, [onDragEnd])

  const clearListeners = useCallback(() => {
    if (moveListenerRef.current) {
      window.removeEventListener('pointermove', moveListenerRef.current)
      moveListenerRef.current = null
    }

    if (endListenerRef.current) {
      window.removeEventListener('pointerup', endListenerRef.current)
      window.removeEventListener('pointercancel', endListenerRef.current)
      endListenerRef.current = null
    }
  }, [])

  const beginDrag = useCallback(
    (pointerId: number, clientX: number, clientY: number, anchorPosition: { x: number; y: number }) => {
      clearListeners()

      dragStateRef.current = {
        isDragging: true,
        pointerId,
        offset: {
          x: clientX - anchorPosition.x,
          y: clientY - anchorPosition.y,
        },
      }

      setIsDragging(true)
      setDragPosition(anchorPosition)
      latestPositionRef.current = anchorPosition
      onDragStartRef.current?.()

      const handlePointerMove = (event: PointerEvent) => {
        if (!dragStateRef.current.isDragging || event.pointerId !== dragStateRef.current.pointerId) {
          return
        }

        const nextPosition = {
          x: event.clientX - dragStateRef.current.offset.x,
          y: event.clientY - dragStateRef.current.offset.y,
        }

        latestPositionRef.current = nextPosition
        setDragPosition(nextPosition)
      }

      const handlePointerEnd = (event: PointerEvent) => {
        if (event.pointerId !== dragStateRef.current.pointerId) {
          return
        }

        dragStateRef.current.isDragging = false
        dragStateRef.current.pointerId = -1
        setIsDragging(false)
        clearListeners()
        onDragEndRef.current?.(latestPositionRef.current)
      }

      moveListenerRef.current = handlePointerMove
      endListenerRef.current = handlePointerEnd
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerEnd)
      window.addEventListener('pointercancel', handlePointerEnd)
    },
    [clearListeners],
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (disabled || !canStartPointerDrag(event)) {
        return
      }

      event.preventDefault()
      beginDrag(event.pointerId, event.clientX, event.clientY, isDragging ? dragPosition : initialPosition)
    },
    [beginDrag, disabled, dragPosition, initialPosition, isDragging],
  )

  const startDragAt = useCallback(
    (event: ReactPointerEvent, anchorPosition: { x: number; y: number }) => {
      if (disabled || !canStartPointerDrag(event)) {
        return
      }

      event.preventDefault()
      setDragPosition(anchorPosition)
      latestPositionRef.current = anchorPosition
      beginDrag(event.pointerId, event.clientX, event.clientY, anchorPosition)
    },
    [beginDrag, disabled],
  )

  useEffect(() => clearListeners, [clearListeners])

  return { position: isDragging ? dragPosition : initialPosition, handlePointerDown, startDragAt }
}
