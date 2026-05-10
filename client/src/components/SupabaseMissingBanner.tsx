export function SupabaseMissingBanner() {
  const isProd = import.meta.env.PROD

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="font-semibold">Supabase is not configured in this build</p>
      {isProd ? (
        <>
          <p className="mt-2 leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            This is the <strong>production</strong> site. Local <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">.env.local</code> is
            not used here.
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            <li>
              Vercel → your project → <strong>Settings → Environment Variables</strong>
            </li>
            <li>
              Add <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">VITE_SUPABASE_URL</code> and{' '}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">VITE_SUPABASE_ANON_KEY</code> (anon key from Supabase →
              Settings → API)
            </li>
            <li>
              Enable <strong>Production</strong> for both, save, then <strong>Deployments → Redeploy</strong>
            </li>
          </ol>
          <p className="mt-3 text-xs text-amber-800/80 dark:text-amber-300/80">
            Full steps: see <code className="rounded bg-amber-100 px-0.5 dark:bg-amber-900/60">VERCEL.md</code> in the GitHub repo. Do not commit
            keys to GitHub.
          </p>
        </>
      ) : (
        <p className="mt-2 leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          Create <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">client/.env.local</code> with{' '}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">VITE_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">VITE_SUPABASE_ANON_KEY</code>, then restart{' '}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">npm run dev</code>.
        </p>
      )}
    </div>
  )
}
