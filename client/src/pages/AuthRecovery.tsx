import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import { SupabaseMissingBanner } from '../components/SupabaseMissingBanner'

/**
 * Landing page for the link in Supabase "Reset password" emails.
 * URL must be listed in Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export function AuthRecovery() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const supabase = getSupabase()
    const fromHash = typeof window !== 'undefined' && window.location.hash.includes('type=recovery')

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && fromHash) setReady(true)
    })

    if (fromHash) setReady(true)

    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      const supabase = getSupabase()
      const { error: upErr } = await supabase.auth.updateUser({ password })
      if (upErr) {
        setError(upErr.message)
        return
      }
      await supabase.auth.signOut()
      navigate('/login', { replace: true, state: { message: 'Password updated. Sign in with your new password.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <SupabaseMissingBanner />
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-brand-600 hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Set new password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Use the form below after opening the link from your email. If this page stays disabled, open the reset link again
          or request a new email from Forgot password.
        </p>

        {!ready ? (
          <p className="mt-6 text-sm text-amber-800 dark:text-amber-200">
            Waiting for a valid recovery session… If you landed here without clicking the email link, go to{' '}
            <Link to="/forgot-password" className="font-medium underline">
              Forgot password
            </Link>
            .
          </p>
        ) : null}

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="np" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              New password
            </label>
            <input
              id="np"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!ready || submitting}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="npc" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirm password
            </label>
            <input
              id="npc"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={!ready || submitting}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={!ready || submitting}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Update password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-brand-600 hover:underline dark:text-brand-400">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  )
}
