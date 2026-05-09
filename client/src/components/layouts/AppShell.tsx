import { motion } from 'framer-motion'
import clsx from 'clsx'
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Moon,
  Receipt,
  Sun,
  UserCircle,
  Users,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/friends', label: 'Friends', icon: UsersRound },
  { to: '/activity', label: 'Activity', icon: Activity },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  )

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('expense-tracker-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const stored = localStorage.getItem('expense-tracker-theme')
    if (stored === 'dark') setDark(true)
    if (stored === 'light') setDark(false)
  }, [])

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
            ET
          </div>
          <span className="font-semibold tracking-tight text-slate-900 dark:text-white">
            Expense Tracker
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-100 text-brand-900 dark:bg-brand-900/40 dark:text-brand-100'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <Link
            to="/profile"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-200 text-xs font-semibold text-brand-900 dark:bg-brand-800 dark:text-brand-100">
              {user ? initials(user.name) : '?'}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-medium text-slate-900 dark:text-white">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/90">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
              ET
            </span>
            Expense Tracker
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              to="/profile"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Profile"
            >
              <UserCircle className="h-6 w-6" />
            </Link>
          </div>
        </header>

        <header className="sticky top-0 z-10 hidden h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur md:flex dark:border-slate-800 dark:bg-slate-900/90">
          <div />
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        <motion.main
          className="flex-1 px-4 py-6 md:px-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/95">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium',
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/expenses/add"
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400',
            )
          }
        >
          <Receipt className="h-5 w-5" />
          Add
        </NavLink>
      </nav>
    </div>
  )
}
