import { ArrowRight } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { programs } from '../data/content'
import { Button } from './ui/Button'
import { SectionHeading } from './ui/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

const N = programs.length
const LAST = N - 1
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const pad = (n: number) => String(n).padStart(2, '0')
const easeFlight = gsap.parseEase('power3.inOut')

/** Same legibility wash on the base image and on the zooming card, so the hand-off is invisible. */
const OVERLAY =
  'bg-[linear-gradient(to_bottom,rgb(17_24_39/0.85)_0%,rgb(17_24_39/0.5)_50%,rgb(17_24_39/0.72)_100%)] lg:bg-[linear-gradient(90deg,rgb(17_24_39/0.9)_0%,rgb(17_24_39/0.58)_36%,rgb(17_24_39/0.06)_72%),linear-gradient(to_top,rgb(17_24_39/0.6)_0%,transparent_40%)]'

export function Academy() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const layerImgRef = useRef<HTMLImageElement>(null)
  const layerShadeRef = useRef<HTMLDivElement>(null)
  const slotsRef = useRef<HTMLDivElement>(null)
  const bgRefs = useRef<(HTMLImageElement | null)[]>([])
  const copyRefs = useRef<(HTMLDivElement | null)[]>([])
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current!
    const pin = pinRef.current!
    const stage = stageRef.current!
    const layer = layerRef.current!
    const layerImg = layerImgRef.current!
    const layerShade = layerShadeRef.current!
    const slots = slotsRef.current!
    const bgs = bgRefs.current.filter(Boolean) as HTMLElement[]
    const copies = copyRefs.current.filter(Boolean) as HTMLElement[]
    const thumbs = thumbRefs.current.filter(Boolean) as HTMLElement[]
    const fills = fillRefs.current.filter(Boolean) as HTMLElement[]
    const reveals = copies.map((c) => Array.from(c.querySelectorAll<HTMLElement>('[data-reveal]')))

    const state = { p: 0 }
    let current = -1
    let layerFor = -1

    /**
     * Everything on the stage is a pure function of scroll progress `raw` (0 → N-1).
     * Between whole numbers the next program's thumbnail card zooms from the deck to full bleed.
     */
    const apply = (raw: number) => {
      const p = reduced ? Math.round(raw) : raw
      const k = Math.min(Math.floor(p + 1e-6), LAST - 1)
      const t = clamp01(p - k)
      const flying = t > 0.002 && t < 0.998
      const e = easeFlight(t)
      const rounded = Math.round(p)

      // Base images: the outgoing one dims and drifts back while the card grows over it.
      bgs.forEach((bg, i) => {
        let opacity = 0
        let scale = 1
        if (flying) {
          if (i === k) {
            opacity = 1 - 0.5 * e
            scale = 1 + 0.08 * e
          }
        } else if (i === rounded) opacity = 1
        gsap.set(bg, { opacity, scale })
      })

      // Thumbnail deck: slot 0 is "next"; the card being consumed hands over to the zooming layer.
      const slotBox = slots.firstElementChild as HTMLElement
      const step = slots.children[1]
        ? (slots.children[1] as HTMLElement).offsetLeft - slotBox.offsetLeft
        : slotBox.offsetWidth
      thumbs.forEach((thumb, i) => {
        const s = ((((i - p) % N) + N) % N) - 1
        let opacity = 1
        if (s < -0.002) opacity = 0
        else if (s > N - 2) opacity = clamp01(1 - (s - (N - 2)))
        if (flying && i === k + 1) opacity = 0
        gsap.set(thumb, { x: Math.max(s, 0) * step, opacity })
        thumb.toggleAttribute('inert', opacity < 0.05)
      })

      // The zooming card: from slot 0's rectangle to the full stage.
      if (flying) {
        if (layerFor !== k + 1) {
          layerFor = k + 1
          layerImg.src = programs[k + 1].image
        }
        const sr = stage.getBoundingClientRect()
        const sc = sr.width / stage.offsetWidth || 1
        const br = slotBox.getBoundingClientRect()
        gsap.set(layer, {
          display: 'block',
          left: lerp((br.left - sr.left) / sc, 0, e),
          top: lerp((br.top - sr.top) / sc, 0, e),
          width: lerp(slotBox.offsetWidth, stage.offsetWidth, e),
          height: lerp(slotBox.offsetHeight, stage.offsetHeight, e),
          borderRadius: lerp(16, 0, e),
        })
        gsap.set(layerShade, { opacity: clamp01((t - 0.3) / 0.5) })
      } else {
        gsap.set(layer, { display: 'none' })
      }

      // Copy: old text leaves early, new text cascades in as the card lands.
      copies.forEach((copy, i) => {
        const focus = clamp01(1 - Math.abs(p - i) / 0.32)
        const items = reveals[i]
        items.forEach((el, idx) => {
          const local = clamp01(focus * (1 + items.length * 0.12) - idx * 0.12)
          if (el.dataset.reveal === 'line') gsap.set(el, { yPercent: (1 - local) * 112 })
          else gsap.set(el, { opacity: local, y: (1 - local) * 24 })
        })
        copy.style.visibility = focus > 0 ? 'visible' : 'hidden'
        copy.toggleAttribute('inert', i !== rounded)
      })

      fills.forEach((fill, i) => gsap.set(fill, { scaleX: clamp01(1 - Math.abs(i - p)) }))

      if (rounded !== current) {
        current = rounded
        setActive(rounded)
      }
    }

    const ctx = gsap.context(() => {
      apply(0)
      const sequence = gsap.to(state, {
        p: LAST,
        ease: 'none',
        onUpdate: () => apply(state.p),
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * LAST * 1.05)}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / LAST,
            duration: { min: 0.25, max: 0.7 },
            delay: 0.1,
            ease: 'power2.inOut',
          },
        },
      })
      triggerRef.current = sequence.scrollTrigger ?? null
    }, section)

    const onRefresh = () => apply(state.p)
    ScrollTrigger.addEventListener('refresh', onRefresh)

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      triggerRef.current = null
      ctx.revert()
      gsap.set([layer, layerShade, ...bgs, ...thumbs, ...fills, ...reveals.flat()], { clearProps: 'all' })
      copies.forEach((c) => {
        c.style.visibility = ''
        c.removeAttribute('inert')
      })
      thumbs.forEach((t) => t.removeAttribute('inert'))
    }
  }, [reduced])

  const goTo = useCallback((index: number) => {
    const st = triggerRef.current
    if (!st) return
    window.scrollTo({ top: st.start + (index / LAST) * (st.end - st.start), behavior: 'smooth' })
  }, [])

  const program = programs[active]

  return (
    <section ref={sectionRef} id="academy" aria-labelledby="academy-title" className="relative bg-surface">
      <div ref={pinRef} className="relative flex h-svh min-h-[36rem] flex-col overflow-hidden pt-[5.75rem] pb-4 sm:pt-[7rem]">
        <div className="container-x flex items-end justify-between gap-10">
          <SectionHeading id="academy-title" title="Build Your Future Through Our Programs" className="lg:max-w-xl" />
          <p className="t-body hidden max-w-sm text-ink/70 lg:block">
            Explore practical learning experiences that connect knowledge, professional skills, and career readiness.
          </p>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col sm:mt-5">
          <motion.div
            ref={stageRef}
            role="group"
            aria-roledescription="slide show"
            aria-label="Academy programs, scroll to move between them"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="on-dark relative flex min-h-0 flex-1 flex-col overflow-hidden bg-deep px-[var(--gx)] py-6 sm:py-9 lg:py-14"
          >
            {/* Base images — all rendered so swapping never flashes. */}
            {programs.map((p, i) => (
              <img
                key={p.id}
                ref={(el) => {
                  bgRefs.current[i] = el
                }}
                src={p.image}
                alt={i === active ? p.alt : ''}
                aria-hidden={i !== active}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className={`absolute inset-0 size-full object-cover will-change-transform ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div aria-hidden="true" className={`absolute inset-0 ${OVERLAY}`} />

            {/* The thumbnail card that zooms to fill the stage while you scroll. */}
            <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute z-[2] hidden overflow-hidden will-change-transform">
              <img ref={layerImgRef} alt="" draggable={false} className="size-full object-cover" />
              <div ref={layerShadeRef} className={`absolute inset-0 ${OVERLAY}`} />
            </div>

            {/* Copy for every program, stacked; scroll position decides which one is revealed. */}
            <div className="relative z-[3] grid max-w-xl lg:my-auto">
              {programs.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    copyRefs.current[i] = el
                  }}
                  className="col-start-1 row-start-1 flex flex-col items-start"
                >
                  <h3 className="t-display !text-white">
                    {p.title.split(' ').map((word) => (
                      <span key={word} className="block overflow-hidden pb-[0.1em]">
                        <span data-reveal="line" className="block">
                          {word}
                        </span>
                      </span>
                    ))}
                  </h3>

                  <p data-reveal="fade" className="t-lead mt-4 max-w-sm text-white/80">
                    {p.summary}
                  </p>

                  <ul data-reveal="fade" className="mt-5 hidden flex-wrap gap-2 sm:flex" aria-label={`${p.title} covers`}>
                    {p.items.map((item) => (
                      <li key={item} className="chip border-white/30 text-white/90">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div data-reveal="fade" className="mt-6 sm:mt-7">
                    <Button href={p.href} variant="inverse" aria-label={`Enquire about ${p.title}`}>
                      Enquire Now
                      <ArrowRight size={18} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Counter + thumbnail deck. */}
            <div className="relative z-[3] mt-auto flex items-end justify-between gap-4 pt-4 lg:static">
              <p
                className="text-2xl leading-none font-semibold whitespace-nowrap text-white tabular-nums sm:text-3xl lg:absolute lg:top-12 lg:right-[var(--gx)] lg:z-[3]"
                aria-hidden="true"
              >
                {pad(active + 1)}
                <span className="ml-1 text-base font-medium text-white/60">/ {pad(N)}</span>
              </p>

              <div className="relative [--tg:0.625rem] [--th:8.5rem] [--tw:5.6rem] sm:[--tg:0.875rem] sm:[--th:12rem] sm:[--tw:8.5rem] lg:absolute lg:right-[var(--gx)] lg:bottom-12 lg:z-[3] lg:[--th:14.5rem] lg:[--tw:10.5rem]">
                <div ref={slotsRef} className="flex gap-[var(--tg)]" aria-hidden="true">
                  {Array.from({ length: N - 1 }, (_, i) => (
                    <div key={i} className="h-[var(--th)] w-[var(--tw)] shrink-0" />
                  ))}
                </div>
                {programs.map((p, i) => (
                  <button
                    key={p.id}
                    ref={(el) => {
                      thumbRefs.current[i] = el
                    }}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to ${p.title}`}
                    className="absolute top-0 left-0 h-[var(--th)] w-[var(--tw)] cursor-pointer overflow-hidden rounded-card text-left ring-1 ring-white/30 transition-shadow duration-200 hover:ring-2 hover:ring-white"
                  >
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 size-full object-cover"
                    />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <span className="absolute inset-x-3 bottom-3 text-xs leading-snug font-medium text-white sm:text-sm">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              Program {active + 1} of {N}: {program.title}
            </p>
          </motion.div>

          <ol className="container-x mt-3 grid grid-cols-3 gap-3">
            {programs.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={active === i ? 'step' : undefined}
                  className="group block w-full text-left"
                >
                  <span className="relative block h-1 overflow-hidden rounded-full bg-tint">
                    <span
                      ref={(el) => {
                        fillRefs.current[i] = el
                      }}
                      className="absolute inset-0 origin-left scale-x-0 rounded-full bg-deep"
                    />
                  </span>
                  <span
                    className={`t-label mt-2 flex items-center gap-2 transition-colors duration-200 ${active === i ? 'text-ink' : 'text-ink/60 group-hover:text-ink'}`}
                  >
                    <span className="sm:hidden">{pad(i + 1)}</span>
                    <span className="hidden sm:inline">{p.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
