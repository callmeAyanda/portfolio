'use client'

import React, { useRef, useState } from 'react'
import {
  useWindowStore,
  type WindowContentType,
  type WindowState,
} from '@/features/windowManager/model/windowStore'
import { PROJECTS_BY_ID, type ProjectRecord } from '@/entities/project/model/projects'
import { Icon } from '@/_shared/ui/Icon'
import { BriefcaseBusiness, FileText, Folder, GraduationCap, Mail, Trophy, User } from 'lucide-react'
import { Window } from '@/_shared/ui/Window'
import { DesktopNameplate } from './DesktopNameplate'
import { WelcomeContent } from './WelcomeContent'
import { ProjectsContent } from './ProjectsContent'
import { SkillsContent } from './SkillsContent'
import { ContactContent } from './ContactContent'
import { AboutContent } from './AboutContent'
import { ProjectDetailsContent } from './ProjectDetailsContent'
import { EducationContent } from './EducationContent'
import { AchievementsContent } from './AchievementsContent'
import { ExperienceContent } from './ExperienceContent'

const DESKTOP_NAME = 'AYANDA MAKHUBU'

const appMap: Array<{
  icon: React.ElementType
  label: string
  windowTitle: string
  type: Exclude<WindowContentType, 'welcome' | 'projectDetail'>
}> = [
  { icon: Folder, label: 'Projects', windowTitle: 'Projects', type: 'projects' },
  { icon: FileText, label: 'Skills', windowTitle: 'Skills', type: 'skills' },
  { icon: GraduationCap, label: 'Education', windowTitle: 'Education', type: 'education' },
  { icon: Trophy, label: 'Achievements', windowTitle: 'Achievements', type: 'achievements' },
  { icon: BriefcaseBusiness, label: 'Experience', windowTitle: 'Experience', type: 'experience' },
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
      size: { width: 700, height: 400 },
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
      size: { width: 700, height: 400 },
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
      case 'education':
        return <EducationContent />
      case 'achievements':
        return <AchievementsContent />
      case 'experience':
        return <ExperienceContent />
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
      data-desktop-root
      className="relative h-screen w-full overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedIcon(null)
        }
      }}
    >
      <DesktopNameplate name={DESKTOP_NAME} />

      <div className="relative z-10 grid grid-cols-[repeat(auto-fill,80px)] gap-4 p-4">
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

      <div className="absolute inset-0 z-20 pointer-events-none">
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
