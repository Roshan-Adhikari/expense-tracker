import { type FormEvent, useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addFriendByEmail, fetchFriends, type FriendWithProfile } from '../lib/friends'
import { fetchExpenses } from '../lib/expenses'
import { netBalanceWithFriend } from '../lib/balances'
import { formatMoney } from '../lib/formatMoney'

export function Friends() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<FriendWithProfile[]>([])
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  async function refresh() {
    if (!user) return
    setLoading(true)
    try {
      const [list, expenses] = await Promise.all([fetchFriends(user.id), fetchExpenses()])
      setFriends(list)
      const bal: Record<string, number> = {}
      for (const f of list) {
        bal[f.friend_user_id] = netBalanceWithFriend(user.id, f.friend_user_id, expenses)
      }
      setBalances(bal)
      setErr('')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not load friends')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [user?.id])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setErr('')
    setMsg('')
    if (!user) return
    setAdding(true)
    try {
      const result = await addFriendByEmail(user.id, email)
      if (result.kind === 'self') setErr('Use another person’s email.')
      else if (result.kind === 'already') setMsg('Already connected.')
      else if (result.kind === 'linked') {
        setMsg(`Added ${result.profile.full_name || result.profile.email}.`)
        setEmail('')
        await refresh()
      } else {
        setMsg(
          `Invite saved for ${result.email}. When they sign up with that email, they’ll be linked automatically.`,
        )
        setEmail('')
      }
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not add friend')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Friends</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Add someone by email. If they already have an account, you’ll connect instantly. Otherwise they’re invited until
          they register with that email.
        </p>
      </div>

      <form
        onSubmit={(e) => void handleAdd(e)}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="friend-email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Friend’s email
          </label>
          <input
            id="friend-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={adding || !email.trim()}
          className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {adding ? 'Adding…' : 'Add friend'}
        </button>
      </form>

      {msg ? (
        <p className="text-sm text-brand-700 dark:text-brand-300" role="status">
          {msg}
        </p>
      ) : null}
      {err ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {err}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : friends.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
          No friends yet. Enter an email above to connect.
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
          {friends.map((f) => {
            const name = f.profile?.full_name || f.profile?.email || 'Friend'
            const net = balances[f.friend_user_id] ?? 0
            const currency = 'INR'
            const owingThem = net < 0
            return (
              <li key={f.friend_user_id}>
                <Link
                  to={`/friends/${f.friend_user_id}`}
                  className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">
                    {name
                      .split(/\s+/)
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{name}</p>
                    <p className="truncate text-sm text-slate-500">{f.profile?.email}</p>
                  </div>
                  <span
                    className={
                      owingThem
                        ? 'shrink-0 text-sm font-semibold text-red-600 dark:text-red-400'
                        : net > 0
                          ? 'shrink-0 text-sm font-semibold text-brand-600 dark:text-brand-400'
                          : 'shrink-0 text-sm font-semibold text-slate-500'
                    }
                  >
                    {net === 0
                      ? 'Settled'
                      : owingThem
                        ? `You owe ${formatMoney(Math.abs(net), currency)}`
                        : `Owes you ${formatMoney(net, currency)}`}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
