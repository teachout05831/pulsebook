import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// POST /api/consultations/[id]/join - Generate a Daily.co meeting token
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const role = body.role as "host" | "customer";
  let consultationData: { daily_room_name: string; daily_room_url: string; company_id: string } | null = null;

  if (role === "host") {
    // Host must be authenticated
    try {
      const { companyId, supabase } = await getAuthCompany();

      const { data } = await supabase
        .from("consultations")
        .select("daily_room_name, daily_room_url, company_id")
        .eq("id", id)
        .eq("company_id", companyId)
        .limit(1)
        .single();

      consultationData = data;
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  } else {
    // Customer uses public token
    if (!body.publicToken) {
      return NextResponse.json({ error: "Public token required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data } = await supabase
      .from("consultations")
      .select("daily_room_name, daily_room_url, company_id")
      .eq("id", id)
      .eq("public_token", body.publicToken)
      .limit(1)
      .single();

    consultationData = data;
  }

  if (!consultationData || !consultationData.daily_room_name) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  if (!DAILY_API_KEY) {
    // No API key - return room URL without token (public room)
    return NextResponse.json({
      data: {
        token: null,
        roomUrl: consultationData.daily_room_url,
      },
    });
  }

  // Generate a meeting token
  const tokenPayload: Record<string, unknown> = {
    properties: {
      room_name: consultationData.daily_room_name,
      exp: Math.floor(Date.now() / 1000) + 86400,
      user_name: body.userName || (role === "host" ? "Host" : "Guest"),
      enable_screenshare: true,
      start_video_off: false,
      start_audio_off: false,
    },
  };

  if (role === "host") {
    tokenPayload.properties = {
      ...(tokenPayload.properties as Record<string, unknown>),
      is_owner: true,
      enable_recording: "cloud",
      enable_transcription: true,
    };
  }

  try {
    const tokenRes = await fetch("https://api.daily.co/v1/meeting-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify(tokenPayload),
    });

    if (!tokenRes.ok) {
      return NextResponse.json({
        data: { token: null, roomUrl: consultationData.daily_room_url },
      });
    }

    const tokenData = await tokenRes.json();

    return NextResponse.json({
      data: {
        token: tokenData.token,
        roomUrl: consultationData.daily_room_url,
      },
    });
  } catch {
    return NextResponse.json({
      data: { token: null, roomUrl: consultationData.daily_room_url },
    });
  }
}
