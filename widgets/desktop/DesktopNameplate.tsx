"use client";

import React, { useEffect, useRef } from 'react'

interface DesktopNameplateProps {
  name: string
}

const HORIZONTAL_SPEED = 120
const VERTICAL_SPEED = 88

export const DesktopNameplate: React.FC<DesktopNameplateProps> = ({ name }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const plateRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const plate = plateRef.current

    if (!container || !plate) {
      return
    }

    let animationFrame = 0
    let lastTimestamp = 0

    const position = { x: 0, y: 0 }
    const velocity = { x: HORIZONTAL_SPEED, y: VERTICAL_SPEED }
    const bounds = { width: 0, height: 0 }
    const plateSize = { width: 0, height: 0 }

    const applyPosition = () => {
      plate.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
    }

    const measure = (shouldCenter = false) => {
      bounds.width = container.clientWidth
      bounds.height = container.clientHeight
      plateSize.width = plate.offsetWidth
      plateSize.height = plate.offsetHeight

      const maxX = Math.max(0, bounds.width - plateSize.width)
      const maxY = Math.max(0, bounds.height - plateSize.height)

      if (shouldCenter) {
        position.x = maxX / 2
        position.y = maxY / 2
      } else {
        position.x = Math.min(Math.max(position.x, 0), maxX)
        position.y = Math.min(Math.max(position.y, 0), maxY)
      }

      applyPosition()
    }

    const animate = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp
      }

      const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05)
      lastTimestamp = timestamp

      const maxX = Math.max(0, bounds.width - plateSize.width)
      const maxY = Math.max(0, bounds.height - plateSize.height)

      let nextX = position.x + velocity.x * deltaSeconds
      let nextY = position.y + velocity.y * deltaSeconds

      if (nextX <= 0) {
        nextX = 0
        velocity.x = Math.abs(velocity.x)
      } else if (nextX >= maxX) {
        nextX = maxX
        velocity.x = -Math.abs(velocity.x)
      }

      if (nextY <= 0) {
        nextY = 0
        velocity.y = Math.abs(velocity.y)
      } else if (nextY >= maxY) {
        nextY = maxY
        velocity.y = -Math.abs(velocity.y)
      }

      position.x = nextX
      position.y = nextY
      applyPosition()
      animationFrame = window.requestAnimationFrame(animate)
    }

    const handleResize = () => {
      measure()
    }

    const resizeObserver = new ResizeObserver(() => {
      measure()
    })

    measure(true)
    resizeObserver.observe(container)
    resizeObserver.observe(plate)
    window.addEventListener('resize', handleResize)
    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        ref={plateRef}
        className="absolute left-0 top-0 border-raised bg-window/80 px-6 py-3 text-center opacity-70 shadow-[3px_3px_0px_rgba(0,0,0,0.32)] will-change-transform"
      >
        <p className="pb-4 text-xs uppercase tracking-[0.2em] text-title-bar-inactive">Portfolio</p>
        <h1 className="text-2xl font-bold text-title-bar-active sm:text-3xl">{name}</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-title-bar-inactive">
          Software Engineer | SaaS Architect
        </p>
      </div>
    </div>
  )
}
