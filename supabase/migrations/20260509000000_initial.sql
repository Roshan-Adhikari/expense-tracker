-- Expense Tracker — profiles + expenses with RLS (run in Supabase SQL Editor or via CLI)

-- Profiles (one row per auth user; created by trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Personal expenses (each row belongs to exactly one user)
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'INR',
  category text not null default 'Others',
  split_type text not null default 'Equal',
  notes text,
  expense_date date not null default (current_date),
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_created_idx
  on public.expenses (user_id, created_at desc);

alter table public.expenses enable row level security;

create policy "expenses_select_own"
  on public.expenses
  for select
  using (auth.uid() = user_id);

create policy "expenses_insert_own"
  on public.expenses
  for insert
  with check (auth.uid() = user_id);

create policy "expenses_update_own"
  on public.expenses
  for update
  using (auth.uid() = user_id);

create policy "expenses_delete_own"
  on public.expenses
  for delete
  using (auth.uid() = user_id);
