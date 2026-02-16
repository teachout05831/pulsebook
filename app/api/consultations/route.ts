import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { createDailyRoom } from "@/lib/daily/createRoom";

const RESULT_FIELDS = "id, company_id, customer_id, estimate_id, title, purpose, public_token, daily_room_name, daily_room_url, status, host_name, customer_name, scheduled_at, created_at";

const VALID_PURPOSES = ["discovery", "estimate_review", "follow_up"];

// POST /api/consultations - Create a consultation with a Daily.co room
export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();

    const { data: profile } = await supabase
      .from("users").select("full_name").eq("id", user.id).single();

    const body = await request.json();

    if (body.purpose && !VALID_PURPOSES.includes(body.purpose)) {
      return NextResponse.json({ error: "Invalid purpose" }, { status: 400 });
    }

    // Verify customer belongs to company if provided
    let customerName = body.customerName || null;
    let customerEmail = body.customerEmail || null;
    let customerPhone = body.customerPhone || null;

    if (body.customerId) {
      const { data: customer } = await supabase
        .from("customers").select("id, name, email, phone")
        .eq("id", body.customerId).eq("company_id", companyId).single();
      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
      customerName = customerName || customer.name;
      customerEmail = customerEmail || customer.email;
      customerPhone = customerPhone || customer.phone;
    }

    // Verify estimate belongs to company if provided
    if (body.estimateId) {
      const { data: estimate } = await supabase
        .from("estimates").select("id")
        .eq("id", body.estimateId).eq("company_id", companyId).single();
      if (!estimate) {
        return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
      }
    }

    // Create Daily.co room
    const room = await createDailyRoom();
    const publicToken = crypto.randomUUID();

    const { data, error } = await supabase
      .from("consultations")
      .insert({
        company_id: companyId, customer_id: body.customerId || null,
        estimate_id: body.estimateId || null, title: body.title || "Video Consultation",
        purpose: body.purpose || "discovery", public_token: publicToken,
        daily_room_name: room?.roomName || null, daily_room_url: room?.roomUrl || null,
        status: "pending", scheduled_at: body.scheduledAt || null,
        host_user_id: user.id, host_name: profile?.full_name || "Host",
        customer_name: customerName, customer_email: customerEmail,
        customer_phone: customerPhone,
      })
      .select(RESULT_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create consultation" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id, companyId: data.company_id, customerId: data.customer_id,
        estimateId: data.estimate_id, title: data.title, purpose: data.purpose,
        publicToken: data.public_token, dailyRoomName: data.daily_room_name,
        dailyRoomUrl: data.daily_room_url, status: data.status,
        hostName: data.host_name, customerName: data.customer_name,
        scheduledAt: data.scheduled_at, createdAt: data.created_at,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
