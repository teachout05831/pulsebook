import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;

// POST /api/webhooks/daily/pipeline - Async pipeline: download recording → upload to Bunny → trigger transcription
// Internal only — validated by shared secret
export async function POST(request: NextRequest) {
  const secret = process.env.DAILY_WEBHOOK_SECRET;
  if (request.headers.get('x-internal-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { consultationId, downloadUrl } = await request.json();
  if (!consultationId || !downloadUrl) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const admin = createAdminClient();

  const setError = async (msg: string) => {
    await admin.from('consultations')
      .update({ pipeline_status: 'error', pipeline_error: msg })
      .eq('id', consultationId);
  };

  try {
    // Step 1: Update status to uploading
    await admin.from('consultations')
      .update({ pipeline_status: 'uploading', pipeline_error: null })
      .eq('id', consultationId);

    if (!BUNNY_API_KEY || !BUNNY_LIBRARY_ID) {
      await setError('Bunny.net not configured');
      return NextResponse.json({ error: 'Bunny not configured' }, { status: 503 });
    }

    // Step 2: Create video in Bunny Stream
    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: 'POST',
        headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Consultation ${consultationId}` }),
      }
    );

    if (!createRes.ok) {
      await setError('Failed to create Bunny video');
      return NextResponse.json({ error: 'Bunny create failed' }, { status: 502 });
    }

    const bunnyVideo = await createRes.json();
    const bunnyVideoId = bunnyVideo.guid as string;

    // Step 3: Download Daily.co recording and stream-upload to Bunny
    const recordingRes = await fetch(downloadUrl);
    if (!recordingRes.ok || !recordingRes.body) {
      await setError('Failed to download Daily.co recording');
      return NextResponse.json({ error: 'Download failed' }, { status: 502 });
    }

    const uploadUrl = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'application/octet-stream' },
      body: recordingRes.body,
    });

    if (!uploadRes.ok) {
      await setError('Failed to upload to Bunny');
      return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
    }

    // Step 4: Trigger Bunny transcription
    await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}/transcribe`,
      {
        method: 'POST',
        headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'en', force: true }),
      }
    );

    // Step 5: Store bunny_video_id and update status
    await admin.from('estimate_video_calls')
      .update({ bunny_video_id: bunnyVideoId, updated_at: new Date().toISOString() })
      .eq('consultation_id', consultationId);

    await admin.from('consultations')
      .update({ pipeline_status: 'transcribing', pipeline_error: null })
      .eq('id', consultationId);

    return NextResponse.json({ success: true, bunnyVideoId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Pipeline failed';
    await setError(msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
