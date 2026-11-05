import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

/**
 * Frame for the redesigned pages: navigation and content (the shared footer comes from the application layout). `sfs-page` switches
 * the document back to window scrolling. `polish` adds the scoped surface and hover refinements (sfs-premium.css); the home page does not use it.
 */
export function SfsPage({ children, polish = false }: { children: ReactNode; polish?: boolean }) {
  return (
    <div className={`sfs-ui sfs-page bg-white${polish ? ' sfs-polish' : ''}`}>
      <a href="#main" className="btn btn-primary fixed top-3 left-3 z-[70] -translate-y-20 transition-transform focus:translate-y-0">
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
    </div>
  )
}
