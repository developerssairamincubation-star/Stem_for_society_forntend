/**
 * Single place for every destination that is not part of this page.
 * Override with VITE_* variables (see .env.example); empty values fall back
 * to an in-page anchor so no button ever points at an invented URL.
 */
const env = import.meta.env

const pick = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value.trim() : fallback

export const links = {
  /** Separate website — not a fourth academy program. */
  network: pick(env.VITE_NETWORK_URL, 'https://networkingbeyondcampus.com/'),
  /** Partner With Us: the public collaboration page (organisation registration). The platform's own partner account sign-up stays at /partner-institution-signup. */
  partner: pick(env.VITE_PARTNER_URL, '/partner-with-us'),
  enquire: pick(env.VITE_ENQUIRE_URL, '#partner'),
  /** Detailed curriculum document. Empty until the team supplies one: the Institutions page then offers a request form instead of a download. */
  curriculum: pick(env.VITE_CURRICULUM_URL, ''),
  /** Header and footer Login: the platform's student sign-in page. */
  login: '/login',
  /** Scientific Communications (blog) lives on the current platform at /blog; set VITE_BLOG_URL when hosted elsewhere. */
  blog: pick(env.VITE_BLOG_URL, '/blog'),
  /** Existing partner and admin sign-in pages of the platform. */
  adminLogin: pick(env.VITE_ADMIN_LOGIN_URL, '/admin/signin'),
  partnerLogin: pick(env.VITE_PARTNER_LOGIN_URL, '/partner/signin'),
} as const

export const newsletterEndpoint = pick(env.VITE_NEWSLETTER_ENDPOINT, '')

/** Institution enquiry forms POST here when set; otherwise they open a pre-filled email. */
export const enquiryEndpoint = pick(env.VITE_ENQUIRY_ENDPOINT, '')

export const social = {
  linkedin: pick(env.VITE_SOCIAL_LINKEDIN, '#'),
  instagram: pick(env.VITE_SOCIAL_INSTAGRAM, 'https://www.instagram.com/stemforsociety_official/'),
  x: pick(env.VITE_SOCIAL_X, 'https://x.com/EmpoweringSci'),
  youtube: pick(env.VITE_SOCIAL_YOUTUBE, 'https://www.youtube.com/@stemforsociety'),
  facebook: pick(env.VITE_SOCIAL_FACEBOOK, '#'),
} as const

/**
 * Join Our Community page. Social URLs can be overridden per environment; the defaults are the
 * profiles supplied by the team. An empty value renders that card as "coming soon" instead of a dead link.
 */
export const community = {
  /** WhatsApp community invitation link (the QR code in /images/community/whatsapp-qr.png points to it). */
  whatsappUrl: pick(env.VITE_WHATSAPP_COMMUNITY_URL, 'https://chat.whatsapp.com/Epro4DSJ4qG4qf1D9vsEep?mode=ems_share_c'),
  whatsappQr: '/images/community/whatsapp-qr.png',
  x: pick(env.VITE_COMMUNITY_X_URL, 'https://x.com/EmpoweringSci'),
  instagram: pick(env.VITE_COMMUNITY_INSTAGRAM_URL, 'https://www.instagram.com/stemforsociety_official/'),
  youtube: pick(env.VITE_COMMUNITY_YOUTUBE_URL, 'https://www.youtube.com/@stemforsociety'),
} as const

/**
 * Campus Ambassador page. Both "Apply Now" buttons go to the existing registration flow, which lives at
 * /campus-ambassador-booking in the current platform; set VITE_CA_REGISTRATION_URL when it is hosted elsewhere.
 */
export const campusAmbassador = {
  registrationUrl: pick(env.VITE_CA_REGISTRATION_URL, '/campus-ambassador-booking'),
} as const

export const isExternal = (href: string) => /^https?:\/\//i.test(href)
