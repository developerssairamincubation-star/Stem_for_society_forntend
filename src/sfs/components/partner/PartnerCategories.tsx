import { ArrowRight } from '@phosphor-icons/react'
import { partnerCategories, partnerCategoriesIntro } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'
import { Reveal } from '../ui/Reveal'

export function PartnerCategories({ onChoose }: { onChoose: (type: string) => void }) {
  return (
    <section id="categories" aria-labelledby="categories-title" className="section scroll-mt-24 bg-white">
      <div className="container-x">
        <div className="section-head mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="t-label text-deep">{partnerCategoriesIntro.label}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="categories-title" className="t-title mt-3">
              {partnerCategoriesIntro.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lead mt-4 text-ink/70">{partnerCategoriesIntro.description}</p>
          </Reveal>
        </div>

        <ul className="grid gap-5 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {partnerCategories.map((c, i) => {
            const Icon = c.icon
            return (
              <Reveal as="li" key={c.title} delay={(i % 4) * 0.07} className="list-none">
                <button
                  type="button"
                  onClick={() => {
                    onChoose(c.type)
                    scrollToId('register')
                  }}
                  aria-label={`${c.title}: register as ${c.type}`}
                  className="group relative flex min-h-[24rem] w-full flex-col justify-end overflow-hidden rounded-panel bg-deep text-left text-white shadow-raised transition-shadow duration-300 hover:shadow-overlay focus-visible:outline-offset-4 motion-reduce:transition-none"
                >
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={600}
                    draggable={false}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/65 to-deep/10" />
                  <span className="relative flex flex-col gap-3 p-6">
                    <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
                      <Icon size={24} weight="fill" />
                    </span>
                    <span className="t-heading text-white">{c.title}</span>
                    <span className="t-small text-white/85">{c.description}</span>
                    <span className="t-label mt-1 inline-flex items-center gap-2 text-white">
                      Register
                      <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                    </span>
                  </span>
                </button>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
