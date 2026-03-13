"use client";

import React from 'react'
import type { ProjectRecord } from '@/entities/project/model/projects'

interface ProjectDetailsContentProps {
  project: ProjectRecord
}

export const ProjectDetailsContent: React.FC<ProjectDetailsContentProps> = ({ project }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">{project.title}</h2>
      <p className="text-sm">{project.description}</p>

      <div>
        <h3 className="mb-1 text-sm font-bold">Stack</h3>
        <ul className="ml-4 list-disc text-sm">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-bold">Links</h3>
        <ul className="space-y-1 text-sm">
          {project.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="underline hover:no-underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
