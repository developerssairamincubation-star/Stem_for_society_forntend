import { trustedPartners, trustedPartnersIntro } from '../../data/partnerPage'
import { Reveal } from '../ui/Reveal'

/** Logos already published on the STEM for Society site. On narrow screens the row scrolls sideways instead of shrinking the logos. */
export function TrustedPartners() {
  return (
    <section aria-labelledby="trusted-title" className="py-12 sm:py-16">
      <div className="container-x">
        <Reveal x={-16}>
          <h2 id="trusted-title" className="text-[1.0625rem] leading-tight !font-semibold text-ink">
            {trustedPartnersIntro.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <ul
            tabIndex={0}
            aria-label="Partner logos"
            className="mt-5 flex snap-x list-none items-center overflow-x-auto rounded-[2rem] border border-white bg-white/80 p-3 shadow-[0_18px_40px_-24px_rgb(0_84_159/0.4)] backdrop-blur [scrollbar-width:thin] md:justify-between md:overflow-visible"
          >
            {trustedPartners.map((p, i) => (
              <li key={p.name} className={`grid h-24 min-w-[10.5rem] flex-1 shrink-0 snap-center place-items-center px-6 md:min-w-0 ${i > 0 ? 'border-l border-tint' : ''}`}>
                <img src={p.logo} alt={p.name} loading="lazy" decoding="async" draggable={false} className="max-h-14 w-auto max-w-full object-contain" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
