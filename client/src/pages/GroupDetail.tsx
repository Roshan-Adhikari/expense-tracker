import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { demoGroups } from '../lib/demo'

export function GroupDetail() {
  const { id } = useParams()
  const group = demoGroups.find((g) => g.id === id)

  if (!group) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-slate-600 dark:text-slate-400">Group not found.</p>
        <Link to="/groups" className="mt-4 inline-block text-brand-600 hover:underline dark:text-brand-400">
          Back to groups
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/groups"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Groups
      </Link>

      <div className="flex items-start gap-4">
        <span className="text-4xl" aria-hidden>
          {group.emoji}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{group.name}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Member balances and expense history will appear here once the API is connected.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
        No expenses in this group yet. Add one from the dashboard or mobile tab bar.
      </div>
    </div>
  )
}
