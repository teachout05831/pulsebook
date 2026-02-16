import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createHmac } from 'crypto';

// POST /api/webhooks/daily - Daily.co webhook for recording.ready-to-download
// No session auth — verified by HMAC signature
export async function POST(request: NextRequest) {
  const secret = process.env.DAILY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  // Verify HMAC signature
  const rawBody = await request.text();
  const signature = request.headers.get('x-webhook-signature');

  if (signature) {
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    if (signature !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  } else {
    // Fallback: Bearer token check
    const auth = request.headers.get('authorization');
    if (auth?.replace('Bearer ', '') !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = body.event as string | undefined;
  const payload = body.payload as Record<string, unknown> | undefined;

  if (eventType !== 'recording.ready-to-download' || !payload) {
    return NextResponse.json({ received: true });
  }

  const roomName = (payload.room_name as string) || (payload.room as string);
  const downloadUrl = payload.download_url as string;

  if (!roomName || !downloadUrl) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();

  // Find consultation by daily_room_name
  const { data: consultation } = await admin
    .from('consultations')
    .select('id, company_id, customer_id, estimate_id')
    .eq('daily_room_name', roomName)
    .limit(1)
    .single();

  if (!consultation) {
    return NextResponse.json({ received: true });
  }

  // Update pipeline status
  await admin
    .from('consultations')
    .update({ pipeline_status: 'recording_ready', pipeline_error: null })
    .eq('id', consultation.id);

  // Create or update estimate_video_calls record
  const { data: existingCall } = await admin
    .from('estimate_video_calls')
    .select('id')
    .eq('daily_room_name', roomName)
    .limit(1)
    .single();

  const videoCallData = {
    recording_url: downloadUrl,
    consultation_id: consultation.id,
    updated_at: new Date().toISOString(),
  };

  if (existingCall) {
    await admin
      .from('estimate_video_calls')
      .update(videoCallData)
      .eq('id', existingCall.id);
  } else {
    await admin
      .from('estimate_video_calls')
      .insert({
        ...videoCallData,
        company_id: consultation.company_id,
        estimate_id: consultation.estimate_id,
        customer_id: consultation.customer_id,
        daily_room_name: roomName,
        daily_room_url: '',
        call_type: 'discovery',
        created_at: new Date().toISOString(),
      });
  }

  // Trigger async pipeline (upload to Bunny)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000';
  fetch(`${baseUrl}/api/webhooks/daily/pipeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-secret': secret },
    body: JSON.stringify({ consultationId: consultation.id, downloadUrl }),
  }).catch(() => { /* fire-and-forget */ });

  return NextResponse.json({ received: true });
}
