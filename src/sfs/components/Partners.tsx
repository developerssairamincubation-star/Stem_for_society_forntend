import { partners } from '../data/content'
import { SectionHeading } from './ui/SectionHeading'

/** One continuous row of logos that drifts left; the list is rendered twice so the loop is seamless. */
export function Partners() {
  return (
    <section id="partners" aria-labelledby="partners-title" className="section bg-white">
      <div className="container-x">
        <SectionHeading
          id="partners-title"
          align="center"
          title="Trusted by Leading Organizations"
          description="We collaborate with educational institutions and industry leaders to create meaningful learning experiences and career opportunities."
          className="section-head"
        />
      </div>

      <div className="marquee" role="group" aria-label="Partner logos">
        <ul className="marquee-track">
          {[0, 1].map((copy) =>
            partners.map((p) => (
              <li key={`${copy}-${p.name}`} className="marquee-item" aria-hidden={copy === 1 ? true : undefined}>
                <img
                  src={p.logo}
                  alt={copy === 1 ? '' : p.name}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-auto max-w-40 object-contain"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  )
}
