-- Spar: initial schema.
-- Every table is user-scoped and RLS-protected. There is no shared/global data
-- in v1 (no social features), so every policy is simply "the row is mine".

create type spar_mode as enum ('pause_only', 'full');
create type spar_move as enum (
  'agree_bigger', 'own_it', 'hand_back', 'deadpan', 'defended', 'unclear'
);

-- profiles ------------------------------------------------------------------
create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  name               text        not null default '',
  mode               spar_mode   not null default 'pause_only',
  difficulty         smallint    not null default 1 check (difficulty between 1 and 5),
  countdown_seconds  smallint    not null default 5 check (countdown_seconds between 3 and 15),
  training_wheels    boolean     not null default true,
  onboarded_at       timestamptz,
  created_at         timestamptz not null default now()
);

-- sore_spots ----------------------------------------------------------------
create table public.sore_spots (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  text       text not null check (length(btrim(text)) between 1 and 120),
  created_at timestamptz not null default now()
);
create index sore_spots_user_id_idx on public.sore_spots (user_id);

-- off_limits ----------------------------------------------------------------
create table public.off_limits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  text       text not null check (length(btrim(text)) between 1 and 120),
  created_at timestamptz not null default now()
);
create index off_limits_user_id_idx on public.off_limits (user_id);

-- jabs ----------------------------------------------------------------------
create table public.jabs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  text              text not null,
  difficulty        smallint not null check (difficulty between 1 and 5),
  flagged_too_much  boolean not null default false,
  created_at        timestamptz not null default now()
);
create index jabs_user_id_created_at_idx on public.jabs (user_id, created_at desc);

-- reps ----------------------------------------------------------------------
create table public.reps (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  jab_id          uuid references public.jabs (id) on delete set null,
  mode            spar_mode not null,
  audio_path      text,
  transcript      text,
  response_ms     integer check (response_ms >= 0),
  word_count      integer check (word_count >= 0),
  move            spar_move,
  defended        boolean,
  defense_signals jsonb not null default '[]'::jsonb,
  note            text,
  created_at      timestamptz not null default now()
);
create index reps_user_id_created_at_idx on public.reps (user_id, created_at desc);

-- RLS -----------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.sore_spots enable row level security;
alter table public.off_limits enable row level security;
alter table public.jabs       enable row level security;
alter table public.reps       enable row level security;

create policy profiles_select on public.profiles for select using ((select auth.uid()) = id);
create policy profiles_insert on public.profiles for insert with check ((select auth.uid()) = id);
create policy profiles_update on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy profiles_delete on public.profiles for delete using ((select auth.uid()) = id);

create policy sore_spots_all on public.sore_spots for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy off_limits_all on public.off_limits for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy jabs_all on public.jabs for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy reps_all on public.reps for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- A profile row exists for every user from the moment they sign up, so the
-- client never has to branch on "profile missing".
create function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
