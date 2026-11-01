import { X } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useEffect, useId, useRef, type ReactNode } from 'react'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
const ease = [0.16, 1, 0.3, 1] as const

/** Dimmed backdrop. The blur here solves a real layering problem (page content under a dialog). */
export function ModalOverlay() {
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    />
  )
}

/** Full-screen click target that centres its panel; clicking the empty area closes. */
export function ModalFrame({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[61] flex items-center justify-center p-4 sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  )
}

interface ModalPanelProps {
  title: string
  onClose: () => void
  children: ReactNode
  /** Shared id: the panel grows out of / shrinks back into the element carrying the same layoutId. */
  layoutId?: string
  wide?: boolean
}

export function ModalPanel({ title, onClose, children, layoutId, wide = false }: ModalPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const panel = ref.current!
    panel.querySelector<HTMLElement>('input,select,textarea')?.focus({ preventScroll: true })
    if (!panel.contains(document.activeElement)) panel.focus({ preventScroll: true })
  }, [])

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const nodes = Array.from(ref.current!.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (!nodes.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={trapTab}
      // Radius lives in style so the layout animation can correct it while the box scales (= --radius-panel).
      style={{ borderRadius: 24 }}
      {...(layoutId
        ? { transition: { layout: { duration: 0.5, ease } } }
        : {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 16 },
            transition: { duration: 0.3, ease },
          })}
      className={`relative flex max-h-[92svh] w-full flex-col overflow-hidden bg-white shadow-overlay outline-none ${wide ? 'sm:max-w-3xl' : 'sm:max-w-2xl'}`}
    >
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>
      <button type="button" onClick={onClose} aria-label="Close dialog" className="icon-btn absolute top-4 right-4 z-10">
        <X size={20} aria-hidden="true" />
      </button>
      <div className="overflow-y-auto overscroll-contain">{children}</div>
    </motion.div>
  )
}

/** Panel contents fade in once the box has finished growing. */
export function ModalContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.25, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
    >
      {children}
    </motion.div>
  )
}
