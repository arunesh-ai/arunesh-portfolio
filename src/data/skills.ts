export type SkillCategory = {
  id: string
  title: string
  /** Plain strings by design — pills are rendered identically, no per-skill emphasis */
  skills: string[]
}

/** Capability map — Software Engineer breadth with WordPress depth */
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    skills: ['PHP', 'JavaScript', 'jQuery', 'HTML5', 'CSS3', 'MySQL', 'Liquid', 'React'],
  },
  {
    id: 'platforms',
    title: 'Platforms & CMS',
    skills: ['WordPress', 'WooCommerce', 'Shopify'],
  },
  {
    id: 'development',
    title: 'Development',
    skills: [
      'Custom Plugin Development',
      'Custom Theme Development',
      'REST APIs',
      'API Integrations',
      'eCommerce Development',
      'Payment Gateway Integration',
      'Responsive Web Development',
      'React Development',
    ],
  },
  {
    id: 'performance',
    title: 'Performance & Engineering',
    skills: [
      'Performance Optimization',
      'Core Web Vitals',
      'Security',
      'Debugging',
      'Database / SQL',
      'SEO',
      'Website Migration',
      'Troubleshooting',
    ],
  },
  {
    id: 'automation',
    title: 'Automation & Integrations',
    skills: [
      'Klaviyo',
      'Zapier',
      'ActiveCampaign',
      'REST APIs',
      'Third-Party Integrations',
      'Email / Marketing Automation',
    ],
  },
  {
    id: 'wordpress-ecosystem',
    title: 'WordPress Ecosystem',
    skills: [
      'WordPress',
      'WooCommerce',
      'ACF',
      'WPML',
      'Elementor',
      'Divi',
      'Custom Themes',
      'Custom Plugins',
    ],
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    skills: [
      'Cursor',
      'ChatGPT',
      'Claude',
      'Gemini',
      'Codex',
      'Prompt Engineering',
      'AI-Assisted Development',
      'AI-Assisted Debugging',
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Workflow',
    skills: [
      'Git',
      'GitHub',
      'Cloudflare',
      'Postman',
      'VS Code',
      'Chrome DevTools',
      'cPanel',
      'phpMyAdmin',
      'FileZilla',
      'Figma',
    ],
  },
]

export const aiEngineering = {
  title: 'AI × Engineering',
  subtitle: 'Building from scratch with AI as part of the engineering workflow.',
  copy:
    'I use AI as an engineering multiplier — from exploring architecture and writing code to debugging, testing, refactoring and shipping production-ready solutions.',
  tools: ['Cursor', 'ChatGPT', 'Claude', 'Gemini', 'Codex'] as const,
  workflow: ['Build', 'Debug', 'Test', 'Refactor', 'Ship'] as const,
  capabilities: [
    'Prompt Engineering',
    'AI-Assisted Development',
    'AI-Assisted Debugging',
    'AI-Assisted Architecture',
    'AI-Assisted Testing',
    'AI-Assisted Refactoring',
  ] as const,
  featuredProject: {
    title: 'Ultimate Form Builder',
    description:
      'Built a custom WordPress form builder with advanced capabilities commonly associated with paid Gravity Forms features and paid Contact Form 7 extensions.',
    workflowNote:
      'Built from scratch using an AI-assisted development workflow with Cursor, ChatGPT and Claude — across architecture, implementation, debugging, testing, iteration and refactoring.',
    tools: ['Cursor', 'ChatGPT', 'Claude'] as const,
    stages: [
      'Architecture',
      'Implementation',
      'Debugging',
      'Testing',
      'Iteration',
      'Refactoring',
    ] as const,
  },
} as const

export const scaleConcepts = [
  'WEB DEVELOPMENT',
  'PHP',
  'JAVASCRIPT',
  'WORDPRESS',
  'WOOCOMMERCE',
  'MYSQL',
  'REST APIs',
  'CUSTOM PLUGINS',
  'CUSTOM THEMES',
  'DEBUGGING',
  'PERFORMANCE',
  'SECURITY',
  'PRODUCTION',
] as const

export const engineeringPillars = [
  'BUILD',
  'DEBUG',
  'TEST',
  'OPTIMIZE',
  'SECURE',
  'MAINTAIN',
] as const
