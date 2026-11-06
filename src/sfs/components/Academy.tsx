import { ArrowRight, Check } from '@phosphor-icons/react'
import { motion, MotionConfig } from 'framer-motion'
import { programs, type Program } from '../data/content'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const ease = [0.16, 1, 0.3, 1] as const
const pad = (n: number) => String(n).padStart(2, '0')

/** One programme: a picture and its story, side by side. The picture sits on the right in every second section. */
function ProgramSection({ p, index }: { p: Program; index: number }) {
  const flip = index % 2 === 1
  const tone = index % 2 === 0 ? 'bg-white' : 'bg-surface'
  return (
    <section id={p.id} aria-labelledby={`${p.id}-title`} className={`section ${tone}`}>
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.9, ease }}
          className={flip ? 'lg:order-2' : ''}
        >
          <div className="group relative">
            <span aria-hidden="true" className={`absolute inset-0 rounded-panel border-2 border-tint ${flip ? '-translate-x-4 translate-y-4' : 'translate-x-4 translate-y-4'}`} />
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-surface shadow-raised">
              <img
                src={p.image}
                alt={p.alt}
                width={1400}
                height={933}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>
          </div>
        </motion.div>

        <div>
          <Reveal>
            <p className="text-[3.5rem] leading-none font-semibold text-tint tabular-nums" aria-hidden="true">
              {pad(index + 1)}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 id={`${p.id}-title`} className="t-title !mt-3">
              {p.title}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lead !mt-4 max-w-md text-ink/70">{p.summary}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-6 grid max-w-xl gap-x-6 gap-y-3 p-0 sm:grid-cols-2" aria-label={`${p.title} covers`}>
              {p.items.map((item) => (
                <li key={item} className="t-body flex list-none items-start gap-2.5 text-ink/80">
                  <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <Button href={p.href} aria-label={`Enquire about ${p.title}`}>
              Enquire Now
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Our Academy: an opening line, then one calm section for each of the three programmes. */
export function Academy() {
  return (
    <MotionConfig reducedMotion="user">
      <div id="academy">
        <section aria-labelledby="academy-title" className="section bg-surface !pb-6 sm:!pb-8">
          <div className="container-x flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <SectionHeading id="academy-title" title="Build Your Future Through Our Programs" className="lg:max-w-xl" />
            <Reveal delay={0.1}>
              <p className="t-body max-w-sm text-ink/70">
                Explore practical learning experiences that connect knowledge, professional skills, and career readiness.
              </p>
            </Reveal>
          </div>
        </section>

        {programs.map((p, i) => (
          <ProgramSection key={p.id} p={p} index={i} />
        ))}
      </div>
    </MotionConfig>
  )
}
