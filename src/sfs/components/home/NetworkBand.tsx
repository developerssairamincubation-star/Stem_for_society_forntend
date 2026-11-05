import { ArrowSquareOut } from '@phosphor-icons/react'
import { links } from '../../config'
import { networkHighlights } from '../../data/content'
import { Button } from '../ui/Button'

/** Networking Beyond Campus: the one full-colour band on the page; the photo bleeds to the edge. */
export function NetworkBand() {
  return (
    <section id="network" aria-labelledby="network-title" className="on-dark relative bg-deep text-white">
      <div className="container-x grid lg:grid-cols-2">
        <div className="py-16 sm:py-20 lg:py-28 lg:pr-16">
          <h2 id="network-title" className="t-title !text-white max-w-[16ch]">
            Your Network. Your Next Opportunity.
          </h2>
          <p className="t-lead mt-8 max-w-lg text-white/85">
            Networking Beyond Campus brings students together with mentors, peers, and industry leaders in curated rooms
            and unfiltered conversations that catalyze careers.
          </p>
          <ul className="mt-8 grid gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
            {networkHighlights.map(({ icon: Icon, label }) => (
              <li key={label} className="t-body flex list-none items-center gap-3">
                <Icon size={22} className="shrink-0 text-tint" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={links.network} variant="inverse">
              Explore Network Beyond Campus
              <ArrowSquareOut size={18} aria-hidden="true" />
              <span className="sr-only">(opens a separate website)</span>
            </Button>
          </div>
        </div>
      </div>
      <img
        src="/images/network.jpg"
        alt="A professional working on a laptop beside a glass wall reflecting blue-lit server racks"
        width={1600}
        height={1068}
        loading="lazy"
        className="h-72 w-full object-cover object-[62%_center] sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2"
      />
    </section>
  )
}
