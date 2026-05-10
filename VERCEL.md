# Fix “Supabase is not configured” on Vercel

Your app works on **localhost** because `client/.env.local` exists **only on your computer**.  
Vercel does **not** read that file. You must set the same values in the **Vercel dashboard**, then **rebuild** the site.

**Do not put Supabase keys in GitHub** — anyone could steal them. Keys belong in Vercel **Environment Variables** only.

---

## Step 1 — Get values from Supabase

1. Open [supabase.com](https://supabase.com) → your project.
2. **Project Settings** (gear) → **API**.
3. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **anon public** key (long string, or a key labeled **publishable** in newer dashboards)  
   - **Never** use the `service_role` / **secret** key on the website.

---

## Step 2 — Add them in Vercel

1. Open [vercel.com](https://vercel.com) → select **this** project (your Expense Tracker deployment).
2. **Settings** → **Environment Variables**.
3. Add **exactly** these two names (copy/paste — spelling matters):

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | Your **Project URL** from Supabase |
| `VITE_SUPABASE_ANON_KEY` | Your **anon public** key from Supabase |

4. For each variable, enable:
   - **Production** (required for your live `*.vercel.app` site)
   - **Preview** (optional — fixes preview deployments)
5. Click **Save**.

---

## Step 3 — Redeploy (required)

Environment variables are applied when Vite **builds** the app. Adding them does not change an old deployment until you rebuild.

1. Go to **Deployments**.
2. Open the **⋯** menu on the latest deployment → **Redeploy**.
3. Wait until it finishes, then open your site again and try **Log in** / **Sign up**.

If it still fails: redeploy again and open the deployment **Build Logs** — confirm the build started **after** you saved the variables.

---

## Step 4 — Supabase Auth URLs (for production login)

In Supabase: **Authentication** → **URL Configuration**

- **Site URL**: your Vercel URL, e.g. `https://your-app.vercel.app`  
  If this is still `http://localhost:5173`, **password reset emails will send people to localhost** or the wrong place. Set it to your **live** site.
- **Redirect URLs**: add these (replace with your real host):
  - `https://your-app.vercel.app/**`
  - `https://your-app.vercel.app/auth/recovery`  
  (wildcard often covers this, but listing it avoids surprises)  
  Keep `http://localhost:5173/**` for local dev.

**Forgot password** uses redirect `…/auth/recovery`. That path must be allowed here, and you must request the reset from the **same** domain you want in the link (e.g. request reset while on Vercel, not localhost, for production links).

---

## Checklist (common mistakes)

- [ ] Variable names are **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** (must start with `VITE_`).
- [ ] Values are for the **anon** key, not the secret/service key.
- [ ] **Production** is checked for both variables.
- [ ] You clicked **Redeploy** after saving variables.
- [ ] No accidental spaces at the start/end of values (re-paste if unsure).

---

## Why GitHub cannot fix this alone

The live site is built on Vercel’s servers. Those servers only see variables you configure in **Vercel**.  
Committing `.env.local` to GitHub would expose your keys — **never** do that.
