// features/contactForm/ui/ContactForm.tsx
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  contactSubmissionSchema,
  ContactSubmissionData,
} from '../model/contact.schema'
import { Button } from '@/_shared/ui/Button'
import { TurnstileWidget } from './TurnstileWidget'

const getCurrentTimestamp = () => new Date().getTime()

const createEmptyFormValues = (formStartedAt: number): ContactSubmissionData => ({
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
  formStartedAt,
  turnstileToken: '',
})

export const ContactForm: React.FC = () => {
  const [initialFormStartedAt] = React.useState(() => getCurrentTimestamp())
  const [submitState, setSubmitState] = React.useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [turnstileResetCounter, setTurnstileResetCounter] = React.useState(0)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactSubmissionData>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: createEmptyFormValues(initialFormStartedAt),
  })

  const onSubmit = async (data: ContactSubmissionData) => {
    setSubmitState(null)

    const parsedForm = contactSubmissionSchema.safeParse(data)

    if (!parsedForm.success) {
      setSubmitState({
        tone: 'error',
        message: parsedForm.error.issues[0]?.message ?? 'Please review the form and try again.',
      })
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedForm.data),
      })

      const result = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null

      if (!response.ok) {
        setTurnstileResetCounter((currentValue) => currentValue + 1)
        setSubmitState({
          tone: 'error',
          message: result?.error ?? 'Something went wrong while sending your message.',
        })
        return
      }

      setSubmitState({
        tone: 'success',
        message: result?.message ?? 'Message sent successfully.',
      })
      const nextFormStartedAt = getCurrentTimestamp()
      setTurnstileResetCounter((currentValue) => currentValue + 1)
      reset(createEmptyFormValues(nextFormStartedAt))
    } catch {
      setTurnstileResetCounter((currentValue) => currentValue + 1)
      setSubmitState({
        tone: 'error',
        message: 'Unable to reach the contact service right now. Please try again later.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <input
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />
      <input type="hidden" {...register('formStartedAt', { valueAsNumber: true })} />
      <input type="hidden" {...register('turnstileToken')} />
      <div>
        <label className="block text-sm font-bold mb-1">Name</label>
        <input
          {...register('name')}
          maxLength={80}
          className="w-full p-1 border-2 border-border-dark border-t-border-darker border-l-border-darker bg-white"
        />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          maxLength={320}
          className="w-full p-1 border-2 border-border-dark border-t-border-darker border-l-border-darker bg-white"
        />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Subject</label>
        <input
          {...register('subject')}
          maxLength={120}
          className="w-full p-1 border-2 border-border-dark border-t-border-darker border-l-border-darker bg-white"
        />
        {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Message</label>
        <textarea
          {...register('message')}
          rows={4}
          maxLength={5000}
          className="w-full p-1 border-2 border-border-dark border-t-border-darker border-l-border-darker bg-white"
        />
        {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <div>
        <TurnstileWidget
          siteKey={turnstileSiteKey}
          resetSignal={turnstileResetCounter}
          onTokenChange={(token) => {
            setValue('turnstileToken', token, {
              shouldDirty: token.length > 0,
              shouldValidate: token.length > 0,
            })
          }}
        />
        {errors.turnstileToken && (
          <p className="text-red-600 text-xs mt-1">{errors.turnstileToken.message}</p>
        )}
      </div>
      {submitState && (
        <div
          role="status"
          aria-live="polite"
          className={`border-sunken px-3 py-2 text-sm ${
            submitState.tone === 'success' ? 'bg-[#dff0d8] text-[#1f4d1f]' : 'bg-[#f8d7da] text-[#7f1d1d]'
          }`}
        >
          {submitState.message}
        </div>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}

