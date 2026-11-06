/** Validation rules for the organisation registration form, kept apart from the component so they can be tested on their own. */
export interface Values {
  organisation: string
  type: string
  email: string
  countryCode: string
  phone: string
  website: string
  interest: string
  activities: string
  location: string
  details: string
}
export type Errors = Partial<Record<keyof Values, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Accepts "example.org" as well as a full address; returns a usable https URL or null. */
export function normaliseWebsite(input: string): string | null {
  const value = input.trim()
  if (!value) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return /\.[a-z]{2,}$/i.test(url.hostname) ? url.toString() : null
  } catch {
    return null
  }
}

export function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.organisation.trim()) e.organisation = 'Enter the name of your organisation.'
  if (!v.type) e.type = 'Choose the type of organisation.'
  if (!v.email.trim()) e.email = 'Enter an email address.'
  else if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address, for example name@organisation.org.'
  const digits = v.phone.replace(/[\s-]/g, '')
  if (!digits) e.phone = 'Enter a contact number.'
  else if (!/^\d+$/.test(digits)) e.phone = 'Use digits only, without the country code.'
  else if (v.countryCode === '+91' ? !/^[6-9]\d{9}$/.test(digits) : digits.length < 6 || digits.length > 14) {
    e.phone = v.countryCode === '+91' ? 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.' : 'Enter a valid phone number (6 to 14 digits).'
  }
  if (v.website.trim() && !normaliseWebsite(v.website)) e.website = 'Enter a valid website address, for example www.organisation.org.'
  if (!v.interest) e.interest = 'Choose how you would like to collaborate.'
  if (!v.activities.trim()) e.activities = 'Describe the activities you would like to propose.'
  if (!v.details.trim()) e.details = 'Share a few additional details about your organisation.'
  return e
}

