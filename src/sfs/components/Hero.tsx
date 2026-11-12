import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Button } from './ui/Button'

const ease = [0.16, 1, 0.3, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

const ART = {
  src: '/images/home-stem-hero.jpg',
  width: 1672,
  height: 941,
  alt: 'The word STEM in large letters, each filled with a scene: a scientist with a flask, a student coding beside wind turbines, a student at a laptop with code and a brain motif, and a student holding a robot car',
}

/** Thin rules either side of the tagline, as on the artwork. */
const Rule = ({ side }: { side: 'left' | 'right' }) => (
  <span
    aria-hidden="true"
    className={`hidden h-px flex-1 from-transparent via-deep/45 to-deep/45 sm:block ${side === 'left' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'}`}
  />
)

/**
 * The STEM artwork is the hero. "FOR SOCIETY", the tagline and the button are live text set on the reflective floor below
 * the letters (the picture carries only the letters and their scenes).
 *
 * From 1024px the section keeps the artwork's proportions and the text sits where the floor leaves room for it.
 * Below that the artwork is cropped to the four letters so they fill the width, and the text follows underneath on the
 * floor colour.
 */
export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[#ebf3fd] pt-24 pb-14 sm:pt-28 sm:pb-16 lg:aspect-[1672/941] lg:p-0"
    >
      {/* Phones and tablets: the four letters, filling the width */}
      <div className="relative aspect-[1372/530] overflow-hidden lg:hidden">
        <motion.img
          src={ART.src}
          alt={ART.alt}
          width={ART.width}
          height={ART.height}
          {...({ fetchpriority: 'high' } as object)}
          decoding="async"
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
          className="absolute top-[-20.75%] left-[-10.94%] w-[121.87%] max-w-none"
        />
      </div>

      {/* Desktop: the whole artwork behind the section */}
      <motion.img
        src={ART.src}
        alt=""
        aria-hidden="true"
        width={ART.width}
        height={ART.height}
        decoding="async"
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0 -z-10 hidden size-full object-cover lg:block"
      />

      <div className="container-x mt-6 flex flex-col items-center text-center sm:mt-8 lg:absolute lg:inset-x-0 lg:top-[68.6%] lg:mt-0">
        <motion.h1
          id="hero-title"
          {...rise(0.1)}
          className="!m-0 !text-[2.5rem] !leading-none tracking-[0.08em] text-[#0f2a5c] uppercase sm:!text-[3.5rem] lg:!text-[clamp(3rem,5.2vw,6.25rem)]"
        >
          <span className="sr-only">STEM </span>
          <span className="!font-normal">For</span> <span className="ml-[0.18em] !font-bold">Society</span>
        </motion.h1>

        <motion.div {...rise(0.22)} className="mt-4 flex w-full max-w-5xl items-center gap-6 lg:mt-[2.4vw]">
          <Rule side="left" />
          <p className="!m-0 text-base tracking-[0.06em] text-ink/80 sm:text-lg lg:text-[clamp(1.125rem,1.8vw,2.125rem)]">
            Learn <span aria-hidden="true" className="mx-2 sm:mx-3">•</span> Innovate{' '}
            <span aria-hidden="true" className="mx-2 sm:mx-3">•</span> Build a Better Tomorrow
          </p>
          <Rule side="right" />
        </motion.div>

        <motion.div {...rise(0.34)} className="mt-8 lg:mt-[2.2vw]">
          <Button href="#academy">
            Explore Our Academy
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
