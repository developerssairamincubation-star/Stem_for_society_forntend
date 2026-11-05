import { motion, useReducedMotion } from 'framer-motion'
import { links } from '../../config'
import { Button } from '../ui/Button'
import { SmartLink } from '../ui/SmartLink'

/**
 * Hero. The page's one orchestrated moment is the route line: it draws once from "Campus" to "Industry"
 * along the foot of the hero, which is what the programme is about. Everything else stays still.
 */
export function HomeHero() {
  const reduced = useReducedMotion()

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden bg-surface pt-32 sm:pt-36 lg:pt-44">
      <div className="container-x grid items-center gap-12 pb-28 lg:grid-cols-12 lg:gap-8 lg:pb-36">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="t-display max-w-[17ch]">
            From Learning to Real World Impact
          </h1>
          <p className="t-lead mt-7 max-w-xl text-ink/75">
            Hands-on STEM learning, industry mentorship, and real-world projects that transform curiosity into skills,
            confidence, and meaningful careers.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="#academy">Explore Our Academy</Button>
            <SmartLink
              href={links.partner}
              className="t-label text-deep underline decoration-tint decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-deep"
            >
              Partner with us
            </SmartLink>
          </div>
        </div>

        <figure className="relative lg:col-span-5">
          <img
            src="/images/hero-v2.jpg"
            alt="A student's profile blended with robotics, a lab and a city skyline"
            width={1072}
            height={760}
            {...({ fetchpriority: 'high' } as object)}
            className="aspect-[16/10] w-full rounded-card object-cover object-[68%_center] lg:aspect-[4/3.3]"
          />
        </figure>
      </div>

      {/* Route line: Campus → Industry */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 sm:block">
        <svg className="h-full w-full" viewBox="0 0 1440 112" preserveAspectRatio="none" fill="none">
          <motion.path
            d="M0 104 C 380 104, 640 100, 900 70 S 1280 30, 1440 24"
            stroke="#0389ff"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="t-small absolute bottom-3 left-[var(--gx)] translate-y-0 text-ink/60">Campus</span>
        <span className="t-small absolute top-1 right-[var(--gx)] text-ink/60">Industry</span>
      </div>
    </section>
  )
}
