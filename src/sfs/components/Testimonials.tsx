import { CaretLeft, CaretRight, Star } from '@phosphor-icons/react'
import { motion, MotionConfig, useInView, type PanInfo } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { testimonials } from '../data/content'
import { SectionHeading } from './ui/SectionHeading'

const N = testimonials.length

/**
 * Where a card rests in the pile. Slot 0 is the card in front; the rest lie around it, tilted and overlapping.
 * x and y are percentages of the card's own width and height, so the pile scales with the card.
 */
const SLOTS = [
  { x: 0, y: 2, r: -2, s: 1.04, z: 50 },
  { x: -76, y: 0, r: -9, s: 1, z: 40 },
  { x: 76, y: -6, r: 8, s: 1, z: 35 },
  { x: -34, y: -30, r: 5, s: 0.97, z: 25 },
  { x: 38, y: 32, r: -6, s: 0.97, z: 20 },
] as const

/** One colour per card, all from the SFS palette: surface and text, the colour of the stars, and the rule above the name. */
const PALETTE = [
  { card: 'bg-deep text-white', star: 'text-tint', rule: 'border-white/25' },
  { card: 'bg-tint text-ink', star: 'text-deep', rule: 'border-ink/15' },
  { card: 'bg-ink text-white', star: 'text-tint', rule: 'border-white/25' },
  { card: 'bg-brand text-ink', star: 'text-white', rule: 'border-ink/20' },
  { card: 'bg-white text-ink', star: 'text-deep', rule: 'border-ink/15' },
] as const

/** Slot taken by card `i` when card `active` is in front: choosing a card sends the others round the pile. */
const slotOf = (i: number, active: number) => SLOTS[(i - active + N) % N % SLOTS.length]

function useNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return narrow
}

export function Testimonials() {
  const [active, setActive] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const seen = useInView(stage, { once: true, margin: '0px 0px -15% 0px' })
  const narrow = useNarrow()
  const spread = narrow ? 0.55 : 1

  const go = useCallback((dir: number) => setActive((a) => (a + dir + N) % N), [])
  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 50 || info.velocity.x > 400) go(-1)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  return (
    <MotionConfig reducedMotion="user">
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
          className="relative mx-auto max-w-5xl rounded-panel"
        >
          <motion.div
            ref={stage}
            onPanEnd={onPanEnd}
            style={{ touchAction: 'pan-y' }}
            className="grid h-[34rem] place-items-center sm:h-[37rem]"
          >
            {testimonials.map((t, i) => {
              const slot = slotOf(i, active)
              const front = i === active
              const palette = PALETTE[i % PALETTE.length]
              return (
                <motion.figure
                  key={t.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${N}`}
                  aria-hidden={!front}
                  onClick={() => !front && setActive(i)}
                  initial={{ opacity: 0, scale: 0.85, x: '0%', y: '0%', rotate: 0 }}
                  animate={
                    seen
                      ? { opacity: 1, scale: slot.s, x: `${slot.x * spread}%`, y: `${slot.y}%`, rotate: slot.r }
                      : { opacity: 0, scale: 0.85, x: '0%', y: '0%', rotate: 0 }
                  }
                  whileHover={front ? undefined : { scale: slot.s * 1.03, rotate: slot.r * 0.6 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  style={{ zIndex: slot.z }}
                  className={`m-0 flex h-[22rem] w-[min(19rem,76vw)] [grid-area:1/1] flex-col gap-4 rounded-panel p-7 shadow-overlay select-none ${palette.card} ${front ? '' : 'cursor-pointer'}`}
                >
                  <span className="flex gap-0.5" role="img" aria-label={t.rating ? `${t.rating} out of 5 stars` : undefined} hidden={!t.rating}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={20} weight="fill" aria-hidden="true" className={n <= (t.rating ?? 0) ? palette.star : 'opacity-30'} />
                    ))}
                  </span>
                  <blockquote className="t-body m-0 flex-1">{t.quote}</blockquote>
                  <figcaption className={`flex items-center gap-3 border-t pt-4 ${palette.rule}`}>
                    <img
                      src={t.portrait}
                      alt={`Portrait placeholder for ${t.name}`}
                      width={44}
                      height={44}
                      loading="lazy"
                      draggable={false}
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                    <span className="flex flex-col">
                      <cite className="t-label not-italic">{t.name}</cite>
                      <span className="t-small opacity-75">{t.background}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              )
            })}
          </motion.div>

          <p className="sr-only" aria-live="polite">
            Testimonial {active + 1} of {N}: {testimonials[active].name}
          </p>
        </div>

        <div className="container-x mt-2 flex items-center justify-center gap-3" role="group" aria-label="Choose testimonial">
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="icon-btn">
            <CaretLeft size={20} aria-hidden="true" />
          </button>
          <div className="flex items-center">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i + 1}: ${t.name}`}
                aria-current={i === active ? 'true' : undefined}
                className="grid h-8 place-items-center px-1"
              >
                <span className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${i === active ? 'w-8 bg-deep' : 'w-2 bg-deep/25 hover:bg-deep/50'}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="icon-btn">
            <CaretRight size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="container-x mt-6 text-center">
          <p className="t-small text-ink/60">Sample testimonials, five-star ratings and placeholder portraits. Replace with approved student content before launch.</p>
        </div>
      </section>
    </MotionConfig>
  )
}
