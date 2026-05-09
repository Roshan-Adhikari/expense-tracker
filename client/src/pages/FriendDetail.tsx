import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { demoFriends } from '../lib/demo'

export function FriendDetail() {
  const { id } = useParams()
  const friend = demoFriends.find((f) => f.id === id)

  if (!friend) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-slate-600 dark:text-slate-400">Friend not found.</p>
        <Link to="/friends" className="mt-4 inline-block text-brand-600 hover:underline dark:text-brand-400">
          Back to friends
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/friends"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Friends
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">
          {friend.name
            .split(/\s+/)
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{friend.name}</h1>
          <p className="text-slate-500">{friend.email}</p>
        </div>
      </div>

      <Link
        to={`/settle/${friend.id}`}
        className="inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Settle up
      </Link>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
        Shared expense timeline will render here after backend integration.
      </div>
    </div>
  )
}
