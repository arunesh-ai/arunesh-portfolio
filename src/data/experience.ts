export type ExperienceItem = {
  id: string
  year: string
  title: string
  company: string
  period: string
  description: string
  points: string[]
}

export const experience: ExperienceItem[] = [
  {
    id: 'intern',
    year: '2023',
    title: 'Software Engineer Intern',
    company: 'Oriental Outsourcing Consultants Pvt. Ltd.',
    period: 'Oct 2023 — Oct 2024',
    description:
      'Supported development of client websites with PHP, HTML and CSS under supervision — building reusable components, content updates and cross-browser testing.',
    points: [
      'WordPress site development with PHP, HTML and CSS',
      'Reusable components and content updates',
      'Cross-browser and device testing',
      'Debugging and maintaining existing client sites',
    ],
  },
  {
    id: 'engineer',
    year: '2024',
    title: 'Software Engineer',
    company: 'Oriental Outsourcing Consultants Pvt. Ltd.',
    period: 'Oct 2024 — Present',
    description:
      'Developing and maintaining production client websites — custom themes and plugins, API integrations, performance work and production troubleshooting.',
    points: [
      'WordPress and PHP production websites',
      'Custom themes and plugins',
      'API integrations and security updates',
      'Performance optimization and issue resolution',
      'Version control across development projects',
    ],
  },
]

export type EducationItem = {
  id: string
  degree: string
  field?: string
  school: string
  period: string
  result: string
}

export const education: EducationItem[] = [
  {
    id: 'btech',
    degree: 'Bachelor of Technology',
    field: 'Computer Science Engineering',
    school: 'Gulzar Group of Institutes',
    period: '2020 — 2024',
    result: '8 CGPA',
  },
  {
    id: 'twelfth',
    degree: 'Class XII — Non-Medical (CBSE)',
    school: 'U.S.P.C Jain Public School',
    period: '2020',
    result: '80.4%',
  },
]
