"use client";

import React from 'react'
import {
  useWindowStore,
  type WindowContentType,
} from '@/features/windowManager/model/windowStore'
import { Folder, FileText, Mail, User } from 'lucide-react'

interface StartMenuProps {
  onClose: () => void
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { openOrFocusWindow } = useWindowStore()

  const handleItemClick = (contentType: WindowContentType, title: string) => {
    openOrFocusWindow({
      title,
      content: contentType,
      position: { x: 150, y: 150 },
      size: { width: 700, height: 400 },
    })
    onClose()
  }

  return (
    <div className="absolute bottom-10 left-0 w-64 bg-window border-raised shadow-lg p-1">
      <div className="flex">
        {/* Branded left rail */}
        <div className="w-8 bg-title-bar-active flex flex-col items-center py-2">
          <span className="text-white text-xs transform -rotate-90 whitespace-nowrap">Windows 98</span>
        </div>
        {/* Menu items */}
        <div className="flex-1 p-1">
          <MenuItem icon={Folder} label="Projects" onClick={() => handleItemClick('projects', 'Projects')} />
          <MenuItem icon={FileText} label="Skills" onClick={() => handleItemClick('skills', 'Skills')} />
          <MenuItem icon={Mail} label="Contact" onClick={() => handleItemClick('contact', 'Contact')} />
          <MenuItem icon={User} label="About Me" onClick={() => handleItemClick('about', 'About Me')} />
        </div>
      </div>
    </div>
  )
}

const MenuItem: React.FC<{ icon: React.ElementType; label: string; onClick: () => void }> = ({
  icon: IconComponent,
  label,
  onClick,
}) => {
  return (
    <button
      className="w-full flex items-center gap-3 px-2 py-1 hover:bg-title-bar-active hover:text-white border border-transparent hover:border-border-light active:shadow-[2px_2px_0px_rgba(0,0,0,0.6)]"
      onClick={onClick}
    >
      <IconComponent size={20} />
      <span className="text-sm">{label}</span>
    </button>
  )
}

