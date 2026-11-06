import { ArrowRight, Check, Cpu, GraduationCap, UsersThree, type Icon } from '@phosphor-icons/react'
import { MotionConfig } from 'framer-motion'
import { programs, type Program } from '../data/content'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { SmartLink } from './ui/SmartLink'

/** Each programme has its own soft tint, an icon and an accent for its ticks and arrow. The wording and pictures come from the data. */
const LOOK: Record<string, { icon: Icon; card: string; chip: string; accent: string; button: string }> = {
  'industry-skills': {
    icon: Cpu,
    card: 'from-[#e3f6ea] to-[#f4fbf7]',
    chip: 'bg-[#cdeedb] text-[#166534]',
    accent: 'bg-[#166534]',
    button: 'bg-[#166534] hover:bg-[#124d28]',
  },
  'professional-skills': {
    icon: UsersThree,
    card: 'from-[#e1eeff] to-[#f3f8ff]',
    chip: 'bg-[#c9e1ff] text-deep',
    accent: 'bg-brand',
    button: 'bg-brand hover:bg-[#0277e0]',
  },
  'finishing-school': {
    icon: GraduationCap,
    card: 'from-[#ffe9da] to-[#fff6f0]',
    chip: 'bg-[#ffd9bf] text-[#9a3412]',
    accent: 'bg-[#c2410c]',
    button: 'bg-[#c2410c] hover:bg-[#9a3412]',
  },
}

/** The picture sits in the top-right corner and melts into the card on its left and bottom edges. */
const PICTURE_FADE = {
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 55%), linear-gradient(to top, transparent 0%, #000 42%)',
  maskImage: 'linear-gradient(to right, transparent 0%, #000 55%), linear-gradient(to top, transparent 0%, #000 42%)',
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
} as React.CSSProperties

function ProgramCard({ p }: { p: Program }) {
  const look = LOOK[p.id]
  const Icon = look.icon
  return (
    <article id={p.id} className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white bg-gradient-to-br p-7 shadow-raised ${look.card}`}>
      <img
        src={p.image}
        alt={p.alt}
        width={1400}
        height={933}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={PICTURE_FADE}
        className="pointer-events-none absolute top-0 right-0 h-[42%] w-[44%] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
      />

      <span aria-hidden="true" className={`relative grid size-14 place-items-center rounded-full ${look.chip}`}>
        <Icon size={28} weight="duotone" />
      </span>

      <h3 className="t-heading !mt-5 !text-[1.375rem] relative">{p.title}</h3>
      <p className="t-small !mt-2 relative max-w-[15rem] text-ink/75">{p.summary}</p>

      <ul className="relative mt-5 grid gap-2.5 p-0" aria-label={`${p.title} covers`}>
        {p.items.map((item) => (
          <li key={item} className="t-small flex list-none items-start gap-3 font-medium text-ink/85">
            <span aria-hidden="true" className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white ${look.accent}`}>
              <Check size={12} weight="bold" />
            </span>
            {item}
          </li>
        ))}
      </ul>

      {/* The arrow is the link; it stretches over the whole card so the card is the click target. */}
      <div className="relative mt-auto flex justify-end pt-6">
        <SmartLink
          href={p.href}
          aria-label={`Enquire about ${p.title}`}
          className={`grid size-12 place-items-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-0.5 after:absolute after:-top-[40rem] after:-right-7 after:-bottom-7 after:-left-[40rem] after:content-[''] motion-reduce:transition-none ${look.button}`}
        >
          <ArrowRight size={22} aria-hidden="true" />
        </SmartLink>
      </div>
    </article>
  )
}

/** Our Academy: the three programmes side by side as soft tinted cards. */
export function Academy() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="academy" aria-labelledby="academy-title" className="section bg-white">
        <div className="container-x">
          <div className="section-head flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <SectionHeading id="academy-title" title="Build Your Future Through Our Programs" className="lg:max-w-xl" />
            <Reveal delay={0.1}>
              <p className="t-body max-w-sm text-ink/70">
                Explore practical learning experiences that connect knowledge, professional skills, and career readiness.
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-6 p-0 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.08} className="h-full list-none">
                <ProgramCard p={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  )
}
