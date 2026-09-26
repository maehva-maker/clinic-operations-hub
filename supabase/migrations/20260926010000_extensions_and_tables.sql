-- 20260926010000_extensions_and_tables.sql
-- Phase 10: core schema for Clinic Operations Hub. One table per module's
-- data (Open Loop Tracker, Clinical Documentation, Workflow Wizard, Patient
-- & Clinic Directory), matching the TypeScript models in types/*.ts exactly
-- so services/*.service.ts can map rows to/from those types with no
-- reshaping. UUID primary keys throughout, `user_id` ownership columns on
-- every user-data table (single-user today, ready for multi-user RLS in the
-- next migration), and indexes on every column the app actually filters or
-- sorts by (see each table's own list of Open Loop Tracker / Documentation
-- History / Reports filters).

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------- patients
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  aliases text[] not null default '{}',
  dob date not null,
  provider text not null,
  program text not null check (program in ('sleep_medicine', 'weight_management')),
  phone text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patients_user_id_idx on public.patients (user_id);
create index if not exists patients_name_idx on public.patients (lower(name));
create index if not exists patients_aliases_idx on public.patients using gin (aliases);
create index if not exists patients_program_idx on public.patients (program);

-- --------------------------------------------------------------- providers
create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  specialty text not null,
  clinic_days text[] not null default '{}',
  notes text not null default '',
  related_workflow_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists providers_user_id_idx on public.providers (user_id);

-- -------------------------------------------------------------- open_loops
create table if not exists public.open_loops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  patient_name text not null,
  patient_dob date not null,
  domain text not null check (domain in ('sleep_medicine', 'weight_management')),
  category text not null,
  title text not null,
  description text not null default '',
  status text not null check (status in ('new', 'in_progress', 'waiting', 'completed', 'escalated')),
  priority text not null check (priority in ('low', 'normal', 'high', 'urgent')),
  provider text not null,
  waiting_on text check (waiting_on in ('patient', 'insurance', 'dream_sleep', 'labcorp', 'provider', 'other')),
  due_date date,
  opened_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists open_loops_user_id_idx on public.open_loops (user_id);
create index if not exists open_loops_domain_idx on public.open_loops (domain);
create index if not exists open_loops_status_idx on public.open_loops (status);
create index if not exists open_loops_category_idx on public.open_loops (category);
create index if not exists open_loops_due_date_idx on public.open_loops (due_date);
create index if not exists open_loops_waiting_on_idx on public.open_loops (waiting_on);
create index if not exists open_loops_patient_name_idx on public.open_loops (lower(patient_name));

-- --------------------------------------------------------------- activities
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  open_loop_id uuid not null references public.open_loops (id) on delete cascade,
  "timestamp" timestamptz not null default now(),
  action_type text not null check (
    action_type in ('call', 'voicemail', 'fax', 'email', 'documentation', 'status_change', 'follow_up_set', 'note')
  ),
  note text not null,
  performed_by text not null,
  attachment_name text,
  -- Storage object path (bucket "attachments"), added for Phase 10's real
  -- file upload — attachment_name stays the human-readable original filename.
  attachment_path text,
  created_at timestamptz not null default now()
);

create index if not exists activities_user_id_idx on public.activities (user_id);
create index if not exists activities_open_loop_id_idx on public.activities (open_loop_id);
create index if not exists activities_timestamp_idx on public.activities ("timestamp" desc);

-- ------------------------------------------------- documentation_templates
-- Shared reference/config data (the 19 templates from
-- lib/constants/documentation-templates.ts) — not owned by any one user, so
-- no user_id column. Seeded once via seed.sql. The Next.js app still reads
-- template definitions from the bundled TypeScript constants at render time
-- (see the Phase 10 build notes for why); this table is the source of truth
-- for seeding and for any future non-Next.js consumer (e.g. Global Search
-- from a different client, an admin tool).
create table if not exists public.documentation_templates (
  id text primary key,
  category text not null check (
    category in ('patient_communication', 'sleep_medicine', 'weight_management', 'administrative')
  ),
  label text not null,
  fields jsonb not null default '[]',
  help jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists documentation_templates_category_idx on public.documentation_templates (category);

-- -------------------------------------------------- documentation_history
create table if not exists public.documentation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  template_id text not null references public.documentation_templates (id),
  category text not null check (
    category in ('patient_communication', 'sleep_medicine', 'weight_management', 'administrative')
  ),
  "timestamp" timestamptz not null default now(),
  note_text text not null,
  common jsonb not null,
  field_values jsonb not null default '{}',
  related_open_loop_id uuid references public.open_loops (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists documentation_history_user_id_idx on public.documentation_history (user_id);
create index if not exists documentation_history_timestamp_idx on public.documentation_history ("timestamp" desc);
create index if not exists documentation_history_template_id_idx on public.documentation_history (template_id);
create index if not exists documentation_history_category_idx on public.documentation_history (category);
create index if not exists documentation_history_related_open_loop_id_idx
  on public.documentation_history (related_open_loop_id);

-- ------------------------------------------------------------ workflow_runs
create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Matches a WorkflowDefinitionId from lib/constants/workflow-definitions.ts
  -- (static in-code reference data, not a DB table — see build notes).
  workflow_id text not null,
  patient_name text not null,
  status text not null check (status in ('in_progress', 'completed')),
  completed_step_ids text[] not null default '{}',
  confirmed_info_items text[] not null default '{}',
  documentation_generated boolean not null default false,
  generated_note_text text,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists workflow_runs_user_id_idx on public.workflow_runs (user_id);
create index if not exists workflow_runs_workflow_id_idx on public.workflow_runs (workflow_id);
create index if not exists workflow_runs_status_idx on public.workflow_runs (status);
create index if not exists workflow_runs_updated_at_idx on public.workflow_runs (updated_at desc);

-- --------------------------------------------------------- clinic_contacts
create table if not exists public.clinic_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  category text not null check (
    category in (
      'sleep_labs', 'dme_suppliers', 'laboratories',
      'insurance_portals', 'referral_offices', 'internal_contacts'
    )
  ),
  phone text,
  fax text,
  email text,
  address text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clinic_contacts_user_id_idx on public.clinic_contacts (user_id);
create index if not exists clinic_contacts_category_idx on public.clinic_contacts (category);
create index if not exists clinic_contacts_name_idx on public.clinic_contacts (lower(name));

-- ------------------------------------------------------- communication_logs
create table if not exists public.communication_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  contact_id uuid not null references public.clinic_contacts (id) on delete cascade,
  date timestamptz not null default now(),
  method text not null check (method in ('call', 'fax', 'email', 'portal', 'in_person')),
  summary text not null,
  performer text not null,
  created_at timestamptz not null default now()
);

create index if not exists communication_logs_contact_id_idx on public.communication_logs (contact_id);
create index if not exists communication_logs_date_idx on public.communication_logs (date desc);

-- -------------------------------------------------------------- audit_logs
-- Populated only by the trigger functions in
-- 20260926030000_audit_triggers.sql — never written to directly by the app.
-- This is an operational audit trail, not patient documentation.
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  entity text not null,
  entity_id text not null,
  action text not null check (action in ('create', 'update', 'delete', 'status_change')),
  previous_value jsonb,
  new_value jsonb,
  performed_by text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_user_id_idx on public.audit_logs (user_id);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity, entity_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
