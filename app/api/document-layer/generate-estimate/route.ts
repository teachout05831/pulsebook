import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import { createAdminClient } from '@/lib/supabase/admin';
import { callClaude, extractJSON } from '@/lib/ai/claude';
import { buildEstimatePrompt } from '@/lib/ai/prompts/estimateFromTranscript';
import type { AIEstimateOutput } from '@/features/document-layer/types';

// POST /api/document-layer/generate-estimate
// Orchestrate: fetch transcript + catalogs → call Claude → store AI output
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { consultationId } = await request.json();

    if (!consultationId) {
      return NextResponse.json({ error: 'consultationId required' }, { status: 400 });
    }

    // Verify ownership
    const { data: consultation } = await supabase
      .from('consultations')
      .select('id, customer_id, estimate_id')
      .eq('id', consultationId)
      .eq('company_id', companyId)
      .limit(1)
      .single();

    if (!consultation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Get video call with transcript
    const { data: videoCall } = await supabase
      .from('estimate_video_calls')
      .select('id, transcript')
      .eq('consultation_id', consultationId)
      .limit(1)
      .single();

    if (!videoCall?.transcript) {
      return NextResponse.json({ error: 'No transcript available' }, { status: 400 });
    }

    // Fetch company catalogs
    const [servicesRes, materialsRes, settingsRes, customerRes] = await Promise.all([
      supabase.from('service_catalog').select('id, name, default_price, category')
        .eq('company_id', companyId).eq('is_active', true).limit(100),
      supabase.from('materials_catalog').select('id, name, unit_price, unit_label')
        .eq('company_id', companyId).eq('is_active', true).limit(100),
      supabase.from('companies').select('settings')
        .eq('id', companyId).limit(1).single(),
      consultation.customer_id
        ? supabase.from('customers').select('name, address')
            .eq('id', consultation.customer_id).limit(1).single()
        : Promise.resolve({ data: null }),
    ]);

    const services = (servicesRes.data || []).map(s => ({
      id: s.id, name: s.name, defaultPrice: s.default_price, category: s.category,
    }));
    const materials = (materialsRes.data || []).map(m => ({
      id: m.id, name: m.name, unitPrice: m.unit_price, unitLabel: m.unit_label || 'unit',
    }));

    const estimateSettings = (settingsRes.data?.settings as Record<string, unknown>)?.estimateBuilder as Record<string, unknown> | undefined;
    const defaultPricingModel = (estimateSettings?.defaultPricingModel as string) || 'flat';

    // Update pipeline status
    const admin = createAdminClient();
    await admin.from('consultations')
      .update({ pipeline_status: 'analyzing', pipeline_error: null })
      .eq('id', consultationId);

    // Call Claude
    const prompt = buildEstimatePrompt({
      transcript: videoCall.transcript,
      services,
      materials,
      customerName: customerRes.data?.name || null,
      customerAddress: customerRes.data?.address || null,
      defaultPricingModel,
    });

    const response = await callClaude(
      'You are a professional estimator AI. Output ONLY valid JSON.',
      [{ role: 'user', content: prompt }],
    );

    const aiOutput = extractJSON<AIEstimateOutput>(response);

    // Store AI output
    await admin.from('estimate_video_calls')
      .update({
        ai_estimate_output: aiOutput as unknown as Record<string, unknown>,
        extracted_scope: { serviceType: aiOutput.serviceType, notes: aiOutput.customerNotes },
        extracted_pricing: { lineItems: aiOutput.lineItems, resources: aiOutput.resources },
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoCall.id);

    await admin.from('consultations')
      .update({ pipeline_status: 'generating', pipeline_error: null })
      .eq('id', consultationId);

    return NextResponse.json({ data: aiOutput });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    // Store error in pipeline
    const body = await request.clone().json().catch(() => ({}));
    if (body.consultationId) {
      const admin = createAdminClient();
      await admin.from('consultations')
        .update({ pipeline_status: 'error', pipeline_error: 'AI estimate generation failed' })
        .eq('id', body.consultationId);
    }
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}
