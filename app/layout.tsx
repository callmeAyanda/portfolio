// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Taskbar } from '@/widgets/taskbar/Taskbar'

export const metadata: Metadata = {
  title: "Ayanda's Retro Portfolio",
  description: 'A Windows 98 inspired portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Taskbar />
      </body>
    </html>
  )
}

