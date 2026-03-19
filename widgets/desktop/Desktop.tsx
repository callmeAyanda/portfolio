'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  selectWindowById,
  useWindowStore,
  type WindowContentType,
  type WindowState,
} from '@/features/windowManager/model/windowStore'
import {
  PROJECTS_BY_ID,
  type ProjectImage,
  type ProjectRecord,
  type ProjectVideo,
} from '@/entities/project/model/projects'
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
import { ImagePreviewContent } from './ImagePreviewContent'
import { VideoPreviewContent } from './VideoPreviewContent'

const DESKTOP_NAME = 'AYANDA MAKHUBU'

const appMap: Array<{
  icon: React.ElementType
  label: string
  windowTitle: string
  type: Exclude<WindowContentType, 'welcome' | 'projectDetail' | 'imageViewer' | 'videoViewer'>
}> = [
  { icon: Folder, label: 'Projects', windowTitle: 'Projects', type: 'projects' },
  { icon: FileText, label: 'Skills', windowTitle: 'Skills', type: 'skills' },
  { icon: GraduationCap, label: 'Education', windowTitle: 'Education', type: 'education' },
  { icon: Trophy, label: 'Achievements', windowTitle: 'Achievements', type: 'achievements' },
  { icon: BriefcaseBusiness, label: 'Experience', windowTitle: 'Experience', type: 'experience' },
  { icon: Mail, label: 'Contact Me', windowTitle: 'Contact', type: 'contact' },
  { icon: User, label: 'About Me', windowTitle: 'About Me', type: 'about' },
]

const DesktopWindow: React.FC<{
  id: string
  renderWindowContent: (windowState: WindowState) => React.ReactNode
}> = ({ id, renderWindowContent }) => {
  const windowState = useWindowStore(React.useMemo(() => selectWindowById(id), [id]))

  if (!windowState) {
    return null
  }

  return <Window id={id}>{renderWindowContent(windowState)}</Window>
}

export const Desktop: React.FC = () => {
  const openOrFocusWindow = useWindowStore((state) => state.openOrFocusWindow)
  const windows = useWindowStore((state) => state.windows)
  const [selectedIcon, setSelectedIcon] = useState<WindowContentType | null>(null)
  const [isCompactDesktop, setIsCompactDesktop] = useState(false)
  const openOffsetRef = useRef(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px), (pointer: coarse)')

    const syncCompactDesktop = () => {
      setIsCompactDesktop(mediaQuery.matches)
    }

    syncCompactDesktop()
    mediaQuery.addEventListener('change', syncCompactDesktop)

    return () => {
      mediaQuery.removeEventListener('change', syncCompactDesktop)
    }
  }, [])

  const getNextWindowPosition = (baseX: number, baseY: number) => {
    const step = (openOffsetRef.current % 8) * 24
    openOffsetRef.current += 1
    return { x: baseX + step, y: baseY + step }
  }

  const getWindowFrame = (baseX: number, baseY: number, width: number, height: number) => {
    if (typeof window === 'undefined') {
      return {
        position: { x: baseX, y: baseY },
        size: { width, height },
      }
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = Math.max(260, window.innerHeight - 56)

    if (isCompactDesktop) {
      return {
        position: { x: 8, y: 8 },
        size: {
          width: Math.max(280, viewportWidth - 16),
          height: Math.max(240, viewportHeight - 16),
        },
      }
    }

    const nextPosition = getNextWindowPosition(baseX, baseY)
    const safeSize = {
      width: Math.min(width, Math.max(280, viewportWidth - 24)),
      height: Math.min(height, Math.max(240, viewportHeight - 24)),
    }

    return {
      position: {
        x: Math.min(Math.max(8, nextPosition.x), Math.max(8, viewportWidth - safeSize.width - 8)),
        y: Math.min(Math.max(8, nextPosition.y), Math.max(8, viewportHeight - safeSize.height - 8)),
      },
      size: safeSize,
    }
  }

  const openDesktopApp = (
    contentType: Exclude<WindowContentType, 'welcome' | 'projectDetail' | 'imageViewer' | 'videoViewer'>,
    title: string,
  ) => {
    const frame = getWindowFrame(100, 100, 700, 400)
    openOrFocusWindow({
      title,
      content: contentType,
      position: frame.position,
      size: frame.size,
    })
  }

  const openProjectWindow = (project: ProjectRecord) => {
    const frame = getWindowFrame(160, 120, 700, 400)
    openOrFocusWindow({
      title: project.title,
      content: 'projectDetail',
      instanceKey: `project:${project.id}`,
      payload: { projectId: project.id },
      position: frame.position,
      size: frame.size,
    })
  }

  const openProjectImageWindow = (project: ProjectRecord, image: ProjectImage) => {
    const frame = getWindowFrame(220, 140, 760, 520)
    openOrFocusWindow({
      title: `${project.title} - ${image.title}`,
      content: 'imageViewer',
      instanceKey: `project-image:${project.id}:${image.id}`,
      payload: { projectId: project.id, imageId: image.id },
      position: frame.position,
      size: frame.size,
    })
  }

  const openProjectVideoWindow = (project: ProjectRecord, video: ProjectVideo) => {
    const frame = getWindowFrame(240, 160, 780, 560)
    openOrFocusWindow({
      title: `${project.title} - ${video.title}`,
      content: 'videoViewer',
      instanceKey: `project-video:${project.id}:${video.id}`,
      payload: { projectId: project.id, videoId: video.id },
      position: frame.position,
      size: frame.size,
    })
  }

  const renderWindowContent = (windowState: WindowState) => {
    switch (windowState.content) {
      case 'welcome':
        return <WelcomeContent />
      case 'projects':
        return (
          <ProjectsContent
            onOpenProject={openProjectWindow}
            onOpenImage={openProjectImageWindow}
            onOpenVideo={openProjectVideoWindow}
          />
        )
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

        return (
          <ProjectDetailsContent
            project={project}
            onOpenImage={openProjectImageWindow}
            onOpenVideo={openProjectVideoWindow}
          />
        )
      }
      case 'imageViewer': {
        const projectId = windowState.payload?.projectId
        const imageId = windowState.payload?.imageId
        const project = projectId ? PROJECTS_BY_ID[projectId] : null
        const image = project?.images.find((item) => item.id === imageId)

        if (!project || !image) {
          return <p className="text-sm">Image preview could not be loaded.</p>
        }

        return <ImagePreviewContent projectTitle={project.title} image={image} />
      }
      case 'videoViewer': {
        const projectId = windowState.payload?.projectId
        const videoId = windowState.payload?.videoId
        const project = projectId ? PROJECTS_BY_ID[projectId] : null
        const video = project?.videos.find((item) => item.id === videoId)

        if (!project || !video) {
          return <p className="text-sm">Video preview could not be loaded.</p>
        }

        return <VideoPreviewContent projectTitle={project.title} video={video} />
      }
      default:
        return null
    }
  }

  const visibleWindowIds = useMemo(
    () => windows.filter((window) => window.isOpen && !window.isMinimized).map((window) => window.id),
    [windows],
  )

  return (
    <div
      data-desktop-root
      className="relative h-screen w-full overflow-hidden"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
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
            onClick={() => {
              if (isCompactDesktop) {
                openDesktopApp(app.type, app.windowTitle)
                return
              }

              setSelectedIcon(app.type)
            }}
            onDoubleClick={() => openDesktopApp(app.type, app.windowTitle)}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        {visibleWindowIds.map((windowId) => (
          <DesktopWindow key={windowId} id={windowId} renderWindowContent={renderWindowContent} />
        ))}
      </div>
    </div>
  )
}
