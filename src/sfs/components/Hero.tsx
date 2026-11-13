import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Button } from './ui/Button'

const ease = [0.16, 1, 0.3, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, ease } }

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
 * The STEM artwork is the hero, always shown whole: never cropped at the sides and never enlarged past the screen.
 * "FOR SOCIETY", the tagline and the button are live text (the picture carries only the letters and their scenes).
 *
 * From 1024px the artwork sits in a frame that is as large as fits both the screen's width and its height, so on a short
 * laptop screen the whole picture, text and button are visible without scrolling. Any space left at the sides is filled
 * with a soft, blurred copy of the same picture. The text is sized from the frame's width (container units), so it keeps
 * its place on the floor below the letters at every size.
 *
 * Below 1024px the full width of the artwork is shown (only the empty sky above and floor below are trimmed) and the
 * text follows underneath on the floor colour.
 */
export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-[#ebf3fd]">
      {/* Laptop and up: a blurred copy fills any space beside the frame */}
      <img
        src={ART.src}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 -z-10 hidden size-full scale-110 object-cover opacity-80 blur-2xl lg:block"
      />

      {/* Phones and tablets: all four letters, edge to edge */}
      <div className="pt-24 sm:pt-28 lg:hidden">
        <motion.div {...fade} className="relative aspect-[1672/560] overflow-hidden">
          <img
            src={ART.src}
            alt={ART.alt}
            width={ART.width}
            height={ART.height}
            {...({ fetchpriority: 'high' } as object)}
            decoding="async"
            className="absolute top-[-16.07%] left-0 w-full max-w-none"
          />
        </motion.div>
      </div>

      {/* Laptop and up: the whole artwork, as big as the screen allows */}
      <div className="relative mx-auto hidden aspect-[1672/941] w-[min(100%,calc(100svh*1672/941))] [container-type:inline-size] lg:block">
        <motion.img
          {...fade}
          src={ART.src}
          alt={ART.alt}
          width={ART.width}
          height={ART.height}
          decoding="async"
          className="absolute inset-0 size-full"
        />
      </div>

      <div className="container-x flex flex-col items-center pt-6 pb-14 text-center sm:pt-8 sm:pb-16 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:mx-auto lg:h-full lg:w-[min(100%,calc(100svh*1672/941))] lg:max-w-none lg:p-0 lg:[container-type:inline-size]">
        <div className="flex w-full flex-col items-center lg:absolute lg:inset-x-0 lg:top-[68.6%] lg:px-[4cqw]">
          <motion.h1
            id="hero-title"
            {...rise(0.1)}
            className="!m-0 !text-[2.25rem] !leading-none tracking-[0.08em] text-[#0f2a5c] uppercase min-[400px]:!text-[2.5rem] sm:!text-[3.5rem] lg:!text-[5.2cqw]"
          >
            <span className="sr-only">STEM </span>
            <span className="!font-normal">For</span> <span className="ml-[0.18em] !font-bold">Society</span>
          </motion.h1>

          <motion.div {...rise(0.22)} className="mt-4 flex w-full max-w-5xl items-center justify-center gap-6 lg:mt-[2.2cqw] lg:max-w-[80cqw]">
            <Rule side="left" />
            <p className="!m-0 text-[0.8125rem] tracking-[0.02em] whitespace-nowrap text-ink/80 min-[400px]:text-[0.9375rem] sm:text-lg sm:tracking-[0.06em] lg:text-[1.8cqw]">
              Learn <span aria-hidden="true" className="mx-1.5 sm:mx-3">•</span> Innovate{' '}
              <span aria-hidden="true" className="mx-1.5 sm:mx-3">•</span> Build a Better Tomorrow
            </p>
            <Rule side="right" />
          </motion.div>

          <motion.div {...rise(0.34)} className="pointer-events-auto mt-8 lg:mt-[1.9cqw]">
            <Button href="#academy">
              Explore Our Academy
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
