import { ArrowRight, CalendarBlank, ChartBar, Check, ListChecks } from '@phosphor-icons/react'
import type { TrainingPlan } from '../../data/trainingPlans'
import { cardLayoutId } from '../../lib/layoutIds'
import { Button } from '../ui/Button'
import { ModalContent, ModalFrame, ModalPanel } from '../ui/Modal'

/** Full detail for one plan: the same content as the card, larger, with a way to enquire about exactly this plan. */
export function TrainingPlanModal({ plan: p, onClose, onInquire }: { plan: TrainingPlan; onClose: () => void; onInquire: () => void }) {
  const Icon = p.icon
  const facts = [
    { icon: ListChecks, label: 'Skills', value: `${p.skills.length} Skills` },
    { icon: CalendarBlank, label: 'Duration', value: p.duration },
    { icon: ChartBar, label: 'Level', value: p.level },
  ]
  return (
    <ModalFrame onClose={onClose}>
      <ModalPanel title={`${p.category}: ${p.title}`} onClose={onClose} layoutId={cardLayoutId(p.id)} wide>
        <div className="aspect-[16/7] overflow-hidden">
          <img src={p.image} alt={p.alt} className="size-full object-cover" />
        </div>

        <ModalContent className="p-8 sm:p-10">
          <div style={{ '--plan-main': p.accent.main, '--plan-soft': p.accent.soft, '--plan-text': p.accent.text } as React.CSSProperties}>
            <p className="t-label flex items-center gap-2 text-[var(--plan-text)]">
              <span className="grid size-9 place-items-center rounded-full bg-[var(--plan-soft)] text-[var(--plan-main)]">
                <Icon size={20} weight="fill" aria-hidden="true" />
              </span>
              {p.category}
            </p>
            <p aria-hidden="true" className="t-title mt-3">
              {p.title}
            </p>
            <p className="t-body mt-1 font-medium text-[var(--plan-text)]">{p.subtitle}</p>
            <p className="t-lead mt-3 text-ink/70">{p.description}</p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="flex items-center gap-3 rounded-card bg-[var(--plan-soft)] p-4 text-[var(--plan-text)]">
                  <f.icon size={22} aria-hidden="true" />
                  <div>
                    <dt className="t-small opacity-80">{f.label}</dt>
                    <dd className="t-label">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <h3 className="t-heading mt-8">What this plan covers</h3>
            <ul className="mt-3 grid gap-3 p-0 sm:grid-cols-2">
              {p.skills.map((s) => (
                <li key={s} className="t-body flex list-none items-start gap-2.5 text-ink/80">
                  <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-[var(--plan-main)]" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <Button onClick={onInquire}>
              Enquire about this plan
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </ModalContent>
      </ModalPanel>
    </ModalFrame>
  )
}
