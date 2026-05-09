import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchExpenses, type ExpenseRow } from '../lib/expenses'
import { formatExpenseDate, formatMoney } from '../lib/formatMoney'

export function Activity() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchExpenses()
      .then((rows) => {
        if (!cancelled) {
          setExpenses(rows)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activity</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Your expenses only — same data as the dashboard list.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : expenses.length === 0 ? (
        <p className="text-sm text-slate-500">No activity yet.</p>
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
