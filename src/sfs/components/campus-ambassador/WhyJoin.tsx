import { Check, GraduationCap, Megaphone, RocketLaunch, UsersThree, type Icon } from '@phosphor-icons/react'
import { useMotionValue, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Reveal } from '../ui/Reveal'
import { TiltCard, type Pointer } from './TiltCard'

const reasons: { title: string; text: string; Icon: Icon }[] = [
  { title: 'Represent STEM for Society', text: 'Be the face of our mission on your campus.', Icon: Megaphone },
  { title: 'Grow Your Network', text: 'Connect with mentors, experts and peers.', Icon: UsersThree },
  { title: 'Build Your Skills', text: 'Learn, lead and organize impactful events.', Icon: GraduationCap },
  { title: 'Create Impact', text: 'Drive change and inspire your community.', Icon: RocketLaunch },
]

/** The program's existing perks, kept word for word from the previous page. */
const perks = [
  'Access to exclusive STEM for Society opportunities and a chance to win a Campus Ambassador Points',
  'Certificates of recognition for your contributions',
  'Opportunities to network with fellow participants and free access to Stem for Society Conference',
  '30% discount in all the program offered by Stem for Society',
]

/** Cursor-follow tilt only makes sense with a real mouse; touch screens keep the entrance animation only. */
function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return fine
}

export function WhyJoin() {
  const pointer = useMotionValue<Pointer>(null)
  const reduceMotion = useReducedMotion()
  const tilt = useFinePointer() && !reduceMotion

  return (
    <section aria-labelledby="why-join-title" className="section bg-tint">
      <div
        className="container-x"
        onPointerMove={(e) => tilt && e.pointerType === 'mouse' && pointer.set({ x: e.clientX, y: e.clientY })}
        onPointerLeave={() => pointer.set(null)}
      >
        <Reveal className="section-head mx-auto max-w-2xl text-center">
          <h2 id="why-join-title" className="t-title">
            Why Join?
          </h2>
          <p className="t-lead mt-4 text-ink/70">Be a part of a growing community and unlock new opportunities.</p>
        </Reveal>

        <ul className="grid gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ title, text, Icon }, i) => (
            <Reveal as="li" key={title} delay={i * 0.1} className="list-none">
              <TiltCard
                pointer={pointer}
                enabled={tilt}
                className="card h-full border-brand/25 p-6 transition-colors duration-200 hover:border-brand"
              >
                <Icon size={32} className="text-brand" aria-hidden="true" />
                <h3 className="t-heading mt-5">{title}</h3>
                <p className="t-body mt-2 text-ink/70">{text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.2}>
          <ul className="mx-auto mt-12 grid max-w-4xl gap-x-10 gap-y-4 border-t border-brand/25 p-0 pt-10 md:grid-cols-2">
            {perks.map((perk) => (
              <li key={perk} className="t-body flex list-none items-start gap-3 text-ink">
                <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-deep" aria-hidden="true" />
                {perk}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
