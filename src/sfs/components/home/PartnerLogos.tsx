import { partners } from '../../data/content'
import { Reveal } from '../ui/Reveal'

/** Still logo wall: every logo sits in the same box and is shown in one tone, so none outweighs another. */
export function PartnerLogos() {
  return (
    <section id="partners" aria-labelledby="partners-title" className="section bg-white">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="partners-title" className="t-title lg:col-span-7">
            Trusted by Leading Organizations
          </h2>
          <p className="t-lead text-ink/70 lg:col-span-5">
            We collaborate with educational institutions and industry leaders to create meaningful learning experiences and
            career opportunities.
          </p>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 p-0 sm:grid-cols-4 lg:mt-16">
          {partners.map((p) => (
            <li key={p.name} className="flex h-14 list-none items-center justify-center">
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="max-h-full max-w-full object-contain opacity-70 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
