import { BookOpen, CaretDown, SignOut, UserCircle } from '@phosphor-icons/react'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useUser } from '@/lib/hooks'
import { links } from '../config'
import { Button } from './ui/Button'
import { SmartLink } from './ui/SmartLink'

/**
 * Header account control, wired to the platform's existing student session (`useUser`):
 * signed out shows Login (with the same `returnTo` the old header used); signed in shows the account menu
 * with "My trainings" and Logout.
 */
export function AuthControl({ blue = false }: { blue?: boolean }) {
  const { user, signOut } = useUser()
  const { pathname, search, hash } = useLocation()
  const [, setFilterByMe] = useQueryState<boolean>('me', parseAsBoolean)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  if (!user) {
    const returnTo = encodeURIComponent(`${pathname}${search}${hash}`)
    return (
      <Button href={`${links.login}?returnTo=${returnTo}`} size="sm" className={blue ? '!bg-brand hover:!bg-[#0277e0]' : ''}>
        Login
      </Button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`t-label inline-flex h-10 items-center gap-2 rounded-full px-3 transition-colors duration-200 ${blue ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-tint/60 text-deep hover:bg-tint'}`}
      >
        <UserCircle size={22} aria-hidden="true" />
        <span className="hidden max-w-28 truncate sm:inline">{user.user.firstName}</span>
        <CaretDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute top-full right-0 z-10 mt-2 w-52 rounded-panel border border-tint bg-white p-2 shadow-overlay">
          <SmartLink
            href="/courses?me=true"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="t-label flex h-11 items-center gap-3 rounded-control px-3 text-ink transition-colors duration-200 hover:bg-surface hover:text-deep"
          >
            <BookOpen size={18} aria-hidden="true" />
            My trainings
          </SmartLink>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              setFilterByMe(null)
              signOut()
            }}
            className="t-label flex h-11 w-full items-center gap-3 rounded-control px-3 text-left text-ink transition-colors duration-200 hover:bg-surface hover:text-deep"
          >
            <SignOut size={18} aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
