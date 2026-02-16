import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const CALL_FIELDS = "id, company_id, estimate_id, page_id, customer_id, daily_room_name, daily_room_url, call_type, scheduled_at, created_by, created_at";

const VALID_CALL_TYPES = ["discovery", "review", "instant"];

// POST /api/estimate-pages/video-calls/create-room - Create a daily.co video call room
export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();

    const DAILY_API_KEY = process.env.DAILY_API_KEY;
    if (!DAILY_API_KEY) {
      return NextResponse.json(
        { error: "Video calls not configured. Set DAILY_API_KEY." },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate call type
    if (!body.callType || !VALID_CALL_TYPES.includes(body.callType)) {
      return NextResponse.json(
        { error: "callType is required and must be one of: discovery, review, instant" },
        { status: 400 }
      );
    }

    // Verify estimate belongs to this company if provided
    if (body.estimateId) {
      const { data: estimate } = await supabase
        .from("estimates")
        .select("id")
        .eq("id", body.estimateId)
        .eq("company_id", companyId)
        .single();

      if (!estimate) {
        return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
      }
    }

    // Verify customer belongs to this company if provided
    if (body.customerId) {
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("id", body.customerId)
        .eq("company_id", companyId)
        .single();

      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
    }

    // Create room via daily.co REST API
    const roomName = `estimate-${Date.now()}`;
    const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry

    let dailyRoomUrl: string;

    try {
      const dailyResponse = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName,
          privacy: "public",
          properties: {
            exp: expiresAt,
            enable_recording: "cloud",
            enable_chat: true,
            enable_screenshare: true,
          },
        }),
      });

      if (!dailyResponse.ok) {
        const errBody = await dailyResponse.text();
        return NextResponse.json(
          { error: "Failed to create video call room" },
          { status: 502 }
        );
      }

      const dailyData = await dailyResponse.json();
      dailyRoomUrl = dailyData.url;
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to connect to video call provider" },
        { status: 502 }
      );
    }

    // Insert record into estimate_video_calls
    const { data, error } = await supabase
      .from("estimate_video_calls")
      .insert({
        company_id: companyId,
        estimate_id: body.estimateId ?? null,
        page_id: body.pageId ?? null,
        customer_id: body.customerId ?? null,
        daily_room_name: roomName,
        daily_room_url: dailyRoomUrl,
        call_type: body.callType,
        scheduled_at: body.scheduledAt ?? null,
        created_by: user.id,
      })
      .select(CALL_FIELDS)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save video call record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: {
          callId: data.id,
          roomName: data.daily_room_name,
          roomUrl: data.daily_room_url,
          callType: data.call_type,
          scheduledAt: data.scheduled_at || null,
          createdAt: data.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
