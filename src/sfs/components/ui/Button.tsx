import type { ReactNode } from 'react'
import { SmartLink } from './SmartLink'

type Variant = 'primary' | 'secondary' | 'inverse'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: Variant
  size?: 'sm' | 'md'
  className?: string
  'aria-label'?: string
  children: ReactNode
}

/** The only button: one height, one radius, one weight; variants differ by colour only. */
export function Button({ href, onClick, variant = 'primary', size = 'md', className = '', children, ...aria }: ButtonProps) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${variant === 'inverse' ? 'on-dark' : ''} ${className}`.replace(/\s+/g, ' ').trim()
  if (href) {
    return (
      <SmartLink href={href} onClick={onClick} className={cls} {...aria}>
        {children}
      </SmartLink>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls} {...aria}>
      {children}
    </button>
  )
}
