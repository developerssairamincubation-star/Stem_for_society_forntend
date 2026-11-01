import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { campusAmbassador } from '../../config'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { WhyJoin } from './WhyJoin'

const apply = campusAmbassador.registrationUrl

export function CampusAmbassadorPage() {
  return (
    <>
      <section aria-labelledby="ca-title" className="bg-white pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 id="ca-title" className="t-display">
              Campus Ambassador <span className="text-brand">Program</span>
            </h1>
            <p className="t-lead mt-5 max-w-xl text-ink/70">
              Be the voice of STEM for Society on your campus. Inspire, engage and create impact in your college
              community.
            </p>
            <div className="mt-8">
              <Button href={apply}>
                Apply Now
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-panel border border-tint"
          >
            <img
              src="/images/institutions/soft-skills.jpg"
              alt="Three students laughing together over their laptops"
              width={900}
              height={599}
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <WhyJoin />

      <section aria-labelledby="apply-title" className="section bg-white">
        <div className="container-x">
          <Reveal className="rounded-panel border border-tint bg-surface p-8 sm:p-12">
            <h2 id="apply-title" className="t-title">
              Ready to Apply?
            </h2>
            <p className="t-lead mt-4 max-w-xl text-ink/70">
              Take the first step towards becoming a Campus Ambassador and making a difference.
            </p>
            <div className="mt-8">
              <Button href={apply}>
                Apply Now
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
