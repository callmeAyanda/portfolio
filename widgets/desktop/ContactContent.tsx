// widgets/desktop/ContactContent.tsx
"use client";

import { ContactForm } from '@/features/contactForm/ui/ContactForm'

export const ContactContent = () => (
  <div>
    <h2 className="text-lg font-bold border-b border-border-dark pb-1 mb-2">Contact Me</h2>
    <section className="border-sunken bg-window p-3">
      <ContactForm />
    </section>
  </div>
)

