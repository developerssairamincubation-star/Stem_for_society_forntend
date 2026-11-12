/**
 * Content for the Institutions page.
 * Source of truth: https://www.stemforsociety.org/insituion-individual?mode=institution
 * Wording is kept as published; nothing below is invented.
 */

export const institutionHero = {
  lead: 'Partnering with Institutions for',
  rest: 'Real World Readiness',
  /** Campus scene with a clear blue sky and INNOVATE lettered across it; the headline and button sit live on the sky. */
  image: '/images/institutions/campus-innovate.jpg',
  alt: 'The word INNOVATE in large letters across the sky above a modern glass campus, with students on the lawn by a lake',
} as const

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
