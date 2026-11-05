import { stats } from '../../data/content'

/** The platform's own headline figures: quiet, left-aligned, no decoration. */
export function ProofStrip() {
  return (
    <section aria-label="SFS in numbers" className="border-b border-ink/10 bg-white">
      <dl className="container-x grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-6 py-6 sm:block sm:px-8 sm:py-10 sm:first:pl-0">
            <dd className="order-2 text-[2rem] leading-none font-semibold tracking-tight text-deep tabular-nums sm:order-none sm:text-5xl">
              {s.value}
            </dd>
            <dt className="t-small text-ink/70 sm:mt-3">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
