import { CaretLeft, CaretRight, Quotes } from '@phosphor-icons/react'
import { motion, useReducedMotion, type PanInfo, type TargetAndTransition, type Transition } from 'framer-motion'
import { useCallback, useState, type KeyboardEvent } from 'react'
import { testimonials } from '../data/content'
import { SectionHeading } from './ui/SectionHeading'

const N = testimonials.length
const HALF = Math.floor(N / 2)
const ease = [0.16, 1, 0.3, 1] as const

/** Signed distance of card `i` from the front card, wrapped to [-HALF, HALF]. */
const offsetOf = (i: number, active: number) => ((i - active + N + HALF) % N) - HALF

/** Resting pose in the deck: front card straight on, neighbours fanned behind it. */
const pose = (offset: number): TargetAndTransition => {
  const a = Math.abs(offset)
  const d = Math.sign(offset)
  if (a === 0) return { x: '0%', scale: 1, rotateY: -4, opacity: 1, zIndex: 30 }
  if (a === 1) return { x: `${d * 24}%`, scale: 0.94, rotateY: -d * 14, opacity: 1, zIndex: 20 }
  return { x: `${d * 30}%`, scale: 0.88, rotateY: -d * 18, opacity: 0, zIndex: 10 }
}

/** The card leaving the front swings out to the side, then slots in behind the deck. */
const swing = (toOffset: number): TargetAndTransition => {
  const d = Math.sign(toOffset)
  return {
    x: ['0%', `${d * 74}%`, `${d * 24}%`],
    scale: [1, 0.9, 0.94],
    rotateY: [-4, d * 26, -d * 14],
    opacity: 1,
    zIndex: [40, 40, 20],
  }
}

const shade = (offset: number) => (offset === 0 ? 0 : Math.abs(offset) === 1 ? 0.45 : 0.65)

export function Testimonials() {
  const [{ index, prev }, setPosition] = useState({ index: 0, prev: 0 })
  const reduced = useReducedMotion()

  const goTo = useCallback((next: number) => setPosition((p) => ({ index: next, prev: p.index })), [])
  const go = useCallback((dir: number) => setPosition((p) => ({ index: (p.index + dir + N) % N, prev: p.index })), [])

  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 50 || info.velocity.x > 400) go(-1)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section overflow-hidden bg-surface">
      <div className="container-x">
        <SectionHeading
          id="testimonials-title"
          align="center"
          title="Real Stories. Real Growth."
          description="Discover how practical learning and mentorship help students turn their ideas into real-world achievements."
          className="section-head"
        />
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Student testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative mx-auto max-w-3xl rounded-panel"
      >
        <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="icon-btn absolute top-1/2 left-2 z-40 -translate-y-1/2 sm:left-6">
          <CaretLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="icon-btn absolute top-1/2 right-2 z-40 -translate-y-1/2 sm:right-6">
          <CaretRight size={20} aria-hidden="true" />
        </button>

        <motion.div
          onPanEnd={onPanEnd}
          style={{ touchAction: 'pan-y', perspective: 1400 }}
          className="relative mx-auto h-[28rem] w-full cursor-grab active:cursor-grabbing sm:h-[30rem]"
        >
          {testimonials.map((t, i) => {
            const offset = offsetOf(i, index)
            const was = offsetOf(i, prev)
            const isActive = offset === 0
            const jump = Math.abs(offset - was) > 2
            const swinging = was === 0 && Math.abs(offset) === 1 && prev !== index
            const transition: Transition =
              jump || reduced
                ? { duration: 0 }
                : swinging
                  ? { duration: 0.9, times: [0, 0.45, 1], ease: 'easeInOut' }
                  : { duration: 0.7, ease, delay: offset === 0 ? 0.1 : 0 }

            return (
              <motion.figure
                key={t.name}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${N}`}
                aria-hidden={!isActive}
                // React 18 has no boolean `inert` prop: pass the attribute as an empty string.
                {...(isActive ? {} : ({ inert: '' } as object))}
                initial={false}
                animate={swinging ? swing(offset) : pose(offset)}
                transition={transition}
                className="absolute inset-y-4 left-1/2 m-0 flex w-[min(20rem,76vw)] -translate-x-1/2 flex-col justify-between overflow-hidden rounded-panel bg-deep p-8 text-white shadow-overlay sm:w-[21rem]"
              >
                <Quotes size={36} weight="fill" className="relative text-tint" aria-hidden="true" />
                <blockquote className="t-body relative m-0 text-white">{t.quote}</blockquote>
                <figcaption className="relative flex items-center gap-3 border-t border-white/20 pt-5">
                  <img
                    src={t.portrait}
                    alt={`Portrait placeholder for ${t.name}`}
                    width={48}
                    height={48}
                    loading="lazy"
                    draggable={false}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                  <span className="flex flex-col">
                    <cite className="t-label text-white not-italic">{t.name}</cite>
                    <span className="t-small text-white/70">{t.background}</span>
                  </span>
                </figcaption>

                {/* Depth: cards further back sit under a veil. */}
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: shade(offset) }}
                  transition={{ duration: reduced ? 0 : 0.7, ease }}
                  className="pointer-events-none absolute inset-0 bg-ink"
                />
              </motion.figure>
            )
          })}
        </motion.div>

        <p className="sr-only" aria-live="polite">
          Testimonial {index + 1} of {N}: {testimonials[index].name}
        </p>
      </div>

      <div className="container-x mt-6 flex items-center justify-center" role="group" aria-label="Choose testimonial">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show testimonial ${i + 1}: ${t.name}`}
            aria-current={i === index ? 'true' : undefined}
            className="grid h-8 place-items-center px-1"
          >
            <span className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${i === index ? 'w-8 bg-deep' : 'w-2 bg-deep/25 hover:bg-deep/50'}`} />
          </button>
        ))}
      </div>

      <p className="t-small container-x mt-5 text-center text-ink/60">
        Sample testimonials and placeholder portraits. Replace with approved student content before launch.
      </p>
    </section>
  )
}
