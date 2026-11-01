import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { isExternal } from '../../config'

/**
 * One link component for the whole SFS UI:
 * absolute URLs open in a new tab, paths ("/courses", "/#academy") use the app router so the page does not reload,
 * bare "#" placeholders never jump to the top, and everything else (#section, mailto:, tel:) stays a plain anchor.
 */
export function SmartLink({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  if (isExternal(href)) {
    return <a href={href} onClick={onClick} target="_blank" rel="noopener noreferrer" {...rest} />
  }
  if (href.startsWith('/') && !href.startsWith('//')) {
    return <Link to={href} onClick={onClick} {...rest} />
  }
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href === '#') e.preventDefault()
    onClick?.(e)
  }
  return <a href={href} onClick={handle} {...rest} />
}
