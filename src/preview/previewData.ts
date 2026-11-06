/**
 * Sample content for previewing pages without a backend. It is only reachable through `withDevPreview` (devPreview.ts), which
 * runs on the dev server alone, so none of this ships in a production build. Everything here is made up: names, programmes,
 * dates, prices and articles are examples.
 */
import type { Blog } from '@/pages/BlogListing'
import type { StudentTraining } from '@/pages/Training'
import type { PreviewKey } from './devPreview'

const now = new Date()
const at = (offsetDays: number, hour: number, minutes = 0) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays, hour, minutes)
  return d.toISOString()
}

const lesson = (id: string, title: string, type: 'ONLINE' | 'OFFLINE', day: number, content: string, location: string | null = null) => ({
  id,
  createdAt: null,
  updatedAt: null,
  title,
  location,
  type,
  trainingId: null,
  content,
  video: null,
  lastDate: new Date(at(day, 15)) as Date | null,
})

const sample = (
  i: number,
  title: string,
  category: string,
  cover: string,
  type: StudentTraining['type'],
  cost: string,
  day: number,
  hour: number,
  extra: Partial<StudentTraining> = {},
): StudentTraining => ({
  id: `preview-${i}`,
  title,
  coverImg: cover,
  startDate: at(day, hour),
  endDate: at(day, hour + 1, 30),
  description:
    'A practical, mentor-led session where participants build a working project, learn industry workflows and finish with a certificate recognised by partner organisations.',
  createdAt: at(-3, 10),
  category,
  instructor: { firstName: 'Anita', lastName: 'Rao', institutionName: 'Sample Partner Institute' },
  link: 'https://example.org/join',
  cost,
  location: type === 'ONLINE' ? undefined : 'Bengaluru, Karnataka',
  isEnrolled: false,
  displayFeedback: false,
  ratings: [],
  enrolments: [],
  type,
  lessons: [
    lesson('l1', 'Foundations and tooling', 'ONLINE', day, '<p>Set up your environment, meet the mentors and ship a first working prototype.</p><ul><li>Tools and workflow</li><li>Reading a technical brief</li><li>Your first build</li></ul>'),
    lesson('l2', 'Build and iterate', 'OFFLINE', day + 1, '<p>Work in small teams on a real problem, with feedback from a practising engineer at every step.</p>', 'Lab 2, Sample Partner Institute'),
    lesson('l3', 'Present and review', 'ONLINE', day + 2, '<p>Demonstrate your project, answer questions and agree what to improve next.</p>'),
  ],
  ...extra,
})

const cover = {
  industry: '/images/program-industry.jpg',
  professional: '/images/program-professional.jpg',
  finishing: '/images/program-finishing.jpg',
  network: '/images/network.jpg',
  hero: '/images/hero-v2.jpg',
}

/** Sessions for the Training (seminars) list and its detail page. */
export const previewTrainings: StudentTraining[] = [
  sample(0, 'Embedded Systems Bootcamp', 'Undergraduate', cover.industry, 'HYBRID', '1499', 2, 15, { isEnrolled: true, enrolments: [{ id: 'e0', userId: 'u1', trainingId: 'preview-0', completedOn: null, createdAt: at(-1, 9), transactions: [{ amount: '1499', status: 'success' }] }] }),
  sample(1, 'Introduction to Robotics and AI', 'Class 11 - 12', cover.network, 'ONLINE', '0', 6, 17),
  sample(2, 'Data Science and Analytics Workshop', 'Postgraduate', cover.hero, 'ONLINE', '999', 11, 11),
  sample(3, 'UI/UX Design for Engineers', 'Undergraduate', cover.professional, 'OFFLINE', '799', 24, 10),
  sample(4, 'Hands-on Industry Project Sprint', 'Class 8 - 10', cover.finishing, 'OFFLINE', '1299', 36, 14),
  sample(5, 'Professional Skills for Researchers', 'Postgraduate', cover.professional, 'ONLINE', '0', 41, 16),
  sample(6, 'Career Readiness Sprint', 'Undergraduate', cover.finishing, 'HYBRID', '1499', 70, 10),
]

