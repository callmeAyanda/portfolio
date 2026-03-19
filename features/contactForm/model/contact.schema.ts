// features/contactForm/model/contact.schema.ts
import { z } from 'zod'

const singleLineText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be ${max} characters or less`)
    .refine((value) => !/[\r\n]/.test(value), `${label} contains invalid characters`)

export const contactSchema = z.object({
  name: singleLineText('Name', 2, 80),
  email: z.string().trim().email('Invalid email address').max(320, 'Email is too long'),
  subject: singleLineText('Subject', 3, 120),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be 5000 characters or less'),
})

export const contactSubmissionSchema = contactSchema.extend({
  website: z.string().max(0),
  formStartedAt: z.number().int().nonnegative(),
  turnstileToken: z.string().trim().min(1, 'Please complete the security check'),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type ContactSubmissionData = z.infer<typeof contactSubmissionSchema>
