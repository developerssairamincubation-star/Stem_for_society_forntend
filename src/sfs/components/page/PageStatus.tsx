import { PageFrame } from './PageFrame'

/** Loading state shown inside the page frame so the navigation stays visible while data arrives. */
export function PageLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <PageFrame tone="surface">
      <div role="status" aria-live="polite" className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-28 pb-16 text-center">
        <div className="login-spinner size-10 rounded-full border-[3px] border-tint border-t-deep" aria-hidden="true" />
        <p className="t-body text-ink/70">{label}</p>
      </div>
    </PageFrame>
  )
}
