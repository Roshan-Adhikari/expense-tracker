-- Friends + shared expenses (run after 20260509000000_initial.sql)

-- ---------------------------------------------------------------------------
-- Paid by + expense shares
-- ---------------------------------------------------------------------------
alter table public.expenses add column if not exists paid_by_user_id uuid references auth.users (id);

update public.expenses set paid_by_user_id = user_id where paid_by_user_id is null;

alter table public.expenses
  alter column paid_by_user_id set not null;

create table if not exists public.expense_shares (
  expense_id uuid not null references public.expenses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  share_amount numeric(14, 2) not null check (share_amount >= 0),
  primary key (expense_id, user_id)
);

create index if not exists expense_shares_user_idx on public.expense_shares (user_id);

alter table public.expense_shares enable row level security;

-- Backfill: solo expenses = one share covering full amount
insert into public.expense_shares (expense_id, user_id, share_amount)
select e.id, e.user_id, e.amount
from public.expenses e
where not exists (
  select 1 from public.expense_shares s where s.expense_id = e.id
);

-- Expenses: creator keeps user_id; participants see via expense_shares
drop policy if exists "expenses_select_own" on public.expenses;
create policy "expenses_select_shared"
  on public.expenses for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.expense_shares es
      where es.expense_id = expenses.id and es.user_id = auth.uid()
    )
  );

-- Shares: creator or listed participant can read
drop policy if exists "expense_shares_select" on public.expense_shares;
create policy "expense_shares_select"
  on public.expense_shares for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.expenses e
      where e.id = expense_shares.expense_id and e.user_id = auth.uid()
    )
  );

create policy "expense_shares_insert_creator"
  on public.expense_shares for insert
  with check (
    exists (
      select 1 from public.expenses e
      where e.id = expense_shares.expense_id and e.user_id = auth.uid()
    )
  );

create policy "expense_shares_delete_creator"
  on public.expense_shares for delete
  using (
    exists (
      select 1 from public.expenses e
      where e.id = expense_shares.expense_id and e.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Friends + invites
-- ---------------------------------------------------------------------------
create table if not exists public.friends (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, friend_user_id),
  constraint friends_no_self check (user_id <> friend_user_id)
);

create index if not exists friends_friend_idx on public.friends (friend_user_id);

alter table public.friends enable row level security;

create policy "friends_select"
  on public.friends for select
  using (user_id = auth.uid() or friend_user_id = auth.uid());

create policy "friends_insert_participant"
  on public.friends for insert
  with check (user_id = auth.uid() or friend_user_id = auth.uid());

create policy "friends_delete"
  on public.friends for delete
  using (user_id = auth.uid() or friend_user_id = auth.uid());

create table if not exists public.friend_invites (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references auth.users(id) on delete cascade,
  invitee_email text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled')),
  created_at timestamptz default now()
);

create unique index if not exists friend_invites_inviter_email_idx
  on public.friend_invites (inviter_id, lower(invitee_email));

alter table public.friend_invites enable row level security;

create policy "friend_invites_select"
  on public.friend_invites for select
  using (
    inviter_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and lower(trim(p.email)) = lower(trim(invitee_email))
    )
  );

create policy "friend_invites_insert"
  on public.friend_invites for insert
  with check (inviter_id = auth.uid());

create policy "friend_invites_update_invitee"
  on public.friend_invites for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and lower(trim(p.email)) = lower(trim(invitee_email))
    )
  );

-- ---------------------------------------------------------------------------
-- Lookup profile by email (for adding friends) — authenticated only
-- ---------------------------------------------------------------------------
create or replace function public.lookup_profile_by_email(search_email text)
returns table (profile_id uuid, email text, full_name text)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.email, p.full_name
  from public.profiles p
  where lower(trim(p.email)) = lower(trim(search_email))
  limit 1;
$$;

revoke all on function public.lookup_profile_by_email(text) from public;
grant execute on function public.lookup_profile_by_email(text) to authenticated;

-- ---------------------------------------------------------------------------
-- When someone finishes signup, accept pending invites that match their email
-- ---------------------------------------------------------------------------
create or replace function public.accept_pending_friend_invites_for_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inv record;
begin
  for inv in
    select id, inviter_id from public.friend_invites
    where lower(trim(invitee_email)) = lower(trim(new.email))
      and status = 'pending'
  loop
    insert into public.friends (user_id, friend_user_id)
    values (inv.inviter_id, new.id), (new.id, inv.inviter_id)
    on conflict do nothing;

    update public.friend_invites set status = 'accepted' where id = inv.id;
  end loop;
  return new;
end;
$$;

drop trigger if exists trg_profiles_accept_invites on public.profiles;
create trigger trg_profiles_accept_invites
  after insert on public.profiles
  for each row execute function public.accept_pending_friend_invites_for_profile();

-- ---------------------------------------------------------------------------
-- Profiles: allow reading friends & people you split expenses with
-- ---------------------------------------------------------------------------
create policy "profiles_select_friends_and_split_partners"
  on public.profiles for select
  using (
    exists (
      select 1 from public.friends f
      where (f.user_id = auth.uid() and f.friend_user_id = profiles.id)
         or (f.friend_user_id = auth.uid() and f.user_id = profiles.id)
    )
    or exists (
      select 1 from public.expense_shares es1
      join public.expense_shares es2 on es1.expense_id = es2.expense_id
      where es1.user_id = auth.uid() and es2.user_id = profiles.id
    )
  );
