import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

/** Full-page frame for the redesigned pages: navigation, content, footer. `sfs-page` switches the document back to window scrolling. */
export function SfsPage({ children }: { children: ReactNode }) {
  return (
    <div className="sfs-ui sfs-page bg-white">
      <a href="#main" className="btn btn-primary fixed top-3 left-3 z-[70] -translate-y-20 transition-transform focus:translate-y-0">
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </div>
  )
}
