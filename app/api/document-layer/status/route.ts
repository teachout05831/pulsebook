import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';

// GET /api/document-layer/status?consultationId=xxx
// Returns pipeline state for a consultation
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const consultationId = request.nextUrl.searchParams.get('consultationId');

    if (!consultationId) {
      return NextResponse.json({ error: 'consultationId required' }, { status: 400 });
    }

    const { data: consultation } = await supabase
      .from('consultations')
      .select('id, pipeline_status, pipeline_error, estimate_id')
      .eq('id', consultationId)
      .eq('company_id', companyId)
      .limit(1)
      .single();

    if (!consultation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { data: videoCall } = await supabase
      .from('estimate_video_calls')
      .select('id, bunny_video_id, transcript, ai_estimate_output, ai_page_content, processing_error')
      .eq('consultation_id', consultationId)
      .limit(1)
      .single();

    // Convert ai_estimate_output keys to camelCase for frontend
    const rawEstimate = videoCall?.ai_estimate_output as Record<string, unknown> | null;
    let aiEstimateOutput = null;
    if (rawEstimate) {
      aiEstimateOutput = {
        lineItems: (rawEstimate.lineItems ?? rawEstimate.line_items) || [],
        resources: rawEstimate.resources || null,
        pricingModel: (rawEstimate.pricingModel ?? rawEstimate.pricing_model) || 'flat',
        customerNotes: (rawEstimate.customerNotes ?? rawEstimate.customer_notes) || '',
        internalNotes: (rawEstimate.internalNotes ?? rawEstimate.internal_notes) || '',
        serviceType: (rawEstimate.serviceType ?? rawEstimate.service_type) || '',
      };
    }

    return NextResponse.json({
      data: {
        consultationId: consultation.id,
        status: consultation.pipeline_status,
        error: consultation.pipeline_error,
        videoCallId: videoCall?.id || null,
        bunnyVideoId: videoCall?.bunny_video_id || null,
        hasTranscript: !!videoCall?.transcript,
        hasEstimate: !!videoCall?.ai_estimate_output,
        hasPage: !!videoCall?.ai_page_content,
        estimateId: consultation.estimate_id,
        pageId: null,
        aiEstimateOutput,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
