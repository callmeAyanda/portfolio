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
  alt: string
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
    id: 'hr-intellect',
    title: 'HR-Intellect',
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
        src: '/project-media/login.png',
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

/* DHMS */
  {
    id: 'dhms',
    title: 'Digital Healthcare Management System',
    summary: 'The Digital Healthcare Management System (DHMS) is an innovative, web-based platform designed to digitize and streamline healthcare delivery across clinics, hospitals, and community health centers. By connecting patients, healthcare providers, and administrators in one unified platform, DHMS simplifies appointment scheduling, electronic medical record (EMR) management, and administrative oversight ensuring faster, more efficient, and more transparent healthcare operations.',
    description: 'DHMS provides a secure, cloud-based healthcare management solution that enables users to manage appointments, patient records, and healthcare operations from any internet enabled device.',
    stack: ['React', 'TypeScript', 'Convex'],
    sections: [
      {
        title: 'What It Does',
        body: [
          'Designed to digitize and streamline healthcare delivery across clinics, hospitals, and community health centers.',
        ],
      },
      {
        title: 'Problem Solved',
        body: [
          'DHMS simplifies appointment scheduling, electronic medical record (EMR) management, and administrative oversight.',
        ],
      },
      {
        title: 'Notable Features',
        body: [
          'Appointment scheduling.',
          'Electronic medical record (EMR) management.',
          'Administrative oversight.',
        ],
      },
    ],
    images: [
      {
        id: 'login-page',
        title: 'Login Page',
        src: '/project-media/dhms/login.png',
        alt: 'Login page',
        caption: 'A high-level look at the Login page for the DHMS.',
      },
      {
        id: 'prescriptions',
        title: 'Prescriptions Page',
        src: '/project-media/dhms/prescriptions.png',
        alt: 'Prescription page',
        caption: 'A high-level look at the Prescription page for the DHMS.',
      },
    ],
    videos: [{ id: 'dhms-demo-vid', title: 'DHMS Demo Version 1', src: '/project-media/dhms/vid2.mp4', alt: 'DHMS demo video', caption: 'DHMS Demo Version 1' }],
    githubUrl: 'https://github.com/callmeAyanda/digital_healthcare_management_system',
    links: [],
  },

  /* GMUI */
  {
    id: 'gmui',
    title: 'Golide Minerals UI',
    summary: 'This project is a modern, fully responsive corporate landing page built for Golide Minerals Exchange, a global leader in mineral construction and infrastructure development. The website serves as a digital storefront, conveying the company’s expertise, global reach, and commitment to innovation through a sleek, professional, and interactive user experience.',
    description:
      'The site is developed using Next.js 15 (App Router), React, and Tailwind CSS, ensuring optimal performance, SEO-friendliness, and maintainability.',
    stack: ['Next.js', 'React', 'TailwindCSS', 'ShadcnUI', 'Lucide-react'],
    sections: [
      {
        title: 'What It Does',
        body: [
          'Offers complete site navigation with a sticky navbar that includes smooth scrolling to each section, and a comprehensive footer with links, social media, and certifications.',
          'Provides a knowledge hub (“Resources”) where users can browse whitepapers, case studies, and reports, with search, filtering, and newsletter signup.',
        ],
      },
      {
        title: 'Problem Solved',
        body: [
          'This landing page solves all professional online presence issues by delivering a visually stunning, content-rich, and highly interactive platform that positions the company as an industry leader.',
        ],
      },
      {
        title: 'Notable Features',
        body: [
          'Fully Responsive Design – Optimized for mobile, tablet, and desktop.',
        ],
      },
    ],
    images: [
      {
        id: 'hero-section',
        title: 'Hero Section',
        src: '/project-media/gmui/hero.png',
        alt: 'Hero Section picture',
        caption: 'Golide Minerals Hero Section.',
      },
      {
        id: 'footer',
        title: 'Footer',
        src: '/project-media/gmui/footer.png',
        alt: 'Footer section',
        caption: 'Footer Section',
      },
    ],
    videos: [{ id: 'gmui-demo-vid', title: 'GMUI Demo Version 1', src: '/project-media/gmui/vid1.mp4', alt: 'GMUI demo video', caption: 'GMUI Demo Version 1' }],
    githubUrl: 'https://github.com/callmeAyanda/GolideMineralSolutions_',
    links: [],
  },
]

export const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map((project) => [project.id, project])) as Record<
  string,
  ProjectRecord
>
