export type ProjectLink = {
  label: string
  url: string
}

export type ProjectRecord = {
  id: string
  title: string
  description: string
  stack: string[]
  links: ProjectLink[]
}

export const PROJECTS: ProjectRecord[] = [
  {
    id: 'retro-portfolio',
    title: 'Retro Portfolio Desktop UI',
    description:
      'A Windows-inspired portfolio experience built as a playful desktop with draggable windows and app-like interactions.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    links: [
      { label: 'Live Demo', url: 'https://example.com/retro-portfolio' },
      { label: 'GitHub', url: 'https://github.com/example/retro-portfolio' },
    ],
  },
  {
    id: 'component-lab',
    title: 'Component Lab',
    description:
      'A component playground focused on reusable UI primitives, accessibility, and predictable design tokens.',
    stack: ['React', 'Storybook', 'TypeScript'],
    links: [{ label: 'GitHub', url: 'https://github.com/example/component-lab' }],
  },
  {
    id: 'motion-notes',
    title: 'Motion Notes',
    description:
      'A lightweight app for documenting motion studies and interaction ideas with sharable notes.',
    stack: ['Next.js', 'Framer Motion', 'Supabase'],
    links: [
      { label: 'Live Demo', url: 'https://example.com/motion-notes' },
      { label: 'GitHub', url: 'https://github.com/example/motion-notes' },
    ],
  },
]

export const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map((project) => [project.id, project])) as Record<
  string,
  ProjectRecord
>
