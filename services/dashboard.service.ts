// services/dashboard.service.ts
// Data-access layer for the Dashboard. Per the Phase 1 Foundation
// architecture, this is the ONLY place that knows where dashboard data
// actually comes from — right now that's the mock fixture, but a future
// phase swaps the function body for real Supabase queries (open_loops,
// daily_tasks, call_logs) without any component or hook needing to change.

import { MOCK_DASHBOARD_DATA } from "@/lib/mock/dashboard";
import type { DashboardData } from "@/types";

export async function getDashboardData(): Promise<DashboardData> {
  // Simulates network latency so loading states can be exercised in dev.
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_DASHBOARD_DATA;
}
