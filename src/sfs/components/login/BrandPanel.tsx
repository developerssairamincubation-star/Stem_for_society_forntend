import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ease = [0.16, 1, 0.3, 1] as const

/** The photographs the sign-in screens use, each cropped so the people stay in frame. */
const scenes = {
  student: { src: '/images/hero-v2.jpg', width: 1072, height: 760, position: '46% 18%' },
  partner: { src: '/images/partner.jpg', width: 1200, height: 800, position: '72% 35%' },
  admin: { src: '/images/network.jpg', width: 1600, height: 1068, position: '68% 30%' },
} as const

export type BrandScene = keyof typeof scenes

interface BrandPanelProps {
  title?: string
  text?: string
  scene?: BrandScene
}

/**
 * Left panel: a real photograph from the site behind the welcome line. A deep-blue scrim rises from the bottom edge so the
 * words stay readable whatever the crop. On phones it becomes a short banner above the form.
 */
export function BrandPanel({ title = 'Start Your Journey', text = 'Explore, innovate, and connect with the STEM community', scene = 'student' }: BrandPanelProps) {
  const photo = scenes[scene]
  return (
    <section
      aria-label="Welcome to STEM for Society"
      className="relative isolate flex min-h-[14.5rem] flex-col overflow-hidden text-white sm:min-h-[17rem] lg:min-h-0"
    >
      <motion.img
        src={photo.src}
        alt=""
        // The biggest thing on the first screen: ask the browser to fetch it first. (React 18 has no typed prop for this.)
        {...({ fetchpriority: 'high' } as object)}
        decoding="async"
        width={photo.width}
        height={photo.height}
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease }}
        style={{ objectPosition: photo.position }}
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div aria-hidden="true" className="login-scrim absolute inset-0 -z-10" />

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
        <Link to="/" aria-label="STEM for Society home" className="on-dark w-fit rounded-control">
          <img
            src="/images/brand/sfs-logo.png"
            alt="STEM for Society"
            width={64}
            height={64}
            className="size-12 object-contain brightness-0 invert sm:size-16"
          />
        </Link>

        <div className="mt-auto grid gap-3 pt-8">
          <p className="t-display text-white">{title}</p>
          <p className="t-lead hidden max-w-sm text-white/90 sm:block">{text}</p>
        </div>
      </div>
    </section>
  )
}
