import { Buildings, GraduationCap, Rocket, Flask, type Icon } from '@phosphor-icons/react'

/** Content for the public Partner With Us page. Partner logos are the ones already published on the existing STEM for Society site. */

export const partnerHero = {
  description: 'Together, we can create more opportunities, build bigger impact and empower the next generation.',
  image: '/images/partner.jpg',
  alt: 'Students and professionals working together at a laptop',
} as const

export const partnerCategoriesIntro = {
  title: 'Partner Categories',
  description:
    'We welcome collaborations from educational institutions, startups, companies and innovation centres that share our commitment to creating meaningful learning opportunities and empowering the next generation.',
} as const

export const organisationTypes = [
  'Educational Institution',
  'Startup',
  'Corporate',
  'Incubator / Innovation Centre',
  'Research Organisation',
  'Non-profit / NGO',
  'Government Body',
  'Other',
] as const

export interface PartnerCategory {
  title: string
  description: string
  icon: Icon
  image: string
  alt: string
  /** Organisation type chosen in the form when this card is used. */
  type: (typeof organisationTypes)[number]
  /** The text link on the card. */
  cta: string
}

export const partnerCategories: readonly PartnerCategory[] = [
  {
    title: 'Startups',
    description: 'Innovative startups and early-stage teams interested in mentorship, innovation, entrepreneurship and ecosystem collaboration.',
    icon: Rocket,
    image: '/images/program-industry.jpg',
    alt: 'Hands sketching a hardware prototype on technical drawings',
    type: 'Startup',
    cta: 'Register as a startup',
  },
  {
    title: 'Corporate',
    description: 'Technology, biotechnology and industry leaders interested in connecting with students, sharing expertise and developing future-ready talent.',
    icon: Buildings,
    image: '/images/network.jpg',
    alt: 'A professional with a tablet beside a glass-walled server room',
    type: 'Corporate',
    cta: 'Register as corporate',
  },
  {
    title: 'Incubators & Innovation Centres',
    description: 'Accelerators, research centres and innovation hubs interested in supporting emerging ideas, entrepreneurship and student innovation.',
    icon: Flask,
    image: '/images/hero-v2.jpg',
    alt: 'A young person looking up, with science labs and a city skyline layered over them',
    type: 'Incubator / Innovation Centre',
    cta: 'Register as an incubator',
  },
  {
    title: 'Educational Institutions',
    description: 'Universities, colleges and schools interested in developing students through practical learning, professional skills and industry-oriented training.',
    icon: GraduationCap,
    image: '/images/institutions/wellbeing.jpg',
    alt: 'Students sitting together on a campus lawn',
    type: 'Educational Institution',
    cta: 'Register as an institution',
  },
]

export const registerIntro = {
  title: 'Register Your Organisation',
  lead: "Let's build a stronger ecosystem together.",
  description: 'Tell us about your organisation and how you would like to collaborate with STEM for Society.',
  message: 'Together for a Greater Impact',
  image: '/images/institutions/campus-hero.jpg',
  alt: 'A campus of glass buildings around a lake',
} as const

/** Ways to collaborate, taken from what STEM for Society already offers. */
export const collaborationInterests = [
  'Industry Skills programmes',
  'Professional Skills programmes',
  'Finishing School',
  'Institution training plans',
  'Campus Ambassador programme',
  'Network Beyond Campus',
  'Scientific Communication',
  'Mentorship and expert sessions',
  'Hosting a webinar or workshop',
  'Internships and industry exposure',
  'Other',
] as const

export const countryCodes = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA / Canada (+1)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+81', label: 'Japan (+81)' },
] as const

export const locations = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry', 'Outside India',
] as const

export const trustedPartnersIntro = { title: 'Our Trusted Partners' } as const

export const trustedPartners = [
  { name: 'Geneaura', logo: '/lovable-uploads/Geneaura.png' },
  { name: 'Bangalore Bioinnovation Centre', logo: '/lovable-uploads/bioinnovation.png' },
  { name: 'Shewell', logo: '/lovable-uploads/shewell.png' },
  { name: 'IMrobonix', logo: '/lovable-uploads/IMrobonix.png' },
  { name: 'Sri Ramachandra Innovation Incubation Centre', logo: '/lovable-uploads/Ramachandra.png' },
  { name: 'B-Actrol Biosciences', logo: '/lovable-uploads/bioscience.png' },
] as const
