import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getStats, getSalesLeaders, getReferralSources } from "./helpers";
import { getPipeline, getRevenueChart, getTodaysSchedule } from "./aggregations";
import type { DashboardData, DateRange } from "@/features/dashboard/types";

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const range = (request.nextUrl.searchParams.get("range") || "today") as DateRange;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const [stats, salesLeaders, referralSources, pipeline, revenueChart, todaysSchedule] = await Promise.all([
      getStats(supabase, companyId, startOfMonth, today),
      getSalesLeaders(supabase, companyId),
      getReferralSources(supabase, companyId),
      getPipeline(supabase, companyId),
      getRevenueChart(supabase, companyId),
      getTodaysSchedule(supabase, companyId, today),
    ]);

    const data: DashboardData = {
      stats,
      salesLeaders,
      referralSources,
      pipeline,
      revenueChart,
      todaysSchedule,
    };

    return NextResponse.json(
      { data },
      { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
