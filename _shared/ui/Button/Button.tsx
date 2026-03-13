"use client";

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'active'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'px-4 py-1 font-sans text-sm bg-window border-raised active:border-sunken disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100'
  const variantClasses = variant === 'active' ? 'border-sunken' : ''

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

