export type Project = {
  id: string
  slug: string
  index: number
  title: string
  url: string
  description: string
  highlights: string[]
  technologies: string[]
  category: string
  image?: string
  mobileImage?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'gourmet-direct',
    slug: 'gourmet-direct',
    index: 1,
    title: 'Gourmet Direct',
    url: 'https://gourmetdirect.co.nz',
    description:
      'Production WooCommerce storefront with custom integrations, order workflows and payment gateway customization.',
    highlights: [
      'Custom WooCommerce integrations',
      'Product and order management',
      'Windcave payment gateway customization',
      'Authorization and transaction handling',
    ],
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'Windcave'],
    category: 'E-commerce',
    image: '/projects/gourmet-direct/desktop.png',
    mobileImage: '/projects/gourmet-direct/mobile.png',
    featured: true,
  },
  {
    id: 'ezwindows',
    slug: 'ezwindows',
    index: 2,
    title: 'EZWindows',
    url: 'https://ezwindows.com.au',
    description:
      'WooCommerce experience with custom quote flows, product configuration and dynamic PDF invoice generation.',
    highlights: [
      'WooCommerce customization',
      'Standard orders and custom quote requests',
      'Product configuration',
      'Dynamic PDF invoice generation',
    ],
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript'],
    category: 'E-commerce',
    image: '/projects/ezwindows/desktop.png',
    mobileImage: '/projects/ezwindows/mobile.png',
    featured: true,
  },
  {
    id: 'escuelapizzeria',
    slug: 'escuelapizzeria',
    index: 3,
    title: 'EscuelaPizzeria',
    url: 'https://escuelapizzeria.es/',
    description:
      'Production web project developed and maintained as part of my client work.',
    highlights: [
      'Production website delivery',
      'Ongoing maintenance and iteration',
    ],
    // Tech stack not verified — do not invent tags
    technologies: [],
    category: 'Production',
    image: '/projects/escuelapizzeria/desktop.png',
    mobileImage: '/projects/escuelapizzeria/mobile.png',
    featured: true,
  },
  {
    id: 'nesheli',
    slug: 'nesheli',
    index: 4,
    title: 'Nesheli',
    url: 'https://www.nesheli.com/',
    description:
      'Production web project developed and maintained as part of my client work.',
    highlights: [
      'Production website delivery',
      'Client-facing web experience',
    ],
    // Tech stack not verified — do not invent tags
    technologies: [],
    category: 'Production',
    image: '/projects/nesheli/desktop.png',
    mobileImage: '/projects/nesheli/mobile.png',
    featured: true,
  },
]
