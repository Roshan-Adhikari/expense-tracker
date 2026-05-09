import { demoRecent } from '../lib/demo'

export function Activity() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activity</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Full feed will sync from Supabase Realtime.
        </p>
      </div>
      <ul className="space-y-3">
        {demoRecent.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
            <p className="text-sm text-slate-500">
              {item.group} · {item.when}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
