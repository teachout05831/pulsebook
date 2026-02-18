import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";
import { logActivity } from "@/features/activity/utils/logActivity";
import { triggerGhlSync } from "@/features/ghl-integration/utils/triggerGhlSync";

const CUSTOMER_FIELDS =
  "id, name, email, phone, address, status, lead_status, source, estimated_value, service_type, notes, custom_fields, tags, ghl_contact_id, created_at, updated_at";

export async function POST(request: NextRequest) {
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    if (!body.name || body.name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("customers")
      .insert({
        company_id: companyId,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        notes: body.notes || null,
        status: "lead",
        lead_status: body.leadStatus || "new",
        source: body.source || null,
        estimated_value: body.estimatedValue || null,
        service_type: body.serviceType || null,
        service_date: body.serviceDate || null,
        custom_fields: body.customFields || {},
        tags: body.tags || [],
      })
      .select(CUSTOMER_FIELDS)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create lead" },
        { status: 500 }
      );
    }

    // Fire-and-forget: activity log
    logActivity(supabase, {
      companyId,
      entityType: "customer",
      entityId: data.id,
      action: "created",
      description: `Inbound lead received: ${data.name}`,
      metadata: { source: body.source || null, provider: body.provider || null },
      customerId: data.id,
      customerName: data.name,
      category: "system",
    });

    // Fire-and-forget: GHL sync
    triggerGhlSync(supabase, companyId, "lead_created", {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.source,
      tags: data.tags,
    });

    return NextResponse.json(
      {
        data: {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          status: data.status,
          leadStatus: data.lead_status,
          source: data.source,
          estimatedValue: data.estimated_value,
          serviceType: data.service_type,
          notes: data.notes,
          customFields: data.custom_fields || {},
          tags: data.tags || [],
          ghlContactId: data.ghl_contact_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      },
      { status: 201 }
    );
  });
}
