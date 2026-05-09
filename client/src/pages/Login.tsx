import { motion } from 'framer-motion'
import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { user, loading, configured, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (configured && loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (configured && user) return <Navigate to={from} replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!configured) {
      setError('Add Supabase keys to client/.env.local — see README.')
      return
    }
    if (!email.trim() || !password) {
      setError('Enter email and password.')
      return
    }
    setSubmitting(true)
    const result = await signIn(email.trim(), password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
            ET
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in with the email and password you used to register.
          </p>
        </div>

        {!configured ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-medium">Supabase is not configured</p>
            <p className="mt-2 text-amber-800/90 dark:text-amber-200/90">
              Create a free project at supabase.com, run the SQL in{' '}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">supabase/migrations/</code>, then add{' '}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">VITE_SUPABASE_URL</code> and{' '}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">VITE_SUPABASE_ANON_KEY</code> to{' '}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">client/.env.local</code> and restart Vite.
            </p>
          </div>
        ) : null}

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!configured || submitting}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-brand-500 focus:border-brand-500 focus:ring-2 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!configured || submitting}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-brand-500 focus:border-brand-500 focus:ring-2 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Forgot password?
            </Link>
          </div>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={!configured || submitting}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          No account?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Sign up
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
