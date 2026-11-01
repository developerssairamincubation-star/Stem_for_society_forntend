import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { institutionProgrammes, programmesIntro, type InstitutionProgramme } from '../../data/institutions'
import { cardLayoutId } from '../../lib/layoutIds'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

function ProgrammeCard({ p, onOpen }: { p: InstitutionProgramme; onOpen: () => void }) {
  const Icon = p.icon
  return (
    <motion.article layoutId={cardLayoutId(p.id)} style={{ borderRadius: 16 }} className="flex h-full flex-col overflow-hidden bg-white">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={p.image} alt={p.alt} loading="lazy" draggable={false} className="size-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="t-label flex items-center gap-2 text-deep">
          <Icon size={22} className="text-brand" aria-hidden="true" />
          {p.category}
        </p>
        <h3 className="t-heading mt-3">{p.title}</h3>
        <p className="t-body mt-2 text-ink/70">{p.description}</p>

        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          aria-label={`View details: ${p.title}`}
          className="t-label mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-deep underline decoration-tint decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-deep"
        >
          View details
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  )
}

export function ProgrammesSection({ onOpen }: { onOpen: (p: InstitutionProgramme) => void }) {
  return (
    <section id="modules" aria-labelledby="modules-title" className="section on-dark bg-deep">
      <div className="container-x">
        <SectionHeading id="modules-title" tone="dark" title={programmesIntro.title} className="section-head" />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {institutionProgrammes.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 3) * 0.06} className="h-full">
              <ProgrammeCard p={p} onOpen={() => onOpen(p)} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
