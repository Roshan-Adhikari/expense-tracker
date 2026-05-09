import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-slate-200 dark:text-slate-800">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
      <Link to="/" className="mt-6 text-brand-600 hover:underline dark:text-brand-400">
        Go home
      </Link>
    </div>
  )
}
