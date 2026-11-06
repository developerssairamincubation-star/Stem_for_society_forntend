import { CaretRight } from '@phosphor-icons/react'
import { partnerCategories, partnerCategoriesIntro } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'
import { Reveal } from '../ui/Reveal'

/** Unboxed editorial blocks: a photograph, the title, the description and a text link. */
export function PartnerCategories({ onChoose }: { onChoose: (type: string) => void }) {
  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-x">
        <div className="max-w-2xl">
          <Reveal x={-16}>
            <h2 id="categories-title" className="text-[2rem] leading-[1.15] !font-medium tracking-[-0.02em] text-[#0b2545] sm:text-[2.375rem]">
              {partnerCategoriesIntro.title}
            </h2>
          </Reveal>
          <Reveal x={-16} delay={0.12}>
            <p className="t-lead !mt-5 text-ink/70">{partnerCategoriesIntro.description}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-x-12 gap-y-16 p-0 md:grid-cols-2 lg:mt-20">
          {partnerCategories.map((c, i) => {
            const Icon = c.icon
            return (
              <Reveal as="li" key={c.title} x={i % 2 ? 20 : -20} delay={(i % 2) * 0.08} className="list-none">
                <article className="group relative grid gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:items-center">
                  <div className="relative overflow-hidden rounded-card shadow-raised">
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={900}
                      height={600}
                      draggable={false}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
                    />
                    <span aria-hidden="true" className="absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-white text-deep shadow-raised">
                      <Icon size={20} weight="fill" />
                    </span>
                  </div>
                  <div className="grid gap-3">
                    <h3 className="text-balance text-[1.375rem] leading-tight !font-medium tracking-[-0.01em] text-[#0b2545]">{c.title}</h3>
                    <p className="t-small text-ink/70">{c.description}</p>
                    {/* The whole block is the click target: this button stretches over it. */}
                    <button
                      type="button"
                      onClick={() => {
                        onChoose(c.type)
                        scrollToId('register')
                      }}
                      className="t-label inline-flex min-h-11 items-center gap-1 whitespace-nowrap justify-self-start text-deep after:absolute after:inset-0 after:content-['']"
                    >
                      {c.cta}
                      <CaretRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
