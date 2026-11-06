import { ArrowDown, ArrowRight } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'framer-motion'
import { partnerHero } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'
import { Pill } from './Pill'

const ease = [0.16, 1, 0.3, 1] as const

/** A double helix in soft blue, running diagonally in the top corner. Decorative. */
function Helix({ className = '' }: { className?: string }) {
  const rungs = Array.from({ length: 14 }, (_, i) => i)
  const y = (i: number) => 14 + i * 34
  const x = (i: number, side: 1 | -1) => 100 + side * 54 * Math.sin((i / 13) * Math.PI * 2.4)
  const path = (side: 1 | -1) => `M${x(0, side)} ${y(0)} ${rungs.slice(1).map((i) => `L${x(i, side)} ${y(i)}`).join(' ')}`
  return (
    <svg aria-hidden="true" viewBox="0 0 200 500" fill="none" className={className}>
      <path d={path(1)} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d={path(-1)} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeOpacity="0.7" />
      {rungs.map((i) => (
        <line key={i} x1={x(i, 1)} y1={y(i)} x2={x(i, -1)} y2={y(i)} stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
      ))}
    </svg>
  )
}

/** Fades the picture into the page on its left and bottom edges, so it sits in the soft blue background rather than in a box. */
const FADE = {
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 28%), linear-gradient(to top, transparent 0%, #000 16%)',
  maskImage: 'linear-gradient(to right, transparent 0%, #000 28%), linear-gradient(to top, transparent 0%, #000 16%)',
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
} as React.CSSProperties

export function PartnerHero() {
  const reduced = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section aria-labelledby="partner-title" className="relative isolate overflow-x-clip pt-32 pb-12 sm:pb-16 lg:pt-36 lg:pb-0">
      <div aria-hidden="true" className="absolute -top-24 right-[-8rem] -z-10 size-[40rem] rounded-full bg-tint/50 blur-3xl" />
      <div aria-hidden="true" className="absolute top-1/2 -left-32 -z-10 size-[30rem] rounded-full bg-brand/10 blur-3xl" />
      <Helix className="pointer-events-none absolute top-16 right-[3%] z-[1] hidden h-[24rem] w-auto rotate-[24deg] text-brand/25 lg:block" />

      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-6">
        <div className="lg:pb-24">
          <motion.div {...rise(0)}>
            <Pill>{partnerHero.label}</Pill>
          </motion.div>
          <motion.h1 id="partner-title" {...rise(0.06)} className="!mt-6 text-[2.75rem] leading-[1.05] !font-bold tracking-[-0.03em] text-ink sm:text-[4rem]">
            Partner <span className="text-brand">With Us</span>
          </motion.h1>
          <motion.p {...rise(0.14)} className="t-lead !mt-6 max-w-lg text-ink/80">
            {partnerHero.description}
          </motion.p>
          <motion.div {...rise(0.22)} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#register" onClick={(e) => (e.preventDefault(), scrollToId('register'))} className="btn btn-primary nudge !h-12 !rounded-full !px-7">
              Register Your Organisation
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href="#categories"
              onClick={(e) => (e.preventDefault(), scrollToId('categories'))}
              className="btn btn-secondary !h-12 !rounded-full !border-tint !px-5 !text-deep"
            >
              <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-brand text-white">
                <ArrowDown size={14} weight="bold" />
              </span>
              Learn More
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="relative lg:-mr-[calc(var(--gx)-var(--gutter))]"
        >
          <img
            src={partnerHero.image}
            alt={partnerHero.alt}
            width={1200}
            height={800}
            {...({ fetchpriority: 'high' } as object)}
            decoding="async"
            style={FADE}
            className="aspect-[4/3] w-full rounded-tl-[6rem] object-cover object-[60%_40%] lg:aspect-[5/4]"
          />
        </motion.div>
      </div>
    </section>
  )
}
