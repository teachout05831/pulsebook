import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { createDailyRoom } from "@/lib/daily/createRoom";

async function generateToken(
  apiKey: string,
  roomName: string,
  role: "host" | "customer",
  userName: string
): Promise<string | null> {
  const tokenPayload: Record<string, unknown> = {
    properties: {
      room_name: roomName,
      exp: Math.floor(Date.now() / 1000) + 86400,
      user_name: userName,
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

  const res = await fetch("https://api.daily.co/v1/meeting-tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(tokenPayload),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.token || null;
}

// POST /api/consultations/[id]/join - Join a consultation video call
// Creates Daily.co room on-demand if none exists, or replaces expired rooms
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const role = body.role as "host" | "customer";
  let roomName: string | null = null;
  let roomUrl: string | null = null;
  let supabaseClient: Awaited<ReturnType<typeof createClient>> | null = null;

  if (role === "host") {
    try {
      const { companyId, supabase } = await getAuthCompany();
      supabaseClient = supabase;

      const { data } = await supabase
        .from("consultations")
        .select("daily_room_name, daily_room_url, company_id")
        .eq("id", id)
        .eq("company_id", companyId)
        .limit(1)
        .single();

      if (!data) {
        return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
      }
      roomName = data.daily_room_name;
      roomUrl = data.daily_room_url;
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  } else {
    if (!body.publicToken) {
      return NextResponse.json({ error: "Public token required" }, { status: 400 });
    }

    const supabase = await createClient();
    supabaseClient = supabase;

    const { data } = await supabase
      .from("consultations")
      .select("daily_room_name, daily_room_url, company_id")
      .eq("id", id)
      .eq("public_token", body.publicToken)
      .limit(1)
      .single();

    if (!data) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }
    roomName = data.daily_room_name;
    roomUrl = data.daily_room_url;
  }

  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  const userName = body.userName || (role === "host" ? "Host" : "Guest");

  // Helper: create a fresh room and save it to the consultation
  async function provisionNewRoom() {
    const room = await createDailyRoom();
    if (!room || !supabaseClient) return false;
    await supabaseClient
      .from("consultations")
      .update({ daily_room_name: room.roomName, daily_room_url: room.roomUrl })
      .eq("id", id);
    roomName = room.roomName;
    roomUrl = room.roomUrl;
    return true;
  }

  // No room yet (scheduled consultation) — create one now
  if (!roomName) {
    const ok = await provisionNewRoom();
    if (!ok) {
      return NextResponse.json({ error: "Could not create video room" }, { status: 500 });
    }
  }

  // No API key — return room URL without token (public room fallback)
  if (!DAILY_API_KEY) {
    return NextResponse.json({ data: { token: null, roomUrl } });
  }

  // Try to generate a meeting token for the existing room
  let token = await generateToken(DAILY_API_KEY, roomName!, role, userName);

  // Token failed — room likely expired. Create a new room and retry once.
  if (!token) {
    const ok = await provisionNewRoom();
    if (ok) {
      token = await generateToken(DAILY_API_KEY, roomName!, role, userName);
    }
  }

  return NextResponse.json({
    data: { token: token || null, roomUrl },
  });
}
