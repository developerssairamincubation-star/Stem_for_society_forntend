import { motion } from 'framer-motion'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { queryClient, clearAuthStorage } from '@/lib/api'
import { useAdmin, usePartner, useUser } from '@/lib/hooks'
import { supabaseConfigured } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/supabaseAuth'
import { toastError } from '@/lib/utils'
import { BrandPanel } from './BrandPanel'
import { LoginFormPanel, loginRoles, type LoginRole } from './LoginFormPanel'

/**
 * /login for every role. The page itself only collects credentials: signing in, sessions, errors and redirects all come
 * from the platform's existing hooks (useUser / usePartner / useAdmin) and Google flow, unchanged.
 */
export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const requested = params.get('role')?.toUpperCase()
  const [role, setRole] = useState<LoginRole>(loginRoles.some((r) => r.value === requested) ? (requested as LoginRole) : 'STUDENT')
  const [googleBusy, setGoogleBusy] = useState(false)

  const returnTo = params.get('returnTo')
  const safeReturnTo = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'

  const student = useUser({
    extraOnSuccess: () => {
      toast.success('Login was successful!')
      setGoogleBusy(false)
    },
  })
  const partner = usePartner({ extraOnSuccess: () => navigate('/partner', { replace: true }) })
  const admin = useAdmin({ extraOnSuccess: () => navigate('/admin', { replace: true }) })

  // A signed-in student has nothing to do here (same behaviour as before).
  if (student.user) return <Navigate to={safeReturnTo} replace />

  const loading = student.isSigningIn || partner.isSigningIn || admin.isSigningIn || googleBusy

  const handleSubmit = (credentials: { email: string; password: string }) => {
    if (role === 'STUDENT') {
      // Start from a clean session, as the previous login page did.
      queryClient.clear()
      clearAuthStorage()
      student.signIn(credentials)
    } else if (role === 'PARTNER') {
      partner.signIn(credentials)
    } else {
      admin.signIn(credentials)
    }
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
    <div className="sfs-ui min-h-screen bg-surface px-3 py-6 sm:px-6 sm:py-10 lg:flex lg:items-center lg:justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid w-full max-w-6xl gap-2 rounded-[2rem] bg-white p-2 shadow-overlay lg:grid-cols-[58fr_42fr] lg:min-h-[640px]"
      >
        <BrandPanel />
        <LoginFormPanel
          role={role}
          onRoleChange={setRole}
          loading={loading}
          googleEnabled={supabaseConfigured && role === 'STUDENT'}
          onGoogle={handleGoogle}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  )
}
