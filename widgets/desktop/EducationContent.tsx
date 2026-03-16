"use client";

import { EDUCATION } from '@/entities/profile/model/portfolioSections'

export const EducationContent = () => (
  <div className="space-y-3 p-2 font-sans text-sm">
    <h2 className="mb-2 border-b border-border-dark pb-1 text-lg font-bold">Education</h2>

    {EDUCATION.map((item) => (
      <section key={`${item.institution}-${item.qualification}`} className="border-sunken bg-window p-3">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-bold">{item.qualification}</h3>
            <p className="text-xs text-gray-700">{item.institution}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.15em] text-title-bar-inactive">{item.period}</span>
        </div>

        <ul className="list-disc list-inside space-y-1 marker:text-black">
          {item.details.map((detail) => (
            <li key={detail} className="pl-1">
              {detail}
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
)
