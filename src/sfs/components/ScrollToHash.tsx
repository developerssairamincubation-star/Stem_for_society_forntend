import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the element named in the URL hash after a route change ("/#academy" from another page).
 * The target often is not mounted yet (lazy page, pinned sections), so it retries for about two seconds.
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    const timer = window.setInterval(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.clearInterval(timer)
      } else if (++tries > 20) {
        window.clearInterval(timer)
      }
    }, 100)
    return () => window.clearInterval(timer)
  }, [pathname, hash])

  return null
}
