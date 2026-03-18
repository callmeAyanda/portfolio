"use client";

import React from 'react'
import Image from 'next/image'
import { Clapperboard, Github, Image as ImageIcon, Play } from 'lucide-react'
import { Button } from '@/_shared/ui/Button'
import type { ProjectImage, ProjectRecord, ProjectVideo } from '@/entities/project/model/projects'

interface ProjectDetailsContentProps {
  project: ProjectRecord
  onOpenImage: (project: ProjectRecord, image: ProjectImage) => void
  onOpenVideo: (project: ProjectRecord, video: ProjectVideo) => void
}

export const ProjectDetailsContent: React.FC<ProjectDetailsContentProps> = ({
  project,
  onOpenImage,
  onOpenVideo,
}) => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="border-raised bg-[#d7d7d7] p-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-black/60">Project File</div>
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-5">{project.description}</p>
          </div>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-raised bg-window px-3 py-2 text-sm"
            >
              <Github size={15} />
              View GitHub
            </a>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {project.stack.map((item) => (
            <span key={item} className="border-raised bg-window px-2 py-1">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.35fr_minmax(280px,0.9fr)]">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="border-sunken bg-white p-3">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-black/70">Overview</div>
            <p className="text-sm leading-6">{project.summary}</p>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            <section className="border-sunken bg-white p-3">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-black/70">
                <ImageIcon size={14} />
                Image Gallery
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {project.images.map((image) => (
                  <div key={image.id} className="border-raised bg-[#d7d7d7] p-2">
                    <button type="button" className="block w-full" onClick={() => onOpenImage(project, image)}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={520}
                        height={320}
                        className="h-32 w-full border-sunken object-cover"
                      />
                    </button>
                    <div className="mt-2">
                      <div className="text-sm font-bold">{image.title}</div>
                      <p className="mt-1 text-xs leading-4 text-black/70">{image.caption}</p>
                      <Button className="mt-2 px-3" onClick={() => onOpenImage(project, image)}>
                        Open Image Window
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-sunken bg-white p-3">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-black/70">
                <Clapperboard size={14} />
                Video Gallery
              </div>
              {project.videos.length > 0 ? (
                <div className="space-y-3">
                  {project.videos.map((video) => (
                    <div key={video.id} className="border-raised bg-[#d7d7d7] p-2">
                      <div className="flex items-start gap-2">
                        <Play size={16} className="mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-bold">{video.title}</div>
                          <p className="mt-1 text-xs leading-4 text-black/70">{video.caption}</p>
                        </div>
                      </div>
                      <Button className="mt-2 px-3" onClick={() => onOpenVideo(project, video)}>
                        Open Video Window
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="border-sunken bg-[#f7f7f7] px-2 py-3 text-xs leading-5 text-black/70">
                  Video playback is built in. Add a `videos` entry with a local source in the project model and this
                  window will open it in a themed player.
                </p>
              )}
            </section>
          </div>
        </div>

        <aside className="border-sunken bg-white p-3">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-black/70">Project Notes</div>
          <div className="space-y-3">
            {project.sections.map((section) => (
              <section key={section.title} className="border-raised bg-[#d7d7d7] p-2">
                <h3 className="text-sm font-bold">{section.title}</h3>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-sm leading-5">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            {project.links.length > 0 && (
              <section className="border-raised bg-[#d7d7d7] p-2">
                <h3 className="text-sm font-bold">External Links</h3>
                <div className="mt-2 space-y-2">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block border-sunken bg-white px-2 py-2 text-sm underline hover:no-underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
