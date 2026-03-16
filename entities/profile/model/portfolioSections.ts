"use client";

export type EducationRecord = {
  institution: string
  qualification: string
  period: string
  details: string[]
}

export type AchievementRecord = {
  title: string
  date: string
  details: string
}

export type ExperienceRecord = {
  role: string
  company: string
  period: string
  summary: string
  highlights: string[]
}

export type RelevantExperienceRecord = {
  role: string
  company: string
  location: string
  period: string
  jobhighlights: string[]
}

export const EDUCATION: EducationRecord[] = [
  {
    institution: 'Richfield Graduate Institute of Technology',
    qualification: 'Diploma in Information Technology (Software Engineering)',
    period: '2023 - 2025',
    details: [
      'Focused on full-stack engineering, database systems, and software architecture.',
      'Core Modules: Software Engineering, Information Systems, Operating Systems',
      'Studied Software Engineering principles, including software development life cycle (SDLC), system design, testing, and maintenance of scalable applications.',
      'Additional Areas: Project Management, Human–Computer Interaction (HCI), Quantitative Techniques.',
    ],
  },
]

export const ACHIEVEMENTS: AchievementRecord[] = [
  {
    title: 'Student Representative Counsel',
    date: '2025',
    details:
      'Elected to represent the student body, advocating for academic and campus improvements while fostering communication between students and administration.',
  },
  {
    title: 'Head Of Sports',
    date: '2025',
    details:
      'Led the organization and management of sports activities, promoting physical wellness and team spirit among students through various events and initiatives.',
  },
]

export const EXPERIENCE: ExperienceRecord[] = [
  {
    role: 'Software Engineer',
    company: 'HR-Intellect',
    period: 'Ongoing',
    summary:
      'Designing and building end-to-end software product that replace manual processes with intelligent, automated systems using cutting-edge OCR & NLP technology.',
    highlights: [
      'Designing and developing a comprehensive HR management system to streamline recruitment, employee management, document handling, training, and reporting.',
      'Building the platform using Next.js, React, Node.js, and PostgreSQL with a modular and scalable architecture.',
      'Implementing role-based dashboards for HR administrators, managers, and employees to manage HR operations efficiently.',
      'Developing features such as but not limited to recruitment pipelines, employee profiles, document management, training tracking, and analytics dashboards.',
      'Integrating modern UI components and responsive design to create an intuitive user experience for enterprise HR environments.',
    ],
  },
  {
    role: 'Project Coordinator',
    company: 'Digital Health Management System',
    period: '2025',
    summary:
      'Developed a DHMS to manage healthcare data and system workflows.',
    highlights: [
      'Developed a digital health management platform using TypeScript and Convex to manage healthcare data and system workflows.',
      'Designed features for patient record management, appointment tracking, and healthcare data organization.',
      'Implemented a structured backend and real-time data handling using Convex database and server functions.',
      'Built a responsive interface to enable efficient interaction between healthcare providers and system records.',
    ],
  },
]

export const RELEVANT_EXPERIENCE: RelevantExperienceRecord[] = [
  {
    role: 'Administrator Assistant',
    company: 'Richfield Graduate Institute of Technology',
    location: 'Johannesburg, Newtown',
    period: '11/2025 - 01/2026',
    jobhighlights : [
      'Processed and updated 300–1,000+ student records per term with 100% accuracy and full compliance with institutional policies.',
      'Assisted with exam administration for 200–2,000 students per assessment period, ensuring error-free scheduling and material distribution.',
      'Managed daily data capturing and filing for 50–150 documents, improving retrieval time by 25 - 40% through structured organisation.',
      'Handled front-desk operations.',
      'Handled collections and conducted follow-ups via calls, emails, and SMS, achieving an average 90 - 95% contact rate during monthly collection drives.',
    ],
  },
  {
    role: 'Customer Service Representative',
    company: 'Dash BPO',
    location: 'Johannesburg, Randburg',
    period: '12/2022 - 12/2023',
    jobhighlights : [
      'Supported 100+ patients through Tele-Dentistry Services and Dental Health Care consultations.',
      'Proficient in CRM software, handling 1,000+ customer interactions monthly to streamline service and improve customer experience. ',
      'Assisted customers across in-person, email, and phone channels, managing 200+ weekly queries and maintaining an under-24-hour response time, contributing to a 15% increase in customer satisfaction.',
      'Conducted client consultations and managed general administration, contributing to operational efficiency.',
      'Proactively handled 50+ escalations monthly, ensuring smooth workflows and prompt issue resolution.',
    ],
  },
  {
    role: 'Sales Agent',
    company: 'I-talk Financial',
    location: 'Johannesburg, Randburg',
    period: '03/2022 - 11/2022',
    jobhighlights : [
      'Upsold financial services such as life insurance, funeral cover, and life cover, contributing to a 20% increase in sales premiums.',
      'Conducted 50+ product demonstrations and presentations to potential clients monthly, effectively highlighting product features and benefits.',
      'Retained 90% of existing customers by building strong client relationships and ensuring satisfaction with current policies.',
      'Administered 30+ quotes weekly for products and policies, providing clients with prompt and accurate information.',
      'Followed up on 100+ leads monthly, converting an 80% portion into closed sales.',
    ],
  },
]

