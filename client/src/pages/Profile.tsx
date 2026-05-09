import { useAuth } from '../context/AuthContext'

export function Profile() {
  const { user, signOut } = useAuth()

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Signed in with Supabase Auth. Password resets use the link on the login page.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-200 text-lg font-bold text-brand-900 dark:bg-brand-800 dark:text-brand-100">
            {user?.name
              ?.split(/\s+/)
              .map((n) => n[0])
              .join('')
              .slice(0, 2) ?? '?'}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-6 w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
