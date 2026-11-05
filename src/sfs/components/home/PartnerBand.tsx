import { links } from '../../config'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SmartLink } from '../ui/SmartLink'

/** Closing call to action: words and two actions, nothing else. */
export function PartnerBand() {
  return (
    <section id="partner" aria-labelledby="partner-title" className="section bg-surface">
      <Reveal className="container-x grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h2 id="partner-title" className="t-title">
            Build Something Meaningful With Us
          </h2>
          <p className="t-lead mt-7 max-w-xl text-ink/70">
            Partner with STEM Society to strengthen STEM education, support future innovators, and create opportunities that
            connect learning with industry.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-5 lg:justify-end">
          <Button href={links.partner}>Partner With Us</Button>
          <SmartLink
            href={links.partner}
            className="t-label text-deep underline decoration-tint decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-deep"
          >
            Explore Partnership Opportunities
          </SmartLink>
        </div>
      </Reveal>
    </section>
  )
}
