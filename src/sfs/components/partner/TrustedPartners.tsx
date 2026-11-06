import { trustedPartners, trustedPartnersIntro } from '../../data/partnerPage'
import { Reveal } from '../ui/Reveal'

/** Logos already published on the STEM for Society site. On narrow screens the row scrolls sideways instead of shrinking the logos. */
export function TrustedPartners() {
  return (
    <section aria-labelledby="trusted-title" className="border-t border-dashed border-tint/80 py-20 sm:py-24">
      <div className="container-x">
        <Reveal x={-16}>
          <h2 id="trusted-title" className="text-[1.625rem] leading-tight !font-medium tracking-[-0.01em] text-[#0b2545]">
            {trustedPartnersIntro.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <ul
            tabIndex={0}
            aria-label="Partner logos"
            className="mt-10 flex snap-x list-none items-center overflow-x-auto p-0 [scrollbar-width:thin] md:justify-between md:overflow-visible"
          >
            {trustedPartners.map((p, i) => (
              <li key={p.name} className={`grid h-24 min-w-[10.5rem] flex-1 shrink-0 snap-center place-items-center px-6 md:min-w-0 ${i > 0 ? 'border-l border-dashed border-tint/80' : ''}`}>
                <img src={p.logo} alt={p.name} loading="lazy" decoding="async" draggable={false} className="max-h-14 w-auto max-w-full object-contain opacity-90 transition-opacity duration-200 hover:opacity-100" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
