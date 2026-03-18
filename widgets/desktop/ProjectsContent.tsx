"use client";

import React, { useMemo, useState } from 'react'

import { FolderOpen } from 'lucide-react'
import { PROJECTS, type ProjectImage, type ProjectRecord, type ProjectVideo } from '@/entities/project/model/projects'

interface ProjectsContentProps {
  onOpenProject: (project: ProjectRecord) => void
  onOpenImage: (project: ProjectRecord, image: ProjectImage) => void
  onOpenVideo: (project: ProjectRecord, video: ProjectVideo) => void
}

export const ProjectsContent: React.FC<ProjectsContentProps> = ({
  onOpenProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0]?.id ?? '')

  const selectedProject = useMemo(
    () => PROJECTS.find((project) => project.id === selectedProjectId) ?? PROJECTS[0],
    [selectedProjectId]
  )

  if (!selectedProject) {
    return <p className="text-sm">No projects are available yet.</p>
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between border-sunken bg-white px-2 py-1 text-sm">
        <span>{PROJECTS.length} project file{PROJECTS.length === 1 ? '' : 's'}</span>
      </div>

      <div className="min-h-0 flex-1 gap-3">
        <aside className="border-sunken bg-[#efefef] p-2">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-black/70">Explorer</div>
          <div className="space-y-1">
            {PROJECTS.map((project) => {
              const isSelected = project.id === selectedProject.id

              return (
                <button
                  key={project.id}
                  type="button"
                  className={`flex w-full items-start gap-2 border px-2 py-2 text-left text-sm ${
                    isSelected
                      ? 'border-border-light bg-title-bar-active text-white'
                      : 'border-transparent bg-transparent text-black hover:border-border-light hover:bg-white'
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                  onDoubleClick={() => onOpenProject(project)}
                >
                  <FolderOpen size={18} className="mt-0.5 shrink-0" />
                  <span className="leading-5">{project.title}</span>
                </button>
              )
            })}
          </div>
        </aside>

      </div>
    </div>
  )
}
