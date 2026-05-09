import { Link, useParams } from 'react-router-dom'
import { demoFriends } from '../lib/demo'

export function Settle() {
  const { id } = useParams()
  const friend = demoFriends.find((f) => f.id === id)

  if (!friend) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-slate-600 dark:text-slate-400">Invalid settle link.</p>
        <Link to="/friends" className="mt-4 inline-block text-brand-600 dark:text-brand-400">
          Friends
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settle with {friend.name}</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Record a payment and minimize outstanding balance (UI placeholder).
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
        <label className="mb-2 block text-sm font-medium">Amount (INR)</label>
        <input
          type="text"
          inputMode="decimal"
          defaultValue={Math.abs(friend.balance)}
          className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="button"
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Record settlement
        </button>
      </div>
    </div>
  )
}
