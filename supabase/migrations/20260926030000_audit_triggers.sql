-- 20260926030000_audit_triggers.sql
-- Phase 10: Audit Trail. audit_logs rows are written automatically by this
-- one SECURITY DEFINER trigger function attached to every user-data table —
-- no service or component ever writes an audit log itself, so it can't be
-- forgotten on some call site and can't be tampered with by an
-- authenticated user's own client (RLS above grants that role select-only
-- access to audit_logs). This is an operational record of who changed what
-- and when, separate from Clinical Documentation's patient-care notes.

create or replace function public.handle_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_entity_id text;
  v_action text;
  v_previous jsonb;
  v_new jsonb;
  v_user_id uuid;
  v_performed_by text;
begin
  if (tg_op = 'INSERT') then
    v_entity_id := new.id::text;
    v_action := 'create';
    v_previous := null;
    v_new := to_jsonb(new);
    v_user_id := new.user_id;
  elsif (tg_op = 'UPDATE') then
    v_entity_id := new.id::text;
    v_previous := to_jsonb(old);
    v_new := to_jsonb(new);
    v_user_id := new.user_id;
    -- Open Loops and Workflow Runs both carry a `status` column — a change
    -- there is the specific "status_change" action the Phase 10 brief calls
    -- out, distinct from an ordinary field edit.
    if (to_jsonb(old) ? 'status') and (to_jsonb(old) ->> 'status') is distinct from (to_jsonb(new) ->> 'status') then
      v_action := 'status_change';
    else
      v_action := 'update';
    end if;
  else -- DELETE
    v_entity_id := old.id::text;
    v_action := 'delete';
    v_previous := to_jsonb(old);
    v_new := null;
    v_user_id := old.user_id;
  end if;

  -- Best-effort "who" — different tables name it differently
  -- (activities.performed_by, documentation_history.common->>performer);
  -- null is fine when a table has no such concept.
  v_performed_by := coalesce(
    (v_new ->> 'performed_by'),
    (v_new -> 'common' ->> 'performer'),
    (v_previous ->> 'performed_by'),
    (v_previous -> 'common' ->> 'performer')
  );

  insert into public.audit_logs (user_id, entity, entity_id, action, previous_value, new_value, performed_by)
  values (coalesce(v_user_id, auth.uid()), tg_table_name, v_entity_id, v_action, v_previous, v_new, v_performed_by);

  return coalesce(new, old);
end;
$$;

-- One identical trigger per user-data table. audit_logs itself is
-- deliberately excluded to avoid a logging table logging itself, as is the
-- shared, non-user-owned documentation_templates reference table.
do $$
declare
  t text;
begin
  foreach t in array array[
    'patients', 'providers', 'open_loops', 'activities',
    'documentation_history', 'workflow_runs', 'clinic_contacts', 'communication_logs'
  ]
  loop
    execute format(
      'drop trigger if exists %I_audit_trigger on public.%I;',
      t, t
    );
    execute format(
      'create trigger %I_audit_trigger
         after insert or update or delete on public.%I
         for each row execute function public.handle_audit_log();',
      t, t
    );
  end loop;
end;
$$;
