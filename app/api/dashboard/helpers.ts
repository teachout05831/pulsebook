import { SupabaseClient } from "@supabase/supabase-js";
import type { SalesLeader, ReferralSource, DashboardStats } from "@/features/dashboard/types";

export async function getStats(
  supabase: SupabaseClient,
  companyId: string,
  startOfMonth: string,
  today: string
): Promise<DashboardStats> {
  const [monthJobs, todayJobs, paidInvoices] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact", head: true })
      .eq("company_id", companyId).gte("created_at", startOfMonth),
    supabase.from("jobs").select("id", { count: "exact", head: true })
      .eq("company_id", companyId).eq("scheduled_date", today),
    supabase.from("invoices").select("amount_paid")
      .eq("company_id", companyId).eq("status", "paid").gte("issue_date", startOfMonth).limit(500),
  ]);

  const revenue = (paidInvoices.data || []).reduce((sum, inv) => sum + (inv.amount_paid || 0), 0);
  const jobCount = monthJobs.count || 0;

  return {
    jobsThisMonth: jobCount,
    revenueThisMonth: revenue,
    jobsToday: todayJobs.count || 0,
    avgJobValue: jobCount > 0 ? Math.round(revenue / jobCount) : 0,
  };
}

export async function getSalesLeaders(supabase: SupabaseClient, companyId: string): Promise<SalesLeader[]> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();
  const [jobsResult, membersResult] = await Promise.all([
    supabase.from("jobs").select("assigned_to, total").eq("company_id", companyId).in("status", ["scheduled", "in_progress", "completed"]).gte("created_at", ninetyDaysAgo).limit(200),
    supabase.from("team_members").select("id, name").eq("company_id", companyId).eq("is_active", true).limit(50),
  ]);

  const jobs = jobsResult.data || [];
  const members = membersResult.data || [];

  // Build maps: normalized name -> { count, revenue }
  const assignedStats = new Map<string, { count: number; revenue: number }>();
  for (const j of jobs) {
    if (j.assigned_to) {
      const key = j.assigned_to.trim().toLowerCase();
      const existing = assignedStats.get(key) || { count: 0, revenue: 0 };
      existing.count += 1;
      existing.revenue += (j.total || 0);
      assignedStats.set(key, existing);
    }
  }

  // First-name fallback map
  const firstNameStats = new Map<string, { count: number; revenue: number }>();
  assignedStats.forEach((stats, key) => {
    const firstName = key.split(" ")[0];
    if (!firstNameStats.has(firstName)) firstNameStats.set(firstName, { ...stats });
  });

  function getStats(memberName: string): { count: number; revenue: number } {
    const norm = memberName.trim().toLowerCase();
    const exact = assignedStats.get(norm);
    if (exact) return exact;
    const firstName = norm.split(" ")[0];
    return firstNameStats.get(firstName) || { count: 0, revenue: 0 };
  }

  return members.map(m => {
    const s = getStats(m.name);
    return { id: m.id, name: m.name, jobCount: s.count, revenue: Math.round(s.revenue * 100) / 100 };
  }).filter(m => m.jobCount > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
}

export async function getReferralSources(supabase: SupabaseClient, companyId: string): Promise<ReferralSource[]> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();
  const { data } = await supabase.from("customers").select("source, estimated_value").eq("company_id", companyId).eq("status", "lead").not("source", "is", null).gte("created_at", ninetyDaysAgo).limit(200);
  const map: Record<string, { count: number; revenue: number }> = {};
  for (const c of data || []) { if (!c.source) continue; if (!map[c.source]) map[c.source] = { count: 0, revenue: 0 }; map[c.source].count++; map[c.source].revenue += c.estimated_value || 0; }
  return Object.entries(map).map(([source, v]) => ({ source, leadCount: v.count, revenue: v.revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
}
