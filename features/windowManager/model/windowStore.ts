"use client";

import { create } from 'zustand'

export type WindowContentType = 'welcome' | 'projects' | 'skills' | 'contact' | 'about' | 'projectDetail'

type WindowPayload = {
  projectId?: string
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
  taskbarHeight: number
}

interface WindowStore {
  windows: WindowState[]
  nextZIndex: number
  addWindow: (window: Omit<WindowState, 'zIndex'>) => void
  openOrFocusWindow: (window: OpenOrFocusWindowInput) => void
  openWindow: (id: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMaximizeWindow: (id: string, viewport: MaximizeViewport) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
  updateWindowSize: (id: string, size: { width: number; height: number }) => void
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [
    // Initial windows (maybe one open by default, e.g., 'welcome')
    {
      id: 'welcome-1',
      title: 'Welcome',
      content: 'welcome',
      instanceKey: 'welcome',
      payload: null,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 50, y: 50 },
      size: { width: 500, height: 300 },
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
      const existingWindow = state.windows.find((w) => w.instanceKey === resolvedInstanceKey)

      if (existingWindow) {
        return {
          windows: state.windows.map((w) =>
            w.id === existingWindow.id
              ? {
                  ...w,
                  title: window.title,
                  payload: window.payload ?? w.payload,
                  isOpen: true,
                  isMinimized: false,
                  isMaximized: false,
                  restoreState: null,
                  zIndex: state.nextZIndex,
                }
              : w
          ),
          nextZIndex: state.nextZIndex + 1,
        }
      }

      return {
        windows: [
          ...state.windows,
          {
            id: `${window.content}-1`,
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
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: state.nextZIndex } : w
      ),
      nextZIndex: state.nextZIndex + 1,
    })),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isOpen: false } : w)),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    })),

  toggleMaximizeWindow: (id, viewport) =>
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w

        if (w.isMaximized && w.restoreState) {
          return {
            ...w,
            isMaximized: false,
            position: w.restoreState.position,
            size: w.restoreState.size,
            restoreState: null,
            zIndex: state.nextZIndex,
          }
        }

        return {
          ...w,
          isMaximized: true,
          restoreState: {
            position: w.position,
            size: w.size,
          },
          position: { x: 0, y: 0 },
          size: {
            width: viewport.width,
            height: Math.max(200, viewport.height - viewport.taskbarHeight),
          },
          zIndex: state.nextZIndex,
        }
      }),
      nextZIndex: state.nextZIndex + 1,
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
      ),
      nextZIndex: state.nextZIndex + 1,
    })),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.nextZIndex } : w
      ),
      nextZIndex: state.nextZIndex + 1,
    })),

  updateWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    })),

  updateWindowSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    })),
}))

