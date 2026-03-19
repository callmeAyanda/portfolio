'use client'

import React from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'auto' | 'light' | 'dark'
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

interface TurnstileWidgetProps {
  siteKey: string
  resetSignal: number
  onTokenChange: (token: string) => void
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  siteKey,
  resetSignal,
  onTokenChange,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const widgetIdRef = React.useRef<string | null>(null)
  const [isScriptReady, setIsScriptReady] = React.useState(false)

  React.useEffect(() => {
    if (!isScriptReady || !siteKey || !containerRef.current || !window.turnstile) {
      return
    }

    onTokenChange('')

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current)
      widgetIdRef.current = null
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'light',
      callback: (token) => {
        onTokenChange(token)
      },
      'expired-callback': () => {
        onTokenChange('')
      },
      'error-callback': () => {
        onTokenChange('')
      },
    })

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [isScriptReady, onTokenChange, siteKey])

  React.useEffect(() => {
    if (!widgetIdRef.current || !window.turnstile) {
      return
    }

    onTokenChange('')
    window.turnstile.reset(widgetIdRef.current)
  }, [onTokenChange, resetSignal])

  if (!siteKey) {
    return (
      <p className="text-xs text-red-600">
        Contact form security is not configured. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
      </p>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      <div ref={containerRef} />
    </>
  )
}
