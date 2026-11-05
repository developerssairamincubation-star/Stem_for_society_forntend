import { motion, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { Navbar } from '../Navbar'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Frame for the migrated pages (the shared footer comes from the application layout). `sfs-skin` switches on the scoped
 * restyling of legacy controls, and reduced-motion preferences are honoured for every animation inside.
 */
export function PageFrame({ children, tone = 'white' }: { children: ReactNode; tone?: 'white' | 'surface' }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`sfs-ui sfs-skin sfs-page ${tone === 'surface' ? 'bg-surface' : 'bg-white'}`}>
        <a href="#main" className="btn btn-primary fixed top-3 left-3 z-[70] -translate-y-20 transition-transform focus:translate-y-0">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
      </div>
    </MotionConfig>
  )
}

interface PageHeroProps {
  title: ReactNode
  description?: ReactNode
  /** Small line above the title (breadcrumb, category, date). */
  kicker?: ReactNode
  /** Buttons or links under the description. */
  actions?: ReactNode
  /** Optional picture on the right (desktop) / below (mobile). */
  image?: { src: string; alt: string }
  id?: string
}

/** Deep-blue page opener shared by the content pages: title, a supporting line and optional actions or picture. */
export function PageHero({ title, description, kicker, actions, image, id = 'page-title' }: PageHeroProps) {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  })
  return (
    <section aria-labelledby={id} className="on-dark relative isolate overflow-hidden bg-deep pt-36 pb-16 sm:pb-20 lg:pt-44 lg:pb-24">
      {/* A soft light from the upper right, so the blue has depth. Decorative only. */}
      <div aria-hidden="true" className="premium-hero-light absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-px bg-white/15" />
      <div className={`container-x relative ${image ? 'grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16' : ''}`}>
        <div className={image ? '' : 'max-w-3xl'}>
          {kicker && (
            <motion.div {...rise(0)} className="t-small mb-5 text-white/75">
              {kicker}
            </motion.div>
          )}
          <motion.h1 id={id} {...rise(0.05)} className="t-display !text-white">
            {title}
          </motion.h1>
          {description && (
            <motion.div {...rise(0.15)} className="t-lead mt-6 max-w-2xl">
              {description}
            </motion.div>
          )}
          {actions && (
            <motion.div {...rise(0.25)} className="mt-10 flex flex-wrap items-center gap-4">
              {actions}
            </motion.div>
          )}
        </div>
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="overflow-hidden rounded-panel shadow-overlay ring-1 ring-white/20"
          >
            <img src={image.src} alt={image.alt} className="aspect-[4/3] w-full object-cover" />
          </motion.div>
        )}
      </div>
    </section>
  )
}
