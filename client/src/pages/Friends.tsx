import { ChevronRight, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { demoFriends } from '../lib/demo'

export function Friends() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Friends</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            One-on-one balances outside of groups.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <UserPlus className="h-4 w-4" />
          Add friend
        </button>
      </div>

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
        {demoFriends.map((f) => (
          <li key={f.id}>
            <Link
              to={`/friends/${f.id}`}
              className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">
                {f.name
                  .split(/\s+/)
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{f.name}</p>
                <p className="truncate text-sm text-slate-500">{f.email}</p>
              </div>
              <span
                className={
                  f.balance < 0
                    ? 'shrink-0 text-sm font-semibold text-red-600 dark:text-red-400'
                    : 'shrink-0 text-sm font-semibold text-brand-600 dark:text-brand-400'
                }
              >
                {f.balance < 0 ? 'You owe' : 'Owes you'}{' '}
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                  Math.abs(f.balance),
                )}
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
