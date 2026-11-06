import { Check, PaperPlaneTilt } from '@phosphor-icons/react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { enquiryEndpoint } from '../../config'
import { contact } from '../../data/content'
import { meetingSlots } from '../../data/institutions'
import { trainingPlans } from '../../data/trainingPlans'
import { ModalContent, ModalFrame, ModalPanel } from '../ui/Modal'

export type EnquiryMode = 'partner' | 'custom'
export interface EnquiryRequest {
  mode: EnquiryMode
  /** Pre-selected "Area of Interest" (programme title). */
  area?: string
  /** Programme card the form grows out of (shared layout id), when opened from a programme. */
  layoutId?: string
}

const COPY: Record<EnquiryMode, { title: string; blurb: string }> = {
  partner: {
    title: 'Partner With Us',
    blurb: "Tell us about your institution's needs. We'll build a custom plan for you.",
  },
  custom: {
    title: 'Discuss Custom Needs',
    blurb: "Share your institution's requirements and we'll get back to you shortly.",
  },
}

const inputCls = 'field'

function Field({ label, required, children, className = '' }: { label: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <label className={`t-label flex flex-col gap-1.5 ${className}`}>
      <span>
        {label}
        {required && <span className="text-deep"> *</span>}
      </span>
      {children}
    </label>
  )
}

export function EnquiryModal({ request, onClose }: { request: EnquiryRequest; onClose: () => void }) {
  const { mode, area, layoutId } = request
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'mailed' | 'error'>('idle')
  const copy = { ...COPY[mode], title: area && mode === 'partner' ? `Enquire: ${area}` : COPY[mode].title }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const entries = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const institute = entries.institute?.trim() || 'Institution'

    if (enquiryEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(enquiryEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: mode, ...entries, page: window.location.href }),
        })
        if (!res.ok) throw new Error(String(res.status))
        setStatus('sent')
      } catch {
        setStatus('error')
      }
      return
    }

    // No backend configured: hand the enquiry over as a pre-filled email to the published address.
    const body = Object.entries(entries)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    const subject = `${copy.title} | ${institute}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('mailed')
  }

  return (
    <ModalFrame onClose={onClose}>
    <ModalPanel title={copy.title} onClose={onClose} layoutId={layoutId}>
      <ModalContent className="p-8 sm:p-10">
        <p aria-hidden="true" className="t-title pr-12">
          {copy.title}
        </p>
        <p className="t-body mt-2 text-ink/70">{copy.blurb}</p>

        {status === 'sent' || status === 'mailed' ? (
          <div role="status" className="mt-8 rounded-card bg-surface p-6">
            <p className="t-label flex items-center gap-2">
              <Check size={18} aria-hidden="true" /> Thank you. We have your details.
            </p>
            <p className="t-body mt-2 text-ink/70">
              {status === 'mailed'
                ? `Your email app should now open with your enquiry filled in. If it didn't, write to us at ${contact.email}.`
                : "We'll get back to you shortly."}
            </p>
            <button type="button" onClick={onClose} className="btn btn-primary mt-5">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-7 grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <Field label="Name" required>
              <input name="Name" required autoComplete="name" placeholder="John Doe" className={inputCls} />
            </Field>
            <Field label="Designation" required>
              <input name="Designation" required placeholder="Principal" className={inputCls} />
            </Field>

            {mode === 'partner' ? (
              <>
                <Field label="Institute Name" required>
                  <input name="institute" required autoComplete="organization" placeholder="Lincoln High School" className={inputCls} />
                </Field>
                <Field label="Department">
                  <input name="Department" placeholder="Administration" className={inputCls} />
                </Field>
              </>
            ) : null}

            <Field label="Contact Number" required>
              <input name="Contact Number" required type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 9876543210" className={inputCls} />
            </Field>
            <Field label="Email" required>
              <input name="Email" required type="email" autoComplete="email" placeholder="principal@school.edu" className={inputCls} />
            </Field>

            {mode === 'custom' ? (
              <Field label="Institute Name" required className="sm:col-span-2">
                <input name="institute" required autoComplete="organization" placeholder="Lincoln High School" className={inputCls} />
              </Field>
            ) : (
              <>
                <Field label="Address" className="sm:col-span-2">
                  <input name="Address" autoComplete="street-address" placeholder="Street Address" className={inputCls} />
                </Field>
                <Field label="State">
                  <input name="State" autoComplete="address-level1" placeholder="Maharashtra" className={inputCls} />
                </Field>
                <Field label="City">
                  <input name="City" autoComplete="address-level2" placeholder="Mumbai" className={inputCls} />
                </Field>
                <Field label="Area of Interest" required className="sm:col-span-2">
                  <select name="Area of Interest" required defaultValue={area ?? ''} className={inputCls}>
                    <option value="" disabled>
                      Select a training plan
                    </option>
                    {trainingPlans.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.category}: {p.title}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Date of Meeting">
                  <input name="Date of Meeting" type="date" className={inputCls} />
                </Field>
                <Field label="Available Time">
                  <select name="Available Time" defaultValue="" className={inputCls}>
                    <option value="">Select a time</option>
                    {meetingSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}

            <Field label="Requirements / Questions" className="sm:col-span-2">
              <textarea
                name="Requirements / Questions"
                rows={3}
                placeholder="E.g., We are looking for a program for 200 11th-grade students..."
                className={inputCls}
              />
            </Field>

            {status === 'error' && (
              <p role="alert" className="t-small font-medium text-deep sm:col-span-2">
                Something went wrong sending your request. Please try again or email {contact.email}.
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn btn-primary mt-2 sm:col-span-2">
              Request Proposal
              <PaperPlaneTilt size={18} aria-hidden="true" />
            </button>
          </form>
        )}
      </ModalContent>
    </ModalPanel>
    </ModalFrame>
  )
}
