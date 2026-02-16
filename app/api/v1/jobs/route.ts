import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

const ALLOWED_SORTS_JOBS = ["scheduled_date", "created_at", "updated_at", "title", "status"];

function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.min(Math.max(1, Number(params.get("limit")) || 20), 100);
    const offset = (page - 1) * limit;
    const rawSort = params.get("sort") || "scheduled_date";
    const order = params.get("order") || "desc";
    const search = params.get("q") || "";
    const status = params.get("status") || "";
    const customerId = params.get("customerId") || "";

    let query = supabase
      .from("jobs")
      .select("id, customer_id, title, description, status, scheduled_date, scheduled_time, estimated_duration, address, assigned_to, notes, custom_fields, created_at, updated_at, customers(name)", { count: "exact" })
      .eq("company_id", companyId);

    if (search) {
      const safe = escapeLike(search);
      query = query.or(`title.ilike.%${safe}%,address.ilike.%${safe}%`);
    }
    if (status) query = query.eq("status", status);
    if (customerId) query = query.eq("customer_id", customerId);

    // Validate sort field against allowlist
    const mapped = rawSort === "scheduledDate" ? "scheduled_date" : rawSort === "createdAt" ? "created_at" : rawSort;
    const sortField = ALLOWED_SORTS_JOBS.includes(mapped) ? mapped : "scheduled_date";
    query = query
      .order(sortField, { ascending: order === "asc" })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }

    return NextResponse.json({
      data: (data || []).map((j) => {
        const customer = Array.isArray(j.customers) ? j.customers[0] : j.customers;
        return {
          id: j.id, customerId: j.customer_id,
          customerName: customer?.name || "", title: j.title,
          description: j.description, status: j.status,
          scheduledDate: j.scheduled_date, scheduledTime: j.scheduled_time,
          estimatedDuration: j.estimated_duration, address: j.address,
          assignedTo: j.assigned_to, notes: j.notes,
          customFields: j.custom_fields || {},
          createdAt: j.created_at, updatedAt: j.updated_at,
        };
      }),
      pagination: { page, limit, total: count || 0 },
    }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  });
}

export async function POST(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    if (!body.title || body.title.length < 2) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        company_id: companyId, customer_id: body.customerId || null,
        title: body.title, description: body.description || null,
        status: body.status || "scheduled",
        scheduled_date: body.scheduledDate || new Date().toISOString().split("T")[0],
        scheduled_time: body.scheduledTime || null,
        estimated_duration: body.estimatedDuration || null,
        address: body.address || null, assigned_to: body.assignedTo || null,
        notes: body.notes || null, custom_fields: body.customFields || {},
      })
      .select("id, customer_id, title, description, status, scheduled_date, scheduled_time, estimated_duration, address, assigned_to, notes, custom_fields, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id, customerId: data.customer_id, title: data.title,
        description: data.description, status: data.status,
        scheduledDate: data.scheduled_date, scheduledTime: data.scheduled_time,
        estimatedDuration: data.estimated_duration, address: data.address,
        assignedTo: data.assigned_to, notes: data.notes,
        customFields: data.custom_fields || {},
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    }, { status: 201 });
  });
}
