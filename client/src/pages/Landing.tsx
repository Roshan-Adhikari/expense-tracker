import { motion } from 'framer-motion'
import { ArrowRight, Receipt, Shield, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="min-h-svh bg-gradient-to-b from-brand-50 to-white dark:from-slate-950 dark:to-slate-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
            ET
          </span>
          Expense Tracker
        </span>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <p className="mb-4 inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-800 dark:border-brand-800 dark:bg-slate-900 dark:text-brand-200">
            Split bills like Splitwise — built for groups & friends
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-white">
            Track shared expenses, settle up faster
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Fair splits, multiple split types, group balances, and settlement suggestions —
            with a clean UI that works on mobile and desktop.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700"
            >
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              I have an account
            </Link>
          </div>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          {[
            {
              icon: Users,
              title: 'Groups & friends',
              body: 'Invite people, track balances per group or one-on-one.',
            },
            {
              icon: Receipt,
              title: 'Flexible splits',
              body: 'Equal, exact amounts, percentages, or shares — you choose.',
            },
            {
              icon: Shield,
              title: 'Ready for production',
              body: 'Supabase auth & Postgres planned — structure matches your schema.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {body}
              </p>
            </li>
          ))}
        </motion.ul>
      </main>
    </div>
  )
}
