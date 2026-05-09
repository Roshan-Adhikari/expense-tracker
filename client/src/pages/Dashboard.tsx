import { motion } from 'framer-motion'
import { ArrowRightLeft, Plus, Receipt, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { demoBalances, demoRecent } from '../lib/demo'

function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(n)
}

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hello, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Here&apos;s a snapshot of your balances (demo data).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          layout
          className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30"
        >
          <p className="text-sm font-medium text-red-800 dark:text-red-300">You owe</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-red-700 dark:text-red-200">
            {formatInr(demoBalances.youOwe)}
          </p>
        </motion.div>
        <motion.div
          layout
          className="rounded-2xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-900/50 dark:bg-brand-950/30"
        >
          <p className="text-sm font-medium text-brand-800 dark:text-brand-300">You are owed</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-brand-700 dark:text-brand-200">
            {formatInr(demoBalances.owedToYou)}
          </p>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/expenses/add"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 sm:flex-none"
        >
          <Plus className="h-5 w-5" />
          Add expense
        </Link>
        <Link
          to="/groups"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:flex-none"
        >
          <Users className="h-5 w-5" />
          Groups
        </Link>
        <Link
          to="/friends"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:flex-none"
        >
          <ArrowRightLeft className="h-5 w-5" />
          Friends
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Recent activity</h2>
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
          {demoRecent.map((item) => (
            <li key={item.id} className="flex items-center gap-4 px-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Receipt className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                <p className="truncate text-sm text-slate-500">
                  {item.group} · {item.when}
                </p>
              </div>
              <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">
                {formatInr(item.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
