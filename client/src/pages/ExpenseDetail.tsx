import { Link, useParams } from 'react-router-dom'

export function ExpenseDetail() {
  const { id } = useParams()

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expense</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Detail view for expense <span className="font-mono text-sm">{id}</span> — load from API later.
      </p>
      <Link to="/dashboard" className="text-brand-600 hover:underline dark:text-brand-400">
        Back to dashboard
      </Link>
    </div>
  )
}
