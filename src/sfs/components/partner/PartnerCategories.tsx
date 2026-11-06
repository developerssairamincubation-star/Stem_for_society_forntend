import { ArrowRight } from '@phosphor-icons/react'
import { partnerCategories, partnerCategoriesIntro } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'
import { Reveal } from '../ui/Reveal'
import { Pill } from './Pill'

/** The photograph melts into the card from below, as on the reference. */
const PHOTO_FADE = {
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 38%)',
  maskImage: 'linear-gradient(to bottom, transparent 0%, #000 38%)',
} as React.CSSProperties

export function PartnerCategories({ onChoose }: { onChoose: (type: string) => void }) {
  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-24 py-14 sm:py-20">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,3.1fr)] lg:gap-8">
        <div className="lg:pt-6">
          <Reveal x={-16}>
            <Pill>{partnerCategoriesIntro.label}</Pill>
          </Reveal>
          <Reveal x={-16} delay={0.06}>
            <h2 id="categories-title" className="!mt-5 text-[2.25rem] leading-[1.08] !font-bold tracking-[-0.02em] text-ink sm:text-[2.75rem]">
              {partnerCategoriesIntro.title}
            </h2>
          </Reveal>
          <Reveal x={-16} delay={0.12}>
            <p className="t-small !mt-6 text-ink/75">{partnerCategoriesIntro.description}</p>
            <span aria-hidden="true" className="mt-6 block h-0.5 w-20 rounded-full bg-brand" />
          </Reveal>
        </div>

        <ul className="grid gap-5 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {partnerCategories.map((c, i) => {
            const Icon = c.icon
            return (
              <Reveal as="li" key={c.title} delay={i * 0.07} className="list-none">
                <article className="group relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[1.75rem] border border-white bg-gradient-to-b from-white to-tint/60 shadow-[0_18px_40px_-20px_rgb(0_84_159/0.35)] transition-shadow duration-300 hover:shadow-[0_26px_50px_-18px_rgb(0_84_159/0.45)] motion-reduce:transition-none">
                  <div className="relative z-10 p-6 pb-0">
                    <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-white text-deep shadow-raised">
                      <Icon size={28} weight="fill" />
                    </span>
                    <h3 className="text-balance !mt-5 text-[1.125rem] leading-snug !font-semibold text-ink">{c.title}</h3>
                    <p className="t-small !mt-2 text-ink/75">{c.description}</p>
                  </div>

                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={600}
                    draggable={false}
                    style={PHOTO_FADE}
                    className="mt-auto h-48 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />

                  {/* One button covers the whole card, so the card is the click target; the round arrow is its picture. */}
                  <button
                    type="button"
                    onClick={() => {
                      onChoose(c.type)
                      scrollToId('register')
                    }}
                    aria-label={`${c.title}: ${c.cta}`}
                    className="absolute inset-0 z-10 rounded-[1.75rem]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 bottom-36 z-20 grid size-11 place-items-center rounded-full bg-brand text-white shadow-raised transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  >
                    <ArrowRight size={20} />
                  </span>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
