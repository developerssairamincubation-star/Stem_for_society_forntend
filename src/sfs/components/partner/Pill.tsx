import type { ReactNode } from 'react'

/** The small rounded label above a heading, with a blue dot, as on the reference. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="t-small inline-flex w-fit items-center gap-2 rounded-full border border-tint bg-white/80 px-4 py-1.5 font-medium text-deep backdrop-blur-sm">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
      {children}
    </span>
  )
}
