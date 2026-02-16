import { SupabaseClient } from "@supabase/supabase-js";
import type { PipelineStage, RevenueDataPoint, ScheduleItem } from "@/features/dashboard/types";

const PIPELINE_STAGES = [
  { stage: "new", color: "blue" },
  { stage: "contacted", color: "cyan" },
  { stage: "qualified", color: "amber" },
  { stage: "proposal", color: "purple" },
  { stage: "won", color: "green" },
];

export async function getPipeline(
  supabase: SupabaseClient,
  companyId: string
): Promise<PipelineStage[]> {
  const results = await Promise.all(
    PIPELINE_STAGES.map(s =>
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("status", "lead")
        .eq("lead_status", s.stage)
    )
  );

  return PIPELINE_STAGES.map((s, i) => ({
    stage: s.stage,
    count: results[i].count || 0,
    color: s.color,
  }));
}

export async function getRevenueChart(
  supabase: SupabaseClient,
  companyId: string
): Promise<RevenueDataPoint[]> {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const sinceDate = sixMonthsAgo.toISOString().split("T")[0];

  const { data } = await supabase
    .from("invoices")
    .select("amount_paid, issue_date")
    .eq("company_id", companyId)
    .eq("status", "paid")
    .gte("issue_date", sinceDate)
    .limit(200);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthTotals: Record<string, number> = {};

  // Initialize 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthTotals[key] = 0;
  }

  for (const inv of data || []) {
    if (!inv.issue_date) continue;
    const key = inv.issue_date.substring(0, 7);
    if (key in monthTotals) monthTotals[key] += inv.amount_paid || 0;
  }

  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return Object.entries(monthTotals).map(([key, revenue]) => ({
    month: monthNames[parseInt(key.split("-")[1], 10) - 1],
    revenue,
    isCurrent: key === currentKey,
  }));
}

export async function getTodaysSchedule(
  supabase: SupabaseClient,
  companyId: string,
  today: string
): Promise<ScheduleItem[]> {
  const { data } = await supabase
    .from("jobs")
    .select("id, title, status, scheduled_time, assigned_to, customers(name)")
    .eq("company_id", companyId)
    .eq("scheduled_date", today)
    .in("status", ["scheduled", "in_progress", "completed"])
    .order("scheduled_time", { ascending: true })
    .limit(20);

  return (data || []).map(j => {
    const customer = Array.isArray(j.customers) ? j.customers[0] : j.customers;
    return {
      id: j.id,
      time: j.scheduled_time || "TBD",
      customerName: customer?.name || "",
      jobTitle: j.title,
      assignedTo: j.assigned_to,
      status: j.status as ScheduleItem["status"],
    };
  });
}
