import { CaretDown } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { resourceLinks } from '../data/content'
import { SmartLink } from './ui/SmartLink'

/** Desktop "Resources" trigger with a dropdown; opens on hover or click, closes on Escape, outside click or blur. */
export function ResourcesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const pointerType = useRef('mouse')
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <li
      ref={ref}
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        onKeyDown={() => (pointerType.current = 'key')}
        // With a mouse the hover has already opened the menu, so a click must not close it again.
        onClick={() => setOpen((v) => (pointerType.current === 'mouse' ? true : !v))}
        className={`t-label inline-flex h-10 items-center gap-1.5 rounded-full px-4 whitespace-nowrap transition-colors duration-200 ${
          active || open ? 'bg-tint/60 text-deep' : 'text-ink/80 hover:bg-white hover:text-ink'
        }`}
      >
        Resources
        <CaretDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 z-10 w-72 list-none rounded-panel border border-tint bg-white p-2 pt-2 shadow-overlay"
            style={{ marginTop: 8 }}
          >
            {resourceLinks.map((l) => (
              <li key={l.label} role="none">
                <SmartLink
                  href={l.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="t-label flex h-11 items-center rounded-control px-4 text-ink transition-colors duration-200 hover:bg-surface hover:text-deep"
                >
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}

/** Mobile menu version: a label followed by the same links. */
export function ResourcesMobileGroup({ onNavigate }: { onNavigate: () => void }) {
  return (
    <li>
      <p className="t-label flex h-12 items-center px-4 text-ink/60">Resources</p>
      <ul className="flex flex-col gap-1 pl-4">
        {resourceLinks.map((l) => (
          <li key={l.label}>
            <SmartLink
              href={l.href}
              onClick={onNavigate}
              className="t-label flex h-12 items-center rounded-control px-4 text-ink transition-colors duration-200 hover:bg-surface"
            >
              {l.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </li>
  )
}
