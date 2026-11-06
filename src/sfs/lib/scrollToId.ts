/** Smooth-scrolls to an element, or jumps straight there when the visitor prefers reduced motion. Moves focus so keyboard users land in the section. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
  history.replaceState(null, '', `#${id}`)
}
