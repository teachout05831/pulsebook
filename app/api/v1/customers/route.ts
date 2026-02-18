import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

const ALLOWED_SORTS_CUSTOMERS = ["created_at", "updated_at", "name", "email", "status"];

function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.min(Math.max(1, Number(params.get("limit")) || 20), 100);
    const offset = (page - 1) * limit;
    const rawSort = params.get("sort") || "created_at";
    const order = params.get("order") || "desc";
    const search = params.get("q") || "";
    const status = params.get("status") || "";

    let query = supabase
      .from("customers")
      .select("id, name, email, phone, address, status, lead_status, source, estimated_value, service_type, notes, custom_fields, tags, ghl_contact_id, created_at, updated_at", { count: "exact" })
      .eq("company_id", companyId);

    if (search) {
      const safe = escapeLike(search);
      query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%`);
    }
    if (status) {
      query = query.eq("status", status);
    }

    // Validate sort field against allowlist
    const mapped = rawSort === "createdAt" ? "created_at" : rawSort === "updatedAt" ? "updated_at" : rawSort;
    const sortField = ALLOWED_SORTS_CUSTOMERS.includes(mapped) ? mapped : "created_at";
    query = query
      .order(sortField, { ascending: order === "asc" })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }

    return NextResponse.json({
      data: (data || []).map((c) => ({
        id: c.id, name: c.name, email: c.email, phone: c.phone,
        address: c.address, status: c.status, leadStatus: c.lead_status,
        source: c.source, estimatedValue: c.estimated_value,
        serviceType: c.service_type, notes: c.notes,
        customFields: c.custom_fields || {}, tags: c.tags || [],
        ghlContactId: c.ghl_contact_id || null,
        createdAt: c.created_at, updatedAt: c.updated_at,
      })),
      pagination: { page, limit, total: count || 0 },
    }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  });
}

export async function POST(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    if (!body.name || body.name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("customers")
      .insert({
        company_id: companyId, name: body.name,
        email: body.email || null, phone: body.phone || null,
        address: body.address || null, notes: body.notes || null,
        status: body.status || "active", lead_status: body.leadStatus || null,
        source: body.source || null, estimated_value: body.estimatedValue || null,
        service_type: body.serviceType || null, service_date: body.serviceDate || null,
        last_contact_date: body.lastContactDate || null, assigned_to: body.assignedTo || null,
        custom_fields: body.customFields || {}, tags: body.tags || [],
      })
      .select("id, name, email, phone, address, status, lead_status, source, estimated_value, service_type, notes, custom_fields, tags, ghl_contact_id, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id, name: data.name, email: data.email, phone: data.phone,
        address: data.address, status: data.status, leadStatus: data.lead_status,
        source: data.source, estimatedValue: data.estimated_value,
        serviceType: data.service_type, notes: data.notes,
        customFields: data.custom_fields || {}, tags: data.tags || [],
        ghlContactId: data.ghl_contact_id || null,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    }, { status: 201 });
  });
}
