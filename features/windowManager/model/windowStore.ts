'use client'

import { create } from 'zustand'

export type WindowContentType =
  | 'welcome'
  | 'projects'
  | 'skills'
  | 'education'
  | 'achievements'
  | 'experience'
  | 'contact'
  | 'about'
  | 'projectDetail'
  | 'imageViewer'
  | 'videoViewer'

type WindowPayload = {
  projectId?: string
  imageId?: string
  videoId?: string
}

export type WindowState = {
  id: string
  title: string
  content: WindowContentType
  instanceKey: string
  payload: WindowPayload | null
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  restoreState: {
    position: { x: number; y: number }
    size: { width: number; height: number }
  } | null
  zIndex: number
}

type OpenOrFocusWindowInput = {
  content: WindowContentType
  title: string
  instanceKey?: string
  payload?: WindowPayload | null
  position: { x: number; y: number }
  size: { width: number; height: number }
}

type MaximizeViewport = {
  width: number
  height: number
}

export interface WindowStore {
  windows: WindowState[]
  nextZIndex: number
  addWindow: (window: Omit<WindowState, 'zIndex'>) => void
  openOrFocusWindow: (window: OpenOrFocusWindowInput) => void
  openWindow: (id: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMaximizeWindow: (id: string, viewport: MaximizeViewport) => void
  restoreFromMaximize: (id: string, position: { x: number; y: number }) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
  updateWindowSize: (id: string, size: { width: number; height: number }) => void
}

const toWindowId = (instanceKey: string) => instanceKey.replace(/[^a-zA-Z0-9_-]/g, '-')

const getUniqueWindowId = (windows: WindowState[], instanceKey: string, content: WindowContentType) => {
  const baseId = toWindowId(instanceKey || content)

  if (!windows.some((window) => window.id === baseId)) {
    return baseId
  }

  let suffix = 2
  let candidateId = `${baseId}-${suffix}`

  while (windows.some((window) => window.id === candidateId)) {
    suffix += 1
    candidateId = `${baseId}-${suffix}`
  }

  return candidateId
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [
    {
      id: 'welcome-1',
      title: 'Welcome',
      content: 'welcome',
      instanceKey: 'welcome',
      payload: null,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 150, y: 150 },
      size: { width: 700, height: 400 },
      restoreState: null,
      zIndex: 1,
    },
  ],
  nextZIndex: 2,

  addWindow: (window) =>
    set((state) => ({
      windows: [
        ...state.windows,
        {
          ...window,
          zIndex: state.nextZIndex,
        },
      ],
      nextZIndex: state.nextZIndex + 1,
    })),

  openOrFocusWindow: (window) =>
    set((state) => {
      const resolvedInstanceKey = window.instanceKey ?? window.content
      const existingWindow = state.windows.find((entry) => entry.instanceKey === resolvedInstanceKey)

      if (existingWindow) {
        return {
          windows: state.windows.map((entry) =>
            entry.id === existingWindow.id
              ? {
                  ...entry,
                  title: window.title,
                  payload: window.payload ?? entry.payload,
                  isOpen: true,
                  isMinimized: false,
                  zIndex: state.nextZIndex,
                }
              : entry,
          ),
          nextZIndex: state.nextZIndex + 1,
        }
      }

      return {
        windows: [
          ...state.windows,
          {
            id: getUniqueWindowId(state.windows, resolvedInstanceKey, window.content),
            title: window.title,
            content: window.content,
            instanceKey: resolvedInstanceKey,
            payload: window.payload ?? null,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            position: window.position,
            size: window.size,
            restoreState: null,
            zIndex: state.nextZIndex,
          },
        ],
        nextZIndex: state.nextZIndex + 1,
      }
    }),

  openWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id
          ? { ...window, isOpen: true, isMinimized: false, zIndex: state.nextZIndex }
          : window,
      ),
      nextZIndex: state.nextZIndex + 1,
    })),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) => {
        if (window.id !== id) return window

        if (window.content === 'welcome') {
          return { ...window, isOpen: true, isMinimized: true }
        }

        return { ...window, isOpen: false }
      }),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, isMinimized: true } : window,
      ),
    })),

  toggleMaximizeWindow: (id, viewport) =>
    set((state) => ({
      windows: state.windows.map((window) => {
        if (window.id !== id) return window

        if (window.isMaximized && window.restoreState) {
          return {
            ...window,
            isMaximized: false,
            position: window.restoreState.position,
            size: window.restoreState.size,
            restoreState: null,
            zIndex: state.nextZIndex,
          }
        }

        return {
          ...window,
          isMaximized: true,
          restoreState: {
            position: window.position,
            size: window.size,
          },
          position: { x: 0, y: 0 },
          size: {
            width: viewport.width,
            height: Math.max(200, viewport.height),
          },
          zIndex: state.nextZIndex,
        }
      }),
      nextZIndex: state.nextZIndex + 1,
    })),

  restoreFromMaximize: (id, position) =>
    set((state) => ({
      windows: state.windows.map((window) => {
        if (window.id !== id || !window.isMaximized) return window

        const restoreSize = window.restoreState?.size ?? window.size
        return {
          ...window,
          isMaximized: false,
          position,
          size: restoreSize,
          restoreState: null,
          zIndex: state.nextZIndex,
        }
      }),
      nextZIndex: state.nextZIndex + 1,
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, isMinimized: false, zIndex: state.nextZIndex } : window,
      ),
      nextZIndex: state.nextZIndex + 1,
    })),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, zIndex: state.nextZIndex } : window,
      ),
      nextZIndex: state.nextZIndex + 1,
    })),

  updateWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, position } : window,
      ),
    })),

  updateWindowSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, size } : window)),
    })),
}))

export const selectVisibleWindowIds = (state: WindowStore) =>
  state.windows.filter((window) => window.isOpen && !window.isMinimized).map((window) => window.id)

export const selectWindowById =
  (id: string) =>
  (state: WindowStore): WindowState | null =>
    state.windows.find((window) => window.id === id) ?? null

export const selectTaskbarWindows = (state: WindowStore) => {
  const welcomeWindow = state.windows.find((window) => window.instanceKey === 'welcome') ?? null
  const openWindows = state.windows.filter(
    (window) => window.isOpen && !window.isMinimized && window.instanceKey !== 'welcome',
  )
  const minimizedWindows = state.windows.filter(
    (window) => window.isOpen && window.isMinimized && window.instanceKey !== 'welcome',
  )

  return {
    welcomeWindow,
    openWindows,
    minimizedWindows,
  }
}
