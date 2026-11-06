import { describe, expect, it } from 'vitest'
import { normaliseWebsite, validate } from './organisationValidation'

const valid = {
  organisation: 'Example Institute',
  type: 'Educational Institution',
  email: 'team@example.org',
  countryCode: '+91',
  phone: '9876543210',
  website: '',
  interest: 'Finishing School',
  activities: 'Guest lectures',
  location: '',
  details: 'We run a college in Bengaluru.',
}

describe('organisation form validation', () => {
  it('accepts a complete registration, with website and location optional', () => {
    expect(validate(valid)).toEqual({})
  })

  it('requires every mandatory field', () => {
    const errors = validate({ ...valid, organisation: ' ', type: '', email: '', phone: '', interest: '', activities: '', details: '' })
    expect(Object.keys(errors).sort()).toEqual(['activities', 'details', 'email', 'interest', 'organisation', 'phone', 'type'])
  })

  it('checks the email format', () => {
    expect(validate({ ...valid, email: 'not-an-email' }).email).toBeTruthy()
  })

  it('checks Indian mobile numbers and other countries separately', () => {
    expect(validate({ ...valid, phone: '12345' }).phone).toBeTruthy()
    expect(validate({ ...valid, phone: '5876543210' }).phone).toBeTruthy()
    expect(validate({ ...valid, phone: '98765 43210' }).phone).toBeUndefined()
    expect(validate({ ...valid, countryCode: '+44', phone: '2079460958' }).phone).toBeUndefined()
    expect(validate({ ...valid, phone: 'abc' }).phone).toBeTruthy()
  })

  it('validates the website only when one is given', () => {
    expect(validate({ ...valid, website: 'www.example.org' }).website).toBeUndefined()
    expect(validate({ ...valid, website: 'not a site' }).website).toBeTruthy()
    expect(normaliseWebsite('example.org')).toBe('https://example.org/')
    expect(normaliseWebsite('localhost')).toBeNull()
  })
})
