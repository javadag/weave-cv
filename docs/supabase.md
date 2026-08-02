# Supabase Setup

Weave CV uses [Supabase](https://supabase.com/) for authentication, the database, and storage.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (local development only)
- Supabase CLI:

  ```bash
  npm install -g supabase
  ```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable                  | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `SUPABASE_PROJECT_REF`    | Project slug used by the Supabase CLI          |
| `NUXT_PUBLIC_SUPABASE_URL`| Public project URL (e.g. `https://<ref>.supabase.co`) |
| `NUXT_PUBLIC_SUPABASE_KEY`| Anon/public API key                            |
| `NUXT_SUPABASE_SECRET_KEY`| Service-role key (server-only, never exposed to the client) |

## Schema & Migrations

The full database schema is version-controlled in `supabase/migrations/`. This is the source of truth for all tables, RLS policies, functions, and triggers. The Supabase CLI applies these migrations automatically — you do not need to run them manually.

When you change the schema (add a column, new policy, etc.), create a new migration:

```bash
supabase migration new <descriptive_name>
# Edit the generated file in supabase/migrations/
supabase db reset   # verify locally
```

## Local Development

```bash
supabase start
```

The CLI creates a local Postgres + GoTrue stack inside Docker, applies all migrations, and prints the local URL and keys. Copy the `anon` key and URL into `.env`. Local Postgres runs on port `54322` and the API on `54321`.

## Cloud Project

1. Create a project at [supabase.com](https://supabase.com).
2. Link the CLI and push the schema:

   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   ```

3. Copy the project URL and keys (Dashboard → Settings → API) into `.env`.

## Row Level Security (RLS)

All resume data is stored in the `resumes` table and protected by **one policy that scopes every row to its owner**. This is the only policy currently defined:

| Policy            | Table    | Command | Using (`USING`)       | With Check (`WITH CHECK`) |
| ----------------- | -------- | ------- | --------------------- | ------------------------- |
| `resumes_owner_all` | `resumes` | `ALL`   | `auth.uid() = owner_id` | `auth.uid() = owner_id` |

Equivalently:

```sql
create policy "resumes_owner_all"
  on public.resumes
  for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
```

### What this means

- **Reads and deletes:** a row is only visible/deletable if the signed-in user's JWT `auth.uid()` matches that row's `owner_id`. Anonymous users see nothing.
- **Inserts and updates:** the `WITH CHECK` clause rejects any write where the user would not own the resulting row — users cannot create or reassign a resume to someone else.
- **Backend access:** server routes authenticate with the service-role key (see `server/utils/auth.ts`), so they can access any row. Treat the service-role key as a secret — never ship it to the client.

### Adding a policy

Keep the naming convention `<table>_<action>_<scope>` (e.g. `resumes_owner_all`) and always test both clauses:

```sql
create policy "resumes_insert_own"
  on public.resumes
  for insert
  to authenticated
  with check (auth.uid() = owner_id);
```

Verify with the policies query:

```sql
select policyname, tablename, cmd, qual, with_check
from pg_policies order by tablename, cmd;
```

## Auth Notes

- Client auth is handled by `@nuxtjs/supabase`; the server validates the session via `serverSupabaseUser` (`server/utils/auth.ts`).
- When scaling to multiple serverless replicas, the in-memory rate limiter (`server/utils/rateLimit.ts`) should be replaced with a shared store such as Redis or Supabase itself.
