import type { Metadata } from 'next'
import './globals.css'
import { Taskbar } from '@/widgets/taskbar/Taskbar'

const toAbsoluteUrl = (value: string | undefined) => {
  if (!value) {
    return null
  }

  try {
    return new URL(value)
  } catch {
    try {
      return new URL(`https://${value}`)
    } catch {
      return null
    }
  }
}

const siteUrl =
  toAbsoluteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  toAbsoluteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  toAbsoluteUrl(process.env.VERCEL_URL) ??
  new URL('http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Ayanda's Retro Portfolio",
  description: 'Windows 98 inspired portfolio for Ayanda Makhubu.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: "Ayanda's Retro Portfolio",
    description: 'Windows 98 inspired portfolio for Ayanda Makhubu.',
    siteName: "Ayanda's Retro Portfolio",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: "Ayanda's Retro Portfolio",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ayanda's Retro Portfolio",
    description: 'Windows 98 inspired portfolio for Ayanda Makhubu.',
    images: ['/twitter-image'],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
    apple: ['/icon.svg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Taskbar />
      </body>
    </html>
  )
}
