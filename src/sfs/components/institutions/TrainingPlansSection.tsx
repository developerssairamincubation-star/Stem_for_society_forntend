import { ArrowRight, CalendarBlank, ChartBar, Check, ListChecks } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { links } from '../../config'
import { trainingPlans, trainingPlansIntro, type TrainingPlan } from '../../data/trainingPlans'
import { cardLayoutId } from '../../lib/layoutIds'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

const accentStyle = (p: TrainingPlan) =>
  ({ '--plan-main': p.accent.main, '--plan-soft': p.accent.soft, '--plan-text': p.accent.text }) as React.CSSProperties

function PlanCard({ p, onOpen }: { p: TrainingPlan; onOpen: () => void }) {
  const Icon = p.icon
  return (
    <motion.article
      layoutId={cardLayoutId(p.id)}
      style={{ ...accentStyle(p), borderRadius: 24 }}
      className="group flex h-full flex-col overflow-hidden border border-tint/80 bg-white shadow-raised transition-shadow duration-300 hover:shadow-overlay"
    >
      <div className="relative">
        <div className="aspect-[16/10] overflow-hidden bg-surface">
          <img
            src={p.image}
            alt={p.alt}
            loading="lazy"
            decoding="async"
            width={900}
            height={563}
            draggable={false}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute -bottom-6 left-6 grid size-12 place-items-center rounded-full bg-[var(--plan-soft)] text-[var(--plan-main)] shadow-raised ring-4 ring-white"
        >
          <Icon size={24} weight="fill" />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-10 pb-6">
        <p className="t-label text-[var(--plan-text)]">{p.category}</p>
        <h3 className="t-heading !mt-1">{p.title}</h3>
        <p className="t-small !mt-0.5 font-medium text-[var(--plan-text)]">{p.subtitle}</p>
        <p className="t-small !mt-3 text-ink/70">{p.description}</p>

        <ul className="mt-5 grid gap-2 p-0" aria-label={`${p.title} skills`}>
          {p.skills.map((s) => (
            <li key={s} className="t-small flex list-none items-start gap-2.5">
              <Check size={16} weight="bold" className="mt-1 shrink-0 text-[var(--plan-main)]" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <dl className="grid grid-cols-3 gap-2 rounded-card bg-[var(--plan-soft)] p-3 text-center">
            <div>
              <dt className="sr-only">Skills</dt>
              <dd className="t-small flex flex-col items-center gap-1 font-medium text-[var(--plan-text)]">
                <ListChecks size={18} aria-hidden="true" />
                {p.skills.length} Skills
              </dd>
            </div>
            <div>
              <dt className="sr-only">Duration</dt>
              <dd className="t-small flex flex-col items-center gap-1 font-medium text-[var(--plan-text)]">
                <CalendarBlank size={18} aria-hidden="true" />
                {p.duration}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Level</dt>
              <dd className="t-small flex flex-col items-center gap-1 font-medium text-[var(--plan-text)]">
                <ChartBar size={18} aria-hidden="true" />
                {p.level}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            aria-label={`View details: ${p.category}, ${p.title}`}
            className="t-label mt-5 inline-flex items-center gap-3 text-[var(--plan-text)]"
          >
            <span className="grid size-11 place-items-center rounded-full bg-[var(--plan-main)] text-white transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
              <ArrowRight size={20} aria-hidden="true" />
            </span>
            View plan
          </button>
        </div>
      </div>
    </motion.article>
  )
}

interface Props {
  onOpen: (p: TrainingPlan) => void
  /** Used when no curriculum document is configured: opens the enquiry form so the curriculum can be requested. */
  onRequestCurriculum: () => void
}

export function TrainingPlansSection({ onOpen, onRequestCurriculum }: Props) {
  const curriculum = links.curriculum
  return (
    <section id="plans" aria-labelledby="plans-title" className="section bg-surface">
      <div className="container-x">
        <div className="section-head flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Reveal>
              <p className="t-label text-deep">{trainingPlansIntro.label}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="plans-title" className="t-title !mt-3">
                {trainingPlansIntro.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-lead !mt-4 text-ink/70">{trainingPlansIntro.description}</p>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="shrink-0">
            {curriculum ? (
              <Button href={curriculum} variant="secondary" className="nudge">
                Download Detailed Curriculum
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            ) : (
              <Button onClick={onRequestCurriculum} variant="secondary" className="nudge">
                Request Detailed Curriculum
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            )}
          </Reveal>
        </div>

        <ul className="grid gap-6 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {trainingPlans.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 4) * 0.07} className="h-full list-none">
              <PlanCard p={p} onOpen={() => onOpen(p)} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
