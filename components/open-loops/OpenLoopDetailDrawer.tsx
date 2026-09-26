"use client";

// components/open-loops/OpenLoopDetailDrawer.tsx
// Page 2 — Open Loop Detail. Always a right-side drawer over the tracker,
// never a separate page: closing it returns to exactly where the list was
// (the open loop id lives in the URL as ?loop=, not in a route segment).
// Combines the loop's fields, its full Activity Timeline, and the six Quick
// Actions, each of which appends to that timeline through
// hooks/use-open-loop-detail.ts.

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { QuickActionsBar, type QuickAction } from "@/components/open-loops/QuickActionsBar";
import { QuickActionModal } from "@/components/open-loops/QuickActionModal";
import { ChangeStatusModal } from "@/components/open-loops/ChangeStatusModal";
import { SetFollowUpModal } from "@/components/open-loops/SetFollowUpModal";
import { ActivityTimelineList } from "@/components/open-loops/ActivityTimelineList";
import { useOpenLoopDetail } from "@/hooks/use-open-loop-detail";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import { formatFriendlyDate } from "@/lib/utils/date";
import { DOMAIN_LABEL, WAITING_ON_LABEL } from "@/types";

interface OpenLoopDetailDrawerProps {
  loopId: string | null;
  onClose: () => void;
}

const DOCUMENTATION_ACTION_CONFIG = {
  documentation: {
    title: "Add Documentation",
    noteLabel: "Documentation",
    notePlaceholder: "What was done, and what's the outcome?",
    includeAttachment: false,
  },
  call: {
    title: "Log Call",
    noteLabel: "Call Summary",
    notePlaceholder: "Who did you reach, and what was discussed?",
    includeAttachment: false,
  },
  fax: {
    title: "Upload Fax",
    noteLabel: "Fax Details",
    notePlaceholder: "What was faxed, and to whom?",
    includeAttachment: true,
  },
  email: {
    title: "Send Email Record",
    noteLabel: "Email Summary",
    notePlaceholder: "What was sent, and to whom?",
    includeAttachment: true,
  },
} as const;

function isDocumentationAction(
  action: QuickAction,
): action is keyof typeof DOCUMENTATION_ACTION_CONFIG {
  return action in DOCUMENTATION_ACTION_CONFIG;
}

export function OpenLoopDetailDrawer({ loopId, onClose }: OpenLoopDetailDrawerProps) {
  const { loop, activities, logActivity, changeStatus, setFollowUp } = useOpenLoopDetail(loopId);
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null);

  const isOpen = Boolean(loopId);
  const documentationConfig = activeAction && isDocumentationAction(activeAction)
    ? DOCUMENTATION_ACTION_CONFIG[activeAction]
    : null;

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} title={loop?.patientName ?? "Open Loop"}>
        {loop ? (
          <div className="flex flex-col gap-6">
            <section aria-labelledby="loop-overview-heading" className="flex flex-col gap-3">
              <h3 id="loop-overview-heading" className="sr-only">
                Loop Overview
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={loop.status} />
                <PriorityBadge priority={loop.priority} />
              </div>
              <p className="text-base font-semibold text-accent">{loop.title}</p>
              {loop.description ? (
                <p className="text-sm text-accent/70">{loop.description}</p>
              ) : null}

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-card bg-surface p-4 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">
                    Patient DOB
                  </dt>
                  <dd className="text-accent">{formatFriendlyDate(loop.patientDob)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">
                    Domain
                  </dt>
                  <dd className="text-accent">{DOMAIN_LABEL[loop.domain]}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">
                    Category
                  </dt>
                  <dd className="text-accent">{CATEGORY_LABEL[loop.category]}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">
                    Provider
                  </dt>
                  <dd className="text-accent">{loop.provider}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">
                    Due Date
                  </dt>
                  <dd className="text-accent">
                    {loop.dueDate ? formatFriendlyDate(loop.dueDate) : "None set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">
                    Waiting On
                  </dt>
                  <dd className="text-accent">
                    {loop.waitingOn ? WAITING_ON_LABEL[loop.waitingOn] : "Nobody"}
                  </dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="quick-actions-heading" className="flex flex-col gap-3">
              <h3 id="quick-actions-heading" className="text-sm font-semibold text-accent">
                Quick Actions
              </h3>
              <QuickActionsBar onSelect={setActiveAction} />
            </section>

            <section aria-labelledby="activity-timeline-heading" className="flex flex-col gap-3">
              <h3 id="activity-timeline-heading" className="text-sm font-semibold text-accent">
                Activity Timeline
              </h3>
              <ActivityTimelineList activities={activities} />
            </section>
          </div>
        ) : (
          <p className="text-sm text-accent/50">Loading open loop…</p>
        )}
      </Drawer>

      {documentationConfig ? (
        <QuickActionModal
          isOpen
          onClose={() => setActiveAction(null)}
          actionType={activeAction === "documentation" ? "documentation" : (activeAction as "call" | "fax" | "email")}
          title={documentationConfig.title}
          noteLabel={documentationConfig.noteLabel}
          notePlaceholder={documentationConfig.notePlaceholder}
          includeAttachment={documentationConfig.includeAttachment}
          onSubmit={async (input) => {
            await logActivity(input);
          }}
        />
      ) : null}

      {loop ? (
        <ChangeStatusModal
          isOpen={activeAction === "change_status"}
          onClose={() => setActiveAction(null)}
          currentStatus={loop.status}
          onSubmit={async (status, reason) => {
            await changeStatus(status, reason);
          }}
        />
      ) : null}

      {loop ? (
        <SetFollowUpModal
          isOpen={activeAction === "set_follow_up"}
          onClose={() => setActiveAction(null)}
          currentDueDate={loop.dueDate}
          currentWaitingOn={loop.waitingOn}
          onSubmit={async (dueDate, waitingOn) => {
            await setFollowUp(dueDate, waitingOn);
          }}
        />
      ) : null}
    </>
  );
}
