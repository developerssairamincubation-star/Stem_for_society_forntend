import { ArrowDownLeft, ArrowRight, CalendarBlank, CaretDown, MapPin, UserCircle } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { timeRange } from '@/lib/sessionTime'
import { withDevPreview } from '@/preview/devPreview'
import type { StudentTraining } from '@/pages/Training'
import { eventKind } from '../../lib/eventKind'
import { Reveal } from '../ui/Reveal'

/** One name for everything that is coming up: training programmes, webinars, workshops and sessions. */
export const upcomingEventsIntro = {
  title: 'Upcoming Training & Events',
  description:
    'Discover upcoming learning opportunities, expert-led sessions, webinars and professional development events organised by STEM for Society.',
} as const

const MODE = { ONLINE: 'Online', OFFLINE: 'Offline', HYBRID: 'Hybrid' } as const
type Range = 'this' | 'next' | 'all'
const RANGE_LABEL: Record<Range, string> = { this: 'This month', next: 'Next month', all: 'All upcoming' }

const ordinal = (n: number) => {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`
}
const startsOn = (iso: string) => {
  const d = dayjs(iso)
  return `Starts ${ordinal(d.date())} ${d.format('MMM')}’${d.format('YY')}`
}

function useUpcoming() {
  return useQuery<StudentTraining[]>({
    queryKey: ['trainings', 'upcoming'],
    queryFn: async () => {
      const res = await withDevPreview(() => api().get<{ data?: StudentTraining[] }>('/trainings'), 'trainings')
      const startOfToday = dayjs().startOf('day')
      return (res.data?.data ?? [])
        .filter((t) => t.startDate && dayjs(t.startDate).isValid() && !dayjs(t.endDate || t.startDate).isBefore(startOfToday))
        .sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf())
    },
    staleTime: 1000 * 60 * 5,
  })
}

/** The thin rule between two sessions, with a small diamond where it meets the details column. */
function Rule() {
  return (
    <div aria-hidden="true" className={`grid ${COLUMNS}`}>
      <span />
      <div className="relative h-px bg-white/60">
        <span className="absolute top-1/2 -left-1.5 size-2.5 -translate-y-1/2 rotate-45 bg-white max-lg:hidden" />
      </div>
    </div>
  )
}
const COLUMNS = 'lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-14'

function Row({ e }: { e: StudentTraining }) {
  const time = timeRange(e.startDate, e.endDate)
  const mode = MODE[e.type] ?? 'Online'
  const registered = e.isEnrolled || e.enrolments?.some((x) => x.transactions?.some((t) => t.status === 'success'))
  const host = [e.instructor?.firstName, e.instructor?.lastName].filter(Boolean).join(' ')
  const partner = host || e.instructor?.institutionName
  return (
    <article className={`group relative grid gap-4 py-8 ${COLUMNS} lg:items-center`}>
      <div>
        <p className="text-[1.5rem] leading-tight font-semibold text-tint sm:text-[1.75rem]">{startsOn(e.startDate)}</p>
        {time && <p className="t-small !mt-1 text-white/75">{time}</p>}
      </div>

      <div className="relative pr-16">
        <h3 className="t-heading !text-white">
          <Link to={`/training/${e.id}`} className="outline-offset-4 after:absolute after:-inset-y-8 after:inset-x-0 after:content-['']">
            {e.title}
          </Link>
        </h3>
        <p className="t-small !mt-2 line-clamp-2 text-white/80">{e.description}</p>
        <ul className="t-small mt-4 grid gap-2 p-0 font-medium text-white" aria-label="Details">
          <li className="flex list-none items-center gap-2.5">
            <MapPin size={20} weight="fill" className="shrink-0 text-tint" aria-hidden="true" />
            {e.location ? `${mode} at ${e.location}` : mode}
          </li>
          {partner && (
            <li className="flex list-none items-center gap-2.5">
              <UserCircle size={20} weight="fill" className="shrink-0 text-tint" aria-hidden="true" />
              In collaboration with {partner}
            </li>
          )}
          <li className="flex list-none flex-wrap items-center gap-x-4 gap-y-1 text-white/75">
            <span>{eventKind(e.title)}</span>
            {e.category && <span>For {e.category}</span>}
            {registered && <span className="text-tint">You are registered</span>}
          </li>
        </ul>
        <ArrowDownLeft
          size={44}
          weight="light"
          aria-hidden="true"
          className="absolute top-1/2 right-0 -translate-y-1/2 text-tint transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-[-40%] motion-reduce:transition-none"
        />
      </div>
    </article>
  )
}

export function UpcomingEvents({ limit = 3, id = 'events' }: { limit?: number; id?: string }) {
  const { data, isPending, isError, refetch } = useUpcoming()
  const [choice, setChoice] = useState<Range | null>(null)
  const selectId = useId()

  const inMonth = (iso: string, offset: number) => dayjs(iso).isSame(dayjs().add(offset, 'month'), 'month')
  const thisMonth = useMemo(() => (data ?? []).filter((e) => inMonth(e.startDate, 0)), [data])
  // Open on "This month" when it has sessions; otherwise show everything that is coming up.
  const range: Range = choice ?? (thisMonth.length > 0 ? 'this' : 'all')
  const shown = useMemo(() => {
    const all = data ?? []
    const list = range === 'this' ? thisMonth : range === 'next' ? all.filter((e) => inMonth(e.startDate, 1)) : all
    return list.slice(0, limit)
  }, [data, range, thisMonth, limit])

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section bg-surface">
      <div className="container-x">
        <Reveal className="on-dark rounded-panel bg-deep px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2 id={`${id}-title`} className="text-[1.75rem] leading-tight !font-bold tracking-tight !text-tint uppercase sm:text-[2.5rem]">
              {upcomingEventsIntro.title}
            </h2>
            <div className="relative inline-flex items-center">
              <label htmlFor={selectId} className="sr-only">
                Show sessions for
              </label>
              <select
                id={selectId}
                value={range}
                onChange={(e) => setChoice(e.target.value as Range)}
                className="[field-sizing:content] cursor-pointer appearance-none !border-0 !bg-transparent !p-0 !pr-9 !text-[1.75rem] !leading-tight !font-light tracking-tight !text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tint sm:!text-[2.5rem]"
              >
                {(Object.keys(RANGE_LABEL) as Range[]).map((r) => (
                  <option key={r} value={r} className="text-ink">
                    {RANGE_LABEL[r]}
                  </option>
                ))}
              </select>
              <CaretDown size={28} aria-hidden="true" className="pointer-events-none absolute right-0 text-white" />
            </div>
          </div>
          <p className="t-body !mt-4 max-w-2xl text-white/80">{upcomingEventsIntro.description}</p>

          <div className="mt-8">
            {isPending ? (
              <div aria-busy="true" aria-label="Loading sessions" className="grid gap-6">
                {Array.from({ length: limit }, (_, i) => (
                  <div key={i} aria-hidden="true" className="h-24 animate-pulse rounded-card bg-white/10" />
                ))}
              </div>
            ) : isError ? (
              <div role="status" className="py-8">
                <p className="t-heading !text-white">We could not load sessions right now</p>
                <p className="t-body !mt-2 text-white/80">Please check your connection and try again.</p>
                <button type="button" onClick={() => refetch()} className="btn btn-inverse mt-5">
                  Try again
                </button>
              </div>
            ) : shown.length > 0 ? (
              <ul className="p-0">
                {shown.map((e, i) => (
                  <li key={e.id} className="list-none">
                    {i > 0 && <Rule />}
                    <Row e={e} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-3 py-8">
                <CalendarBlank size={32} className="text-tint" aria-hidden="true" />
                <p className="t-heading !text-white">New training programmes and events will be announced soon</p>
                <p className="t-body max-w-xl text-white/80">
                  {range === 'all'
                    ? 'Follow our community channels or check back shortly for upcoming sessions, webinars and workshops.'
                    : 'Nothing is scheduled for this period yet. Try another month or see everything that is coming up.'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Link to="/training" className="t-label nudge inline-flex items-center gap-2 text-tint underline decoration-tint/40 decoration-2 underline-offset-4 hover:decoration-tint">
              View all training and events
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
