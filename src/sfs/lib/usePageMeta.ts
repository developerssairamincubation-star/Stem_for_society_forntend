import { useEffect } from 'react'

/**
 * Sets the page title, description and social-sharing tags while a page is shown, and puts the previous values back when it
 * is left. Small on purpose: the site has no head-management library and does not need one for a handful of pages.
 */
export function usePageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    const previousTitle = document.title
    const touched: { el: HTMLMetaElement; previous: string | null; created: boolean }[] = []

    const set = (attr: 'name' | 'property', key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      const created = !el
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      touched.push({ el, previous: created ? null : el.getAttribute('content'), created })
      el.setAttribute('content', value)
    }

    document.title = title
    set('name', 'description', description)
    set('property', 'og:title', title)
    set('property', 'og:description', description)
    set('property', 'og:type', 'website')
    set('name', 'twitter:card', 'summary_large_image')

    return () => {
      document.title = previousTitle
      for (const { el, previous, created } of touched) {
        if (created) el.remove()
        else if (previous !== null) el.setAttribute('content', previous)
      }
    }
  }, [title, description])
}
