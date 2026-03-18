import { NextRequest, NextResponse } from 'next/server'

import { sendContactEmail } from '@/_shared/lib/contact/sendContactEmail'
import { contactSubmissionSchema } from '@/features/contactForm/model/contact.schema'

export const runtime = 'nodejs'

const MIN_FORM_FILL_TIME_MS = 3_000
const RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000)
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5)

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown'
  }

  return request.headers.get('x-real-ip') ?? 'unknown'
}

const isRateLimited = (ipAddress: string) => {
  const now = Date.now()
  const existingEntry = rateLimitStore.get(ipAddress)

  if (!existingEntry || existingEntry.resetAt <= now) {
    rateLimitStore.set(ipAddress, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })

    return false
  }

  if (existingEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  existingEntry.count += 1
  return false
}

export async function POST(request: NextRequest) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'The contact form request could not be read.' },
      { status: 400 },
    )
  }

  const parsedSubmission = contactSubmissionSchema.safeParse(payload)

  if (!parsedSubmission.success) {
    const firstIssue = parsedSubmission.error.issues[0]

    return NextResponse.json(
      { error: firstIssue?.message ?? 'The contact form submission is invalid.' },
      { status: 400 },
    )
  }

  const { website, formStartedAt, ...submission } = parsedSubmission.data

  if (website) {
    return NextResponse.json({
      message: 'Message sent successfully.',
    })
  }

  if (Date.now() - formStartedAt < MIN_FORM_FILL_TIME_MS) {
    return NextResponse.json(
      { error: 'Please wait a moment before submitting the form.' },
      { status: 400 },
    )
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: 'Too many messages were sent from this connection. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    await sendContactEmail(submission)

    return NextResponse.json({
      message: 'Message sent successfully.',
    })
  } catch (error) {
    console.error('Contact form delivery failed:', error)

    return NextResponse.json(
      { error: 'Message delivery is unavailable right now. Please try again later.' },
      { status: 500 },
    )
  }
}
