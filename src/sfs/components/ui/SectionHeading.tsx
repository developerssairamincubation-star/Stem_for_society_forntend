import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  title: ReactNode
  description?: string
  id?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

/** Every section opens the same way: title, then an optional supporting line. */
export function SectionHeading({ title, description, id, align = 'left', tone = 'light', className = '' }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Reveal>
        <h2 id={id} className={`t-title ${dark ? '!text-white' : ''}`}>
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.08}>
          <p className={`t-lead mt-4 ${dark ? 'text-white/80' : 'text-ink/70'}`}>{description}</p>
        </Reveal>
      )}
    </div>
  )
}
