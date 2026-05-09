import { motion } from 'framer-motion'
import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Signup() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Name, email, and password (6+ chars) required.')
      return
    }
    login({ email: email.trim(), name: name.trim() })
    navigate('/dashboard', { replace: true })
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Local demo — wire Supabase for real sign-up & verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-brand-500 focus:border-brand-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="Your name"
            />
          </div>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-brand-500 focus:border-brand-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="At least 6 characters"
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
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Log in
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
