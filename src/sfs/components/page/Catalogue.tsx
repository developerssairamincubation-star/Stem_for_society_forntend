import { MagnifyingGlass, SlidersHorizontal, ArrowCounterClockwise } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

/** White filter bar that holds the page's own selects, the search box and the reset button. */
export function CatalogueFilters({
  children,
  search,
  onSearch,
  onReset,
}: {
  children: ReactNode
  search: string
  onSearch: (value: string) => void
  onReset: () => void
}) {
  return (
    <div className="card mb-8 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="t-label inline-flex items-center gap-2 rounded-control bg-surface px-4 py-2.5 text-deep">
          <SlidersHorizontal size={18} aria-hidden="true" />
          Filter By
        </div>
        {children}
        <div className="relative min-w-[200px] flex-1">
          <label htmlFor="catalogue-search" className="sr-only">
            Search courses
          </label>
          <MagnifyingGlass size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink/50" aria-hidden="true" />
          <input id="catalogue-search" type="text" placeholder="Search courses..." value={search} onChange={(e) => onSearch(e.target.value)} className="!pl-10" />
        </div>
        <button type="button" onClick={onReset} className="btn btn-secondary !border-tint !text-ink hover:!bg-surface">
          <ArrowCounterClockwise size={16} aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  )
}

export function CatalogueEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="card px-6 py-16 text-center">
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-surface text-brand">
        <MagnifyingGlass size={30} aria-hidden="true" />
      </div>
      <h3 className="t-heading">No courses found</h3>
      <p className="t-body mt-2 text-ink/70">Try adjusting your filters or search query</p>
      <button type="button" onClick={onReset} className="btn btn-primary mt-6">
        Clear Filters
      </button>
    </div>
  )
}
