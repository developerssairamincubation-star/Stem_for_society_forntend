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
 * The campus picture fills the hero edge to edge, sky and all, with no overlay on it. The headline and button sit live on
 * the open sky above the INNOVATE lettering. From 1024px the section keeps the picture's proportions so nothing is
 * cropped and the text lands where the picture leaves room for it; below that the section is a tall frame and the
 * picture is cropped at the sides around the centre.
 *
 * The second line is a deeper blue than the brand blue: on this sky brand blue reads at 2.2:1, this one at 3.1:1 or more.
 */
export function InstitutionHero({ onPartner }: { onPartner: () => void }) {
  return (
    <section
      aria-labelledby="inst-hero-title"
      className="relative isolate h-[47.5rem] overflow-hidden bg-[#9fd0f8] sm:h-[52rem] lg:h-auto lg:aspect-[1672/941]"
    >
      <motion.img
        src={hero.image}
        alt={hero.alt}
        width={1672}
        height={941}
        {...({ fetchpriority: 'high' } as object)}
        decoding="async"
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0 -z-10 size-full origin-bottom object-cover object-[50%_100%]"
      />

      <div className="container-x flex flex-col items-center pt-28 text-center sm:pt-32 lg:pt-[max(7.5rem,8.7%)]">
        <motion.h1
          id="inst-hero-title"
          {...rise(0)}
          className="t-display !text-[2rem] !leading-[1.12] !font-semibold text-ink sm:!text-[2.75rem] lg:!text-[clamp(2.75rem,4.15vw,4.5rem)] lg:!leading-[1.1]"
        >
          <span className="lg:block">{hero.lead}</span>{' '}
          <span className="text-[#0057c2] lg:block">{hero.rest}</span>
        </motion.h1>

        <motion.div {...rise(0.15)} className="mt-6 xl:mt-8">
          <Button onClick={onPartner}>
            Partner With Us
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
