"use client";

import { ACHIEVEMENTS } from '@/entities/profile/model/portfolioSections'

export const AchievementsContent = () => (
  <div className="space-y-3 p-2 font-sans text-sm">
    <h2 className="mb-2 border-b border-border-dark pb-1 text-lg font-bold">Achievements</h2>

    {ACHIEVEMENTS.map((achievement) => (
      <section key={`${achievement.title}-${achievement.date}`} className="border-sunken bg-window p-3">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-bold">{achievement.title}</h3>
          <span className="text-xs uppercase tracking-[0.15em] text-title-bar-inactive">{achievement.date}</span>
        </div>
        <p className="leading-relaxed">{achievement.details}</p>
      </section>
    ))}
  </div>
)
