import { ArrowRight, CaretRight } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'framer-motion'
import { partnerCategories, partnerHero } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'

const ease = [0.16, 1, 0.3, 1] as const

/** A circle in the floating cluster. `float` picks one of two drift speeds so they never move in step. */
interface Bubble {
  className: string
  float: 'dna-float' | 'dna-float-slow'
  delay: number
}

const BUBBLES: Bubble[] = [
  { className: 'left-[2%] top-[34%] size-24', float: 'dna-float-slow', delay: 0.25 },
  { className: 'left-[26%] top-[4%] size-28', float: 'dna-float', delay: 0.15 },
  { className: 'right-[4%] top-[12%] size-24', float: 'dna-float-slow', delay: 0.35 },
  { className: 'left-[8%] bottom-[8%] size-28', float: 'dna-float', delay: 0.45 },
  { className: 'right-[6%] bottom-[16%] size-28', float: 'dna-float', delay: 0.3 },
]
const TONES = ['bg-white text-deep', 'bg-deep text-white', 'bg-brand text-white', 'bg-white text-deep']

/** A flowing ribbon along the bottom edge of the opener: SFS blues only, drifting slowly sideways. */
function Ribbon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 260" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 -z-10 h-48 w-full sm:h-60">
      <defs>
        <linearGradient id="ribbon" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#c0e1ff" />
          <stop offset="0.35" stopColor="#0389ff" />
          <stop offset="0.7" stopColor="#00549f" />
          <stop offset="1" stopColor="#22c4ee" />
        </linearGradient>
      </defs>
      <g className="ribbon-drift">
        <path d="M-80 220 C 240 60, 560 250, 900 120 S 1380 40, 1560 110 L 1560 260 L -80 260 Z" fill="url(#ribbon)" fillOpacity="0.9" />
        <path d="M-80 245 C 300 150, 620 260, 960 190 S 1400 130, 1560 180 L 1560 260 L -80 260 Z" fill="#f2f8ff" />
      </g>
    </svg>
  )
}

export function PartnerHero() {
  const reduced = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 20, x: -12 },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: { duration: 0.7, delay, ease },
  })
  const pop = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section aria-labelledby="partner-title" className="relative isolate overflow-hidden pt-28 pb-40 sm:pb-52 lg:pt-32 lg:pb-60">
      <Ribbon />

      {/* Sub-navigation row, like the reference: where you are on the left, where you can jump on the right */}
      <div className="container-x flex items-center justify-between gap-4 pt-4">
        <motion.p {...rise(0)} className="t-label text-deep">
          {partnerHero.label}
        </motion.p>
        <motion.ul {...rise(0.05)} className="t-label hidden items-center gap-6 p-0 sm:flex">
          {[
            ['Partner Categories', 'categories'],
            ['Ways to collaborate', 'ways'],
            ['Register', 'register'],
          ].map(([label, id]) => (
            <li key={id} className="list-none">
              <a href={`#${id}`} onClick={(e) => (e.preventDefault(), scrollToId(id))} className="text-ink/70 transition-colors duration-200 hover:text-deep">
                {label}
              </a>
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="container-x mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <motion.h1 id="partner-title" {...rise(0.08)} className="text-[2.75rem] leading-[1.08] !font-medium tracking-[-0.02em] text-[#0b2545] sm:text-[3.5rem]">
            Partner <span className="text-brand">With Us</span>
          </motion.h1>
          <motion.p {...rise(0.16)} className="t-lead mt-6 max-w-md text-ink/70">
            {partnerHero.description}
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#register" onClick={(e) => (e.preventDefault(), scrollToId('register'))} className="btn btn-primary nudge">
              Register Your Organisation
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#categories" onClick={(e) => (e.preventDefault(), scrollToId('categories'))} className="t-label group inline-flex items-center gap-1 text-deep">
              Learn More
              <CaretRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
            </a>
          </motion.div>
        </div>

        {/* The cluster: one large photograph, the four partner types as round icons, and a few small dots */}
        <div className="relative mx-auto h-[24rem] w-full max-w-[34rem] sm:h-[28rem] lg:max-w-none">
          <motion.div {...pop(0.1)} className="absolute top-1/2 left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 sm:size-64">
            <div className="dna-float-slow size-full overflow-hidden rounded-full shadow-overlay ring-8 ring-white">
              <img
                src={partnerHero.image}
                alt={partnerHero.alt}
                width={1200}
                height={800}
                {...({ fetchpriority: 'high' } as object)}
                decoding="async"
                className="size-full object-cover object-[65%_40%]"
              />
            </div>
          </motion.div>

          {BUBBLES.slice(0, 4).map((b, i) => {
            const c = partnerCategories[i]
            const Icon = c.icon
            return (
              <motion.div key={c.title} {...pop(b.delay)} className={`absolute ${b.className}`}>
                <div className={`${b.float} grid size-full place-items-center rounded-full shadow-raised ${TONES[i]}`} title={c.title}>
                  <Icon size={36} weight="fill" aria-hidden="true" />
                  <span className="sr-only">{c.title}</span>
                </div>
              </motion.div>
            )
          })}
          <motion.span {...pop(0.5)} aria-hidden="true" className="dna-float absolute right-[8%] bottom-[8%] size-5 rounded-full bg-brand/60" />
          <motion.span {...pop(0.55)} aria-hidden="true" className="dna-float-slow absolute top-[8%] left-[6%] size-3 rounded-full bg-deep/50" />
          <motion.span {...pop(0.6)} aria-hidden="true" className="dna-float absolute top-[46%] right-[0%] size-4 rounded-full bg-tint" />
        </div>
      </div>
    </section>
  )
}
