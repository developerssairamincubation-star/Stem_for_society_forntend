import { ArrowRight, CaretRight } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'framer-motion'
import { partnerHero, registerIntro } from '../../data/partnerPage'
import { scrollToId } from '../../lib/scrollToId'
import { OrganisationForm } from './OrganisationForm'

const ease = [0.16, 1, 0.3, 1] as const

interface Props {
  type: string
  onTypeChange: (type: string) => void
  interest: string
  onInterestChange: (interest: string) => void
}

/**
 * The opener is the whole job of the page: what this is on the left, the registration form beside it.
 * On narrow screens the order is the text, the form, then the photograph.
 */
export function PartnerHero({ type, onTypeChange, interest, onInterestChange }: Props) {
  const reduced = useReducedMotion()
  const rise = (delay: number, x = -12) => ({
    initial: reduced ? false : { opacity: 0, y: 20, x },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section aria-labelledby="partner-title" className="pt-32 pb-20 sm:pb-24 lg:pt-36">
      <div className="container-x grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr]">
        <div className="lg:col-start-1 lg:row-start-1">
          <motion.h1 id="partner-title" {...rise(0)} className="text-[2.75rem] leading-[1.08] !font-medium tracking-[-0.02em] text-[#0b2545] sm:text-[3.5rem]">
            Partner <span className="text-brand">With Us</span>
          </motion.h1>
          <motion.p {...rise(0.08)} className="t-lead !mt-6 max-w-md text-ink/70">
            {partnerHero.description}
          </motion.p>
          <motion.div {...rise(0.16)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#register" onClick={(e) => (e.preventDefault(), scrollToId('register'))} className="btn btn-primary nudge">
              Register Your Organisation
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#categories" onClick={(e) => (e.preventDefault(), scrollToId('categories'))} className="t-label group inline-flex items-center gap-1 text-deep">
              Learn More
              <CaretRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
            </a>
          </motion.div>
        </div>

        <motion.div
          id="register"
          tabIndex={-1}
          {...rise(0.1, 16)}
          className="scroll-mt-24 rounded-panel border border-tint/70 bg-white p-6 shadow-[0_30px_60px_-12px_rgb(0_84_159/0.22),0_18px_36px_-18px_rgb(17_24_39/0.2)] focus:outline-none sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <h2 id="register-title" className="text-[1.5rem] leading-tight !font-medium tracking-[-0.01em] text-[#0b2545]">
            {registerIntro.title}
          </h2>
          <p className="t-body !mt-2 !mb-7 text-ink/70">
            {registerIntro.lead} {registerIntro.description}
          </p>
          <OrganisationForm type={type} onTypeChange={onTypeChange} interest={interest} onInterestChange={onInterestChange} />
        </motion.div>

        <motion.figure {...rise(0.2)} className="m-0 flex flex-col overflow-hidden rounded-panel bg-deep shadow-raised max-lg:order-last lg:col-start-1 lg:row-start-2">
          <img
            src={registerIntro.image}
            alt={registerIntro.alt}
            width={1472}
            height={1069}
            {...({ fetchpriority: 'high' } as object)}
            decoding="async"
            className="aspect-[16/9] min-h-[14rem] w-full flex-1 object-cover object-[50%_70%] lg:aspect-auto"
          />
          <figcaption className="on-dark t-heading px-6 py-5 text-white">{registerIntro.message}</figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
