# Clinic Operations Hub

A Healthcare Virtual Assistant (HVA) operating system for a Sleep Medicine & Weight Management clinic — an EMR **companion**, not a replacement for PracticeQ. It tracks open workflows to completion, generates EMR-ready documentation, organizes follow-ups, and teaches beginner-friendly SOPs for every clinic procedure and piece of software.

Built with **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS**, backed by **Supabase** (Auth, Postgres, Storage), and installable as a **Progressive Web App**.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Local installation](#local-installation)
- [Supabase setup](#supabase-setup)
- [Running the app](#running-the-app)
- [Deploying to Vercel](#deploying-to-vercel)
- [Updating the database](#updating-the-database)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS |
| Backend | Supabase — Postgres, Auth (email/password), Storage, Row Level Security |
| Hosting | Vercel |
| PWA | Native `app/manifest.ts` + a static-asset service worker (`public/sw.js`) |

---

## Local installation

**Prerequisites:** Node.js **20+** and npm. A free [Supabase](https://supabase.com) account (see [Supabase setup](#supabase-setup) below — do that first if you don't have a project yet).

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in your Supabase project's values
cp .env.local.example .env.local
```

Open `.env.local` and set the three values from your Supabase project (**Project Settings → API**):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # not used by the app itself; see the file's comments
```

See [Environment variables](#environment-variables) for what each one does — this is the complete list; the app reads nothing else.

---

## Supabase setup

Do this once per Supabase project (a fresh one for production, or a separate one for local development if you want to keep them apart).

### 1. Create a project

Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard). Note its **Project URL** and **anon public key** (Project Settings → API) — you'll need them for `.env.local` and, later, for Vercel.

### 2. Run the migrations

The schema lives in `supabase/migrations/`, as four numbered SQL files that must run **in order**:

| File | What it does |
|---|---|
| `20260926010000_extensions_and_tables.sql` | Creates all 10 tables (`patients`, `providers`, `open_loops`, `activities`, `documentation_templates`, `documentation_history`, `workflow_runs`, `clinic_contacts`, `communication_logs`, `audit_logs`), UUID primary keys, `user_id` ownership columns, CHECK constraints, and indexes. |
| `20260926020000_row_level_security.sql` | Enables Row Level Security and adds `select/insert/update/delete` policies scoped to `user_id = auth.uid()`. |
| `20260926030000_audit_triggers.sql` | Adds the audit-logging trigger function and attaches it to every user-data table. |
| `20260926040000_storage_buckets.sql` | Creates the 4 private Storage buckets (`fax-confirmations`, `attachments`, `pdfs`, `screenshots`) and their per-user folder policies. |

**Option A — Supabase CLI (recommended):**

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

`supabase db push` applies every migration in `supabase/migrations/` that hasn't run yet, in filename order.

**Option B — SQL Editor (no CLI):**

Open your project's **SQL Editor** in the Supabase dashboard and run each of the 4 files above **in order**, pasting one file's contents at a time. Each file is safe to run exactly once — some statements (like `create policy`) will error if you accidentally run the same file twice, which is expected: if that happens, just skip to the next file.

### 3. Create your account (the HVA user)

The app is single-user. Create that one account **before** seeding, either:

- In the app itself, once it's running — but sign-up isn't wired into the UI in this version, so instead:
- In the Supabase dashboard: **Authentication → Users → Add user**, and set an email + password.

### 4. Seed reference data

`supabase/seed.sql` seeds Documentation Templates, Providers, sample Patients, and Clinic Contacts (with their Communication Logs). It looks up the **first** user in `auth.users`, so your account from step 3 must already exist.

It deliberately does **not** seed Open Loops, Activities, Documentation History, or Workflow Runs — a real account should start with a clean slate of day-to-day work; that mock data existed only to demo cross-module matching during development.

Run it the same way as the migrations:

```bash
supabase db execute -f supabase/seed.sql
```

...or paste its contents into the SQL Editor.

### 5. (Optional) Turn off email confirmation for a single-user setup

By default, Supabase requires a new user to confirm their email before signing in. For a single internal HVA account you control yourself, you can turn this off under **Authentication → Providers → Email → Confirm email**, or simply confirm the user manually in **Authentication → Users**.

---

## Running the app

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`. Sign in with the account you created in Supabase setup step 3.

For a production-mode local run (e.g. to test the service worker, which only registers when `NODE_ENV=production`):

```bash
npm run build
npm run start
```

---

## Deploying to Vercel

See the full **Deployment Guide** (in the project's Claude docs, `claude/deployment-guide.md`) for a complete, click-by-click walkthrough. Short version:

1. Push this repository to GitHub.
2. In Vercel, **Add New Project** → import the GitHub repo. Vercel auto-detects Next.js; no build settings need to change.
3. Add the 3 environment variables from [Environment variables](#environment-variables) in **Project Settings → Environment Variables** (for the Production, Preview, and Development environments).
4. Deploy. Vercel gives you a `https://your-app.vercel.app` URL.
5. In Supabase, go to **Authentication → URL Configuration** and set **Site URL** to your Vercel URL (and add it under **Redirect URLs** too) — this matters if you ever enable email confirmation or password-reset links, so Supabase's emails point at your real domain instead of `localhost`.

That's it — the same Supabase project backs both your local dev environment and the deployed app (or use a separate Supabase project for each, if you'd rather keep them isolated; just run the migrations + seed against whichever project's URL you put in Vercel's env vars).

---

## Updating the database

**Schema changes:** add a new file to `supabase/migrations/` named with a later timestamp prefix (e.g. `20261015000000_add_something.sql`), following the existing files' style — `create table if not exists`, indexes on anything the app filters/sorts by, and a matching entry in `types/database.ts` (the hand-written `Database` type every Supabase client call is generic over). Never edit an already-applied migration file; add a new one. Apply it the same way as the initial migrations (`supabase db push` or the SQL Editor).

**Seed data changes:** don't hand-edit `supabase/seed.sql` — it's generated from the app's own reference data (`lib/mock/*.ts`, `lib/constants/documentation-templates.ts`) by `scripts/generate-seed-sql.ts`, so the two never drift apart. Regenerate it with:

```bash
node --experimental-strip-types scripts/generate-seed-sql.ts > supabase/seed.sql
```

**Row Level Security / audit triggers:** if you add a new user-owned table, give it the same 4 policies (`select/insert/update/delete` scoped to `user_id = auth.uid()`) as the existing tables in `20260926020000_row_level_security.sql`, and add its name to the trigger loop in `20260926030000_audit_triggers.sql` if it should be audited — as a new migration file, not an edit to those two.

---

## Project structure

```
app/                    Routes (Next.js App Router) — pages, layouts, manifest.ts
components/             Presentational React components, organized by module
hooks/                  Client-side orchestration (state + service calls)
services/               The ONLY layer that reads/writes data — Supabase queries live here
types/                  Shared TypeScript types, including types/database.ts (Supabase schema)
lib/
  supabase/             Browser/server Supabase clients, auth middleware, Storage helpers
  constants/            Static reference data (workflow definitions, SOP content, templates)
  mock/                 Original mock data — now used only to generate supabase/seed.sql
supabase/
  migrations/           SQL migrations, applied in filename order
  seed.sql              Generated seed data (see "Updating the database")
scripts/                One-off Node scripts (excluded from the Next.js build)
public/                 Static assets, PWA icons, manifest-adjacent files, sw.js
```

Every module follows the same layering: **route → component → hook → service → type**. Services are the only files that import `@/lib/supabase/client` — if you're adding a new data source, add a function to a service, never fetch Supabase directly from a component.

---

## Environment variables

| Variable | Required | Where it's used | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `lib/supabase/client.ts`, `server.ts`, `middleware.ts` | Your Supabase project's URL. Public — safe in browser bundles. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Same as above | Supabase's anon/public API key. Public by design — Row Level Security is what actually protects data, not this key being secret. |
| `SUPABASE_SERVICE_ROLE_KEY` | No (documented, unused by the running app) | — | Kept in the env template so it's never confused with the anon key above. Only needed if you write your own admin/maintenance script that must bypass RLS. **Never** set this as a `NEXT_PUBLIC_` variable or expose it to the browser. |

This is the complete list — verified against every `process.env` reference in the codebase.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server (`localhost:3000`) |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | ESLint (via `next lint`) |
| `npm run typecheck` | `tsc --noEmit` |
