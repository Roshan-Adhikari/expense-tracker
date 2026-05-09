# Expense Tracker

Splitwise-style expense sharing: React + Vite + Tailwind frontend, Express API scaffold, ready to connect [Supabase](https://supabase.com/) for auth, Postgres, and storage.

## Structure

- `client/` — React (TypeScript), React Router, Tailwind CSS v4, Framer Motion
- `server/` — Express (`/health`, `/api/version`)
- `splitwise-cursor-prompt.md` — full product spec for upcoming features

## Quick start

```bash
cd client && npm install && npm run dev
```

In another terminal:

```bash
cd server && npm install && npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:4000/health](http://localhost:4000/health)

Log in with any email/password on the demo auth screen (localStorage). Replace with Supabase Auth when ready.

## Environment

Copy `.env.example` to `.env` in the repo root and in `client/` as needed. See `splitwise-cursor-prompt.md` for the full variable list.

### Supabase (free database + email auth)

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. In **Project Settings → API**, copy **Project URL** and **anon public** key.
3. Create **`client/.env.local`**:

   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

4. In **SQL Editor**, paste and run migrations in order:
   - `supabase/migrations/20260509000000_initial.sql` (profiles + expenses + RLS)
   - `supabase/migrations/20260509120000_friends_and_shared_expenses.sql` (friends, invites, shared splits, lookup RPC)

   If the second file errors on `execute function`, replace it with `execute procedure` for the profile invite trigger line (depends on Postgres version).
5. In **Authentication → URL Configuration**, add your local and production URLs to **Redirect URLs** (e.g. `http://localhost:5173/**`, `https://your-app.vercel.app/**`).
6. Optional: **Authentication → Providers → Email** — disable “Confirm email” while testing so sign-up logs in immediately; turn it back on for production.

Restart `npm run dev` after changing env vars.

On **Vercel**, add the same `VITE_SUPABASE_*` variables in **Project → Settings → Environment Variables**, then redeploy.

Each signed-in user only sees their own rows: policies use `auth.uid()` on `profiles` and `expenses`.

## Deploy

- Frontend: build with `cd client && npm run build`, deploy `client/dist` (e.g. Vercel).
- Backend: run `server` on Railway or similar; set `PORT` and `CLIENT_ORIGIN`.

### Vercel (monorepo)

This repo has the Vite app in `client/`. Use **one** of these approaches:

1. **Recommended:** In the Vercel project → **Settings → General → Root Directory**, set **`client`**, then **Save** and **Redeploy**. Framework preset **Vite**, build output **`dist`** (default).

2. **Or** leave Root Directory as the repo root: the root **`vercel.json`** already runs `cd client && npm run build` and publishes **`client/dist`**.

If you see **404 NOT_FOUND** on your `*.vercel.app` URL, the deployment was not serving `client/dist` (wrong root). Fix Root Directory or rely on root `vercel.json`, then redeploy.

Client-side routes (`/dashboard`, etc.) need the **`rewrites`** in `vercel.json` so refreshes do not 404.

## License

MIT
