import { BookOpen, CalendarCheck, GraduationCap, Handshake, MapPin, type Icon } from '@phosphor-icons/react'
import { links } from '../config'
import { CAMPUS_AMBASSADOR_PATH, COMMUNITY_PATH, SKILL_DEVELOPMENT_PATH } from '../lib/route'

export const navLeft = [
  { label: 'Our Academy', href: '#academy', id: 'academy' },
  { label: 'Institutions', href: '/institutions', id: 'institutions' },
  // External website: opens in the same tab from the navigation.
  { label: 'Network Beyond Campus', href: links.network, id: 'network' },
] as const

export const navRight = [
  { label: 'Resources', href: '#resources', id: 'resources' },
  { label: 'Partner With Us', href: links.partner, id: 'partner' },
] as const

/** Items of the Our Academy dropdown. All of them lead to the platform's existing Skill Development page. */
export const academyLinks = [
  { label: 'Industry Skills', href: SKILL_DEVELOPMENT_PATH },
  { label: 'Professional Skills', href: SKILL_DEVELOPMENT_PATH },
  { label: 'Finishing School', href: SKILL_DEVELOPMENT_PATH },
] as const

/** Items of the Resources dropdown in the header. */
export const resourceLinks = [
  { label: 'Scientific Communications', href: links.blog },
  { label: 'Join the community', href: COMMUNITY_PATH },
  { label: 'Campus Ambassador (CA)', href: CAMPUS_AMBASSADOR_PATH },
] as const

export interface Program {
  id: string
  /** Existing platform page this programme leads to. */
  href: string
  number: string
  title: string
  summary: string
  image: string
  alt: string
  items: readonly string[]
}

export const programs: readonly Program[] = [
  {
    id: 'industry-skills',
    href: '/skill-development',
    number: '01',
    title: 'Industry Skills',
    summary: 'Build with the tools and workflows industry teams use every day.',
    image: '/images/program-industry.jpg',
    alt: 'A student reviewing engineering drawings beside a toolbox and prototype parts',
    items: [
      'Robotics and AI',
      'Data Science and Analytics',
      'Embedded Systems',
      'UI/UX Design',
      'Hands-on industry projects',
    ],
  },
  {
    id: 'professional-skills',
    href: '/skill-development',
    number: '02',
    title: 'Professional Skills',
    summary: 'The human skills that turn technical talent into effective teammates.',
    image: '/images/program-professional.jpg',
    alt: 'Three students collaborating and laughing around laptops at a wooden table',
    items: [
      'Communication and presentation',
      'Leadership and teamwork',
      'Critical thinking',
      'Workplace collaboration',
    ],
  },
  {
    id: 'finishing-school',
    href: '/finishing-school',
    number: '03',
    title: 'Finishing School',
    summary: 'A focused runway from graduation to a confident first role.',
    image: '/images/program-finishing.jpg',
    alt: 'Candidates taking notes during a conversation at a sunlit table',
    items: [
      'Career preparation',
      'Interview readiness',
      'Resume and portfolio development',
      'Industry exposure and placement preparation',
    ],
  },
]

export const networkHighlights: readonly { icon: Icon; label: string }[] = [
  { icon: CalendarCheck, label: 'Curated sessions' },
  { icon: GraduationCap, label: 'Elite mentorship' },
  { icon: BookOpen, label: 'Knowledge arsenal' },
  { icon: Handshake, label: 'Peer engagement' },
  { icon: MapPin, label: 'Find a session near you' },
]

export interface Testimonial {
  name: string
  background: string
  quote: string
  portrait: string
}

/** Sample content — replace with approved student testimonials before launch. */
export const testimonials: readonly Testimonial[] = [
  {
    name: 'Amara O.',
    background: 'Industry Skills · Robotics and AI',
    quote:
      'I had only ever built things in a classroom. Shipping a working prototype for a real client taught me more in eight weeks than a full semester of theory.',
    portrait: '/images/portraits/p2.jpg',
  },
  {
    name: 'Daniel R.',
    background: 'Professional Skills · Leadership track',
    quote:
      'Presenting to mentors every week changed how I speak up. I went from hiding in the back row to leading my team’s demo.',
    portrait: '/images/portraits/p4.jpg',
  },
  {
    name: 'Nia K.',
    background: 'Finishing School · Career preparation',
    quote:
      'Mock interviews and portfolio reviews made my first real interview feel familiar. I knew what to say and why my projects mattered.',
    portrait: '/images/portraits/p1.jpg',
  },
  {
    name: 'Jordan T.',
    background: 'Industry Skills · UI/UX Design',
    quote:
      'My mentor challenged every design decision I made. Defending my choices to a working designer is what finally made me feel like one.',
    portrait: '/images/portraits/p5.jpg',
  },
  {
    name: 'Samuel E.',
    background: 'Industry Skills · Data Science and Analytics',
    quote:
      'Working with messy, real datasets was humbling and exciting. The community around the programme kept me going when the models didn’t.',
    portrait: '/images/portraits/p3.jpg',
  },
]

export interface PartnerLogo {
  name: string
  /** Official logo, served from /public. Height is fixed in the marquee; width follows the original proportions. */
  logo: string
}

export const partners: readonly PartnerLogo[] = [
  { name: 'Bangalore Bioinnovation Centre', logo: '/images/partners/bbc.png' },
  { name: 'GeneAura', logo: '/images/partners/geneaura.png' },
  { name: 'XERA Robotics', logo: '/images/partners/xera.jpg' },
  { name: 'B Aatral Biosciences', logo: '/images/partners/aatral.png' },
  { name: 'Networking Beyond Campus', logo: '/images/partners/nbc.jpg' },
  { name: 'InovAugmet', logo: '/images/partners/inovaugment.jpg' },
  { name: 'IMrobonix', logo: '/images/partners/imrobonix.png' },
  { name: 'Shewell', logo: '/images/partners/shewell.svg' },
]

export const contact = {
  address: '94 Kempegowda nagara, Herohalli, Bengaluru, Karnataka 560091',
  phone: '+918296155821',
  email: 'info@stemforsociety.org',
} as const
