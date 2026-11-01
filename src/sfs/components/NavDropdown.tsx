import { CaretDown } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { SmartLink } from './ui/SmartLink'

export interface NavDropdownItem {
  label: string
  href: string
}

interface NavDropdownProps {
  label: string
  items: readonly NavDropdownItem[]
  active?: boolean
}

/**
 * Desktop navigation item with a dropdown.
 * Opens on hover or click; closes on Escape (focus returns to the trigger), outside click, blur or selecting an item.
 * Keyboard: Enter/Space/ArrowDown open and focus the first item, arrows/Home/End move between items, Tab leaves.
 */
export function NavDropdown({ label, items, active = false }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const pointerType = useRef('mouse')
  const focusFirst = useRef(false)
  const menuId = useId()

  const menuItems = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [open])

  // After a keyboard open, move focus into the menu once it has rendered.
  useEffect(() => {
    if (open && focusFirst.current) {
      focusFirst.current = false
      requestAnimationFrame(() => menuItems()[0]?.focus())
    }
  }, [open])

  const onTriggerKey = (e: KeyboardEvent) => {
    pointerType.current = 'key'
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusFirst.current = true
      if (open) menuItems()[0]?.focus()
      else setOpen(true)
    } else if (e.key === 'Enter' || e.key === ' ') {
      focusFirst.current = true
    }
  }

  const onMenuKey = (e: KeyboardEvent) => {
    const els = menuItems()
    const i = els.indexOf(document.activeElement as HTMLElement)
    const go = (n: number) => {
      e.preventDefault()
      els[(n + els.length) % els.length]?.focus()
    }
    if (e.key === 'ArrowDown') go(i + 1)
    else if (e.key === 'ArrowUp') go(i - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(els.length - 1)
    else if (e.key === 'Escape') {
      e.stopPropagation()
      setOpen(false)
      trigger.current?.focus()
    }
  }

  return (
    <li
      ref={ref}
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && open && onMenuKey(e)}
    >
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        onKeyDown={onTriggerKey}
        // With a mouse the hover has already opened the menu, so a click must not close it again.
        onClick={() => setOpen((v) => (pointerType.current === 'mouse' ? true : !v))}
        className={`t-label inline-flex h-10 items-center gap-1.5 rounded-full px-4 whitespace-nowrap transition-colors duration-200 ${
          active || open ? 'bg-tint/60 text-deep' : 'text-ink/80 hover:bg-white hover:text-ink'
        }`}
      >
        {label}
        <CaretDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKey}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 z-10 w-72 list-none rounded-panel border border-tint bg-white p-2 shadow-overlay"
            style={{ marginTop: 8 }}
          >
            {items.map((l) => (
              <li key={l.label} role="none">
                <SmartLink
                  href={l.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="t-label flex h-11 items-center rounded-control px-4 text-ink transition-colors duration-200 hover:bg-surface hover:text-deep focus-visible:bg-surface"
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
export function NavMobileGroup({ label, items, onNavigate }: { label: string; items: readonly NavDropdownItem[]; onNavigate: () => void }) {
  return (
    <li>
      <p className="t-label flex h-12 items-center px-4 text-ink/60">{label}</p>
      <ul className="flex flex-col gap-1 pl-4">
        {items.map((l) => (
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
