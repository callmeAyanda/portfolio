"use client";

import React, { useState } from 'react'
import { FolderOpen } from 'lucide-react'
import { Icon } from '@/_shared/ui/Icon'
import { PROJECTS, type ProjectRecord } from '@/entities/project/model/projects'

interface ProjectsContentProps {
  onOpenProject: (project: ProjectRecord) => void
}

export const ProjectsContent: React.FC<ProjectsContentProps> = ({ onOpenProject }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  return (
    <div className="h-full">
      <div className="mb-3 border-sunken bg-white px-2 py-1 text-sm">
        {PROJECTS.length} item{PROJECTS.length === 1 ? '' : 's'}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,95px)] gap-2 rounded border-sunken bg-[#d7d7d7] p-2">
        {PROJECTS.map((project) => (
          <Icon
            key={project.id}
            icon={FolderOpen}
            label={project.title}
            selected={selectedProjectId === project.id}
            className="w-[90px]"
            labelClassName="text-black drop-shadow-none"
            onClick={() => {
              setSelectedProjectId(project.id)
              onOpenProject(project)
            }}
          />
        ))}
      </div>
    </div>
  )
}
