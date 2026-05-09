import { motion } from 'framer-motion'
import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to={from} replace />

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Enter email and password.')
      return
    }
    const name = email.split('@')[0]?.replace(/[._]/g, ' ') ?? 'User'
    login({ email: email.trim(), name: name.charAt(0).toUpperCase() + name.slice(1) })
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
            Demo login — Supabase auth hooks in next.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-brand-500 focus:border-brand-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-brand-500 focus:border-brand-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Log in
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
