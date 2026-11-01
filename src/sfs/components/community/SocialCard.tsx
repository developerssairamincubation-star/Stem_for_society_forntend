import { ArrowUpRight, type Icon } from '@phosphor-icons/react'
import { Reveal } from '../ui/Reveal'

interface SocialCardProps {
  name: string
  action: string
  href: string
  Icon: Icon
  delay?: number
}

const body = 'flex h-full items-center gap-4 p-5'

/** The whole card is the link. With no URL yet it renders as a quiet, non-interactive "coming soon" card. */
export function SocialCard({ name, action, href, Icon, delay = 0 }: SocialCardProps) {
  const icon = <Icon size={28} className="shrink-0 text-brand" aria-hidden="true" />

  return (
    <Reveal as="li" delay={delay} className="list-none">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`card group ${body} transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
        >
          {icon}
          <span className="min-w-0 flex-1">
            <span className="t-heading block">{name}</span>
            <span className="t-small block text-ink/70">
              {action}
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </span>
          <ArrowUpRight
            size={20}
            className="shrink-0 text-ink/40 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand motion-reduce:transition-none"
            aria-hidden="true"
          />
        </a>
      ) : (
        <div className={`card ${body} opacity-70`}>
          {icon}
          <span className="min-w-0 flex-1">
            <span className="t-heading block">{name}</span>
            <span className="t-small block text-ink/70">Link coming soon</span>
          </span>
        </div>
      )}
    </Reveal>
  )
}
