'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/_shared/ui/Button'
import type { ProjectVideo } from '@/entities/project/model/projects'

interface VideoPreviewContentProps {
  projectTitle: string
  video: ProjectVideo
}

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) {
    return '0:00'
  }

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const VideoPreviewContent: React.FC<VideoPreviewContentProps> = ({ projectTitle, video }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const element = videoRef.current

    if (!element) {
      return
    }

    const syncTime = () => setCurrentTime(element.currentTime)
    const syncDuration = () => setDuration(element.duration)
    const syncPlayState = () => setIsPlaying(!element.paused)

    element.addEventListener('timeupdate', syncTime)
    element.addEventListener('loadedmetadata', syncDuration)
    element.addEventListener('play', syncPlayState)
    element.addEventListener('pause', syncPlayState)
    element.addEventListener('ended', syncPlayState)

    return () => {
      element.removeEventListener('timeupdate', syncTime)
      element.removeEventListener('loadedmetadata', syncDuration)
      element.removeEventListener('play', syncPlayState)
      element.removeEventListener('pause', syncPlayState)
      element.removeEventListener('ended', syncPlayState)
    }
  }, [])

  const togglePlayback = async () => {
    const element = videoRef.current

    if (!element) {
      return
    }

    if (element.paused) {
      await element.play()
      return
    }

    element.pause()
  }

  const seekBy = (delta: number) => {
    const element = videoRef.current

    if (!element) {
      return
    }

    element.currentTime = Math.max(0, Math.min(element.duration || 0, element.currentTime + delta))
  }

  const restart = async () => {
    const element = videoRef.current

    if (!element) {
      return
    }

    element.currentTime = 0
    await element.play()
  }

  if (!video.src) {
    return (
      <div className="flex h-full items-center justify-center border-sunken bg-white p-4 text-sm">
        Video source missing for this project.
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="border-raised bg-[#d7d7d7] p-2">
        <div className="text-xs uppercase tracking-wide text-black/60">Media Player</div>
        <h2 className="text-sm font-bold">{projectTitle}</h2>
        <p className="text-xs text-black/70">{video.title}</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-sunken bg-black p-2">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          preload="metadata"
          playsInline
          className="min-h-0 flex-1 bg-black"
        />
      </div>

      <div className="border-raised bg-[#d7d7d7] p-2">
        <div className="mb-2 flex flex-wrap gap-2">
          <Button type="button" onClick={() => void togglePlayback()} className="flex items-center gap-2 px-3">
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button type="button" onClick={() => seekBy(-10)} className="flex items-center gap-2 px-3">
            <SkipBack size={14} />
            Back 10s
          </Button>
          <Button type="button" onClick={() => seekBy(10)} className="flex items-center gap-2 px-3">
            <SkipForward size={14} />
            Forward 10s
          </Button>
          <Button type="button" onClick={() => void restart()} className="flex items-center gap-2 px-3">
            <RotateCcw size={14} />
            Replay
          </Button>
        </div>

        <label className="block text-xs">
          <span className="mb-1 block font-bold uppercase tracking-wide text-black/60">Timeline</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => {
              const nextValue = Number(event.target.value)
              setCurrentTime(nextValue)

              if (videoRef.current) {
                videoRef.current.currentTime = nextValue
              }
            }}
            className="w-full"
          />
        </label>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span>{formatTime(currentTime)}</span>
          <span>{video.caption}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
