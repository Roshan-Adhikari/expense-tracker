# 💸 Expense Splitting App — Cursor Build Prompt
> A professional, full-stack Splitwise / Settle Up style application

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | Supabase (free tier - PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Email | Resend.com (free tier) |
| File Storage | Supabase Storage |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## 🔐 Authentication

- Email & Password login / signup
- Google OAuth login
- Email verification on signup
- Forgot password / reset password flow
- Protected routes — redirect to login if not authenticated
- User profile with name, email, avatar (initials fallback)

---

## 🚀 Core Features

### 1. Dashboard
- Overview of total amount you owe and total amount owed to you
- Recent activity feed
- Quick action buttons: Add Expense, Create Group, Settle Up

### 2. Groups
- Create a group (name, optional icon/emoji, description)
- Invite members via email
- Member can accept/reject group invite
- View all group members and their balances
- Leave group option
- Group expense history

### 3. Friends
- Add friends by email
- View all friends and individual balances
- One-on-one expense tracking outside of groups

### 4. Expenses
- Add an expense with:
  - Title / Description
  - Amount
  - Currency (default INR, support USD, EUR)
  - Date
  - Category (Food, Travel, Rent, Utilities, Entertainment, Others)
  - Split type:
    - ✅ Equal split among selected members
    - ✅ Exact amounts per person
    - ✅ Percentage split
    - ✅ Share-based split
  - Paid by (select who paid)
  - Attach to a group or individual friend
  - Optional notes
  - Receipt image upload (Supabase Storage)
- Edit / Delete expense (only by creator)

### 5. Balances & Settlements
- Real-time balance calculation per user, per group, per friend
- Smart settle up suggestion (minimize number of transactions)
- Record a settlement/payment between two people
- Mark debt as settled
- Settlement history

### 6. Activity & Notifications
- In-app activity feed showing all changes
- Email notifications for:
  - New expense added in your group
  - Someone settles up with you
  - New group invite

---

## 🗄 Database Schema (Supabase / PostgreSQL)

```sql
-- Users
users (id, email, name, avatar_url, created_at)

-- Groups
groups (id, name, emoji, description, created_by, created_at)

-- Group Members
group_members (id, group_id, user_id, role, joined_at, status)

-- Friends
friends (id, user_id, friend_id, status, created_at)

-- Expenses
expenses (id, title, amount, currency, category, paid_by, 
          group_id, created_by, date, notes, receipt_url, created_at)

-- Expense Splits
expense_splits (id, expense_id, user_id, amount, percentage, shares)

-- Settlements
settlements (id, payer_id, payee_id, amount, group_id, note, created_at)

-- Notifications
notifications (id, user_id, type, message, read, created_at)
```

---

## 🎨 UI/UX Requirements

- Clean, minimal, modern design
- Custom color palette (purple/blue or Splitwise-inspired green)
- Fully responsive — mobile first
- Sidebar navigation on desktop, bottom tab bar on mobile
- Loading skeletons for all data fetches
- Toast notifications for success/error actions
- Empty state illustrations for no groups, no expenses
- Smooth animations using Framer Motion
- Dark mode support

---

## 📄 Pages / Routes

```
/               → Landing page (hero, features, CTA)
/login          → Login page
/signup         → Signup page
/dashboard      → Home dashboard (protected)
/groups         → All groups list
/groups/:id     → Individual group detail + expenses
/friends        → Friends list + balances
/friends/:id    → Individual friend expense history
/expenses/add   → Add expense form
/expenses/:id   → Expense detail
/activity       → Full activity feed
/profile        → User profile + settings
/settle/:id     → Settle up flow
```

---

## 🔒 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Users can only see data they are part of
- Input validation on both frontend and backend
- Rate limiting on API routes
- Environment variables for all secrets (.env)

---

## 💾 Backup & Data Plan

- Supabase provides automatic daily backups on free tier
- Enable Supabase Point-in-Time Recovery (PITR) on upgrade
- Export feature: user can download expense history as CSV
- All file uploads go to Supabase Storage with organized buckets

---

## 📁 Folder Structure

```
/client                  → React frontend
  /src
    /components          → Reusable UI components
    /pages               → All route pages
    /hooks               → Custom React hooks
    /context             → Auth context, App context
    /utils               → Helper functions, formatters
    /api                 → API call functions

/server                  → Express backend
  /routes                → All API routes
  /controllers           → Business logic
  /middleware            → Auth middleware, error handler
  /utils                 → DB helpers
```

---

## 🔑 Environment Variables

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
EMAIL_SERVICE_API_KEY=       # Resend.com
```

---

## ✅ Build Order (Follow This Sequence in Cursor)

1. Set up Supabase project + all tables with RLS policies
2. Build authentication flow (signup, login, Google OAuth)
3. Build dashboard layout and navigation
4. Build Groups feature end to end
5. Build Add Expense with all split types
6. Build balance calculation logic
7. Build Settle Up flow
8. Build Friends feature
9. Add notifications and activity feed
10. Polish UI — dark mode, animations, empty states
11. Deploy frontend to Vercel + backend to Railway

---

## 🆓 Free Services Used

| Service | Purpose | Free Limit |
|---|---|---|
| Supabase | Database + Auth + Storage | 500MB DB, 1GB Storage |
| Vercel | Frontend Hosting | Unlimited personal projects |
| Railway | Backend Hosting | $5 free credits/month |
| Resend.com | Email Notifications | 100 emails/day |

---

## 💡 Pro Tips

- Build **one feature at a time** — don't ask Cursor to do everything at once
- Always set up **Supabase RLS policies** before building frontend
- Test balance calculation logic thoroughly with edge cases
- Use **Supabase Realtime** for live balance updates across users
- Keep the Supabase SQL editor open to debug DB issues quickly

---

*Generated for Cursor AI — Paste this as your project brief and build feature by feature.*
