"use client";

// components/open-loops/ActivityTimelineItem.tsx
// One Activity Timeline entry: timestamp, action-type icon + label, the
// generated/entered documentation note, who performed it, and an optional
// attachment. Mostly presentational — the timeline never edits or deletes —
// except for "View", which resolves the attachment's private Storage path to
// a short-lived signed URL on demand, right when it's clicked, rather than
// storing or displaying a link up front.

import { useState } from "react";
import { Paperclip } from "lucide-react";
import { ACTION_TYPE_ICON, ACTION_TYPE_LABEL } from "@/lib/constants/action-types";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import { getSignedUrl } from "@/lib/supabase/storage";
import type { Activity } from "@/types";

interface ActivityTimelineItemProps {
  activity: Activity;
}

export function ActivityTimelineItem({ activity }: ActivityTimelineItemProps) {
  const Icon = ACTION_TYPE_ICON[activity.actionType];
  const [isResolvingLink, setIsResolvingLink] = useState(false);

  async function handleViewAttachment() {
    if (!activity.attachmentPath) return;
    setIsResolvingLink(true);
    try {
      const url = await getSignedUrl("attachments", activity.attachmentPath);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // Best-effort — a failed signed-URL lookup shouldn't break the timeline.
    } finally {
      setIsResolvingLink(false);
    }
  }

  return (
    <li className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary-dark">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="flex-1 border-b border-surface-border pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <span className="text-sm font-semibold text-accent">
            {ACTION_TYPE_LABEL[activity.actionType]}
          </span>
          <time dateTime={activity.timestamp} className="text-xs text-accent/50">
            {formatTimelineTimestamp(activity.timestamp)}
          </time>
        </div>
        <p className="mt-1 text-sm text-accent/80">{activity.note}</p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-accent/50">
          <span>By {activity.performedBy}</span>
          {activity.attachmentName ? (
            activity.attachmentPath ? (
              <button
                type="button"
                onClick={() => void handleViewAttachment()}
                disabled={isResolvingLink}
                className="inline-flex items-center gap-1 font-medium text-secondary-dark hover:underline disabled:opacity-50"
              >
                <Paperclip className="h-3 w-3" aria-hidden="true" />
                {isResolvingLink ? "Opening…" : activity.attachmentName}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Paperclip className="h-3 w-3" aria-hidden="true" />
                {activity.attachmentName}
              </span>
            )
          ) : null}
        </div>
      </div>
    </li>
  );
}
