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
    description:
      'HR Intellect is an AI-powered HR platform designed to help organizations automate recruitment, document processing, and workforce management.',
    summary: 'Streamline recruitment, automate workflows, and make smarter talent decisions with AI-powered HR automation designed for modern businesses. HR-Intellect is not available to the general public yet, but you can check out the demo video and screenshots below.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'ShadcnUI', 'NodeJS', 'ExpressJS', 'PostgreSQL'],
    sections: [
      {
        title: 'What It Does',
        body: [
          'We combine artificial intelligence, data analytics, and secure cloud infrastructure to simplify complex HR operations giving businesses more time to focus on people, not paperwork.',
          'HR-Intellect offers a comprehensive suite of tools for recruitment, document processing, and workforce management, all designed to enhance efficiency and decision-making in human resource management.',
        ],
      },
      {
        title: 'Problem Solved',
        body: [
          'To simplify and elevate human resource management through intelligent automation.',
          'HR-Intellect addresses the challenges of manual HR processes, enabling businesses to make smarter, data-driven decisions while enhancing employee experience and organizational efficiency.',
        ],
      },
      {
        title: 'Notable Features',
        body: [
          'Objective, data-driven candidate evaluation.',
          'Automated document processing and compliance management.',
          'Intelligent workforce analytics and insights.',
        ],
      },
    ],
    images: [
      {
        id: 'hero',
        title: 'Hero Section',
        src: '/project-media/hr-intellect/hero.png',
        alt: 'Hero section for HR-Intellect',
        caption: 'A high-level look at the hero section for HR-Intellect, showcasing the platform’s core features and value proposition.',
      },
      {
        id: 'about',
        title: 'About Section',
        src: '/project-media/hr-intellect/about.png',
        alt: 'About section for HR-Intellect',
        caption: 'About Section for HR-Intellect, highlighting the platform’s mission, vision, and key benefits for businesses.',
      },
      {
        id: 'pricing',
        title: 'Pricing Section',
        src: '/project-media/hr-intellect/pricing.png',
        alt: 'About section for HR-Intellect',
        caption: 'Pricing Section for HR-Intellect, outlining the different subscription plans and features available to users.',
      },
    ],
    videos: [{id: 'hr-intellect-demo-vid', title: 'HR-Intellect Demo Version 1', src: '/project-media/hr-intellect/hr-intellect.mp4', alt: 'HR-Intellect demo video', caption: 'HR-Intellect Demo Version 1' }],
    links: [],
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
        id: 'contact',
        title: 'Contact',
        src: '/project-media/gmui/contact.png',
        alt: 'Contact section',
        caption: 'Contact Section',
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
