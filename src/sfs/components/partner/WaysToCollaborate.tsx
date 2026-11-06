import { CaretRight } from '@phosphor-icons/react'
import { collaborationInterests } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'
import { Reveal } from '../ui/Reveal'

/** The collaboration areas already offered in the registration form, shown as a list. Choosing one fills that field in the form. */
export function WaysToCollaborate({ onChoose }: { onChoose: (interest: string) => void }) {
  return (
    <section id="ways" aria-labelledby="ways-title" className="scroll-mt-24 border-t border-dashed border-tint/80 py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal x={-16}>
            <p className="t-label text-deep">Ways to collaborate</p>
          </Reveal>
          <Reveal x={-16} delay={0.06}>
            <h2 id="ways-title" className="!mt-4 text-[2rem] leading-[1.15] !font-medium tracking-[-0.02em] text-[#0b2545] sm:text-[2.375rem]">
              Choose where you would like to contribute
            </h2>
          </Reveal>
          <Reveal x={-16} delay={0.12}>
            <p className="t-lead !mt-5 text-ink/70">Select an area and it is filled in for you on the registration form.</p>
          </Reveal>
        </div>

        <ul className="grid gap-x-10 p-0 sm:grid-cols-2">
          {collaborationInterests.map((interest, i) => (
            <Reveal as="li" key={interest} x={16} delay={(i % 2) * 0.05} className="list-none">
              <button
                type="button"
                onClick={() => {
                  onChoose(interest)
                  scrollToId('register')
                }}
                className="group flex w-full items-center justify-between gap-4 border-b border-tint/80 py-5 text-left transition-colors duration-200 hover:border-deep"
              >
                <span className="t-body font-medium text-[#0b2545]">{interest}</span>
                <CaretRight size={18} aria-hidden="true" className="shrink-0 text-deep transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
