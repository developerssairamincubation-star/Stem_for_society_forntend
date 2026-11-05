/**
 * Entrance motion for the public pages (never the home page, never the Partner and Admin dashboards).
 *
 * Pages that opt in with `.sfs-skin` or `.sfs-polish` (Institutions, Community, Campus Ambassador) get a soft fade-and-rise on
 * their cards, tables and section headings as they come into view. It watches the document, so content that arrives after a
 * data request fades in too. Nothing is rewritten in the pages themselves: the script only adds a `data-reveal` attribute and
 * removes it again when the entrance has finished, so it never fights hover transforms or layout.
 *
 * Elements already animated by framer-motion (inline opacity) and anything inside an element that is revealing are skipped,
 * and nothing runs when the visitor prefers reduced motion.
 */

const GROUPS = [
  {
    root: '.sfs-skin main',
    targets: ['.card', '.section-head', 'ul.grid > li', 'table', '.prose-sfs > h2'].join(','),
  },
  {
    root: '.sfs-polish main',
    targets: '.card',
  },
]

const STEP_MS = 60
const MAX_STEPS = 8
const CLEAN_AFTER_MS = 900

export function startAutoMotion() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  document.documentElement.classList.add('sfs-motion')
  const seen = new WeakSet<Element>()

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        io.unobserve(el)
        el.classList.add('is-in')
        window.setTimeout(() => {
          el.removeAttribute('data-reveal')
          el.classList.remove('is-in')
          el.style.removeProperty('transition-delay')
        }, CLEAN_AFTER_MS + (parseInt(el.style.transitionDelay) || 0))
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
  )

  const mark = (nodes: Element[]) => {
    const perParent = new Map<Element, number>()
    for (const el of nodes) {
      if (seen.has(el)) continue
      seen.add(el)
      if (el.closest('[data-reveal]') && !el.hasAttribute('data-reveal')) continue
      if (el.closest('[style*="opacity"]')) continue
      const parent = el.parentElement
      const i = parent ? perParent.get(parent) ?? 0 : 0
      if (parent) perParent.set(parent, i + 1)
      ;(el as HTMLElement).style.transitionDelay = `${Math.min(i, MAX_STEPS) * STEP_MS}ms`
      el.setAttribute('data-reveal', 'up')
      io.observe(el)
    }
  }

  const collect = (root: Element) => {
    const found: Element[] = []
    for (const group of GROUPS) {
      const inScope = root.closest(group.root) !== null
      if (inScope) {
        if (root.matches(group.targets)) found.push(root)
        root.querySelectorAll(group.targets).forEach((n) => found.push(n))
      } else {
        root.querySelectorAll(group.root).forEach((scope) => {
          scope.querySelectorAll(group.targets).forEach((n) => found.push(n))
        })
      }
    }
    return found
  }

  const mo = new MutationObserver((records) => {
    const found: Element[] = []
    for (const r of records) {
      r.addedNodes.forEach((n) => {
        if (n.nodeType === 1) found.push(...collect(n as Element))
      })
    }
    if (found.length) mark(found)
  })
  mo.observe(document.body, { childList: true, subtree: true })
  mark(collect(document.body))

  return () => {
    mo.disconnect()
    io.disconnect()
    document.documentElement.classList.remove('sfs-motion')
  }
}
