import { ArrowRight, CalendarBlank, Clock, MapPin, UsersThree } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { timeRange } from '@/lib/sessionTime'
import { withDevPreview } from '@/preview/devPreview'
import type { StudentTraining } from '@/pages/Training'
import { eventKind } from '../../lib/eventKind'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

/** One name for everything that is coming up: training programmes, webinars, workshops and sessions. */
export const upcomingEventsIntro = {
  label: 'UPCOMING TRAINING & EVENTS',
  title: 'Upcoming Training & Events',
  description:
    'Discover upcoming learning opportunities, expert-led sessions, webinars and professional development events organised by STEM for Society.',
} as const

const MODE = { ONLINE: 'Online', OFFLINE: 'Offline', HYBRID: 'Hybrid' } as const

function useUpcoming(limit: number) {
  return useQuery<StudentTraining[]>({
    queryKey: ['trainings', 'upcoming', limit],
    queryFn: async () => {
      const res = await withDevPreview(() => api().get<{ data?: StudentTraining[] }>('/trainings'), 'trainings')
      const startOfToday = dayjs().startOf('day')
      return (res.data?.data ?? [])
        .filter((t) => t.startDate && dayjs(t.startDate).isValid() && !dayjs(t.endDate || t.startDate).isBefore(startOfToday))
        .sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf())
        .slice(0, limit)
    },
    staleTime: 1000 * 60 * 5,
  })
}

function EventCard({ e }: { e: StudentTraining }) {
  const start = dayjs(e.startDate)
  const time = timeRange(e.startDate, e.endDate)
  const registered = e.isEnrolled || e.enrolments?.some((x) => x.transactions?.some((t) => t.status === 'success'))
  const mode = MODE[e.type] ?? 'Online'
  return (
    <article className="card group relative flex h-full flex-col gap-4 p-6 transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised motion-reduce:transition-none">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-16 w-16 shrink-0 place-content-center rounded-card bg-deep text-center text-white" aria-hidden="true">
          <span className="text-xs font-medium text-white/80">{start.format('MMM')}</span>
          <span className="text-2xl leading-none font-semibold">{start.format('D')}</span>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <span className="chip text-deep">{eventKind(e.title)}</span>
          <span className={`chip ${registered ? '!bg-emerald-50 text-emerald-800' : 'text-ink/80'}`}>{registered ? 'Registered' : 'Registration open'}</span>
        </div>
      </div>

      <h3 className="t-heading line-clamp-2">
        <Link to={`/training/${e.id}`} className="outline-offset-4 after:absolute after:inset-0 after:content-['']">
          {e.title}
        </Link>
      </h3>
      <p className="t-small line-clamp-2 text-ink/70">{e.description}</p>

      <dl className="t-small mt-auto grid gap-2 text-ink/80">
        <div className="flex items-center gap-2.5">
          <dt className="sr-only">Date</dt>
          <CalendarBlank size={18} className="shrink-0 text-brand" aria-hidden="true" />
          <dd>{start.format('ddd, D MMM YYYY')}</dd>
        </div>
        {time && (
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Time</dt>
            <Clock size={18} className="shrink-0 text-brand" aria-hidden="true" />
            <dd>{time}</dd>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <dt className="sr-only">Format</dt>
          <MapPin size={18} className="shrink-0 text-brand" aria-hidden="true" />
          <dd>{e.location ? `${mode}, ${e.location}` : mode}</dd>
        </div>
        {e.category && (
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Intended audience</dt>
            <UsersThree size={18} className="shrink-0 text-brand" aria-hidden="true" />
            <dd>For {e.category}</dd>
          </div>
        )}
      </dl>

      <span className="t-label inline-flex items-center gap-2 text-deep">
        {registered ? 'View details' : 'Register'}
        <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
      </span>
    </article>
  )
}

export function UpcomingEvents({ limit = 3, id = 'events' }: { limit?: number; id?: string }) {
  const { data, isPending, isError, refetch } = useUpcoming(limit)

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section bg-surface">
      <div className="container-x">
        <div className="section-head flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <Reveal>
              <p className="t-label text-deep">{upcomingEventsIntro.label}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id={`${id}-title`} className="t-title mt-3">
                {upcomingEventsIntro.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-lead mt-4 text-ink/70">{upcomingEventsIntro.description}</p>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="shrink-0">
            <Button href="/training" variant="secondary" className="nudge">
              View all
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </Reveal>
        </div>

        {isPending ? (
          <ul className="grid gap-6 p-0 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading events">
            {Array.from({ length: limit }, (_, i) => (
              <li key={i} aria-hidden="true" className="card h-72 list-none animate-pulse bg-white" />
            ))}
          </ul>
        ) : isError ? (
          <div role="status" className="card mx-auto max-w-xl p-8 text-center">
            <p className="t-heading">We could not load events right now</p>
            <p className="t-body mt-2 text-ink/70">Please check your connection and try again.</p>
            <button type="button" onClick={() => refetch()} className="btn btn-secondary mt-5">
              Try again
            </button>
          </div>
        ) : data && data.length > 0 ? (
          <ul className="grid gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {data.map((e, i) => (
              <Reveal as="li" key={e.id} delay={(i % 3) * 0.07} className="h-full list-none">
                <EventCard e={e} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="card mx-auto max-w-xl p-10 text-center">
            <span aria-hidden="true" className="mx-auto grid size-14 place-items-center rounded-full bg-surface text-deep">
              <CalendarBlank size={28} />
            </span>
            <p className="t-heading mt-4">New training programmes and events will be announced soon</p>
            <p className="t-body mt-2 text-ink/70">Follow our community channels or check back shortly for upcoming sessions, webinars and workshops.</p>
            <Button href="/community" variant="secondary" className="mt-6">
              Join our community
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
