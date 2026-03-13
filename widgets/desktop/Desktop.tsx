'use client'

import React, { useRef, useState } from 'react'
import {
  useWindowStore,
  type WindowContentType,
  type WindowState,
} from '@/features/windowManager/model/windowStore'
import { PROJECTS_BY_ID, type ProjectRecord } from '@/entities/project/model/projects'
import { Icon } from '@/_shared/ui/Icon'
import { Folder, FileText, Mail, User } from 'lucide-react'
import { Window } from '@/_shared/ui/Window'
import { DesktopNameplate } from './DesktopNameplate'
import { WelcomeContent } from './WelcomeContent'
import { ProjectsContent } from './ProjectsContent'
import { SkillsContent } from './SkillsContent'
import { ContactContent } from './ContactContent'
import { AboutContent } from './AboutContent'
import { ProjectDetailsContent } from './ProjectDetailsContent'

const DESKTOP_NAME = 'A22 MA'

const appMap: Array<{
  icon: React.ElementType
  label: string
  windowTitle: string
  type: Exclude<WindowContentType, 'welcome' | 'projectDetail'>
}> = [
  { icon: Folder, label: 'Projects', windowTitle: 'Projects', type: 'projects' },
  { icon: FileText, label: 'Skills', windowTitle: 'Skills', type: 'skills' },
  { icon: Mail, label: 'Contact Me', windowTitle: 'Contact', type: 'contact' },
  { icon: User, label: 'About Me', windowTitle: 'About Me', type: 'about' },
]

export const Desktop: React.FC = () => {
  const { windows, openOrFocusWindow } = useWindowStore()
  const [selectedIcon, setSelectedIcon] = useState<WindowContentType | null>(null)
  const openOffsetRef = useRef(0)

  const getNextWindowPosition = (baseX: number, baseY: number) => {
    const step = (openOffsetRef.current % 8) * 24
    openOffsetRef.current += 1
    return { x: baseX + step, y: baseY + step }
  }

  const openDesktopApp = (contentType: Exclude<WindowContentType, 'welcome' | 'projectDetail'>, title: string) => {
    const position = getNextWindowPosition(100, 100)
    openOrFocusWindow({
      title,
      content: contentType,
      position,
      size: { width: 520, height: 360 },
    })
  }

  const openProjectWindow = (project: ProjectRecord) => {
    const position = getNextWindowPosition(160, 120)
    openOrFocusWindow({
      title: project.title,
      content: 'projectDetail',
      instanceKey: `project:${project.id}`,
      payload: { projectId: project.id },
      position,
      size: { width: 560, height: 380 },
    })
  }

  const renderWindowContent = (windowState: WindowState) => {
    switch (windowState.content) {
      case 'welcome':
        return <WelcomeContent />
      case 'projects':
        return <ProjectsContent onOpenProject={openProjectWindow} />
      case 'skills':
        return <SkillsContent />
      case 'contact':
        return <ContactContent />
      case 'about':
        return <AboutContent />
      case 'projectDetail': {
        const projectId = windowState.payload?.projectId
        const project = projectId ? PROJECTS_BY_ID[projectId] : null

        if (!project) {
          return <p className="text-sm">Project details could not be loaded.</p>
        }

        return <ProjectDetailsContent project={project} />
      }
      default:
        return null
    }
  }

  return (
    <div
      className="relative h-screen w-full overflow-hidden p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedIcon(null)
        }
      }}
    >
      <DesktopNameplate name={DESKTOP_NAME} />

      <div className="relative z-0 grid grid-cols-[repeat(auto-fill,80px)] gap-4">
        {appMap.map((app) => (
          <Icon
            key={app.type}
            icon={app.icon}
            label={app.label}
            selected={selectedIcon === app.type}
            onClick={() => setSelectedIcon(app.type)}
            onDoubleClick={() => openDesktopApp(app.type, app.windowTitle)}
          />
        ))}
      </div>

      <div className="relative z-20">
        {windows
          .filter((w) => w.isOpen && !w.isMinimized)
          .map((win) => (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              initialPosition={win.position}
              initialSize={win.size}
            >
              {renderWindowContent(win)}
            </Window>
          ))}
      </div>
    </div>
  )
}
