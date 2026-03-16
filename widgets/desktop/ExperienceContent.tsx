"use client";

import { EXPERIENCE, RELEVANT_EXPERIENCE } from '@/entities/profile/model/portfolioSections'

export const ExperienceContent = () => (
  <div className="space-y-3 p-2 font-sans text-sm">

    {/* PROJECT EXPERIENCE */}
    <h2 className="mb-2 border-b border-border-dark pb-1 text-lg font-bold">Project Experience</h2>

    {EXPERIENCE.map((entry) => (
      <section key={`${entry.role}-${entry.company}`} className="border-sunken bg-window p-3">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-bold">{entry.role}</h3>
            <p className="text-xs text-gray-700">{entry.company}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.15em] text-title-bar-inactive">{entry.period}</span>
        </div>

        <p className="mb-2 leading-relaxed">{entry.summary}</p>

        <ul className="list-disc list-inside space-y-1 marker:text-black">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="pl-1">
              {highlight}
            </li>
          ))}
        </ul>
      </section>
    ))}

    {/* RELEVANT EXPERIENCE */}
    <h2 className="mb-2 border-b border-border-dark pb-1 text-lg font-bold">Relevant Experience</h2>

    {RELEVANT_EXPERIENCE.map((entry) => (
      <section key={`${entry.role}-${entry.company}`} className="border-sunken bg-window p-3">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-bold">{entry.role}</h3>
            <p className="text-xs text-gray-700">{entry.company} | {entry.location}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.15em] text-title-bar-inactive">{entry.period}</span>
        </div>

        <ul className="list-disc list-inside space-y-1 marker:text-black">
          {entry.jobhighlights.map((jobhighlight, index) => (
            <li key={`${jobhighlight}-${index}`} className="pl-1">
              {jobhighlight}
            </li>
          ))}
        </ul>
      </section>
    ))}


  </div>
)
