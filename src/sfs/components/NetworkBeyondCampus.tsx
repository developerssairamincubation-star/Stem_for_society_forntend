import { ArrowSquareOut } from '@phosphor-icons/react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { links } from '../config'
import { networkHighlights } from '../data/content'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

export function NetworkBeyondCampus() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <section id="network" aria-labelledby="network-title" className="section bg-white">
      <div className="container-x">
        <div ref={ref} className="on-dark grid overflow-hidden rounded-panel bg-deep lg:min-h-[32rem] lg:grid-cols-[1.05fr_1fr]">
          {/* Copy */}
          <div className="panel-pad flex flex-col justify-center">
            <Reveal>
              <h2 id="network-title" className="t-title !text-white">
                Your Network. <span className="text-tint">Your Next Opportunity.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="t-lead mt-4 max-w-lg text-white/80">
                Networking Beyond Campus brings students together with mentors, peers, and industry leaders in curated rooms
                and unfiltered conversations that catalyze careers.
              </p>
            </Reveal>

            <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {networkHighlights.map(({ icon: Icon, label }, i) => (
                <Reveal as="li" key={label} delay={0.12 + i * 0.04} className="t-label flex items-center gap-3 text-white">
                  <Icon size={22} className="shrink-0 text-tint" aria-hidden="true" />
                  {label}
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.3} className="mt-10">
              <Button href={links.network} variant="inverse">
                Explore Network Beyond Campus
                <ArrowSquareOut size={18} aria-hidden="true" />
                <span className="sr-only">(opens a separate website)</span>
              </Button>
            </Reveal>
          </div>

          {/* Photo */}
          <motion.div
            className="relative min-h-72 overflow-hidden lg:min-h-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="/images/network-nbc.jpg"
              alt="A group of Networking Beyond Campus members standing together in an outdoor cafe garden"
              loading="lazy"
              width={1600}
              height={776}
              style={{ y: imageY }}
              className="absolute inset-x-0 -top-[5%] h-[110%] w-full object-cover object-[50%_35%]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
