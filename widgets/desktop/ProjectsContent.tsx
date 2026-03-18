"use client";

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { Clapperboard, FolderOpen, Image as ImageIcon, Github, Play, ArrowRight } from 'lucide-react'
import { Button } from '@/_shared/ui/Button'
import { PROJECTS, type ProjectImage, type ProjectRecord, type ProjectVideo } from '@/entities/project/model/projects'

interface ProjectsContentProps {
  onOpenProject: (project: ProjectRecord) => void
  onOpenImage: (project: ProjectRecord, image: ProjectImage) => void
  onOpenVideo: (project: ProjectRecord, video: ProjectVideo) => void
}

export const ProjectsContent: React.FC<ProjectsContentProps> = ({
  onOpenProject,
  onOpenImage,
  onOpenVideo,
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
        <span>{selectedProject.images.length} image preview(s)</span>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[230px_minmax(0,1fr)]">
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

        <section className="grid min-h-0 gap-3 md:grid-cols-[minmax(0,1.2fr)_260px]">
          <div className="border-sunken bg-white p-3">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-black/60">Previewing</div>
                <h2 className="text-lg font-bold">{selectedProject.title}</h2>
                <p className="mt-1 text-sm leading-5">{selectedProject.summary}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onOpenProject(selectedProject)} className="px-3">
                  Open
                </Button>
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border-raised bg-window px-3 py-1 text-sm"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                )}
              </div>
            </div>

            <div className="mb-3 border-raised bg-[#d7d7d7] p-2">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-black/70">Project Snapshot</div>
              <p className="text-sm leading-5">{selectedProject.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {selectedProject.stack.map((item) => (
                  <span key={item} className="border-raised bg-window px-2 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="border-raised bg-[#d7d7d7] p-2">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-black/70">
                  <ImageIcon size={14} />
                  Screenshots
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedProject.images.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      className="border-raised bg-window p-1 text-left"
                      onClick={() => onOpenImage(selectedProject, image)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={480}
                        height={280}
                        className="h-28 w-full border-sunken object-cover"
                      />
                      <span className="mt-2 block text-xs font-bold">{image.title}</span>
                      <span className="mt-1 block text-xs leading-4 text-black/70">{image.caption}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-raised bg-[#d7d7d7] p-2">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-black/70">
                  <Clapperboard size={14} />
                  Video Clips
                </div>
                {selectedProject.videos.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProject.videos.map((video) => (
                      <button
                        key={video.id}
                        type="button"
                        className="flex w-full items-start gap-2 border-raised bg-window p-2 text-left"
                        onClick={() => onOpenVideo(selectedProject, video)}
                      >
                        <Play size={16} className="mt-0.5 shrink-0" />
                        <span>
                          <span className="block text-xs font-bold">{video.title}</span>
                          <span className="mt-1 block text-xs leading-4 text-black/70">{video.caption}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="border-sunken bg-white px-2 py-3 text-xs leading-5 text-black/70">
                    This project is ready for retro video previews. Add a local `mp4` or `webm` source in
                    `entities/project/model/projects.ts` and it will appear here automatically.
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="border-sunken bg-[#efefef] p-3">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-black/70">Details</div>
            <div className="space-y-3 text-sm">
              {selectedProject.sections.map((section) => (
                <div key={section.title} className="border-raised bg-window p-2">
                  <h3 className="font-bold">{section.title}</h3>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="mt-2 leading-5">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-between border-raised bg-window px-3 py-2 text-sm"
              onClick={() => onOpenProject(selectedProject)}
            >
              <span>Open Full Project Window</span>
              <ArrowRight size={14} />
            </button>
          </aside>
        </section>
      </div>
    </div>
  )
}
