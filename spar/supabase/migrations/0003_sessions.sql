-- A session is the ten-rep container. Reps were loose rows keyed only by
-- timestamp; the rep cap, the "Too much" three-strikes rule and per-session
-- history all need a real boundary, so it gets a table rather than a
-- timestamp heuristic.

create type spar_session_end as enum (
  'completed',   -- hit the rep cap
  'stopped',     -- user left early
  'too_much'     -- three "Too much" taps, ended gently
);

create table public.sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  mode        spar_mode not null,
  difficulty  smallint not null check (difficulty between 1 and 5),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  ended_reason spar_session_end
);
create index sessions_user_id_started_at_idx on public.sessions (user_id, started_at desc);

-- Reps outlive their session row only if a session is deleted directly, which
-- nothing does; set null keeps the rep and its response_ms for the stats.
alter table public.reps
  add column session_id uuid references public.sessions (id) on delete set null;
create index reps_session_id_idx on public.reps (session_id);

alter table public.sessions enable row level security;

create policy sessions_all on public.sessions for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
