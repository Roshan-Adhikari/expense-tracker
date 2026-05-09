import { motion } from 'framer-motion'
import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ForgotPassword() {
  const { configured, requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!configured) {
      setError('Configure Supabase first.')
      return
    }
    if (!email.trim()) {
      setError('Enter your email.')
      return
    }
    setSubmitting(true)
    const result = await requestPasswordReset(email.trim())
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setMessage('If an account exists for that email, you will receive a reset link shortly.')
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          We&apos;ll email you a link to choose a new password (redirects back to this app&apos;s login).
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4">
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-brand-700 dark:text-brand-300">{message}</p> : null}
          <button
            type="submit"
            disabled={!configured || submitting}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Back to log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
