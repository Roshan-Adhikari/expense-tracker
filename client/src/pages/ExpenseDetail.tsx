import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchExpenseById, type ExpenseRow } from '../lib/expenses'
import { formatExpenseDate, formatMoney } from '../lib/formatMoney'

export function ExpenseDetail() {
  const { id } = useParams()
  const [expense, setExpense] = useState<ExpenseRow | null>(null)
  const [loading, setLoading] = useState(true)

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
          <dt className="text-slate-500">Category</dt>
          <dd className="font-medium text-slate-900 dark:text-white">{expense.category}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Split type</dt>
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
      <Link to="/dashboard" className="text-brand-600 hover:underline dark:text-brand-400">
        ← Back to dashboard
      </Link>
    </div>
  )
}
