'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useWindowStore } from '@/features/windowManager/model/windowStore'
import { Button } from '@/_shared/ui/Button'
import { StartMenu } from '../startMenu/StartMenu'

export const Taskbar: React.FC = () => {
  const restoreWindow = useWindowStore((state) => state.restoreWindow)
  const windows = useWindowStore((state) => state.windows)
  const [time, setTime] = useState(new Date())
  const [showStartMenu, setShowStartMenu] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1_000)
    return () => clearInterval(timer)
  }, [])

  const { welcomeWindow, openWindows, minimizedWindows } = useMemo(() => {
    const welcome = windows.find((window) => window.instanceKey === 'welcome') ?? null
    const open = windows.filter(
      (window) => window.isOpen && !window.isMinimized && window.instanceKey !== 'welcome',
    )
    const minimized = windows.filter(
      (window) => window.isOpen && window.isMinimized && window.instanceKey !== 'welcome',
    )

    return {
      welcomeWindow: welcome,
      openWindows: open,
      minimizedWindows: minimized,
    }
  }, [windows])

  return (
    <div
      data-taskbar-root
      className="fixed bottom-0 left-0 right-0 z-50 flex h-10 items-center border-raised border-t-2 border-t-border-light bg-window px-1"
    >
      <div className="relative">
        <Button
          variant={showStartMenu ? 'active' : 'default'}
          onClick={() => setShowStartMenu(!showStartMenu)}
          className="flex h-8 items-center gap-1 px-3"
        >
          <span className="text-sm font-bold" aria-hidden="true">
            Win
          </span>
          Start
        </Button>
        {showStartMenu ? <StartMenu onClose={() => setShowStartMenu(false)} /> : null}
      </div>

      <div className="mx-2 flex flex-1 gap-1 overflow-x-auto">
        {welcomeWindow ? (
          <button
            type="button"
            className={`h-8 max-w-[150px] truncate px-3 text-sm ${
              welcomeWindow.isMinimized ? 'border-sunken bg-window opacity-70' : 'border-raised bg-window'
            }`}
            onClick={() => restoreWindow(welcomeWindow.id)}
          >
            {welcomeWindow.title}
          </button>
        ) : null}
        {openWindows.map((window) => (
          <button
            key={window.id}
            type="button"
            className="h-8 max-w-[150px] truncate border-raised bg-window px-3 text-sm active:border-sunken"
            onClick={() => restoreWindow(window.id)}
          >
            {window.title}
          </button>
        ))}
        {minimizedWindows.map((window) => (
          <button
            key={window.id}
            type="button"
            className="h-8 max-w-[150px] truncate border-sunken bg-window px-3 text-sm opacity-70"
            onClick={() => restoreWindow(window.id)}
          >
            {window.title}
          </button>
        ))}
      </div>

      <div className="flex h-8 items-center border-sunken bg-window px-3 text-sm" suppressHydrationWarning>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
