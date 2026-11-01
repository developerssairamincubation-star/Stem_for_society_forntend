/** Tiny path router: the site is a static SPA with a few pages, so no router dependency is needed. */
export const currentPath = () => window.location.pathname.replace(/\/+$/, '') || '/'
export const isHomePath = () => currentPath() === '/'
export const INSTITUTIONS_PATH = '/institutions'
export const LOGIN_PATH = '/login'
export const COMMUNITY_PATH = '/community'
export const CAMPUS_AMBASSADOR_PATH = '/campus-ambassador'

/**
 * Section anchors live on the home page; the footer exists on every page and #partner also exists on the
 * Institutions page (its custom-solution band), so everything else is prefixed with "/" off the home page.
 */
export const sectionHref = (href: string) => {
  if (isHomePath() || !href.startsWith('#') || href === '#resources') return href
  if (href === '#partner' && currentPath() === INSTITUTIONS_PATH) return href
  return `/${href}`
}
