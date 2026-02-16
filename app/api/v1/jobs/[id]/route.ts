import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data, error } = await supabase
      .from("jobs")
      .select("id, customer_id, title, description, status, scheduled_date, scheduled_time, estimated_duration, address, assigned_to, notes, custom_fields, created_at, updated_at, customers(name)")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    return NextResponse.json({
      data: {
        id: data.id, customerId: data.customer_id,
        customerName: customer?.name || "", title: data.title,
        description: data.description, status: data.status,
        scheduledDate: data.scheduled_date, scheduledTime: data.scheduled_time,
        estimatedDuration: data.estimated_duration, address: data.address,
        assignedTo: data.assigned_to, notes: data.notes,
        customFields: data.custom_fields || {},
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.customerId !== undefined) updateData.customer_id = body.customerId;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.scheduledDate !== undefined) updateData.scheduled_date = body.scheduledDate;
    if (body.scheduledTime !== undefined) updateData.scheduled_time = body.scheduledTime;
    if (body.estimatedDuration !== undefined) updateData.estimated_duration = body.estimatedDuration;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.assignedTo !== undefined) updateData.assigned_to = body.assignedTo;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.customFields !== undefined) updateData.custom_fields = body.customFields;

    const { data, error } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", id)
      .eq("company_id", companyId)
      .select("id, customer_id, title, description, status, scheduled_date, scheduled_time, estimated_duration, address, assigned_to, notes, custom_fields, created_at, updated_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
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
    });
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data: existing } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const { error } = await supabase.from("jobs").delete().eq("id", id).eq("company_id", companyId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }

    return NextResponse.json({ data: { id, deleted: true } });
  });
}
