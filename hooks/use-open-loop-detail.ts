"use client";

// hooks/use-open-loop-detail.ts
// Backs the Open Loop Detail drawer: fetches one loop plus its full Activity
// Timeline, and exposes the three mutations Quick Actions can perform. Every
// mutation re-fetches both the loop and its timeline afterward, since a
// status change or follow-up update always also appends a new activity
// entry — the two are never out of sync in the service layer.

import { useCallback, useEffect, useState } from "react";
import {
  appendActivity,
  getActivitiesForLoop,
  getOpenLoopById,
  updateOpenLoopFollowUp,
  updateOpenLoopStatus,
  type AddActivityInput,
} from "@/services/open-loops.service";
import type { Activity, LoopStatus, OpenLoop, WaitingOnType } from "@/types";

interface UseOpenLoopDetailResult {
  loop: OpenLoop | null;
  activities: Activity[];
  isLoading: boolean;
  logActivity: (input: AddActivityInput) => Promise<void>;
  changeStatus: (status: LoopStatus, reason?: string) => Promise<void>;
  setFollowUp: (dueDate: string, waitingOn: WaitingOnType | null) => Promise<void>;
}

export function useOpenLoopDetail(loopId: string | null): UseOpenLoopDetailResult {
  const [loop, setLoop] = useState<OpenLoop | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!loopId) {
      setLoop(null);
      setActivities([]);
      return;
    }
    setIsLoading(true);
    const [loopResult, activityResult] = await Promise.all([
      getOpenLoopById(loopId),
      getActivitiesForLoop(loopId),
    ]);
    setLoop(loopResult);
    setActivities(activityResult);
    setIsLoading(false);
  }, [loopId]);

  useEffect(() => {
    void load();
  }, [load]);

  const logActivity = useCallback(
    async (input: AddActivityInput) => {
      if (!loopId) return;
      await appendActivity(loopId, input);
      await load();
    },
    [loopId, load],
  );

  const changeStatus = useCallback(
    async (status: LoopStatus, reason?: string) => {
      if (!loopId) return;
      await updateOpenLoopStatus(loopId, status, reason);
      await load();
    },
    [loopId, load],
  );

  const setFollowUp = useCallback(
    async (dueDate: string, waitingOn: WaitingOnType | null) => {
      if (!loopId) return;
      await updateOpenLoopFollowUp(loopId, dueDate, waitingOn);
      await load();
    },
    [loopId, load],
  );

  return { loop, activities, isLoading, logActivity, changeStatus, setFollowUp };
}
