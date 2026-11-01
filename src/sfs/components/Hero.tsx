import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Button } from './ui/Button'

const ease = [0.16, 1, 0.3, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex flex-col overflow-hidden bg-deep pt-28 lg:min-h-[max(40rem,92svh)] lg:flex-row lg:items-center lg:pt-24"
    >
      {/* Double-exposure student photo; its left edge dissolves into the deep-blue surface. */}
      <img
        src="/images/hero-v2.jpg"
        alt="A young student gazing upward, his silhouette filled with robotics labs, engineers at work and a sunlit city skyline"
        width={1072}
        height={760}
        // React 18 only knows the lowercase attribute name.
        {...({ fetchpriority: "high" } as object)}
        className="fade-hero block h-auto w-full object-cover object-[72%_center] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:h-full lg:w-[58%]"
      />

      <div className="container-x relative pt-4 pb-16 sm:pb-20 lg:py-24">
        <div className="lg:w-1/2">
          <h1 id="hero-title" className="t-display !text-white">
            From Learning to <span className="text-tint">Real World Impact</span>
          </h1>

          <motion.p {...rise(0.15)} className="t-lead mt-6 max-w-md text-white/80">
            Hands-on STEM learning, industry mentorship, and real-world projects that transform curiosity into skills,
            confidence, and meaningful careers.
          </motion.p>

          <motion.div {...rise(0.3)} className="mt-8">
            <Button href="#academy" variant="inverse">
              Explore Our Academy
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
