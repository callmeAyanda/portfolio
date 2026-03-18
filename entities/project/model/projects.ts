export type ProjectImage = {
  id: string
  title: string
  src: string
  alt: string
  caption: string
}

export type ProjectVideo = {
  id: string
  title: string
  src: string
  poster?: string
  caption: string
}

export type ProjectSection = {
  title: string
  body: string[]
}

export type ProjectLink = {
  label: string
  url: string
}

export type ProjectRecord = {
  id: string
  title: string
  summary: string
  description: string
  stack: string[]
  sections: ProjectSection[]
  images: ProjectImage[]
  videos: ProjectVideo[]
  githubUrl?: string
  links: ProjectLink[]
}

export const PROJECTS: ProjectRecord[] = [
  {
    id: 'retro-portfolio',
    title: 'Retro Portfolio Desktop UI',
    summary: 'A Windows 98 desktop portfolio with draggable windows, taskbar state, and playful app navigation.',
    description:
      'This project turns a personal portfolio into a nostalgic operating system experience, letting visitors explore work as if they were browsing a classic desktop computer.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    sections: [
      {
        title: 'What It Does',
        body: [
          'Transforms a traditional portfolio into a desktop environment with movable windows, taskbar interactions, and app-like content areas.',
          'Keeps the entire browsing experience inside one themed interface so projects feel interactive instead of static.',
        ],
      },
      {
        title: 'Problem Solved',
        body: [
          'Many portfolios feel visually interchangeable and make it hard to communicate personality. This concept gives the site a stronger point of view while still keeping the content readable.',
        ],
      },
      {
        title: 'Notable Features',
        body: [
          'Window focus management, minimize and maximize behavior, reusable desktop icons, and project previews that can open dedicated media windows.',
        ],
      },
    ],
    images: [
      {
        id: 'desktop-home',
        title: 'Desktop Home',
        src: '/project-media/retro-portfolio-desktop.svg',
        alt: 'Retro portfolio desktop overview',
        caption: 'The opening desktop with app icons, taskbar, and the main welcome window.',
      },
      {
        id: 'project-explorer',
        title: 'Projects Explorer',
        src: '/project-media/retro-portfolio-projects.svg',
        alt: 'Projects explorer view inside the retro portfolio',
        caption: 'An explorer-style project browser with file list, preview panel, and media shortcuts.',
      },
    ],
    videos: [],
    githubUrl: 'https://github.com/example/retro-portfolio',
    links: [{ label: 'Live Demo', url: 'https://example.com/retro-portfolio' }],
  },
  {
    id: 'component-lab',
    title: 'Component Lab',
    summary: 'A reusable UI playground focused on design consistency, accessibility, and systemized components.',
    description:
      'Component Lab acts as a workshop for designing, documenting, and testing interface building blocks before they are used in larger products.',
    stack: ['React', 'Storybook', 'TypeScript'],
    sections: [
      {
        title: 'What It Does',
        body: [
          'Collects buttons, forms, cards, navigation patterns, and feedback states into a documented component library.',
          'Helps product teams validate interaction details before implementation spreads across multiple screens.',
        ],
      },
      {
        title: 'Problem Solved',
        body: [
          'Without a shared library, interface decisions drift over time. This project creates a reliable source of truth for patterns, tokens, and usage guidance.',
        ],
      },
      {
        title: 'Notable Features',
        body: [
          'Story-driven documentation, typed component APIs, and a workflow for testing accessibility and edge states early.',
        ],
      },
    ],
    images: [
      {
        id: 'storybook-overview',
        title: 'Storybook Overview',
        src: '/project-media/component-lab-overview.svg',
        alt: 'Component lab overview interface',
        caption: 'A high-level look at the documented component catalog and design tokens.',
      },
      {
        id: 'form-states',
        title: 'Form States',
        src: '/project-media/component-lab-forms.svg',
        alt: 'Component lab form component states',
        caption: 'Validation, success, and helper-text patterns captured in one workspace.',
      },
    ],
    videos: [],
    githubUrl: 'https://github.com/example/component-lab',
    links: [],
  },
  {
    id: 'motion-notes',
    title: 'Motion Notes',
    summary: 'A lightweight study tool for capturing interaction ideas, motion references, and sharable feedback.',
    description:
      'Motion Notes is a focused app for designers and developers who want to collect short experiments, annotate them, and keep visual thinking organized.',
    stack: ['Next.js', 'Framer Motion', 'Supabase'],
    sections: [
      {
        title: 'What It Does',
        body: [
          'Lets users save motion concepts, pair them with screenshots or references, and track why an interaction works.',
          'Encourages structured critique so animation decisions stay connected to product goals.',
        ],
      },
      {
        title: 'Problem Solved',
        body: [
          'Motion work is often scattered across notes, clips, and private experiments. This project keeps research and rationale in one searchable place.',
        ],
      },
      {
        title: 'Notable Features',
        body: [
          'Sharable notes, lightweight categorization, and a workflow built around explaining interaction intent rather than just storing assets.',
        ],
      },
    ],
    images: [
      {
        id: 'notes-board',
        title: 'Notes Board',
        src: '/project-media/motion-notes-board.svg',
        alt: 'Motion notes board with entries and annotations',
        caption: 'A board of saved interaction studies with tags and quick annotations.',
      },
      {
        id: 'entry-detail',
        title: 'Entry Detail',
        src: '/project-media/motion-notes-detail.svg',
        alt: 'Motion notes detail view',
        caption: 'A single study view showing rationale, implementation notes, and collaborators.',
      },
    ],
    videos: [],
    githubUrl: 'https://github.com/example/motion-notes',
    links: [{ label: 'Live Demo', url: 'https://example.com/motion-notes' }],
  },
]

export const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map((project) => [project.id, project])) as Record<
  string,
  ProjectRecord
>
