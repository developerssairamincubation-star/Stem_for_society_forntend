import { ArrowRight, Check } from '@phosphor-icons/react'
import type { InstitutionProgramme } from '../../data/institutions'
import { cardLayoutId } from '../../lib/layoutIds'
import { Button } from '../ui/Button'
import { ModalContent, ModalFrame, ModalPanel } from '../ui/Modal'

export function ProgrammeModal({
  programme: p,
  onClose,
  onInquire,
}: {
  programme: InstitutionProgramme
  onClose: () => void
  onInquire: () => void
}) {
  const Icon = p.icon
  return (
    <ModalFrame onClose={onClose}>
      <ModalPanel title={p.title} onClose={onClose} layoutId={cardLayoutId(p.id)} wide>
        <div className="aspect-[16/7] overflow-hidden">
          <img src={p.image} alt={p.alt} className="size-full object-cover" />
        </div>

        <ModalContent className="p-8 sm:p-10">
          <p className="t-label flex items-center gap-2 text-deep">
            <Icon size={22} className="text-brand" aria-hidden="true" />
            {p.category}
          </p>
          <p aria-hidden="true" className="t-title mt-3">
            {p.title}
          </p>
          <p className="t-lead mt-3 text-ink/70">{p.description}</p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <section aria-labelledby={`${p.id}-modules`}>
              <h3 id={`${p.id}-modules`} className="t-heading">
                Key Modules
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2 p-0">
                {p.modules.map((m) => (
                  <li key={m} className="chip list-none">
                    {m}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby={`${p.id}-gains`}>
              <h3 id={`${p.id}-gains`} className="t-heading">
                What Students Gain
              </h3>
              <ul className="mt-3 space-y-3 p-0">
                {p.gains.map((g) => (
                  <li key={g} className="t-body flex list-none items-start gap-2.5 text-ink/70">
                    <Check size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-10">
            <Button onClick={onInquire}>
              Inquire Now
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </ModalContent>
      </ModalPanel>
    </ModalFrame>
  )
}
