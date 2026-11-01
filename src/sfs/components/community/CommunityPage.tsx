import { InstagramLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { community } from '../../config'
import { Reveal } from '../ui/Reveal'
import { SocialCard } from './SocialCard'
import { WhatsAppCard } from './WhatsAppCard'

const socials = [
  { name: 'X', action: 'Visit Profile', href: community.x, Icon: XLogo },
  { name: 'Instagram', action: 'Visit Profile', href: community.instagram, Icon: InstagramLogo },
  { name: 'YouTube', action: 'Visit Channel', href: community.youtube, Icon: YoutubeLogo },
]

export function CommunityPage() {
  return (
    <>
      <section aria-labelledby="community-title" className="bg-white pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-44">
        <div className="container-x text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 id="community-title" className="t-display">
              Join Our <span className="text-brand">Community</span>
            </h1>
            <p className="t-lead mx-auto mt-5 max-w-2xl text-ink/70">
              Be a part of something bigger — connect, learn and grow with a vibrant community of learners, mentors and
              innovators.
            </p>
          </motion.div>
        </div>
      </section>

      <section aria-label="WhatsApp community" className="bg-white pb-16 sm:pb-20">
        <div className="container-x">
          <WhatsAppCard />
        </div>
      </section>

      <section aria-labelledby="socials-title" className="section bg-surface">
        <div className="container-x">
          <Reveal className="section-head text-center">
            <h2 id="socials-title" className="t-title">
              Explore Our Socials
            </h2>
          </Reveal>
          <ul className="mx-auto grid max-w-4xl gap-4 p-0 sm:grid-cols-2 md:grid-cols-3">
            {socials.map((s, i) => (
              <SocialCard key={s.name} {...s} delay={i * 0.05} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
