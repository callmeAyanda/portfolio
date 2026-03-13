"use client";

import React from 'react'

interface DesktopNameplateProps {
  name: string
}

export const DesktopNameplate: React.FC<DesktopNameplateProps> = ({ name }) => {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
      <div className="border-raised bg-window/90 px-6 py-3 text-center shadow-[3px_3px_0px_rgba(0,0,0,0.4)]">
        <p className="text-xs uppercase tracking-[0.2em] text-title-bar-inactive">Portfolio</p>
        <h1 className="text-2xl font-bold text-title-bar-active sm:text-3xl">{name}</h1>
      </div>
    </div>
  )
}
