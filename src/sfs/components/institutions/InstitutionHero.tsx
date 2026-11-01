import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { institutionHero as hero } from '../../data/institutions'
import { Button } from '../ui/Button'

const ease = [0.16, 1, 0.3, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

/**
 * Desktop: the whole campus picture is the hero, centred and never cropped (the frame keeps the
 * picture's proportions and stops at 1600px; beyond that its sides melt into the white page).
 * Phones/tablets: heading and button above, the picture below.
 */
export function InstitutionHero({ onPartner }: { onPartner: () => void }) {
  return (
    <section aria-labelledby="inst-hero-title" className="relative isolate overflow-hidden bg-white">
      <div className="relative mx-auto bg-surface lg:aspect-[1472/1069] lg:max-w-[1600px] lg:bg-transparent">
        <motion.img
          src={hero.image}
          alt={hero.alt}
          width={1472}
          height={1069}
          {...({ fetchpriority: "high" } as object)}
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease }}
          className="fade-sides absolute inset-0 -z-10 hidden size-full object-cover lg:block"
        />

        <div className="container-x relative flex flex-col items-center pt-32 text-center lg:pt-[max(8rem,min(9.4vw,10rem))]">
          <motion.h1 id="inst-hero-title" {...rise(0)} className="t-display max-w-[20ch] lg:max-w-none">
            <span className="lg:block">{hero.lead}</span> <span className="text-brand lg:block">{hero.rest}</span>
          </motion.h1>

          <motion.div {...rise(0.15)} className="mt-8">
            <Button onClick={onPartner}>
              Partner With Us
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </motion.div>
        </div>

        <div className="fade-up relative mt-10 h-72 overflow-hidden sm:h-96 lg:hidden">
          <img src={hero.imageSmall} alt={hero.alt} loading="eager" className="absolute inset-0 size-full object-cover object-[50%_30%]" />
        </div>
      </div>
    </section>
  )
}
