"use client";

import React from 'react'
import Image from 'next/image'
import type { ProjectImage } from '@/entities/project/model/projects'

interface ImagePreviewContentProps {
  projectTitle: string
  image: ProjectImage
}

export const ImagePreviewContent: React.FC<ImagePreviewContentProps> = ({ projectTitle, image }) => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="border-raised bg-[#d7d7d7] p-2">
        <div className="text-xs uppercase tracking-wide text-black/60">Image Preview</div>
        <h2 className="text-sm font-bold">{projectTitle}</h2>
        <p className="text-xs text-black/70">{image.title}</p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center border-sunken bg-[#808080] p-3">
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={800}
          className="max-h-full max-w-full border-raised bg-white object-contain"
        />
      </div>

      <div className="border-sunken bg-white px-3 py-2 text-sm leading-5">{image.caption}</div>
    </div>
  )
}
