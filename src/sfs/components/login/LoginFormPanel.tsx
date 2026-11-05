import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { SmartLink } from '../ui/SmartLink'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LoginFormPanelProps {
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

/** The line under a field. It always takes its height, so an error appearing never moves the field below it. */
function FieldNote({ id, error, children }: { id: string; error?: string; children?: ReactNode }) {
  return (
    <div className="mt-1.5 flex min-h-[1.375rem] flex-wrap items-start justify-between gap-x-4 gap-y-1 text-sm leading-[1.375rem]">
      {error ? (
        <p id={id} role="alert" className="flex items-start gap-1.5 text-[var(--login-error)]">
          <WarningCircle size={18} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : (
        <span />
      )}
      {children}
    </div>
  )
}

export function LoginFormPanel({ loading, googleEnabled, onGoogle, onSubmit }: LoginFormPanelProps) {
  const id = useId()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = !email.trim() ? 'Enter your email address.' : !EMAIL_PATTERN.test(email.trim()) ? 'Enter a valid email address.' : ''
  const passwordError = !password ? 'Enter your password.' : ''
  const valid = !emailError && !passwordError

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setTouched({ email: true, password: true })
    if (!valid) {
      // Take the person straight to the first field that needs attention.
      ;(emailError ? emailRef : passwordRef).current?.focus()
      return
    }
    onSubmit({ email: email.trim(), password })
  }

  const showEmailError = touched.email && emailError
  const showPasswordError = touched.password && passwordError

  return (
    <motion.section
      aria-labelledby="login-title"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14"
    >
      <div className="w-full max-w-[26rem]">
        <h1 id="login-title" className="text-[1.75rem] leading-tight font-semibold sm:text-[2rem]">
          Login to STEM Portal
        </h1>

        <form onSubmit={submit} noValidate className="mt-8">
          <div>
            <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              ref={emailRef}
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={showEmailError ? true : undefined}
              aria-describedby={showEmailError ? `${id}-email-error` : undefined}
              className="login-field"
            />
            <FieldNote id={`${id}-email-error`} error={showEmailError ? emailError : undefined} />
          </div>

          <div className="mt-2">
            <label htmlFor={`${id}-password`} className="mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                id={`${id}-password`}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={showPasswordError ? true : undefined}
                aria-describedby={showPasswordError ? `${id}-password-error` : undefined}
                className="login-field !pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-control text-ink/65 transition-colors duration-200 hover:text-deep focus-visible:!outline-offset-[-3px] motion-reduce:transition-none"
              >
                {showPassword ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            <FieldNote id={`${id}-password-error`} error={showPasswordError ? passwordError : undefined}>
              <SmartLink href="/forgot-password" className="login-link shrink-0">
                Forgot password?
              </SmartLink>
            </FieldNote>
          </div>

          <button type="submit" disabled={loading} aria-busy={loading} className="login-btn login-btn-primary mt-4">
            {loading ? (
              <>
                <span className="login-spinner size-[1.125rem] rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Logging in…
              </>
            ) : (
              'Log in'
            )}
          </button>
        </form>

        {googleEnabled && (
          <div className="mt-5">
            <div className="mb-5 flex items-center gap-4" role="separator" aria-label="Or">
              <span className="h-px flex-1 bg-tint" />
              <span className="text-sm text-ink/65">Or</span>
              <span className="h-px flex-1 bg-tint" />
            </div>
            <button type="button" onClick={onGoogle} disabled={loading} className="login-btn login-btn-alt">
              <GoogleIcon />
              Continue with Google
            </button>
          </div>
        )}

        <div className="mt-7 grid gap-3 text-center text-sm text-ink/70">
          <p>
            Don’t have an account?{' '}
            <SmartLink href="/signup" className="login-link font-medium">
              Create account
            </SmartLink>
          </p>
          <p>
            By continuing, you agree to our{' '}
            <SmartLink href="/terms-condition" className="login-link">
              Terms of Service
            </SmartLink>{' '}
            and{' '}
            <SmartLink href="/privacy-policy" className="login-link">
              Privacy Policy
            </SmartLink>
            .
          </p>
        </div>
      </div>
    </motion.section>
  )
}
