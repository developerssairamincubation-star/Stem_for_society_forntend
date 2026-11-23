import { Briefcase, Lightbulb, RocketLaunch, UsersThree, type Icon } from '@phosphor-icons/react'

/**
 * The four Training Plans shown on the Institutions page. The wording, skill names, counts, durations and levels
 * are exactly as supplied by the team: 24 skills in total (6 + 7 + 6 + 5). Do not rename or drop a skill.
 */
export interface TrainingPlan {
  id: string
  /** "Plan 1" */
  category: string
  title: string
  subtitle: string
  description: string
  skills: readonly string[]
  duration: string
  level: string
  image: string
  alt: string
  icon: Icon
  /** Accent used for the icon, label, ticks and arrow: a main colour, a soft tint for backgrounds and a dark text colour. */
  accent: { main: string; soft: string; text: string }
}

export const trainingPlansIntro = {
  label: 'OUR TRAINING PLANS',
  title: 'A progressive journey from foundational skills to future leadership',
  description: 'Four structured plans covering 24 essential professional skills, designed for real-world success.',
} as const

export const trainingPlans: readonly TrainingPlan[] = [
  {
    id: 'foundation',
    category: 'Plan 1',
    title: 'Emotional Intelligence',
    subtitle: 'Workplace basics',
    description: 'Build essential personal and professional skills for a strong start to your academic and career journey.',
    skills: [
      'Professional Communication',
      'Workplace Etiquette',
      'Time Management',
      'Digital Literacy',
      'Emotional Intelligence',
      'Career Planning & Goal Setting',
    ],
    duration: '3 Months',
    level: 'Basic to Beginner',
    image: '/images/institutions/health.jpg',
    alt: 'Students taking notes together at a long study table',
    icon: Briefcase,
    accent: { main: '#16a34a', soft: '#ecfdf3', text: '#166534' },
  },
  {
    id: 'career-launch',
    category: 'Plan 2',
    title: 'Career Launch',
    subtitle: 'Getting hired and being visible',
    description: 'Develop skills to present yourself confidently, build your professional presence and succeed in the job market.',
    skills: [
      'Resume & CV Skills',
      'Group Discussion Skills',
      'Public Speaking',
      'Presentation Skills',
      'Networking Skills',
      'Personal Branding',
      'LinkedIn Presence',
    ],
    duration: '4 Months',
    level: 'Beginner to Intermediate',
    image: '/images/institutions/career.jpg',
    alt: 'Students talking with representatives at a career fair stall',
    icon: RocketLaunch,
    accent: { main: '#0389ff', soft: '#eaf4ff', text: '#00549f' },
  },
  {
    id: 'leadership-thinking',
    category: 'Plan 3',
    title: 'Leadership & Thinking',
    subtitle: 'Growing as a professional',
    description: 'Strengthen leadership, collaboration and problem-solving skills to thrive in any professional environment.',
    skills: [
      'Leadership Skills',
      'Teamwork & Collaboration',
      'Critical & Design Thinking',
      'Problem Solving',
      'Decision Making',
      'Conflict Management',
    ],
    duration: '4 Months',
    level: 'Intermediate',
    image: '/images/institutions/soft-skills.jpg',
    alt: 'A group of colleagues laughing and working together on laptops',
    icon: UsersThree,
    accent: { main: '#ea7a1a', soft: '#fff4e8', text: '#b45309' },
  },
  {
    id: 'innovator-entrepreneur',
    category: 'Plan 4',
    title: 'Innovator & Entrepreneur',
    subtitle: 'Building and running ventures',
    description: 'Gain entrepreneurial and business skills to create, manage and scale ideas and innovations.',
    skills: [
      'Innovation & Entrepreneurship',
      'Entrepreneur Mindset',
      'Financial Literacy',
      'Project Management Fundamentals',
      'Negotiation Skills',
    ],
    duration: '4 Months',
    level: 'Advanced',
    image: '/images/institutions/entrepreneurship.jpg',
    alt: 'Two people planning an idea on a whiteboard',
    icon: Lightbulb,
    accent: { main: '#9333ea', soft: '#f6ecff', text: '#7e22ce' },
  },
]
