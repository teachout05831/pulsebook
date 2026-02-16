import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseVTT } from '@/features/document-layer/utils/parseVTT';

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL || '';

// GET /api/document-layer/transcript?consultationId=xxx
// Polls Bunny for transcript, fetches VTT, parses, stores
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const consultationId = request.nextUrl.searchParams.get('consultationId');

    if (!consultationId) {
      return NextResponse.json({ error: 'consultationId required' }, { status: 400 });
    }

    // Verify consultation belongs to company
    const { data: consultation } = await supabase
      .from('consultations')
      .select('id, company_id, pipeline_status')
      .eq('id', consultationId)
      .eq('company_id', companyId)
      .limit(1)
      .single();

    if (!consultation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Get video call record
    const { data: videoCall } = await supabase
      .from('estimate_video_calls')
      .select('id, bunny_video_id, transcript')
      .eq('consultation_id', consultationId)
      .limit(1)
      .single();

    if (!videoCall?.bunny_video_id) {
      return NextResponse.json({ data: { status: 'waiting', transcript: null, entries: [] } });
    }

    // If transcript already stored, return it
    if (videoCall.transcript) {
      const entries = parseVTT(videoCall.transcript);
      return NextResponse.json({ data: { status: 'ready', transcript: videoCall.transcript, entries } });
    }

    // Poll Bunny for transcription status
    if (!BUNNY_API_KEY || !BUNNY_LIBRARY_ID) {
      return NextResponse.json({ data: { status: 'waiting', transcript: null, entries: [] } });
    }

    const videoRes = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoCall.bunny_video_id}`,
      { headers: { AccessKey: BUNNY_API_KEY } }
    );

    if (!videoRes.ok) {
      return NextResponse.json({ data: { status: 'waiting', transcript: null, entries: [] } });
    }

    const videoData = await videoRes.json();
    const captions = videoData.captions as Array<{ srclang: string }> | undefined;

    if (!captions || captions.length === 0) {
      return NextResponse.json({ data: { status: 'transcribing', transcript: null, entries: [] } });
    }

    // Fetch VTT from Bunny CDN
    const vttUrl = `${BUNNY_CDN_URL}/${videoCall.bunny_video_id}/captions/en.vtt`;
    const vttRes = await fetch(vttUrl);

    if (!vttRes.ok) {
      return NextResponse.json({ data: { status: 'transcribing', transcript: null, entries: [] } });
    }

    const vttContent = await vttRes.text();
    const entries = parseVTT(vttContent);

    // Store transcript and update pipeline status
    const admin = createAdminClient();
    await admin.from('estimate_video_calls')
      .update({ transcript: vttContent, updated_at: new Date().toISOString() })
      .eq('id', videoCall.id);

    await admin.from('consultations')
      .update({ pipeline_status: 'analyzing', pipeline_error: null })
      .eq('id', consultationId);

    // Fire non-blocking auto-process
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000';
    fetch(`${baseUrl}/api/document-layer/auto-process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.DAILY_WEBHOOK_SECRET || '' },
      body: JSON.stringify({ consultationId, companyId: consultation.company_id }),
    }).catch(() => {});

    return NextResponse.json({ data: { status: 'ready', transcript: vttContent, entries } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
