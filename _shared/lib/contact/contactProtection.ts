import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const DEFAULT_RATE_LIMIT_WINDOW = '10 m' as const
const DEFAULT_RATE_LIMIT_MAX = 5

type RateLimitWindow = `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`

type TurnstileVerificationResponse = {
  success: boolean
  hostname?: string
  ['error-codes']?: string[]
}

const toPositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const toOrigin = (value: string | undefined) => {
  if (!value) {
    return null
  }

  try {
    return new URL(value).origin
  } catch {
    try {
      return new URL(`https://${value}`).origin
    } catch {
      return null
    }
  }
}

const getAllowedOrigins = (requestOrigin?: string) => {
  const configuredOrigins =
    process.env.CONTACT_ALLOWED_ORIGINS
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? []

  return Array.from(
    new Set(
      [
        ...DEFAULT_ALLOWED_ORIGINS,
        ...configuredOrigins,
        process.env.NEXT_PUBLIC_SITE_URL,
        process.env.VERCEL_PROJECT_PRODUCTION_URL,
        process.env.VERCEL_BRANCH_URL,
        process.env.VERCEL_URL,
        requestOrigin,
      ]
        .map(toOrigin)
        .filter((origin): origin is string => Boolean(origin)),
    ),
  )
}

const getAllowedHostnames = (requestOrigin?: string) =>
  getAllowedOrigins(requestOrigin).map((origin) => new URL(origin).hostname)

const getRateLimitWindow = (): RateLimitWindow => {
  const configuredWindow = process.env.CONTACT_RATE_LIMIT_WINDOW?.trim()

  if (configuredWindow) {
    return configuredWindow as RateLimitWindow
  }

  const configuredWindowMs = process.env.CONTACT_RATE_LIMIT_WINDOW_MS?.trim()

  if (configuredWindowMs) {
    const parsedMs = Number(configuredWindowMs)

    if (Number.isInteger(parsedMs) && parsedMs > 0) {
      return `${parsedMs} ms`
    }
  }

  return DEFAULT_RATE_LIMIT_WINDOW
}

let cachedRedisClient: Redis | null = null
let cachedRateLimit: Ratelimit | null = null

const getRedisClient = () => {
  if (!cachedRedisClient) {
    cachedRedisClient = Redis.fromEnv()
  }

  return cachedRedisClient
}

const getContactRateLimit = () => {
  if (!cachedRateLimit) {
    cachedRateLimit = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(
        toPositiveInteger(process.env.CONTACT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX),
        getRateLimitWindow(),
      ),
      analytics: true,
      prefix: 'contact-form',
    })
  }

  return cachedRateLimit
}

export const getClientIpAddress = (headers: Headers) => {
  const forwardedFor = headers.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown'
  }

  return headers.get('x-real-ip') ?? 'unknown'
}

export const isAllowedContactRequest = (headers: Headers, requestOrigin?: string) => {
  const allowedOrigins = getAllowedOrigins(requestOrigin)
  const origin = headers.get('origin')
  const referer = headers.get('referer')

  if (origin && allowedOrigins.includes(origin)) {
    return true
  }

  if (referer) {
    try {
      return allowedOrigins.includes(new URL(referer).origin)
    } catch {
      return false
    }
  }

  return false
}

export const rateLimitContactRequest = async (ipAddress: string) => {
  const ratelimit = getContactRateLimit()
  return ratelimit.limit(`contact:${ipAddress}`)
}

export const verifyTurnstileToken = async (
  token: string,
  remoteIp?: string,
  requestOrigin?: string,
) => {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    throw new Error('Turnstile verification is not configured. Set TURNSTILE_SECRET_KEY.')
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: remoteIp,
    }),
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) {
    throw new Error(`Turnstile verification failed with status ${response.status}.`)
  }

  const result = (await response.json()) as TurnstileVerificationResponse
  const allowedHostnames = getAllowedHostnames(requestOrigin)

  if (!result.success) {
    return result
  }

  if (result.hostname && allowedHostnames.length > 0 && !allowedHostnames.includes(result.hostname)) {
    return {
      success: false,
      hostname: result.hostname,
      ['error-codes']: ['hostname-mismatch'],
    } satisfies TurnstileVerificationResponse
  }

  return result
}
