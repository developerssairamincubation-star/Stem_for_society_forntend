import { motion, MotionConfig } from 'framer-motion'
import { useState } from 'react'
import '@/sfs/styles/sfs-login.css'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { queryClient, clearAuthStorage } from '@/lib/api'
import { useUser } from '@/lib/hooks'
import { supabaseConfigured } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/supabaseAuth'
import { toastError } from '@/lib/utils'
import { BrandPanel } from './BrandPanel'
import { LoginFormPanel } from './LoginFormPanel'

/**
 * /login is the student sign-in. Partners and admins have their own pages (/partner/signin, /admin/signin), so an old
 * /login?role=… link is passed on to the right one. The page itself only collects credentials: signing in, sessions, errors and
 * redirects all come from the platform's existing useUser hook and Google flow, unchanged.
 */
export function LoginPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const requested = params.get('role')?.toUpperCase()
  const [googleBusy, setGoogleBusy] = useState(false)

  const returnTo = params.get('returnTo')
  const safeReturnTo = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'

  const student = useUser({
    extraOnSuccess: () => {
      toast.success('Login was successful!')
      setGoogleBusy(false)
    },
  })

  // Old links that asked for the partner or admin form go to their own sign-in pages.
  if (requested === 'PARTNER') return <Navigate to="/partner/signin" replace />
  if (requested === 'ADMIN') return <Navigate to="/admin/signin" replace />

  // A signed-in student has nothing to do here (same behaviour as before).
  if (student.user) return <Navigate to={safeReturnTo} replace />

  const loading = student.isSigningIn || googleBusy

  const handleSubmit = (credentials: { email: string; password: string }) => {
    // Start from a clean session, as the previous login page did.
    queryClient.clear()
    clearAuthStorage()
    student.signIn(credentials)
  }

  const handleGoogle = async () => {
    try {
      setGoogleBusy(true)
      await signInWithGoogle('signin', safeReturnTo !== '/' ? safeReturnTo : undefined)
    } catch (error) {
      toastError(error as Error, 'Failed to sign in with Google')
      setGoogleBusy(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="sfs-ui sfs-login min-h-dvh bg-surface p-3 sm:p-6 lg:flex lg:items-center lg:justify-center">
        <main className="mx-auto w-full max-w-[72rem]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid overflow-hidden rounded-panel bg-white shadow-overlay lg:min-h-[40rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
          >
            <BrandPanel />
            <LoginFormPanel
              loading={loading}
              googleEnabled={supabaseConfigured}
              onGoogle={handleGoogle}
              onSubmit={handleSubmit}
            />
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  )
}
