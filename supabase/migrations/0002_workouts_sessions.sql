-- 0002_workouts_sessions.sql
-- Cloud copies of the user-owned data that currently lives only on the
-- device: workout definitions and completed workout sessions (history).
--
-- The nested shape (a workout's exercises, a session's exercises + sets)
-- is stored as jsonb rather than normalised into child tables. For v1
-- this mirrors the local model exactly, keeps sync a plain row upsert,
-- and avoids multi-table transactions. It can be normalised later if we
-- ever need to query inside sessions server-side.
--
-- Both tables carry the same per-owner Row Level Security as profiles:
-- a user can only ever see or write their own rows.

-- Reuse the updated_at trigger function from 0001 (created there).

-- Workouts -------------------------------------------------------------
create table if not exists public.workouts (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  exercises jsonb not null default '[]'::jsonb,
  source_template_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workouts_user_id_idx on public.workouts (user_id);

alter table public.workouts enable row level security;

drop policy if exists "Workouts are viewable by their owner" on public.workouts;
create policy "Workouts are viewable by their owner"
  on public.workouts for select using (auth.uid() = user_id);

drop policy if exists "Workouts are insertable by their owner" on public.workouts;
create policy "Workouts are insertable by their owner"
  on public.workouts for insert with check (auth.uid() = user_id);

drop policy if exists "Workouts are updatable by their owner" on public.workouts;
create policy "Workouts are updatable by their owner"
  on public.workouts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Workouts are deletable by their owner" on public.workouts;
create policy "Workouts are deletable by their owner"
  on public.workouts for delete using (auth.uid() = user_id);

-- Completed sessions ---------------------------------------------------
create table if not exists public.workout_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Source workout id, kept for reference; the plan itself is snapshotted
  -- into `exercises`, so there is no foreign key (the workout may be gone).
  workout_id uuid not null,
  name text not null,
  status text not null default 'completed'
    check (status in ('active', 'completed', 'cancelled')),
  exercises jsonb not null default '[]'::jsonb,
  current_exercise_index integer not null default 0,
  started_at timestamptz not null,
  ended_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists workout_sessions_user_id_idx on public.workout_sessions (user_id);

alter table public.workout_sessions enable row level security;

drop policy if exists "Sessions are viewable by their owner" on public.workout_sessions;
create policy "Sessions are viewable by their owner"
  on public.workout_sessions for select using (auth.uid() = user_id);

drop policy if exists "Sessions are insertable by their owner" on public.workout_sessions;
create policy "Sessions are insertable by their owner"
  on public.workout_sessions for insert with check (auth.uid() = user_id);

drop policy if exists "Sessions are updatable by their owner" on public.workout_sessions;
create policy "Sessions are updatable by their owner"
  on public.workout_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Sessions are deletable by their owner" on public.workout_sessions;
create policy "Sessions are deletable by their owner"
  on public.workout_sessions for delete using (auth.uid() = user_id);

-- Keep updated_at honest on server-side edits.
drop trigger if exists workouts_set_updated_at on public.workouts;
create trigger workouts_set_updated_at
  before update on public.workouts
  for each row execute function public.set_updated_at();

drop trigger if exists workout_sessions_set_updated_at on public.workout_sessions;
create trigger workout_sessions_set_updated_at
  before update on public.workout_sessions
  for each row execute function public.set_updated_at();
