import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

function getDateRange(): { todayStart: string; todayEnd: string; weekEnd: string } {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = 7 - dayOfWeek;
  const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday + 1).toISOString();
  return { todayStart, todayEnd, weekEnd };
}

/**
 * GET /api/follow-ups/leads
 * Returns customers that have follow-ups, enriched with follow-up date.
 * Supports sidebar filter: open, due-today, due-this-week, overdue, completed, all
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("q");
    const assignedToFilter = searchParams.get("assignedTo");
    const sidebarFilter = searchParams.get("filter") || "open";

    const { todayStart, todayEnd, weekEnd } = getDateRange();

    // 1. Fetch follow-ups based on sidebar filter
    let fuQuery = supabase
      .from("follow_ups")
      .select("id, customer_id, due_date, type, status")
      .eq("company_id", companyId)
      .order("due_date", { ascending: true })
      .limit(200);

    switch (sidebarFilter) {
      case "open":
        fuQuery = fuQuery.eq("status", "pending");
        break;
      case "due-today":
        fuQuery = fuQuery.eq("status", "pending").gte("due_date", todayStart).lt("due_date", todayEnd);
        break;
      case "due-this-week":
        fuQuery = fuQuery.eq("status", "pending").gte("due_date", todayStart).lt("due_date", weekEnd);
        break;
      case "overdue":
        fuQuery = fuQuery.eq("status", "pending").lt("due_date", todayStart);
        break;
      case "completed":
        fuQuery = fuQuery.eq("status", "completed");
        break;
      case "all":
        // No status filter — show everything
        break;
    }

    const { data: followUps, error: fuError } = await fuQuery;

    if (fuError) {
      return NextResponse.json({ error: "Failed to fetch follow-ups" }, { status: 500 });
    }

    if (!followUps || followUps.length === 0) {
      return NextResponse.json({ data: [], total: 0 });
    }

    // 2. Get unique customer IDs
    const customerIds = Array.from(new Set(followUps.map((f) => f.customer_id)));

    // 3. Fetch those customers
    let custQuery = supabase
      .from("customers")
      .select("id, company_id, name, email, phone, address, notes, custom_fields, tags, status, lead_status, source, estimated_value, service_type, service_date, last_contact_date, assigned_to, created_at, updated_at")
      .eq("company_id", companyId)
      .in("id", customerIds);

    if (searchQuery) {
      const safe = searchQuery.replace(/[%_\\]/g, "\\$&");
      custQuery = custQuery.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%`);
    }
    if (assignedToFilter) custQuery = custQuery.eq("assigned_to", assignedToFilter);

    const { data: customers, error: custError } = await custQuery.limit(100);

    if (custError) {
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }

    // 4. Build follow-up lookup (earliest per customer)
    const followUpMap = new Map<string, { id: string; dueDate: string; type: string }>();
    for (const fu of followUps) {
      if (!followUpMap.has(fu.customer_id)) {
        followUpMap.set(fu.customer_id, { id: fu.id, dueDate: fu.due_date, type: fu.type });
      }
    }

    // 5. Batch-fetch balance + latest estimate
    const filteredIds = (customers || []).map((c) => c.id);
    const balanceMap = new Map<string, number>();
    const latestEstimateMap = new Map<string, string>();

    if (filteredIds.length > 0) {
      const [{ data: jobRows }, { data: paymentRows }, { data: estimateRows }] = await Promise.all([
        supabase.from("jobs").select("customer_id, total").in("customer_id", filteredIds).eq("company_id", companyId).limit(1000),
        supabase.from("payments").select("customer_id, amount").in("customer_id", filteredIds).eq("company_id", companyId).limit(1000),
        supabase.from("estimates").select("id, customer_id").in("customer_id", filteredIds).eq("company_id", companyId).order("created_at", { ascending: false }).limit(500),
      ]);
      for (const j of jobRows || []) {
        balanceMap.set(j.customer_id, (balanceMap.get(j.customer_id) || 0) + (j.total || 0));
      }
      for (const p of paymentRows || []) {
        balanceMap.set(p.customer_id, (balanceMap.get(p.customer_id) || 0) - (p.amount || 0));
      }
      for (const e of estimateRows || []) {
        if (!latestEstimateMap.has(e.customer_id)) latestEstimateMap.set(e.customer_id, e.id);
      }
    }

    // 6. Convert to camelCase + enrich with follow-up data
    const result = (customers || []).map((c) => {
      const fu = followUpMap.get(c.id);
      return {
        id: c.id,
        companyId: c.company_id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        notes: c.notes,
        customFields: c.custom_fields || {},
        tags: c.tags || [],
        status: c.status || "active",
        leadStatus: c.lead_status,
        source: c.source,
        estimatedValue: c.estimated_value,
        serviceType: c.service_type,
        serviceDate: c.service_date,
        lastContactDate: c.last_contact_date,
        assignedTo: c.assigned_to,
        accountBalance: Math.round((balanceMap.get(c.id) || 0) * 100) / 100,
        latestEstimateId: latestEstimateMap.get(c.id) || null,
        followUpDate: fu?.dueDate || null,
        followUpId: fu?.id || null,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      };
    });

    // Sort by follow-up date (earliest first)
    result.sort((a, b) => {
      if (!a.followUpDate) return 1;
      if (!b.followUpDate) return -1;
      return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
    });

    return NextResponse.json(
      { data: result, total: result.length },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
