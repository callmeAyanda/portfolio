'use client'

import React from 'react'

export interface IconProps {
  icon: React.ElementType
  label: string
  onClick?: () => void
  onDoubleClick?: () => void
  selected?: boolean
  className?: string
  labelClassName?: string
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  label,
  onClick,
  onDoubleClick,
  selected = false,
  className = '',
  labelClassName = '',
}) => {
  return (
    <button
      type="button"
      className={`w-20 cursor-pointer select-none rounded p-2 text-left transition-shadow touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        selected
          ? 'bg-[rgba(0,0,128,0.25)] shadow-[2px_2px_0px_rgba(0,0,0,0.6)]'
          : 'hover:shadow-[2px_2px_0px_rgba(0,0,0,0.45)]'
      } ${className}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex flex-col items-center">
        <IconComponent size={32} strokeWidth={1.5} className="text-black" />
      </div>
      <span
        className={`mt-1 block text-center text-xs text-black drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)] ${labelClassName}`}
      >
        {label}
      </span>
    </button>
  )
}
