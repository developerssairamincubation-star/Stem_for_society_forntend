import { registerIntro } from '../../data/partnerPage'
import { Reveal } from '../ui/Reveal'
import { OrganisationForm } from './OrganisationForm'

interface Props {
  type: string
  onTypeChange: (type: string) => void
  interest: string
  onInterestChange: (interest: string) => void
}

export function RegisterSection({ type, onTypeChange, interest, onInterestChange }: Props) {
  return (
    <section id="register" aria-labelledby="register-title" className="scroll-mt-24 border-t border-dashed border-tint/80 py-20 focus:outline-none sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal x={-16}>
            <p className="t-label text-deep">{registerIntro.label}</p>
          </Reveal>
          <Reveal x={-16} delay={0.06}>
            <h2 id="register-title" className="!mt-4 text-[2rem] leading-[1.15] !font-medium tracking-[-0.02em] text-[#0b2545] sm:text-[2.375rem]">
              {registerIntro.title}
            </h2>
          </Reveal>
          <Reveal x={-16} delay={0.12}>
            <p className="t-lead !mt-5 font-medium text-[#0b2545]">{registerIntro.lead}</p>
            <p className="t-body !mt-2 max-w-md text-ink/70">{registerIntro.description}</p>
          </Reveal>

          <Reveal x={-16} delay={0.18} className="relative mt-10 overflow-hidden rounded-panel shadow-raised">
            <img src={registerIntro.image} alt={registerIntro.alt} loading="lazy" decoding="async" width={1472} height={1069} className="aspect-[16/10] w-full object-cover object-[50%_70%]" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/25 to-transparent" />
            <p className="t-heading absolute inset-x-0 bottom-0 p-6 text-white">{registerIntro.message}</p>
          </Reveal>
        </div>

        <Reveal x={20} delay={0.08} className="rounded-panel border border-tint/70 bg-white p-6 shadow-[0_30px_60px_-12px_rgb(0_84_159/0.22),0_18px_36px_-18px_rgb(17_24_39/0.2)] sm:p-8 lg:p-10">
          <OrganisationForm type={type} onTypeChange={onTypeChange} interest={interest} onInterestChange={onInterestChange} />
        </Reveal>
      </div>
    </section>
  )
}
