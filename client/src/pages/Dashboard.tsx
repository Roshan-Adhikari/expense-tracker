import { motion } from 'framer-motion'
import { ArrowRightLeft, Plus, Receipt, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchExpenses, type ExpenseRow } from '../lib/expenses'
import { formatExpenseDate, formatMoney } from '../lib/formatMoney'

export function Dashboard() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchExpenses()
      .then((rows) => {
        if (!cancelled) {
          setExpenses(rows)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load expenses')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const totalRecorded = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  )

  const primaryCurrency = expenses[0]?.currency ?? 'INR'

  const recent = useMemo(() => expenses.slice(0, 10), [expenses])

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hello, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Shows expenses you created or are split on — others cannot see your private data (RLS).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          layout
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/80"
        >
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total recorded</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {loading ? '…' : formatMoney(totalRecorded, primaryCurrency)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Sum of all your expense entries</p>
        </motion.div>
        <motion.div
          layout
          className="rounded-2xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-900/50 dark:bg-brand-950/30"
        >
          <p className="text-sm font-medium text-brand-800 dark:text-brand-300">Entries</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-brand-700 dark:text-brand-200">
            {loading ? '…' : expenses.length}
          </p>
          <p className="mt-1 text-xs text-brand-700/80 dark:text-brand-300/80">
            Group splits & balances can extend this later
          </p>
        </motion.div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          to="/expenses/add"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 sm:flex-none"
        >
          <Plus className="h-5 w-5" />
          Add expense
        </Link>
        <Link
          to="/groups"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:flex-none"
        >
          <Users className="h-5 w-5" />
          Groups
        </Link>
        <Link
          to="/friends"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:flex-none"
        >
          <ArrowRightLeft className="h-5 w-5" />
          Friends
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Recent activity</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            No expenses yet. Add your first one to see it here.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
            {recent.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/expenses/${item.id}`}
                  className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Receipt className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                    <p className="truncate text-sm text-slate-500">
                      {item.category} · {formatExpenseDate(item.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatMoney(item.amount, item.currency)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
