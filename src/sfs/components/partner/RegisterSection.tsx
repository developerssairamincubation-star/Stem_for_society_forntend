import { registerIntro } from '../../data/partnerPage'
import { Reveal } from '../ui/Reveal'
import { OrganisationForm } from './OrganisationForm'

export function RegisterSection({ type, onTypeChange }: { type: string; onTypeChange: (type: string) => void }) {
  return (
    <section id="register" aria-labelledby="register-title" className="section scroll-mt-24 bg-surface focus:outline-none">
      <div className="container-x grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <Reveal className="relative isolate flex min-h-[28rem] flex-col justify-between overflow-hidden rounded-panel bg-deep p-8 text-white sm:p-10 lg:min-h-0">
          <div className="on-dark">
            <p className="t-label text-tint">{registerIntro.label}</p>
            <h2 id="register-title" className="t-title mt-3 !text-white">
              {registerIntro.title}
            </h2>
            <p className="t-lead mt-4 font-medium text-white">{registerIntro.lead}</p>
            <p className="t-body mt-2 max-w-md text-white/80">{registerIntro.description}</p>
          </div>

          <div className="relative mt-10 min-h-[15rem] flex-1 overflow-hidden rounded-card">
            <img src={registerIntro.image} alt={registerIntro.alt} loading="lazy" decoding="async" width={1472} height={1069} className="absolute inset-0 size-full object-cover object-[50%_70%]" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-transparent" />
            <p className="t-heading absolute inset-x-0 bottom-0 p-5 text-white">{registerIntro.message}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="rounded-panel bg-white p-6 shadow-raised sm:p-8 lg:p-10">
          <OrganisationForm type={type} onTypeChange={onTypeChange} />
        </Reveal>
      </div>
    </section>
  )
}
