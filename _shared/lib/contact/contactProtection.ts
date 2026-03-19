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

const getAllowedOrigins = () => {
  const rawOrigins = process.env.CONTACT_ALLOWED_ORIGINS

  if (!rawOrigins) {
    return DEFAULT_ALLOWED_ORIGINS
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const getAllowedHostnames = () =>
  getAllowedOrigins().flatMap((origin) => {
    try {
      return [new URL(origin).hostname]
    } catch {
      return []
    }
  })

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
    const rateLimitWindow = (process.env.CONTACT_RATE_LIMIT_WINDOW ?? DEFAULT_RATE_LIMIT_WINDOW) as RateLimitWindow

    cachedRateLimit = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(
        toPositiveInteger(process.env.CONTACT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX),
        rateLimitWindow,
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

export const isAllowedContactRequest = (headers: Headers) => {
  const allowedOrigins = getAllowedOrigins()
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

export const verifyTurnstileToken = async (token: string, remoteIp?: string) => {
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
  const allowedHostnames = getAllowedHostnames()

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
