import { CaretDown, Eye, EyeSlash } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useId, useState, type FormEvent } from 'react'
import { SmartLink } from '../ui/SmartLink'

export type LoginRole = 'STUDENT' | 'PARTNER' | 'ADMIN'

/** The roles the platform can actually sign in (student, partner and admin each have their own endpoint). */
export const loginRoles: { value: LoginRole; label: string }[] = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'ADMIN', label: 'Admin' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LoginFormPanelProps {
  role: LoginRole
  onRoleChange: (role: LoginRole) => void
  loading: boolean
  /** Shown only when Google sign-in is configured (and for students). */
  googleEnabled: boolean
  onGoogle: () => void
  onSubmit: (credentials: { email: string; password: string }) => void
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export function LoginFormPanel({ role, onRoleChange, loading, googleEnabled, onGoogle, onSubmit }: LoginFormPanelProps) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = !email.trim() ? 'Enter your email address.' : !EMAIL_PATTERN.test(email.trim()) ? 'Enter a valid email address.' : ''
  const passwordError = !password ? 'Enter your password.' : ''
  const valid = !emailError && !passwordError

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!valid || loading) return
    onSubmit({ email: email.trim(), password })
  }

  const showEmailError = touched.email && emailError
  const showPasswordError = touched.password && passwordError
  const student = role === 'STUDENT'
  const partner = role === 'PARTNER'

  return (
    <motion.section
      aria-labelledby="login-title"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center px-2 py-10 sm:px-8 lg:px-10 lg:py-0"
    >
      <div className="w-full max-w-sm">
        <h2 id="login-title" className="t-title">
          Login to STEM Portal
        </h2>

        <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
          <div>
            <label htmlFor={`${id}-email`} className="t-label mb-2 block">
              Email Address
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={showEmailError ? true : undefined}
              aria-describedby={showEmailError ? `${id}-email-error` : undefined}
              className={`field ${showEmailError ? '!border-red-500' : ''}`}
            />
            {showEmailError && (
              <p id={`${id}-email-error`} role="alert" className="t-small mt-1.5 text-red-600">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor={`${id}-password`} className="t-label">
                Password
              </label>
              {student && (
                <SmartLink href="/forgot-password" className="t-small text-deep underline-offset-4 hover:underline">
                  Forgot Password?
                </SmartLink>
              )}
            </div>
            <div className="relative">
              <input
                id={`${id}-password`}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={showPasswordError ? true : undefined}
                aria-describedby={showPasswordError ? `${id}-password-error` : undefined}
                className={`field !pr-12 ${showPasswordError ? '!border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-control text-ink/60 transition-colors duration-200 hover:text-deep"
              >
                {showPassword ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            {showPasswordError && (
              <p id={`${id}-password-error`} role="alert" className="t-small mt-1.5 text-red-600">
                {passwordError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${id}-role`} className="t-label mb-2 block">
              Choose Role
            </label>
            <div className="relative">
              <select
                id={`${id}-role`}
                name="role"
                value={role}
                onChange={(e) => onRoleChange(e.target.value as LoginRole)}
                className="field appearance-none !pr-11"
              >
                {loginRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <CaretDown size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink/60" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !valid}
            aria-busy={loading}
            className="btn btn-primary w-full transition-transform duration-200 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 motion-reduce:transition-none"
          >
            {loading ? (
              <>
                <span className="login-spinner size-4 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Logging in…
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {(student || partner) && (
          <p className="t-small mt-5 text-center text-ink/70">
            {student ? 'Don’t have an account? ' : 'Want to partner with us? '}
            <SmartLink href={student ? '/signup' : '/partner/signup'} className="font-medium text-deep underline-offset-4 hover:underline">
              {student ? 'Create account' : 'Sign up'}
            </SmartLink>
          </p>
        )}

        {googleEnabled && (
          <>
            <div className="my-5 flex items-center gap-4" role="separator" aria-label="Or">
              <span className="h-px flex-1 bg-tint" />
              <span className="t-small text-ink/60">Or</span>
              <span className="h-px flex-1 bg-tint" />
            </div>
            <button type="button" onClick={onGoogle} disabled={loading} className="btn btn-secondary w-full !border-tint !text-ink hover:!bg-surface">
              <GoogleIcon />
              Continue with Google
            </button>
          </>
        )}

        <p className="t-small mt-6 text-center text-ink/60">
          By continuing, you agree to our{' '}
          <SmartLink href="/terms-condition" className="text-deep underline underline-offset-4">
            Terms of Service
          </SmartLink>{' '}
          and{' '}
          <SmartLink href="/privacy-policy" className="text-deep underline underline-offset-4">
            Privacy Policy
          </SmartLink>
          .
        </p>
      </div>
    </motion.section>
  )
}