/** Skill Development and Finishing School lists. Their topic (the Our Academy menu items) is the category. */
export const previewCourses: StudentTraining[] = [
  sample(10, 'Embedded Systems Bootcamp', 'Industry Skills', cover.industry, 'HYBRID', '1499', 7, 15),
  sample(11, 'Introduction to Robotics and AI', 'Industry Skills', cover.industry, 'ONLINE', '0', 12, 17),
  sample(12, 'Data Science and Analytics Workshop', 'Industry Skills', cover.network, 'ONLINE', '999', 18, 11),
  sample(13, 'Leadership and Presentation Skills', 'Professional Skills', cover.professional, 'OFFLINE', '799', 9, 10),
  sample(14, 'Professional Skills for Researchers', 'Professional Skills', cover.professional, 'ONLINE', '0', 21, 16),
  sample(15, 'Interview and Portfolio Preparation', 'Finishing School', cover.finishing, 'HYBRID', '1299', 14, 14),
  sample(16, 'Career Readiness Sprint', 'Finishing School', cover.finishing, 'OFFLINE', '1499', 28, 10),
]

const paragraphs = {
  open: (topic: string) =>
    `<p>${topic} is a skill that grows with practice, and the best way to practise is on a real piece of work. This article follows one small project from the first idea to the final write-up, and shows what we would do differently next time.</p>`,
  question: '<h2>The question that started it</h2><p>Every project began with a plain question: what are we trying to find out, and who will care about the answer? Writing it down in one sentence made every later choice easier, because each step either served that sentence or it did not.</p>',
  method:
    '<h2>How we went about it</h2><p>We worked in short cycles. Each cycle ended with something that could be shown to a reader outside the team, even if it was rough. Feedback from those readers changed the plan more than any internal review did.</p><ul><li>Start with the reader and what they already know</li><li>Show the work, including the parts that did not go to plan</li><li>Say clearly what is still unknown</li></ul>',
  quote: '<blockquote>Good writing is rewriting, and good research is repeating it until someone else can too.</blockquote>',
  close:
    '<h2>What we would change</h2><p>We would begin sharing earlier and more often. A draft that is two days old and imperfect teaches more than a polished one that arrives after the deadline. If you are starting your own project, pick a small question, write it down, and share the first version this week.</p>',
}

const post = (i: number, title: string, category: string, coverImage: string, author: string, designation: string): Blog => ({
  id: `preview-blog-${i}`,
  slug: `preview-post-${i}`,
  category,
  title,
  content: [paragraphs.open(title), paragraphs.question, paragraphs.method, paragraphs.quote, paragraphs.close].join(''),
  createdAt: at(-4 * (i + 1), 10),
  coverImage,
  blogAuthor: { name: author, linkedin: 'https://www.linkedin.com', designation },
})

export const previewBlogs: Blog[] = [
  post(0, 'How robots learn from tiny datasets', 'Research', cover.network, 'Meera Nair', 'PhD Scholar'),
  post(1, 'Why every engineer should write', 'Education', cover.hero, 'Dr. Arjun Patel', 'Assistant Professor'),
  post(2, 'Open hardware in rural classrooms', 'Technology', cover.industry, 'Sana Khan', 'Research Associate'),
  post(3, 'A decade of citizen science', 'Research', '/images/partner.jpg', 'Meera Nair', 'PhD Scholar'),
  post(4, 'Making a paper readable in five edits', 'Education', cover.professional, 'Dr. Arjun Patel', 'Assistant Professor'),
  post(5, 'What a first lab placement teaches you', 'Technology', cover.finishing, 'Sana Khan', 'Research Associate'),
]

/** Shaped like the axios responses the pages read, so a page cannot tell the difference. */
export function previewResponse(key: PreviewKey, arg?: string) {
  switch (key) {
    case 'blogs':
      return { data: { data: previewBlogs } }
    case 'blog':
      return { data: { data: previewBlogs.find((b) => b.slug === arg) ?? previewBlogs[0] } }
    case 'courses':
      return { data: { data: previewCourses } }
    case 'trainings':
      return { data: { data: previewTrainings } }
    case 'training':
      return { data: { data: previewTrainings.find((t) => t.id === arg) ?? previewTrainings[0] } }
  }
}
