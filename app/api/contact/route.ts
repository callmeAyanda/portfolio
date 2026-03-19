import { NextRequest, NextResponse } from 'next/server'

import { sendContactEmail } from '@/_shared/lib/contact/sendContactEmail'
import {
  getClientIpAddress,
  isAllowedContactRequest,
  rateLimitContactRequest,
  verifyTurnstileToken,
} from '@/_shared/lib/contact/contactProtection'
import { contactSubmissionSchema } from '@/features/contactForm/model/contact.schema'

export const runtime = 'nodejs'

const MIN_FORM_FILL_TIME_MS = 3_000

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'The contact form request must be sent as JSON.' },
      { status: 415 },
    )
  }

  if (!isAllowedContactRequest(request.headers)) {
    return NextResponse.json(
      { error: 'This request origin is not allowed.' },
      {
        status: 403,
        headers: {
          Vary: 'Origin, Referer',
        },
      },
    )
  }

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

  const clientIpAddress = getClientIpAddress(request.headers)
  const { website, formStartedAt, turnstileToken, ...submission } = parsedSubmission.data

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

  const rateLimitResult = await rateLimitContactRequest(clientIpAddress)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many messages were sent from this connection. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, Math.ceil((rateLimitResult.reset - Date.now()) / 1_000))),
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
        },
      },
    )
  }

  try {
    const turnstileVerification = await verifyTurnstileToken(turnstileToken, clientIpAddress)

    if (!turnstileVerification.success) {
      return NextResponse.json(
        { error: 'The security check could not be verified. Please try again.' },
        { status: 400 },
      )
    }

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
