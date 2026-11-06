import { trustedPartners, trustedPartnersIntro } from '../../data/partnerPage'
import { Reveal } from '../ui/Reveal'

/** Logos already published on the STEM for Society site. On narrow screens the row scrolls sideways instead of shrinking the logos. */
export function TrustedPartners() {
  return (
    <section aria-labelledby="trusted-title" className="section bg-white">
      <div className="container-x">
        <Reveal>
          <h2 id="trusted-title" className="t-title text-center">
            {trustedPartnersIntro.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <ul
            tabIndex={0}
            aria-label="Partner logos"
            className="mt-10 flex snap-x list-none items-center gap-0 overflow-x-auto rounded-panel border border-tint/80 bg-white p-0 shadow-raised [scrollbar-width:thin] md:justify-between md:overflow-visible"
          >
            {trustedPartners.map((p, i) => (
              <li
                key={p.name}
                className={`grid h-28 min-w-[11rem] flex-1 shrink-0 snap-center place-items-center px-6 md:min-w-0 ${i > 0 ? 'border-l border-tint/80' : ''}`}
              >
                <img src={p.logo} alt={p.name} loading="lazy" decoding="async" draggable={false} className="max-h-14 w-auto max-w-full object-contain" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
