import { ArrowRight } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'framer-motion'
import { partnerHero } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'

const ease = [0.16, 1, 0.3, 1] as const

/** A quiet double helix drawn as two sine paths with rungs. Decorative: hidden from assistive technology and still under reduced motion. */
function Helix({ className = '' }: { className?: string }) {
  const rungs = Array.from({ length: 11 }, (_, i) => i)
  const y = (i: number) => 20 + i * 38
  const x = (i: number, side: 1 | -1) => 100 + side * 62 * Math.sin((i / 10) * Math.PI * 2)
  return (
    <svg aria-hidden="true" viewBox="0 0 200 440" fill="none" className={className}>
      <path className="dna-dash" d={`M${x(0, 1)} ${y(0)} ${rungs.slice(1).map((i) => `L${x(i, 1)} ${y(i)}`).join(' ')}`} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path className="dna-dash" d={`M${x(0, -1)} ${y(0)} ${rungs.slice(1).map((i) => `L${x(i, -1)} ${y(i)}`).join(' ')}`} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {rungs.map((i) => (
        <g key={i}>
          <line x1={x(i, 1)} y1={y(i)} x2={x(i, -1)} y2={y(i)} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
          <circle cx={x(i, 1)} cy={y(i)} r="4" fill="currentColor" />
          <circle cx={x(i, -1)} cy={y(i)} r="4" fill="currentColor" fillOpacity="0.6" />
        </g>
      ))}
    </svg>
  )
}

export function PartnerHero() {
  const reduced = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  })

  return (
    <section aria-labelledby="partner-title" className="relative isolate overflow-hidden bg-surface pt-32 pb-16 sm:pb-20 lg:pt-36 lg:pb-24">
      {/* Soft blue shapes and a helix behind the picture */}
      <div aria-hidden="true" className="absolute -top-32 -right-24 -z-10 size-[34rem] rounded-full bg-tint/60 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 -left-24 -z-10 size-80 rounded-full bg-brand/10 blur-3xl" />
      <Helix className="dna-float absolute top-24 right-[44%] -z-10 hidden h-[26rem] w-auto text-brand/30 lg:block" />

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <motion.p {...rise(0)} className="t-small inline-flex items-center rounded-full border border-tint bg-white px-4 py-1.5 font-medium text-deep">
            {partnerHero.label}
          </motion.p>
          <motion.h1 id="partner-title" {...rise(0.06)} className="t-display mt-6">
            Partner <span className="text-brand">With Us</span>
          </motion.h1>
          <motion.p {...rise(0.14)} className="t-lead mt-5 max-w-lg text-ink/70">
            {partnerHero.description}
          </motion.p>
          <motion.div {...rise(0.22)} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#register" onClick={(e) => (e.preventDefault(), scrollToId('register'))} className="btn btn-primary nudge">
              Register Your Organisation
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#categories" onClick={(e) => (e.preventDefault(), scrollToId('categories'))} className="btn btn-secondary">
              Learn More
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="relative"
        >
          <div aria-hidden="true" className="dna-float-slow absolute -bottom-5 -left-5 size-full rounded-panel border-2 border-tint" />
          <div className="relative overflow-hidden rounded-panel shadow-overlay">
            <img
              src={partnerHero.image}
              alt={partnerHero.alt}
              width={1200}
              height={800}
              {...({ fetchpriority: 'high' } as object)}
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
