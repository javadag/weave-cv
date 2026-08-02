-- ============================================================
-- Weave CV — initial schema migration
-- Recreates every table, function, enum and RLS policy the app
-- needs from an empty database.  Run with:
--   supabase start          (local)
--   supabase db push         (cloud, after supabase link)
-- ============================================================

-- 0. Extensions
create extension if not exists "pg_trgm" with schema extensions;

-- 1. Enums
create type public.locale as enum ('en', 'fa');

-- 2. Tables
create table public.resumes (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null references auth.users(id) on delete cascade,
  title            text not null default 'Untitled',
  content          jsonb,
  configs          jsonb,
  "schemaVersion"  integer not null default 1,
  is_public        boolean not null default false,
  slug             text unique,
  public_updated_at timestamptz,
  public_view_count integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.resumes is 'User-created resumes with full content stored as JSON.';

-- 3. Row Level Security
alter table public.resumes enable row level security;

create policy "resumes_owner_all"
  on public.resumes
  for all
  to authenticated
  using  (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- 4. Indexes
create index resumes_owner_id_idx  on public.resumes (owner_id);
create index resumes_slug_idx      on public.resumes (slug) where slug is not null;
create index resumes_updated_at_idx on public.resumes (updated_at desc);

-- 5. Helper functions

-- Auto-update updated_at on row modification
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger resumes_set_updated_at
  before update on public.resumes
  for each row
  execute function public.set_updated_at();

-- Handle new auth user (profile bootstrap hook)
create or replace function public.handle_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.resumes (owner_id, title)
  values (new.id, 'Untitled');
  return new;
end;
$$;

-- Trigger on auth.users insert (optional — creates a blank resume for each new user)
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_profile();

-- pg_trgm wrappers (used by Supabase dashboard / text search)
create or replace function public.show_trgm(input text)
returns setof text
language sql
stable
as $$
  select unnest(show_trgm(input));
$$;

create or replace function public.show_limit()
returns integer
language sql
stable
as $$
  select 3;
$$;
