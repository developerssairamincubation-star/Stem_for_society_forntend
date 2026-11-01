import { ArrowUpRight } from '@phosphor-icons/react'
import { links } from '../config'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { SmartLink } from './ui/SmartLink'

export function PartnerCTA() {
  return (
    <section id="partner" aria-labelledby="partner-title" className="section bg-surface">
      <div className="container-x">
        <div className="grid items-center gap-10 rounded-panel border border-tint bg-white lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="panel-pad">
            <Reveal>
              <h2 id="partner-title" className="t-title">
                Build Something Meaningful With Us
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="t-lead mt-4 max-w-xl text-ink/70">
                Partner with STEM Society to strengthen STEM education, support future innovators, and create opportunities
                that connect learning with industry.
              </p>
            </Reveal>
            <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={links.partner}>Partner With Us</Button>
              <SmartLink
                href={links.partner}
                className="t-label inline-flex items-center gap-1.5 text-deep underline decoration-tint decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-deep"
              >
                Explore Partnership Opportunities
                <ArrowUpRight size={18} aria-hidden="true" />
              </SmartLink>
            </Reveal>
          </div>

          <div className="px-8 pb-8 lg:p-8 lg:pl-0">
            <img
              src="/illustrations/team.svg"
              alt="A group of four people talking together"
              loading="lazy"
              width={900}
              height={560}
              className="mx-auto h-auto w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
