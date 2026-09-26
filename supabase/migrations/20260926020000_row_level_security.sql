-- 20260926020000_row_level_security.sql
-- Phase 10: Row Level Security. Every user-data table is scoped to
-- `user_id = auth.uid()` — today that's a single HVA account, but the
-- policy shape already supports a second authenticated user seeing only
-- their own rows with zero application code changes ("single-user ready,
-- expandable later" per the Phase 10 brief). documentation_templates is
-- shared reference content (no user_id), readable by any authenticated
-- user and never writable from the client. audit_logs is written only by
-- the SECURITY DEFINER trigger functions in the next migration, so it has
-- no insert/update/delete policy for ordinary authenticated users at all.

alter table public.patients enable row level security;
alter table public.providers enable row level security;
alter table public.open_loops enable row level security;
alter table public.activities enable row level security;
alter table public.documentation_templates enable row level security;
alter table public.documentation_history enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.clinic_contacts enable row level security;
alter table public.communication_logs enable row level security;
alter table public.audit_logs enable row level security;

-- ---------------------------------------------------------------- patients
create policy "patients_select_own" on public.patients
  for select to authenticated using (user_id = auth.uid());
create policy "patients_insert_own" on public.patients
  for insert to authenticated with check (user_id = auth.uid());
create policy "patients_update_own" on public.patients
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "patients_delete_own" on public.patients
  for delete to authenticated using (user_id = auth.uid());

-- --------------------------------------------------------------- providers
create policy "providers_select_own" on public.providers
  for select to authenticated using (user_id = auth.uid());
create policy "providers_insert_own" on public.providers
  for insert to authenticated with check (user_id = auth.uid());
create policy "providers_update_own" on public.providers
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "providers_delete_own" on public.providers
  for delete to authenticated using (user_id = auth.uid());

-- -------------------------------------------------------------- open_loops
create policy "open_loops_select_own" on public.open_loops
  for select to authenticated using (user_id = auth.uid());
create policy "open_loops_insert_own" on public.open_loops
  for insert to authenticated with check (user_id = auth.uid());
create policy "open_loops_update_own" on public.open_loops
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "open_loops_delete_own" on public.open_loops
  for delete to authenticated using (user_id = auth.uid());

-- --------------------------------------------------------------- activities
create policy "activities_select_own" on public.activities
  for select to authenticated using (user_id = auth.uid());
create policy "activities_insert_own" on public.activities
  for insert to authenticated with check (user_id = auth.uid());
create policy "activities_update_own" on public.activities
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "activities_delete_own" on public.activities
  for delete to authenticated using (user_id = auth.uid());

-- ------------------------------------------------- documentation_templates
-- Shared, read-only reference data: any signed-in user can read every
-- template; nothing here is user-owned, so there's no insert/update/delete
-- policy at all (only a service-role/admin connection — e.g. seed.sql — can
-- write to it).
create policy "documentation_templates_select_all" on public.documentation_templates
  for select to authenticated using (true);

-- -------------------------------------------------- documentation_history
create policy "documentation_history_select_own" on public.documentation_history
  for select to authenticated using (user_id = auth.uid());
create policy "documentation_history_insert_own" on public.documentation_history
  for insert to authenticated with check (user_id = auth.uid());
create policy "documentation_history_update_own" on public.documentation_history
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "documentation_history_delete_own" on public.documentation_history
  for delete to authenticated using (user_id = auth.uid());

-- ------------------------------------------------------------ workflow_runs
create policy "workflow_runs_select_own" on public.workflow_runs
  for select to authenticated using (user_id = auth.uid());
create policy "workflow_runs_insert_own" on public.workflow_runs
  for insert to authenticated with check (user_id = auth.uid());
create policy "workflow_runs_update_own" on public.workflow_runs
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workflow_runs_delete_own" on public.workflow_runs
  for delete to authenticated using (user_id = auth.uid());

-- --------------------------------------------------------- clinic_contacts
create policy "clinic_contacts_select_own" on public.clinic_contacts
  for select to authenticated using (user_id = auth.uid());
create policy "clinic_contacts_insert_own" on public.clinic_contacts
  for insert to authenticated with check (user_id = auth.uid());
create policy "clinic_contacts_update_own" on public.clinic_contacts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "clinic_contacts_delete_own" on public.clinic_contacts
  for delete to authenticated using (user_id = auth.uid());

-- ------------------------------------------------------- communication_logs
create policy "communication_logs_select_own" on public.communication_logs
  for select to authenticated using (user_id = auth.uid());
create policy "communication_logs_insert_own" on public.communication_logs
  for insert to authenticated with check (user_id = auth.uid());
create policy "communication_logs_update_own" on public.communication_logs
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "communication_logs_delete_own" on public.communication_logs
  for delete to authenticated using (user_id = auth.uid());

-- -------------------------------------------------------------- audit_logs
-- Read-only for the owning user; no client-side write policy — rows are
-- inserted exclusively by the SECURITY DEFINER trigger functions, which run
-- with elevated privilege regardless of RLS.
create policy "audit_logs_select_own" on public.audit_logs
  for select to authenticated using (user_id = auth.uid());
