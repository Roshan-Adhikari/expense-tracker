import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchFriends } from '../lib/friends'
import { equalShares, insertExpenseWithShares } from '../lib/expenses'

const categories = ['Food', 'Travel', 'Rent', 'Utilities', 'Entertainment', 'Others'] as const

function todayISODate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function AddExpense() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [friendRows, setFriendRows] = useState<{ friend_user_id: string; label: string }[]>([])
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set())

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [category, setCategory] = useState<(typeof categories)[number]>('Food')
  const [notes, setNotes] = useState('')
  const [expenseDate, setExpenseDate] = useState(todayISODate())
  const [paidByUserId, setPaidByUserId] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchFriends(user.id)
      .then((rows) => {
        setFriendRows(
          rows.map((r) => ({
            friend_user_id: r.friend_user_id,
            label: r.profile?.full_name || r.profile?.email || r.friend_user_id.slice(0, 8),
          })),
        )
      })
      .catch(() => setFriendRows([]))
  }, [user])

  const participantIds = useMemo(() => {
    if (!user) return []
    const ids = [user.id, ...Array.from(selectedFriendIds)]
    return [...new Set(ids)]
  }, [user, selectedFriendIds])

  useEffect(() => {
    if (!user?.id) return
    setPaidByUserId((prev) =>
      prev && participantIds.includes(prev) ? prev : user.id,
    )
  }, [user?.id, participantIds])

  function toggleFriend(id: string) {
    setSelectedFriendIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!user) {
      setError('You must be signed in.')
      return
    }
    const parsed = parseFloat(amount.replace(/,/g, ''))
    if (!title.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a title and a valid amount.')
      return
    }
    if (participantIds.length < 1) {
      setError('Select at least yourself as participant.')
      return
    }
    if (!participantIds.includes(paidByUserId)) {
      setError('Payer must be one of the participants.')
      return
    }

    const shares = equalShares(parsed, participantIds)
    const sum = shares.reduce((s, x) => s + x.share_amount, 0)
    if (Math.abs(sum - parsed) > 0.02) {
      setError('Split calculation error — try again.')
      return
    }

    setSubmitting(true)
    try {
      await insertExpenseWithShares(
        {
          user_id: user.id,
          paid_by_user_id: paidByUserId,
          title: title.trim(),
          amount: parsed,
          currency,
          category,
          split_type: 'Equal',
          notes: notes.trim() || null,
          expense_date: expenseDate,
        },
        shares,
      )
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save expense')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add expense</h1>
        <Link to="/dashboard" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          Cancel
        </Link>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            placeholder="e.g. Dinner, Groceries"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Total amount
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
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Date
          </label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Split between (equal shares)
          </label>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Add people from Friends first. Include yourself and tick who shared this bill.
          </p>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
            <input type="checkbox" checked disabled className="rounded border-slate-400" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">You</span>
          </label>
          <div className="mt-2 space-y-2">
            {friendRows.map((f) => (
              <label
                key={f.friend_user_id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <input
                  type="checkbox"
                  checked={selectedFriendIds.has(f.friend_user_id)}
                  onChange={() => toggleFriend(f.friend_user_id)}
                  className="rounded border-slate-400"
                />
                <span className="text-sm text-slate-900 dark:text-white">{f.label}</span>
              </label>
            ))}
          </div>
          {friendRows.length === 0 ? (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
              No friends yet —{' '}
              <Link to="/friends" className="font-medium underline">
                add someone by email
              </Link>{' '}
              so they can appear here.
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Paid by
          </label>
          <select
            value={paidByUserId || user?.id}
            onChange={(e) => setPaidByUserId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
          >
            <option value={user?.id ?? ''}>You</option>
            {friendRows
              .filter((f) => selectedFriendIds.has(f.friend_user_id))
              .map((f) => (
                <option key={f.friend_user_id} value={f.friend_user_id}>
                  {f.label}
                </option>
              ))}
          </select>
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
            Notes (optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            placeholder="Receipt details…"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save expense'}
        </button>
      </form>
    </div>
  )
}
