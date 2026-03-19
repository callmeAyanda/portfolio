import { ImageResponse } from 'next/og'

export const alt = "Ayanda's Retro Portfolio"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').hostname

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          background: 'linear-gradient(135deg, #008080 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '64px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            border: '4px solid rgba(255,255,255,0.45)',
            background: 'rgba(0, 0, 0, 0.28)',
            padding: '36px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: 28, letterSpacing: 4, textTransform: 'uppercase' }}>
              Windows 98 Inspired Portfolio
            </div>
            <div style={{ fontSize: 72, fontWeight: 700 }}>Ayanda Makhubu</div>
            <div style={{ fontSize: 30, maxWidth: 860, lineHeight: 1.3 }}>
              Full-stack projects, interactive desktop UI, and production-ready portfolio experience.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26 }}>
            <span>Next.js - React - TypeScript</span>
            <span>{siteHost}</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
