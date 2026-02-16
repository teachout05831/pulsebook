import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/estimate-pages/video-calls/webhook - daily.co webhook handler
// No auth required — validated by webhook secret
export async function POST(request: NextRequest) {
  const DAILY_WEBHOOK_SECRET = process.env.DAILY_WEBHOOK_SECRET;

  // Validate webhook secret if configured
  if (DAILY_WEBHOOK_SECRET) {
    const authHeader = request.headers.get("authorization");
    const webhookToken = authHeader?.replace("Bearer ", "");

    if (webhookToken !== DAILY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const eventType = body.event as string | undefined;
  if (!eventType) {
    return NextResponse.json({ error: "Missing event type" }, { status: 400 });
  }

  // Extract room name from the webhook payload
  // daily.co sends room info at payload.room or payload.name depending on event
  const payload = body.payload as Record<string, unknown> | undefined;
  const roomName =
    (payload?.room as string) ||
    (payload?.name as string) ||
    (payload?.room_name as string);

  if (!roomName) {
    // Unknown payload structure — acknowledge but skip processing
    return NextResponse.json({ received: true });
  }

  const supabase = await createClient();

  switch (eventType) {
    case "meeting.started": {
      const { error } = await supabase
        .from("estimate_video_calls")
        .update({
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("daily_room_name", roomName);

      if (error) {
        // meeting.started update failed
      }
      break;
    }

    case "meeting.ended": {
      // Fetch the call record to calculate duration
      const { data: callRecord } = await supabase
        .from("estimate_video_calls")
        .select("started_at")
        .eq("daily_room_name", roomName)
        .limit(1)
        .single();

      let durationSeconds: number | null = null;

      if (callRecord?.started_at) {
        const startedAt = new Date(callRecord.started_at as string).getTime();
        const endedAt = Date.now();
        durationSeconds = Math.round((endedAt - startedAt) / 1000);
      }

      const updatePayload: Record<string, unknown> = {
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (durationSeconds !== null && durationSeconds > 0) {
        updatePayload.duration_seconds = durationSeconds;
      }

      // Include participants if provided in the payload
      if (payload?.participants) {
        updatePayload.participants = payload.participants;
      }

      const { error } = await supabase
        .from("estimate_video_calls")
        .update(updatePayload)
        .eq("daily_room_name", roomName);

      if (error) {
        // meeting.ended update failed
      }
      break;
    }

    case "recording.ready": {
      const recordingUrl =
        (payload?.download_url as string) ||
        (payload?.recording_url as string) ||
        (payload?.url as string);

      if (recordingUrl) {
        const { error } = await supabase
          .from("estimate_video_calls")
          .update({
            recording_url: recordingUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("daily_room_name", roomName);

        if (error) {
          // recording.ready update failed
        }
      }
      break;
    }

    case "transcription.ready": {
      const transcript =
        (payload?.transcript as string) ||
        (payload?.text as string);

      if (transcript) {
        const { error } = await supabase
          .from("estimate_video_calls")
          .update({
            transcript,
            updated_at: new Date().toISOString(),
          })
          .eq("daily_room_name", roomName);

        if (error) {
          // transcription.ready update failed
        }
      }
      break;
    }

    default:
      // Unhandled event type — acknowledge silently
      break;
  }

  return NextResponse.json({ received: true });
}
