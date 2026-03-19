import 'server-only'

import nodemailer from 'nodemailer'

import type { ContactFormData } from '@/features/contactForm/model/contact.schema'

type ContactMailConfig = {
  destinationEmail: string
  fromEmail: string
  host: string
  port: number
  secure: boolean
  user: string
  password: string
}

let cachedTransporter: nodemailer.Transporter | null = null
let cachedConfigKey: string | null = null

const RETRY_DELAYS_MS = [500, 1_000, 2_000]

const getContactMailConfig = (): ContactMailConfig => {
  const {
    CONTACT_DESTINATION_EMAIL,
    CONTACT_FROM_EMAIL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASSWORD,
  } = process.env

  if (
    !CONTACT_DESTINATION_EMAIL ||
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASSWORD
  ) {
    throw new Error(
      'Contact form email delivery is not configured. Set CONTACT_DESTINATION_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.',
    )
  }

  return {
    destinationEmail: CONTACT_DESTINATION_EMAIL,
    fromEmail: CONTACT_FROM_EMAIL ?? SMTP_USER,
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
    user: SMTP_USER,
    password: SMTP_PASSWORD,
  }
}

const getTransporter = (config: ContactMailConfig) => {
  const configKey = JSON.stringify(config)

  if (!cachedTransporter || cachedConfigKey !== configKey) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      requireTLS: !config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      tls: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
    })
    cachedConfigKey = configKey
  }

  return cachedTransporter
}

const sleep = (durationMs: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs)
  })

export const sendContactEmail = async (submission: ContactFormData) => {
  const config = getContactMailConfig()
  const transporter = getTransporter(config)

  const text = [
    'New portfolio contact form submission',
    '',
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Subject: ${submission.subject}`,
    '',
    'Message:',
    submission.message,
  ].join('\n')

  let lastError: unknown

  for (const retryDelayMs of RETRY_DELAYS_MS) {
    try {
      await transporter.sendMail({
        from: config.fromEmail,
        to: config.destinationEmail,
        replyTo: submission.email,
        subject: `[Portfolio Contact] ${submission.subject}`,
        text,
      })

      return
    } catch (error) {
      lastError = error
      await sleep(retryDelayMs)
    }
  }

  try {
    await transporter.sendMail({
      from: config.fromEmail,
      to: config.destinationEmail,
      replyTo: submission.email,
      subject: `[Portfolio Contact] ${submission.subject}`,
      text,
    })
  } catch (error) {
    throw error ?? lastError
  }
}
