import { List, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useActiveSection } from '../hooks/useActiveSection'
import { isExternal } from '../config'
import { academyLinks, navLeft, navRight, resourceLinks } from '../data/content'
import { CAMPUS_AMBASSADOR_PATH, COMMUNITY_PATH, INSTITUTIONS_PATH, SKILL_DEVELOPMENT_PATH, currentPath, isHomePath, sectionHref } from '../lib/route'
import { AuthControl } from './AuthControl'
import { NavDropdown, NavMobileGroup } from './NavDropdown'
import { ScrollToHash } from './ScrollToHash'
import { SmartLink } from './ui/SmartLink'

const sectionIds = ['testimonials', 'partners'] as const

function NavLink({ href, active, children, onClick }: { href: string; active: boolean; children: string; onClick?: () => void }) {
  return (
    <SmartLink
      href={href}
      onClick={onClick}
      // External destinations (Network Beyond Campus) open in the same tab from the navigation bar.
      target={isExternal(href) ? '_self' : undefined}
      aria-current={active ? 'true' : undefined}
      className={`t-label inline-flex h-10 items-center rounded-full px-4 whitespace-nowrap transition-colors duration-200 ${
        active ? 'bg-tint/60 text-deep' : 'text-ink/80 hover:bg-white hover:text-ink'
      }`}
    >
      {children}
    </SmartLink>
  )
}

/** The one place glass is used: the bar floats over changing content, so it needs the blur to stay legible. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  useLocation() // re-render on navigation so active states follow the route
  const onHome = isHomePath()
  const to = sectionHref

  useEffect(() => {
    // Capture phase: on the platform's older pages <body> is the scroll container, whose scroll events never reach window.
    const onScroll = () => setScrolled(Math.max(window.scrollY, document.body.scrollTop, document.documentElement.scrollTop) > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', onScroll, { capture: true })
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const resourcePage = currentPath() === COMMUNITY_PATH || currentPath() === CAMPUS_AMBASSADOR_PATH
  const isActive = (id: string) => {
    if (id === 'resources') return resourcePage
    if (id === 'academy') return currentPath() === SKILL_DEVELOPMENT_PATH
    if (id === 'network' || id === 'partner') return false
    return onHome ? id === active : currentPath() === INSTITUTIONS_PATH && id === 'institutions'
  }
  const close = () => setOpen(false)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50">
      <ScrollToHash />
      <div className="container-x pointer-events-auto relative">
        <nav
          aria-label="Primary"
          className={`grid grid-cols-[1fr_auto_1fr] items-center rounded-full border border-white/70 bg-white/85 px-3 py-1.5 backdrop-blur-xl transition-shadow duration-300 min-[1180px]:px-5 ${
            scrolled ? 'shadow-overlay' : 'shadow-raised'
          }`}
        >
          {/* Left */}
          <div className="flex items-center justify-start min-[1180px]:justify-end min-[1180px]:pr-3">
            <button
              type="button"
              className="icon-btn !border-transparent !bg-transparent min-[1180px]:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}
            </button>
            <ul className="hidden items-center gap-1 min-[1180px]:flex">
              {navLeft.map((l) =>
                l.id === 'academy' ? (
                  <NavDropdown key={l.id} label={l.label} items={academyLinks} active={isActive(l.id)} />
                ) : (
                  <li key={l.id}>
                    <NavLink href={to(l.href)} active={isActive(l.id)}>
                      {l.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Centre: the grid keeps the logo centred on the whole bar */}
          <SmartLink href={onHome ? '#home' : '/'} aria-label="STEM for Society, home" className="justify-self-center rounded-card px-2">
            <img src="/images/brand/sfs-logo.png" alt="STEM for Society" width={64} height={64} className="size-14 object-contain sm:size-16" />
          </SmartLink>

          {/* Right */}
          <div className="flex items-center justify-end gap-3 min-[1180px]:justify-between min-[1180px]:pl-3">
            <ul className="hidden items-center gap-1 min-[1180px]:flex">
              {navRight.map((l) =>
                l.id === 'resources' ? (
                  <NavDropdown key={l.id} label={l.label} items={resourceLinks} active={isActive(l.id)} />
                ) : (
                  <li key={l.id}>
                    <NavLink href={to(l.href)} active={isActive(l.id)}>
                      {l.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
            <AuthControl />
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full mt-2 rounded-panel border border-tint bg-white p-3 shadow-overlay min-[1180px]:hidden"
            >
              <ul className="flex flex-col gap-1">
                {[...navLeft, ...navRight].map((l) =>
                  l.id === 'academy' ? (
                    <NavMobileGroup key={l.id} label={l.label} items={academyLinks} onNavigate={close} />
                  ) : l.id === 'resources' ? (
                    <NavMobileGroup key={l.id} label={l.label} items={resourceLinks} onNavigate={close} />
                  ) : (
                  <li key={l.id}>
                    <SmartLink
                      href={to(l.href)}
                      onClick={close}
                      target={isExternal(l.href) ? '_self' : undefined}
                      aria-current={isActive(l.id) ? 'true' : undefined}
                      className={`t-label flex h-12 items-center rounded-control px-4 transition-colors duration-200 ${
                        isActive(l.id) ? 'bg-tint/60 text-deep' : 'text-ink hover:bg-surface'
                      }`}
                    >
                      {l.label}
                    </SmartLink>
                  </li>
                  ),
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
