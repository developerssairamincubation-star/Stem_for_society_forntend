import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, type KeyboardEvent } from 'react'
import { programs } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SmartLink } from '../ui/SmartLink'

/**
 * Programmes as one explorer instead of a scroll-hijacked slideshow: pick a programme on the left, read it on the right.
 * The picture swaps only in response to the visitor's choice.
 */
export function ProgrammeExplorer() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const current = programs[active]

  const move = (to: number) => {
    const i = (to + programs.length) % programs.length
    setActive(i)
    tabs.current[i]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const target =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? active + 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? active - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? programs.length - 1
              : null
    if (target === null) return
    e.preventDefault()
    move(target)
  }

  return (
    <section id="academy" aria-labelledby="academy-title" className="section bg-white">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="academy-title" className="t-title lg:col-span-7">
            Build Your Future Through Our Programs
          </h2>
          <p className="t-lead text-ink/70 lg:col-span-5">
            Explore practical learning experiences that connect knowledge, professional skills, and career readiness.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div role="tablist" aria-label="Programmes" aria-orientation="vertical" className="border-t border-ink/10 lg:col-span-5" onKeyDown={onKey}>
            {programs.map((p, i) => {
              const on = i === active
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  role="tab"
                  id={`prog-tab-${p.id}`}
                  type="button"
                  aria-selected={on}
                  aria-controls="prog-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={(e) => e.nativeEvent instanceof MouseEvent && setActive(i)}
                  className={`relative block w-full border-b border-ink/10 py-6 pl-6 text-left transition-colors duration-200 ${
                    on ? 'text-ink' : 'text-ink/55 hover:text-ink'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-[3px] transition-colors duration-200 ${on ? 'bg-brand' : 'bg-transparent'}`}
                  />
                  <span className={`t-heading block ${on ? 'text-deep' : ''}`}>{p.title}</span>
                  <span className="t-body mt-1.5 block max-w-md text-ink/70">{p.summary}</span>
                </button>
              )
            })}
          </div>

          <div id="prog-panel" role="tabpanel" aria-labelledby={`prog-tab-${current.id}`} className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-surface">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.id}
                  src={current.image}
                  alt={current.alt}
                  width={1400}
                  height={933}
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
              <ul aria-label={`${current.title} covers`} className="grid gap-x-8 sm:grid-cols-2">
                {current.items.map((item) => (
                  <li key={item} className="t-body list-none border-t border-ink/10 py-2.5 text-ink">
                    {item}
                  </li>
                ))}
              </ul>
              <SmartLink
                href={current.href}
                aria-label={`Enquire about ${current.title}`}
                className="t-label whitespace-nowrap text-deep underline decoration-tint decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-deep"
              >
                Enquire Now
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
