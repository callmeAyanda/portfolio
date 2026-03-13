import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

interface UseDraggableProps {
  initialPosition: { x: number; y: number }
  onDrag: (position: { x: number; y: number }) => void
}

export const useDraggable = ({ initialPosition, onDrag }: UseDraggableProps) => {
  const [position, setPosition] = useState(initialPosition)
  const dragRef = useRef({ isDragging: false, offset: { x: 0, y: 0 } })
  const moveListenerRef = useRef<((e: MouseEvent) => void) | null>(null)
  const upListenerRef = useRef<(() => void) | null>(null)
  const onDragRef = useRef(onDrag)

  useEffect(() => {
    onDragRef.current = onDrag
  }, [onDrag])

  useEffect(() => {
    setPosition(initialPosition)
  }, [initialPosition])

  const clearListeners = useCallback(() => {
    if (moveListenerRef.current) {
      document.removeEventListener('mousemove', moveListenerRef.current)
      moveListenerRef.current = null
    }

    if (upListenerRef.current) {
      document.removeEventListener('mouseup', upListenerRef.current)
      upListenerRef.current = null
    }
  }, [])

  const beginDrag = useCallback(
    (clientX: number, clientY: number, anchorPosition: { x: number; y: number }) => {
      clearListeners()

      dragRef.current.isDragging = true
      dragRef.current.offset = {
        x: clientX - anchorPosition.x,
        y: clientY - anchorPosition.y,
      }

      const handleMouseMove = (event: MouseEvent) => {
        if (!dragRef.current.isDragging) return

        const newX = event.clientX - dragRef.current.offset.x
        const newY = event.clientY - dragRef.current.offset.y

        setPosition({ x: newX, y: newY })
        onDragRef.current({ x: newX, y: newY })
      }

      const handleMouseUp = () => {
        dragRef.current.isDragging = false
        clearListeners()
      }

      moveListenerRef.current = handleMouseMove
      upListenerRef.current = handleMouseUp
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [clearListeners]
  )

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault()
      beginDrag(e.clientX, e.clientY, position)
    },
    [beginDrag, position]
  )

  const startDragAt = useCallback(
    (e: ReactMouseEvent, anchorPosition: { x: number; y: number }) => {
      e.preventDefault()
      setPosition(anchorPosition)
      onDragRef.current(anchorPosition)
      beginDrag(e.clientX, e.clientY, anchorPosition)
    },
    [beginDrag]
  )

  useEffect(() => clearListeners, [clearListeners])

  return { position, handleMouseDown, startDragAt }
}
