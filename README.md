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
