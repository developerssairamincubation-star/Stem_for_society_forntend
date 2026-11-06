import { registerIntro } from '../../data/partnerPage'
import { Reveal } from '../ui/Reveal'
import { OrganisationForm } from './OrganisationForm'
import { Pill } from './Pill'

interface Props {
  type: string
  onTypeChange: (type: string) => void
  interest: string
  onInterestChange: (interest: string) => void
}

const PHOTO_FADE = {
  WebkitMaskImage: 'linear-gradient(to top, #000 62%, transparent 100%)',
  maskImage: 'linear-gradient(to top, #000 62%, transparent 100%)',
} as React.CSSProperties

export function RegisterSection({ type, onTypeChange, interest, onInterestChange }: Props) {
  return (
    <section id="register" aria-labelledby="register-title" className="scroll-mt-24 py-10 focus:outline-none sm:py-14">
      <div className="container-x">
        <Reveal className="relative isolate grid overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-white via-surface to-tint/70 shadow-[0_30px_70px_-30px_rgb(0_84_159/0.4)] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative flex min-h-[34rem] flex-col p-8 sm:p-10 lg:min-h-[36rem] lg:p-12">
            <Pill>{registerIntro.label}</Pill>
            <h2 id="register-title" className="!mt-5 text-[2.25rem] leading-[1.08] !font-bold tracking-[-0.02em] text-ink sm:text-[3rem]">
              {registerIntro.title}
            </h2>
            <p className="t-body !mt-5 max-w-sm text-ink/80">
              {registerIntro.lead} {registerIntro.description}
            </p>
            <p className="t-lead !mt-8 max-w-[14rem] -rotate-6 text-[1.5rem] leading-tight !font-medium italic text-deep">
              {registerIntro.message}
              <span aria-hidden="true" className="mt-2 block h-1 w-28 rounded-full bg-brand/70" />
            </p>

            <img
              src={registerIntro.image}
              alt={registerIntro.alt}
              loading="lazy"
              decoding="async"
              width={1472}
              height={1069}
              style={PHOTO_FADE}
              className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[48%] w-full object-cover object-[50%_75%]"
            />
          </div>

          <div className="m-4 rounded-[2rem] bg-white p-6 shadow-overlay sm:m-6 sm:p-8 lg:m-8">
            <OrganisationForm type={type} onTypeChange={onTypeChange} interest={interest} onInterestChange={onInterestChange} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
