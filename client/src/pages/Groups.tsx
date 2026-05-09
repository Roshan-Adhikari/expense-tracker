import { ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { demoGroups } from '../lib/demo'

export function Groups() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Groups</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Shared spaces for trips, flats, and events.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New group
        </button>
      </div>

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
        {demoGroups.map((g) => (
          <li key={g.id}>
            <Link
              to={`/groups/${g.id}`}
              className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80"
            >
              <span className="text-2xl" aria-hidden>
                {g.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{g.name}</p>
                <p
                  className={
                    g.balance < 0
                      ? 'text-sm text-red-600 dark:text-red-400'
                      : 'text-sm text-brand-600 dark:text-brand-400'
                  }
                >
                  {g.balance < 0 ? 'You owe' : 'You are owed'}{' '}
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                    Math.abs(g.balance),
                  )}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
