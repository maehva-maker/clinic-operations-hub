// services/open-loops.service.ts
// The only place that reads or mutates Open Loop / Activity data. Phase 10:
// backed by the real `open_loops` and `activities` Supabase tables instead
// of an in-memory mock array — every exported function keeps its exact
// Phase 4 signature and return shape, so no hook or component calling this
// service needed to change. Row Level Security (not this file) is what
// scopes every query to the signed-in user; inserts still set `user_id`
// explicitly so the row is correct even before RLS's own default applies.

import { createClient } from "@/lib/supabase/client";
import { getDueDateBucket } from "@/lib/utils/date";
import { LOOP_STATUS_LABEL, WAITING_ON_LABEL } from "@/types";
import type {
  Activity,
  ActivityActionType,
  LoopStatus,
  OpenLoop,
  OpenLoopCategory,
  OpenLoopFilters,
  TaskPriority,
  WaitingOnType,
  WorkflowDomain,
} from "@/types";
import type { Database } from "@/types/database";

type OpenLoopRow = Database["public"]["Tables"]["open_loops"]["Row"];
type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];

function rowToOpenLoop(row: OpenLoopRow): OpenLoop {
  return {
    id: row.id,
    patientName: row.patient_name,
    patientDob: row.patient_dob,
    domain: row.domain,
    category: row.category as OpenLoopCategory,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    provider: row.provider,
    waitingOn: row.waiting_on,
    dueDate: row.due_date,
    openedAt: row.opened_at,
    updatedAt: row.updated_at,
  };
}

function rowToActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    openLoopId: row.open_loop_id,
    timestamp: row.timestamp,
    actionType: row.action_type,
    note: row.note,
    performedBy: row.performed_by,
    attachmentName: row.attachment_name,
    attachmentPath: row.attachment_path,
  };
}

export async function getOpenLoops(): Promise<OpenLoop[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("open_loops").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(`Couldn't load open loops: ${error.message}`);
  return (data ?? []).map(rowToOpenLoop);
}

export async function getOpenLoopById(id: string): Promise<OpenLoop | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("open_loops").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Couldn't load open loop: ${error.message}`);
  return data ? rowToOpenLoop(data) : null;
}

export async function getActivitiesForLoop(loopId: string): Promise<Activity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("open_loop_id", loopId)
    .order("timestamp", { ascending: false });
  if (error) throw new Error(`Couldn't load activity timeline: ${error.message}`);
  return (data ?? []).map(rowToActivity);
}

/** Pure filtering — no I/O — so it can also be used to compute status counts. Unchanged from Phase 4. */
export function filterOpenLoops(loops: OpenLoop[], filters: OpenLoopFilters): OpenLoop[] {
  const query = filters.search.trim().toLowerCase();

  return loops.filter((loop) => {
    if (loop.domain !== filters.domain) return false;
    if (filters.category !== "all" && loop.category !== filters.category) return false;
    if (filters.status !== "all" && loop.status !== filters.status) return false;
    if (filters.priority !== "all" && loop.priority !== filters.priority) return false;
    if (filters.provider !== "all" && loop.provider !== filters.provider) return false;
    if (filters.dueDate !== "all" && getDueDateBucket(loop.dueDate) !== filters.dueDate) {
      return false;
    }
    if (
      query &&
      !loop.patientName.toLowerCase().includes(query) &&
      !loop.title.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}

export function getStatusCounts(loops: OpenLoop[]): Record<LoopStatus, number> {
  const counts: Record<LoopStatus, number> = {
    new: 0,
    in_progress: 0,
    waiting: 0,
    completed: 0,
    escalated: 0,
  };
  loops.forEach((loop) => {
    counts[loop.status] += 1;
  });
  return counts;
}

export interface CreateOpenLoopInput {
  patientName: string;
  patientDob: string;
  domain: WorkflowDomain;
  category: OpenLoopCategory;
  title: string;
  description: string;
  priority: TaskPriority;
  provider: string;
  dueDate: string | null;
}

export async function createOpenLoop(input: CreateOpenLoopInput): Promise<OpenLoop> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to create an open loop.");

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("open_loops")
    .insert({
      user_id: user.id,
      patient_name: input.patientName,
      patient_dob: input.patientDob,
      domain: input.domain,
      category: input.category,
      title: input.title,
      description: input.description,
      status: "new",
      priority: input.priority,
      provider: input.provider,
      waiting_on: null,
      due_date: input.dueDate,
      opened_at: now,
      updated_at: now,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Couldn't create open loop: ${error.message}`);

  const loop = rowToOpenLoop(data);
  await appendActivity(loop.id, { actionType: "note", note: "Open loop created." });
  return loop;
}

export interface AddActivityInput {
  actionType: ActivityActionType;
  note: string;
  performedBy?: string;
  attachmentName?: string | null;
  attachmentPath?: string | null;
}

export async function appendActivity(loopId: string, input: AddActivityInput): Promise<Activity> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to add an activity.");

  const timestamp = new Date().toISOString();
  const { data, error } = await supabase
    .from("activities")
    .insert({
      user_id: user.id,
      open_loop_id: loopId,
      timestamp,
      action_type: input.actionType,
      note: input.note,
      performed_by: input.performedBy ?? "Mae",
      attachment_name: input.attachmentName ?? null,
      attachment_path: input.attachmentPath ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Couldn't add activity: ${error.message}`);

  const { error: touchError } = await supabase
    .from("open_loops")
    .update({ updated_at: timestamp })
    .eq("id", loopId);
  if (touchError) throw new Error(`Couldn't update open loop timestamp: ${touchError.message}`);

  return rowToActivity(data);
}

export async function updateOpenLoopStatus(
  loopId: string,
  status: LoopStatus,
  reason?: string,
): Promise<OpenLoop> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("open_loops")
    .update({ status, updated_at: now })
    .eq("id", loopId)
    .select("*")
    .single();
  if (error) throw new Error(`Couldn't update open loop status: ${error.message}`);

  await appendActivity(loopId, {
    actionType: "status_change",
    note: reason
      ? `Status changed to ${LOOP_STATUS_LABEL[status]}. ${reason}`
      : `Status changed to ${LOOP_STATUS_LABEL[status]}.`,
  });

  return rowToOpenLoop(data);
}

export async function updateOpenLoopFollowUp(
  loopId: string,
  dueDate: string,
  waitingOn: WaitingOnType | null,
): Promise<OpenLoop> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("open_loops")
    .update({ due_date: dueDate, waiting_on: waitingOn, updated_at: now })
    .eq("id", loopId)
    .select("*")
    .single();
  if (error) throw new Error(`Couldn't update open loop follow-up: ${error.message}`);

  await appendActivity(loopId, {
    actionType: "follow_up_set",
    note: waitingOn
      ? `Follow-up date set to ${dueDate} — waiting on ${WAITING_ON_LABEL[waitingOn]}.`
      : `Follow-up date set to ${dueDate}.`,
  });

  return rowToOpenLoop(data);
}
