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

## License

MIT
