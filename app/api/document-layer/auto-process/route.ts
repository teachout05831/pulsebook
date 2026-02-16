import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { callClaude, extractJSON } from '@/lib/ai/claude';
import { buildEstimatePrompt } from '@/lib/ai/prompts/estimateFromTranscript';
import { buildPagePrompt, getAIFillableSections } from '@/lib/ai/prompts/pageFromTranscript';
import { mergeTemplateContent } from '@/features/document-layer/utils/mergeTemplateContent';
import type { AIEstimateOutput, AIPageContent } from '@/features/document-layer/types';
import type { IDLSettings } from '@/features/consultations/types';
import { IDL_DEFAULTS } from '@/features/consultations/types';

// POST /api/document-layer/auto-process
// Internal server-to-server: auto-chain estimate + page generation after transcript
export async function POST(request: NextRequest) {
  const secret = process.env.DAILY_WEBHOOK_SECRET;
  if (request.headers.get('x-internal-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { consultationId, companyId } = await request.json();
  if (!consultationId || !companyId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const admin = createAdminClient();

  const setError = async (msg: string) => {
    await admin.from('consultations')
      .update({ pipeline_status: 'error', pipeline_error: msg })
      .eq('id', consultationId);
  };

  try {
    // Fetch IDL settings
    const { data: settingsRow } = await admin
      .from('consultation_settings')
      .select('idl_settings')
      .eq('company_id', companyId)
      .limit(1)
      .single();

    const idl: IDLSettings = { ...IDL_DEFAULTS, ...(settingsRow?.idl_settings as Partial<IDLSettings> || {}) };

    if (!idl.enablePipeline || !idl.autoGenerateEstimate) {
      return NextResponse.json({ skipped: true });
    }

    // Fetch transcript
    const { data: videoCall } = await admin
      .from('estimate_video_calls')
      .select('id, transcript, consultation_id')
      .eq('consultation_id', consultationId)
      .limit(1)
      .single();

    if (!videoCall?.transcript) {
      return NextResponse.json({ error: 'No transcript' }, { status: 400 });
    }

    // Fetch consultation + catalogs
    const { data: consultation } = await admin
      .from('consultations')
      .select('id, customer_id')
      .eq('id', consultationId)
      .limit(1)
      .single();

    const [servicesRes, materialsRes, customerRes] = await Promise.all([
      admin.from('service_catalog').select('id, name, default_price, category')
        .eq('company_id', companyId).eq('is_active', true).limit(100),
      admin.from('materials_catalog').select('id, name, unit_price, unit_label')
        .eq('company_id', companyId).eq('is_active', true).limit(100),
      consultation?.customer_id
        ? admin.from('customers').select('name, address').eq('id', consultation.customer_id).limit(1).single()
        : Promise.resolve({ data: null }),
    ]);

    const services = (servicesRes.data || []).map(s => ({ id: s.id, name: s.name, defaultPrice: s.default_price, category: s.category }));
    const materials = (materialsRes.data || []).map(m => ({ id: m.id, name: m.name, unitPrice: m.unit_price, unitLabel: m.unit_label || 'unit' }));

    // Generate estimate
    await admin.from('consultations').update({ pipeline_status: 'analyzing', pipeline_error: null }).eq('id', consultationId);

    const prompt = buildEstimatePrompt({ transcript: videoCall.transcript, services, materials, customerName: customerRes.data?.name || null, customerAddress: customerRes.data?.address || null, defaultPricingModel: idl.defaultPricingModel });
    const response = await callClaude('You are a professional estimator AI. Output ONLY valid JSON.', [{ role: 'user', content: prompt }]);
    const aiOutput = extractJSON<AIEstimateOutput>(response);

    await admin.from('estimate_video_calls').update({ ai_estimate_output: aiOutput as unknown as Record<string, unknown>, extracted_scope: { serviceType: aiOutput.serviceType, notes: aiOutput.customerNotes }, extracted_pricing: { lineItems: aiOutput.lineItems, resources: aiOutput.resources }, updated_at: new Date().toISOString() }).eq('id', videoCall.id);

    await admin.from('consultations').update({ pipeline_status: 'generating', pipeline_error: null }).eq('id', consultationId);

    // Auto-populate page if enabled
    if (idl.autoPopulatePage) {
      const { data: tpl } = await admin.from('estimate_page_templates').select('id, name, sections, design_theme').eq('company_id', companyId).eq('is_default', true).limit(1).single();

      if (tpl) {
        const sections = (tpl.sections || []) as Array<{ type: string; content: Record<string, unknown> }>;
        const fillable = getAIFillableSections(sections);

        if (fillable.length > 0) {
          const { data: companyRow } = await admin.from('companies').select('name').eq('id', companyId).limit(1).single();
          const pagePrompt = buildPagePrompt({ transcript: videoCall.transcript, templateSections: sections, customerName: customerRes.data?.name || null, serviceType: aiOutput.serviceType || null, companyName: companyRow?.name || null });
          const pageResponse = await callClaude('You are a professional page content writer. Output ONLY valid JSON.', [{ role: 'user', content: pagePrompt }]);
          const aiContent = extractJSON<AIPageContent>(pageResponse);
          const mergedSections = mergeTemplateContent(sections as never[], aiContent);
          await admin.from('estimate_video_calls').update({ ai_page_content: { sections: mergedSections, designTheme: tpl.design_theme }, updated_at: new Date().toISOString() }).eq('id', videoCall.id);
        }
      }
    }

    await admin.from('consultations').update({ pipeline_status: 'ready', pipeline_error: null }).eq('id', consultationId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Auto-process failed';
    await setError(msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
