import { Brain, Compass, DeviceMobile, HandHeart, Lightbulb, UsersThree, type Icon } from '@phosphor-icons/react'

/**
 * Content for the Institutions page.
 * Source of truth: https://www.stemforsociety.org/insituion-individual?mode=institution
 * Wording is kept as published; nothing below is invented.
 */

export const institutionHero = {
  lead: 'Partnering with Institutions for',
  rest: 'Real World Readiness',
  /** Desktop: full campus scene (baked-in nav and text removed). */
  image: '/images/institutions/campus-hero.jpg',
  /** Phones: the lower part of the same scene. */
  imageSmall: '/images/institutions/campus.jpg',
  alt: 'A modern university campus of glass buildings around a lake, with students studying on the lawn',
} as const

export const programmesIntro = {
  title: 'One Partner. Multiple Modules.',
} as const

export interface InstitutionProgramme {
  id: string
  number: string
  category: string
  title: string
  tagline: string
  description: string
  modules: readonly string[]
  gains: readonly string[]
  image: string
  alt: string
  icon: Icon
}

export const institutionProgrammes: readonly InstitutionProgramme[] = [
  {
    id: 'career-counselling',
    number: '01',
    category: 'Career Ready',
    title: 'Career Counselling and Guidance',
    tagline: 'From confusion to clarity',
    description:
      'Help students move from confusion to clarity. Provide actionable roadmaps for higher education and careers.',
    modules: ['Career Awareness', 'Career Readiness', 'Career Assessment'],
    gains: [
      'Clarity about streams, specializations, and future study options',
      'Understanding of strengths, interests, and aptitude',
      'Actionable roadmaps for higher education and careers',
    ],
    image: '/images/institutions/career.jpg',
    alt: 'Students talking with representatives at a university career fair booth',
    icon: Compass,
  },
  {
    id: 'entrepreneurship',
    number: '02',
    category: 'Innovation',
    title: 'Entrepreneurship',
    tagline: 'From idea to impact',
    description:
      'Ignite the entrepreneurial spirit. Learn to find business ideas, pitch like a pro, and master branding and storytelling.',
    modules: ['Finding Business Ideas', 'Pitching Like a Pro', 'Branding & Storytelling'],
    gains: [
      'Practical framework for launching ventures',
      'Mastering the art of persuasion and sales',
      'Building a personal and business brand',
    ],
    image: '/images/institutions/entrepreneurship.jpg',
    alt: 'Students brainstorming startup ideas on a whiteboard during a workshop',
    icon: Lightbulb,
  },
  {
    id: 'attitude-personality',
    number: '03',
    category: 'Soft Skills',
    title: 'Attitude and Personality Development',
    tagline: 'Shape confident individuals',
    description: 'Shape confident, grounded and emotionally intelligent individuals.',
    modules: ['Personality Development', 'Critical Thinking', 'Team Building'],
    gains: [
      'Better self-image and interpersonal skills',
      'Ability to build and maintain healthy relationships',
      'Leadership and teamwork skills for academic and professional settings',
    ],
    image: '/images/institutions/soft-skills.jpg',
    alt: 'Three students laughing together over laptops at a wooden table',
    icon: UsersThree,
  },
  {
    id: 'mental-wellbeing',
    number: '04',
    category: 'Resilience',
    title: 'Mental Well-being',
    tagline: 'Foundation of success',
    description: 'Because mental health is foundational to academic success.',
    modules: ['Stress and Burnout', 'Resilience Building', 'Procrastination and Motivation'],
    gains: [
      'Tools for managing exam pressure and academic stress',
      'Improved self-awareness and emotional regulation',
      'Healthier coping strategies and stronger inner resilience',
    ],
    image: '/images/institutions/wellbeing.jpg',
    alt: 'Students sitting together in a supportive group discussion circle',
    icon: Brain,
  },
  {
    id: 'digital-wellness',
    number: '05',
    category: 'Digital Balance',
    title: 'Digital Wellness & Social Media Awareness',
    tagline: 'Mindful technology use',
    description: 'Help students use technology mindfully instead of being consumed by it.',
    modules: ['Digital Detox', 'Social Media Awareness'],
    gains: [
      'Awareness of screen addiction and its impact',
      'Safer, more mindful use of social media',
      'Critical thinking to navigate information overload',
    ],
    image: '/images/institutions/digital.jpg',
    alt: 'A student looking thoughtfully at a phone',
    icon: DeviceMobile,
  },
  {
    id: 'sex-education',
    number: '06',
    category: 'Health & Respect',
    title: 'Sex Education',
    tagline: 'Values-sensitive learning',
    description: 'Age-appropriate, scientifically accurate, and values-sensitive learning.',
    modules: ['Menstrual Hygiene', 'Handling Relationships', 'Human Development'],
    gains: [
      'Correct information about reproductive health and bodily changes',
      'Reduced stigma and myths around periods and sexuality',
      'Respectful attitudes towards self and others',
    ],
    image: '/images/institutions/health.jpg',
    alt: 'Students taking notes during a group discussion at a sunlit table',
    icon: HandHeart,
  },
]

export const faqIntro = {
  title: 'Frequently Asked Questions',
} as const

/**
 * The published FAQ lists these four questions but its answers are empty.
 * The answers below only restate what the page actually says (age-appropriate content,
 * structured evidence-based programs, custom plans) and otherwise point to the enquiry form.
 * Replace them with approved answers when available.
 */
export const faqs: readonly { q: string; a: string }[] = [
  {
    q: 'Are the programs age-appropriate?',
    a: 'Our programs are structured, evidence-based and delivered by experts. Sensitive topics such as Sex Education are taught in an age-appropriate, scientifically accurate and values-sensitive way. To confirm the right programme for a particular age group, please get in touch with us.',
  },
  {
    q: 'Can we run these as part of our timetable?',
    a: "Every institution is unique, so scheduling is worked out with you. Tell us about your institution's needs through the enquiry form and we'll build a custom plan for you.",
  },
  {
    q: 'Do you provide reports and feedback?',
    a: "Reporting and feedback are best discussed as part of your custom plan. Share your requirements with us and we'll confirm exactly what is provided for your institution.",
  },
  {
    q: 'Can we start with a pilot?',
    a: "We understand that every institution is unique and we build a custom plan for each one. Let us know you'd like to begin with a pilot and we'll discuss the options with you.",
  },
]

/** Real time slots offered by the published "Partner With Us" form. */
export const meetingSlots = ['10:30 AM', '11:30 AM', '12:30 PM', '3:30 PM', '4:30 PM', '5:30 PM'] as const
