// features/contactForm/ui/ContactForm.tsx
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactFormData } from '../model/contact.schema'
import { Button } from '@/_shared/ui/Button'

export const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    // TODO: Send data to an API route or server action
    console.log(data)
    // Simulate success
    alert('Message sent! (demo)')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <div>
        <label className="block text-sm font-bold mb-1">Name</label>
        <input
          {...register('name')}
          className="w-full p-1 border-2 border-border-dark border-t-border-darker border-l-border-darker bg-white"
        />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full p-1 border-2 border-border-dark border-t-border-darker border-l-border-darker bg-white"
        />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Message</label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full p-1 border-2 border-border-dark border-t-border-darker border-l-border-darker bg-white"
        />
        {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}

