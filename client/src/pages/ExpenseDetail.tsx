import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchExpenseById, type ExpenseRow } from '../lib/expenses'
import { getSupabase } from '../lib/supabase'
import { formatExpenseDate, formatMoney } from '../lib/formatMoney'

export function ExpenseDetail() {
  const { id } = useParams()
  const [expense, setExpense] = useState<ExpenseRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!id) return
    let cancelled = false
    fetchExpenseById(id)
      .then((row) => {
        if (!cancelled) setExpense(row)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!expense) return
    const ids = [
      expense.paid_by_user_id,
      ...(expense.expense_shares?.map((s) => s.user_id) ?? []),
    ]
    const uniq = [...new Set(ids)].filter(Boolean)
    if (uniq.length === 0) return

    const supabase = getSupabase()
    supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', uniq)
      .then(({ data }) => {
        const map: Record<string, string> = {}
        for (const p of data ?? []) {
          const pid = p.id as string
          map[pid] = (p.full_name as string) || (p.email as string) || pid.slice(0, 8)
        }
        setNames(map)
      })
  }, [expense])

  function label(userId: string) {
    return names[userId] ?? userId.slice(0, 8)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg">
        <p className="text-slate-500">Loading…</p>
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <p className="text-slate-600 dark:text-slate-400">
          Expense not found or you don&apos;t have access (RLS).
        </p>
        <Link to="/dashboard" className="text-brand-600 hover:underline dark:text-brand-400">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{expense.title}</h1>
        <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
          {formatMoney(expense.amount, expense.currency)}
        </p>
      </div>
      <dl className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Paid by</dt>
          <dd className="font-medium text-slate-900 dark:text-white">
            {label(expense.paid_by_user_id)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Category</dt>
          <dd className="font-medium text-slate-900 dark:text-white">{expense.category}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Split</dt>
          <dd className="font-medium text-slate-900 dark:text-white">{expense.split_type}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Expense date</dt>
          <dd className="font-medium text-slate-900 dark:text-white">{expense.expense_date}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Logged</dt>
          <dd className="font-medium text-slate-900 dark:text-white">
            {formatExpenseDate(expense.created_at)}
          </dd>
        </div>
        {expense.notes ? (
          <div>
            <dt className="text-slate-500">Notes</dt>
            <dd className="mt-1 text-slate-900 dark:text-white">{expense.notes}</dd>
          </div>
        ) : null}
      </dl>

      {expense.expense_shares && expense.expense_shares.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Shares</h2>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {expense.expense_shares.map((s) => (
              <li key={s.user_id} className="flex justify-between py-2 text-sm">
                <span className="text-slate-700 dark:text-slate-300">{label(s.user_id)}</span>
                <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                  {formatMoney(s.share_amount, expense.currency)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link to="/dashboard" className="text-brand-600 hover:underline dark:text-brand-400">
        ← Back to dashboard
      </Link>
    </div>
  )
}
