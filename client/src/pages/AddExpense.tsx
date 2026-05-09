import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

const categories = ['Food', 'Travel', 'Rent', 'Utilities', 'Entertainment', 'Others'] as const
const splitTypes = ['Equal', 'Exact amounts', 'Percentage', 'Shares'] as const

export function AddExpense() {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('Food')
  const [splitType, setSplitType] = useState<(typeof splitTypes)[number]>('Equal')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Persist via API + Supabase in a later iteration
    alert('Expense saved locally (demo). Wire POST /api/expenses next.')
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add expense</h1>
        <Link to="/dashboard" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            placeholder="e.g. Uber to airport"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount
            </label>
            <input
              required
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Currency
            </label>
            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white">
              <option>INR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof categories)[number])}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Split type
          </label>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value as (typeof splitTypes)[number])}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          >
            {splitTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Notes (optional)
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            placeholder="Receipt details…"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Save expense
        </button>
      </form>
    </div>
  )
}
