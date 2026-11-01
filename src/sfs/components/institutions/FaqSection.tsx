import { Minus, Plus } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import { contact } from '../../data/content'
import { faqIntro, faqs } from '../../data/institutions'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()

  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-white">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading id="faq-title" title={faqIntro.title} />
          <Reveal delay={0.1} className="mt-8">
            <Button href={`mailto:${contact.email}?subject=${encodeURIComponent('Institution enquiry')}`} variant="secondary">
              Contact Support
            </Button>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 hidden lg:block">
            <img src="/illustrations/faq.svg" alt="A person presenting a large question mark" loading="lazy" width={640} height={533} className="h-auto w-full max-w-sm" />
          </Reveal>
        </div>

        <ul className="space-y-3 p-0">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal as="li" key={f.q} delay={i * 0.05} className="list-none">
                <div className={`card transition-colors duration-200 ${isOpen ? '!border-deep' : ''}`}>
                  <h3>
                    <button
                      type="button"
                      id={`${base}-q${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`${base}-a${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="t-body flex min-h-14 w-full items-center justify-between gap-4 rounded-card px-6 py-3 text-left font-medium"
                    >
                      {f.q}
                      {isOpen ? (
                        <Minus size={20} className="shrink-0 text-deep" aria-hidden="true" />
                      ) : (
                        <Plus size={20} className="shrink-0 text-deep" aria-hidden="true" />
                      )}
                    </button>
                  </h3>
                  <div
                    id={`${base}-a${i}`}
                    role="region"
                    aria-labelledby={`${base}-q${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="t-body px-6 pb-6 text-ink/70">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
