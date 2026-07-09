-- Exponential Go — cloud sync schema.
-- Paste this whole file into the Supabase SQL Editor (see SETUP-SYNC.md) and Run.
--
-- Security model: one row per family, keyed by a long unguessable "sync code".
-- The families table has Row Level Security ON with NO policies, so the public
-- (anon) role cannot read or write it directly. All access goes through two
-- SECURITY DEFINER functions that require the code — so knowing the code is the
-- only way in.

create table if not exists public.families (
  code       text primary key,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.families enable row level security;
-- (Intentionally no policies: direct table access is denied for anon.)

-- Fetch a family's state by code.
create or replace function public.get_family(p_code text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select state
  from public.families
  where code = upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
$$;

-- Insert or update a family's state (last write wins).
create or replace function public.save_family(p_code text, p_state jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  c text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
begin
  if length(c) < 8 then
    raise exception 'code too short';
  end if;
  insert into public.families (code, state, updated_at)
  values (c, p_state, now())
  on conflict (code) do update
    set state = excluded.state,
        updated_at = now();
end;
$$;

-- Only these two functions are callable by the anonymous web client.
revoke all on function public.get_family(text) from public;
revoke all on function public.save_family(text, jsonb) from public;
grant execute on function public.get_family(text) to anon, authenticated;
grant execute on function public.save_family(text, jsonb) to anon, authenticated;
