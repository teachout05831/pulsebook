import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { supabase, companyId } = await getAuthCompany();

    // Verify customer belongs to company
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const base = { customer_id: id, company_id: companyId };

    // Use head:true count queries (no row data transferred) + one invoice query for sums
    const [
      totalJobsRes, activeJobsRes, completedJobsRes, openJobsRes,
      totalEstimatesRes, sentEstimatesRes, pendingEstimatesRes,
      invoicesResult,
    ] = await Promise.all([
      supabase.from("jobs").select("id", { count: "exact", head: true }).match(base),
      supabase.from("jobs").select("id", { count: "exact", head: true }).match(base).in("status", ["scheduled", "in_progress"]),
      supabase.from("jobs").select("id", { count: "exact", head: true }).match(base).eq("status", "completed"),
      supabase.from("jobs").select("id", { count: "exact", head: true }).match(base).not("status", "in", "(completed,cancelled)"),
      supabase.from("estimates").select("id", { count: "exact", head: true }).match(base),
      supabase.from("estimates").select("id", { count: "exact", head: true }).match(base).eq("status", "sent"),
      supabase.from("estimates").select("id", { count: "exact", head: true }).match(base).in("status", ["sent", "draft"]),
      // Invoices need actual amounts for sums — select minimal fields
      supabase.from("invoices").select("status, total, amount_due").match(base).limit(500),
    ]);

    const invoices = invoicesResult.data || [];
    const lifetimeValue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + (i.total || 0), 0);
    const balanceDue = invoices.reduce((s, i) => s + (i.amount_due || 0), 0);

    return NextResponse.json(
      {
        data: {
          stats: {
            lifetimeValue,
            activeJobs: activeJobsRes.count || 0,
            pendingEstimates: pendingEstimatesRes.count || 0,
            balanceDue,
            totalJobs: totalJobsRes.count || 0,
            completedJobs: completedJobsRes.count || 0,
            totalEstimates: totalEstimatesRes.count || 0,
            totalInvoices: invoices.length,
          },
          counts: {
            estimates: sentEstimatesRes.count || 0,
            jobs: openJobsRes.count || 0,
            invoices: invoices.filter((i) => (i.amount_due || 0) > 0).length,
            files: 0,
            notes: 0,
          },
        },
      },
      { headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
