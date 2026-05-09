import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { netBalanceWithFriend } from '../lib/balances'
import { fetchExpenses, type ExpenseRow } from '../lib/expenses'
import { formatExpenseDate, formatMoney } from '../lib/formatMoney'

export function FriendDetail() {
  const { id: friendId } = useParams()
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchExpenses()
      .then((rows) => {
        if (!cancelled && user && friendId) {
          const shared = rows.filter((e) => {
            const ids = new Set((e.expense_shares ?? []).map((s) => s.user_id))
            return ids.has(user.id) && ids.has(friendId)
          })
          setExpenses(shared)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user?.id, friendId])

  const net =
    user && friendId ? netBalanceWithFriend(user.id, friendId, expenses) : 0

  const subtitle = useMemo(() => {
    if (!user || !friendId) return ''
    const owingThem = net < 0
    if (net === 0) return 'No balance between you on shared expenses.'
    return owingThem
      ? `You owe ${formatMoney(Math.abs(net), 'INR')} overall on splits with this person.`
      : `They owe you ${formatMoney(net, 'INR')} overall on splits with this person.`
  }, [net, user, friendId])

  if (!friendId) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/friends"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Friends
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shared expenses</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      <Link
        to={`/settle/${friendId}`}
        className="inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Record settlement (coming soon)
      </Link>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : expenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
          No shared expenses yet. Add an expense and include both of you as participants.
        </div>
      ) : (
        <ul className="space-y-3">
          {expenses.map((item) => (
            <li key={item.id}>
              <Link
                to={`/expenses/${item.id}`}
                className="block rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-800/80"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-slate-500">
                      {item.category} · {formatExpenseDate(item.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatMoney(item.amount, item.currency)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
