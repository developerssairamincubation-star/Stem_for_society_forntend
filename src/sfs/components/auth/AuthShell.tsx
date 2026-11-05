import { motion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthShellProps {
  /** Heading of the form panel. */
  title: string
  /** Supporting line under the heading. */
  description?: string
  /** Headline and line shown on the blue brand panel. */
  brandTitle?: string
  brandText?: string
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
  wide = false,
  children,
  footer,
}: AuthShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="sfs-ui sfs-skin min-h-screen bg-surface px-3 py-6 sm:px-6 sm:py-10 lg:flex lg:items-center lg:justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className={`mx-auto grid w-full gap-2 rounded-[2rem] bg-white p-2 shadow-overlay lg:min-h-[640px] ${
            wide ? 'max-w-6xl lg:grid-cols-[40fr_60fr]' : 'max-w-6xl lg:grid-cols-[58fr_42fr]'
          }`}
        >
          <section
            aria-label="Welcome to STEM for Society"
            className="login-gradient relative flex flex-col overflow-hidden rounded-[1.5rem] p-6 text-white sm:p-8 lg:p-10"
          >
            <div aria-hidden="true" className="login-decor pointer-events-none absolute inset-0">
              <span className="login-float absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
              <span className="login-float absolute bottom-24 -left-16 size-44 rounded-full bg-white/10 [animation-delay:-4s]" />
              <span className="login-glow absolute top-1/3 right-1/4 size-64 rounded-full bg-cyan-300/30 blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-1 flex-col">
              <Link to="/" aria-label="STEM for Society home" className="w-fit rounded-control">
                <img
                  src="/images/brand/sfs-logo.png"
                  alt="STEM for Society"
                  width={64}
                  height={64}
                  className="size-14 object-contain brightness-0 invert sm:size-16"
                />
              </Link>
              <div className="mt-8 lg:mt-auto lg:pt-16">
                <h2 className="t-display !text-white">{brandTitle}</h2>
                <p className="t-lead mt-4 max-w-md text-white/85">{brandText}</p>
              </div>
            </div>
          </section>

          <motion.section
            aria-labelledby="auth-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="flex items-center justify-center px-2 py-10 sm:px-8 lg:px-10 lg:py-10"
          >
            <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-sm'}`}>
              <h1 id="auth-title" className="t-title">
                {title}
              </h1>
              {description && <p className="t-body mt-2 text-ink/70">{description}</p>}
              <div className="mt-8">{children}</div>
              {footer && <div className="t-small mt-6 text-center text-ink/70">{footer}</div>}
            </div>
          </motion.section>
        </motion.div>
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
