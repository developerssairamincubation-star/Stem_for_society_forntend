import { useEffect } from 'react'

/** Escape-to-close, page scroll lock and focus restore for as long as any dialog is open. */
export function useModalLifecycle(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])
}
