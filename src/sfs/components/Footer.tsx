import { Check, InstagramLogo, LinkedinLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { community, links, newsletterEndpoint, social } from '../config'
import { contact, navLeft, navRight } from '../data/content'
import { CAMPUS_AMBASSADOR_PATH, COMMUNITY_PATH, isHomePath, sectionHref } from '../lib/route'
import { SmartLink } from './ui/SmartLink'

const YEAR = new Date().getFullYear()

/** Social icons only appear once their profile URL is configured. */
const socials = [
  { label: 'LinkedIn', href: social.linkedin, Icon: LinkedinLogo },
  { label: 'X (Twitter)', href: social.x, Icon: XLogo },
  { label: 'Instagram', href: social.instagram, Icon: InstagramLogo },
  { label: 'YouTube', href: social.youtube, Icon: YoutubeLogo },
].filter((s) => s.href !== '#')

/** Explore mirrors the header navigation; "Resources" is left out because it is this footer, and Partner With Us is under Important Links. */
const explore = [
  ...[...navLeft, ...navRight].filter((l) => l.id !== 'resources' && l.id !== 'partner'),
  { id: 'community', label: 'Join Our Community', href: COMMUNITY_PATH },
  { id: 'campus-ambassador', label: 'Campus Ambassador', href: CAMPUS_AMBASSADOR_PATH },
  // Existing platform pages that are no longer in the header, kept reachable from here.
  { id: 'skill-development', label: 'Skill Development', href: '/skill-development' },
  { id: 'finishing-school', label: 'Finishing School', href: '/finishing-school' },
  { id: 'courses', label: 'Courses', href: '/courses' },
]

const important = [
  { label: 'Partner With Us', href: links.partner },
  { label: 'Login', href: links.login },
  { label: 'Partner Login', href: links.partnerLogin },
  { label: 'Admin Login', href: links.adminLogin },
  { label: 'Join WhatsApp Community', href: community.whatsappUrl },
  { label: 'Contact Us', href: `mailto:${contact.email}` },
]

const legal = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms and Conditions', href: '/terms-condition' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

const heading = 't-label mb-4 uppercase tracking-wide !text-white'
const link = 't-body text-white/80 transition-colors duration-200 hover:text-white'

function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = String(new FormData(form).get('email') ?? '').trim()
    if (!email) return
    if (!newsletterEndpoint) {
      // Same behaviour as the platform's previous footer: hand the request to the visitor's mail client.
      window.location.href = `mailto:${contact.email}?subject=Newsletter%20subscription&body=${encodeURIComponent(`Please subscribe ${email} to updates.`)}`
      setStatus('done')
      form.reset()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(newsletterEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('done')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} aria-describedby="newsletter-status" className="flex flex-col gap-3">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email address"
        className="field border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white"
      />
      <button type="submit" disabled={status === 'sending'} className="btn btn-inverse">
        Subscribe
      </button>
      <p id="newsletter-status" role="status" className="t-small min-h-6">
        {status === 'done' && (
          <span className="inline-flex items-center gap-1.5 text-white">
            <Check size={16} aria-hidden="true" /> Thanks, you are on the list.
          </span>
        )}
        {status === 'error' && <span className="text-white">Something went wrong. Please try again.</span>}
      </p>
    </form>
  )
}

export function Footer() {
  return (
    <footer id="footer" className="on-dark bg-deep text-white">
      <div className="container-x pt-16 pb-8">
        <div id="resources" className="grid scroll-mt-24 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* Brand */}
          <div>
            <SmartLink href={isHomePath() ? '#home' : '/'} aria-label="STEM for Society, back to top" className="inline-block rounded-full">
              <img src="/images/brand/sfs-logo.png" alt="STEM for Society" width={64} height={64} className="size-16 object-contain brightness-0 invert" />
            </SmartLink>
            <p className="t-heading mt-4 !text-white">STEM FOR SOCIETY</p>
            <p className="t-body mt-2 max-w-xs text-white/80">Let’s Innovate, Incubate and Impact the world together!</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3 p-0">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label} className="list-none">
                    <SmartLink href={href} aria-label={label} className="grid size-10 place-items-center rounded-full bg-white text-deep transition-colors duration-200 hover:bg-tint">
                      <Icon size={20} aria-hidden="true" />
                    </SmartLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h2 className={heading}>Explore</h2>
            <ul className="space-y-3 p-0">
              {explore.map((l) => (
                <li key={l.id} className="list-none">
                  <SmartLink href={sectionHref(l.href)} className={link}>
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Important links */}
          <nav aria-label="Important links">
            <h2 className={heading}>Important Links</h2>
            <ul className="space-y-3 p-0">
              {important.map((l) => (
                <li key={l.label} className="list-none">
                  <SmartLink href={l.href} className={link}>
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Subscribe */}
          <div id="stay-updated" className="scroll-mt-24">
            <h2 className={heading}>Subscribe</h2>
            <p className="t-body mb-4 text-white/80">Get updates on new programs and workshops.</p>
            <Newsletter />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="t-small text-white/80">© {YEAR} STEM for Society. All rights reserved.</p>
            <ul className="t-small flex flex-wrap gap-x-5 gap-y-1 p-0 text-white/80">
              {legal.map((l) => (
                <li key={l.label} className="list-none">
                  <SmartLink href={l.href} className="hover:text-white hover:underline">
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
          <address className="t-small text-white/80 not-italic">
            {contact.address} ·{' '}
            <a href={`tel:${contact.phone}`} className="hover:underline">
              {contact.phone}
            </a>
          </address>
        </div>
      </div>
    </footer>
  )
}
