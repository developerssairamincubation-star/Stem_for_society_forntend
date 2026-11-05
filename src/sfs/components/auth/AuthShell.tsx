import { motion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { BrandPanel, type BrandScene } from '../login/BrandPanel'
import '@/sfs/styles/sfs-login.css'

interface AuthShellProps {
  /** Heading of the form panel. */
  title: string
  /** Supporting line under the heading. */
  description?: string
  /** Headline and line shown on the blue brand panel. */
  brandTitle?: string
  brandText?: string
  /** Which photograph sits behind the brand panel. */
  scene?: BrandScene
  /** Wider form column for long registration forms. */
  wide?: boolean
  children: ReactNode
  /** Rendered under the form card (sign-in links, legal line). */
  footer?: ReactNode
}

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Frame for every sign-in / sign-up / registration screen. It reuses the /login composition: a blue brand panel next to a
 * white form panel inside one rounded container. The page that renders it keeps all of its own state, validation and API calls.
 */
export function AuthShell({
  title,
  description,
  brandTitle = 'Start Your Journey',
  brandText = 'Explore, innovate, and connect with the STEM community',
  scene = 'student',
  wide = false,
  children,
  footer,
}: AuthShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="sfs-ui sfs-skin sfs-login min-h-dvh bg-surface p-3 sm:p-6 lg:flex lg:items-center lg:justify-center">
        <main className="mx-auto w-full max-w-[72rem]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            className={`grid overflow-hidden rounded-panel bg-white shadow-overlay lg:min-h-[40rem] ${
              wide ? 'lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]' : 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]'
            }`}
          >
            <BrandPanel title={brandTitle} text={brandText} scene={scene} />

            <motion.section
              aria-labelledby="auth-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14"
            >
              <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-[26rem]'}`}>
                <h1 id="auth-title" className="text-[1.75rem] leading-tight font-semibold sm:text-[2rem]">
                  {title}
                </h1>
                {description && <p className="t-body mt-3 text-ink/70">{description}</p>}
                <div className="mt-8">{children}</div>
                {footer && <div className="t-small mt-7 text-center text-ink/70">{footer}</div>}
              </div>
            </motion.section>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  )
}

/** A labelled field row. Wraps any control; the label is associated with the control through `htmlFor`. */
export function AuthField({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="t-label mb-2 block">
        {label}
      </label>
      {children}
      {hint && <p className="t-small mt-1.5 text-ink/60">{hint}</p>}
    </div>
  )
}

/** "Or" divider between the form and a secondary method. */
export function AuthDivider({ label = 'Or' }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-4" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-tint" />
      <span className="t-small text-ink/60">{label}</span>
      <span className="h-px flex-1 bg-tint" />
    </div>
  )
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}
