import { Check, PaperPlaneRight, WarningCircle } from '@phosphor-icons/react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { enquiryEndpoint } from '../../config'
import { contact } from '../../data/content'
import { collaborationInterests, countryCodes, locations, organisationTypes } from '../../data/partnerPage'
import { normaliseWebsite, validate, type Values } from '../../lib/organisationValidation'

/**
 * Organisation registration. It submits the same way as the Institutions enquiry forms: when VITE_ENQUIRY_ENDPOINT is set the
 * details are POSTed there and success is shown only after the server answers OK; otherwise the details open as a pre-filled
 * email to the published address, and the page says exactly that (it never claims the registration was received).
 */

type Status = 'idle' | 'sending' | 'sent' | 'mailed' | 'error'

const control =
  'field !h-12 !border-[var(--sfs-edge)] hover:!border-deep focus-visible:!outline-2 focus-visible:!outline-offset-[-3px] focus-visible:!outline-brand aria-[invalid=true]:!border-[#b42318]'
const area = `${control} !h-auto min-h-28 py-3 leading-relaxed`

function Field({ id, label, required, error, hint, children }: { id: string; label: string; required?: boolean; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="t-label">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-deep">
              {' '}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="t-small font-normal text-ink/60"> (optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="t-small flex items-start gap-1.5 text-[#b42318]">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="t-small text-ink/60">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function OrganisationForm({
  type,
  onTypeChange,
  interest,
  onInterestChange,
}: {
  type: string
  onTypeChange: (type: string) => void
  interest: string
  onInterestChange: (interest: string) => void
}) {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Omit<Values, 'type' | 'interest'>>({
    organisation: '',
    email: '',
    countryCode: '+91',
    phone: '',
    website: '',
    activities: '',
    location: '',
    details: '',
  })
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')

  const all: Values = { ...values, type, interest }
  const errors = validate(all)
  const id = (name: keyof Values) => `${uid}-${name}`
  const set = (name: keyof Omit<Values, 'type' | 'interest'>) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [name]: e.target.value }))
  const blur = (name: keyof Values) => () => setTouched((t) => ({ ...t, [name]: true }))
  const shown = (name: keyof Values) => (touched[name] ? errors[name] : undefined)
  const aria = (name: keyof Values, hint = false) => ({
    'aria-invalid': shown(name) ? (true as const) : undefined,
    'aria-describedby': shown(name) ? `${id(name)}-error` : hint ? `${id(name)}-hint` : undefined,
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const keys = Object.keys(all) as (keyof Values)[]
    setTouched(Object.fromEntries(keys.map((k) => [k, true])))
    const first = keys.find((k) => errors[k])
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[id="${id(first)}"]`)?.focus()
      return
    }

    const entries: Record<string, string> = {
      'Organisation Name': all.organisation.trim(),
      'Organisation Type': all.type,
      Email: all.email.trim(),
      'Contact Number': `${all.countryCode} ${all.phone.replace(/[\s-]/g, '')}`,
      Website: normaliseWebsite(all.website) ?? '',
      'Collaboration Interest': all.interest,
      'Proposed Activities': all.activities.trim(),
      Location: all.location,
      'Additional Details': all.details.trim(),
    }

    if (enquiryEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(enquiryEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'organisation-registration', ...entries, page: window.location.href }),
        })
        if (!res.ok) throw new Error(String(res.status))
        setStatus('sent')
      } catch {
        setStatus('error')
      }
      return
    }

    const body = Object.entries(entries)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Organisation registration | ${entries['Organisation Name']}`)}&body=${encodeURIComponent(body)}`
    setStatus('mailed')
  }

  if (status === 'sent' || status === 'mailed') {
    return (
      <div role="status" className="grid gap-4 rounded-card bg-surface p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-deep text-white">
          <Check size={24} weight="bold" aria-hidden="true" />
        </span>
        {status === 'sent' ? (
          <>
            <h3 className="t-heading">Thank you. Your registration has been received.</h3>
            <p className="t-body text-ink/70">Our team will review the details and get back to you at {values.email.trim()}.</p>
          </>
        ) : (
          <>
            <h3 className="t-heading">One more step: send the email</h3>
            <p className="t-body text-ink/70">
              Your email app should now be open with your registration filled in. Please send it to complete your registration. If nothing opened, write to us at{' '}
              <a className="text-deep underline decoration-tint decoration-2 underline-offset-4" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              .
            </p>
          </>
        )}
        <button type="button" className="btn btn-secondary justify-self-start" onClick={() => setStatus('idle')}>
          Back to the form
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-5" aria-label="Organisation registration">
      <Field id={id('organisation')} label="Organisation Name" required error={shown('organisation')}>
        <input id={id('organisation')} name="organisation" autoComplete="organization" placeholder="Name of your organisation" value={values.organisation} onChange={set('organisation')} onBlur={blur('organisation')} className={control} {...aria('organisation')} />
      </Field>

      <Field id={id('type')} label="Organisation Type" required error={shown('type')}>
        <select id={id('type')} name="type" value={type} onChange={(e) => onTypeChange(e.target.value)} onBlur={blur('type')} className={control} {...aria('type')}>
          <option value="">Select organisation type</option>
          {organisationTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id('email')} label="Email Address" required error={shown('email')}>
          <input id={id('email')} name="email" type="email" inputMode="email" autoComplete="email" placeholder="name@organisation.org" value={values.email} onChange={set('email')} onBlur={blur('email')} className={control} {...aria('email')} />
        </Field>

        <Field id={id('phone')} label="Contact Number" required error={shown('phone')}>
          <div className="flex gap-2">
            <select aria-label="Country code" name="countryCode" value={values.countryCode} onChange={set('countryCode')} className={`${control} !w-[7.5rem] shrink-0`}>
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
            <input id={id('phone')} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Phone" value={values.phone} onChange={set('phone')} onBlur={blur('phone')} className={control} {...aria('phone')} />
          </div>
        </Field>
      </div>

      <Field id={id('website')} label="Website" error={shown('website')}>
        <input id={id('website')} name="website" type="url" inputMode="url" autoComplete="url" placeholder="www.organisation.org" value={values.website} onChange={set('website')} onBlur={blur('website')} className={control} {...aria('website')} />
      </Field>

      <Field id={id('interest')} label="Collaboration Interest" required error={shown('interest')}>
        <select id={id('interest')} name="interest" value={interest} onChange={(e) => onInterestChange(e.target.value)} onBlur={blur('interest')} className={control} {...aria('interest')}>
          <option value="">Select an area</option>
          {collaborationInterests.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field id={id('activities')} label="Proposed Activities" required error={shown('activities')}>
        <textarea id={id('activities')} name="activities" rows={3} placeholder="How would you like to contribute or collaborate?" value={values.activities} onChange={set('activities')} onBlur={blur('activities')} className={area} {...aria('activities')} />
      </Field>

      <Field id={id('location')} label="Location">
        <select id={id('location')} name="location" value={values.location} onChange={set('location')} className={control}>
          <option value="">Select state or region</option>
          {locations.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field id={id('details')} label="Additional Details" required error={shown('details')}>
        <textarea id={id('details')} name="details" rows={3} placeholder="Anything else we should know about your organisation" value={values.details} onChange={set('details')} onBlur={blur('details')} className={area} {...aria('details')} />
      </Field>

      {status === 'error' && (
        <p role="alert" className="t-small flex items-start gap-2 rounded-control bg-[#fef3f2] p-3 text-[#b42318]">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
          We could not send your registration. Please try again, or write to us at {contact.email}.
        </p>
      )}

      <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className="btn btn-primary w-full">
        {status === 'sending' ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          <>
            Submit Registration
            <PaperPlaneRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="t-small text-center text-ink/60">
        Already a partner?{' '}
        <Link to="/partner/signin" className="text-deep underline decoration-tint decoration-2 underline-offset-4 hover:decoration-deep">
          Sign in
        </Link>
      </p>
    </form>
  )
}
