import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import { createAdminClient } from '@/lib/supabase/admin';
import { callClaude, extractJSON } from '@/lib/ai/claude';
import { buildPagePrompt, getAIFillableSections } from '@/lib/ai/prompts/pageFromTranscript';
import { mergeTemplateContent } from '@/features/document-layer/utils/mergeTemplateContent';
import type { AIPageContent } from '@/features/document-layer/types';

// POST /api/document-layer/generate-page
// Load template → call Claude → merge AI content → store for review
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { consultationId, templateId } = await request.json();

    if (!consultationId) {
      return NextResponse.json({ error: 'consultationId required' }, { status: 400 });
    }

    // Verify ownership
    const { data: consultation } = await supabase
      .from('consultations')
      .select('id, customer_id')
      .eq('id', consultationId)
      .eq('company_id', companyId)
      .limit(1)
      .single();

    if (!consultation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Get transcript + AI estimate output
    const { data: videoCall } = await supabase
      .from('estimate_video_calls')
      .select('id, transcript, ai_estimate_output')
      .eq('consultation_id', consultationId)
      .limit(1)
      .single();

    if (!videoCall?.transcript) {
      return NextResponse.json({ error: 'No transcript' }, { status: 400 });
    }

    // Resolve template: explicit > consultation_settings default > company default
    let resolvedTemplateId = templateId;

    if (!resolvedTemplateId) {
      const { data: settings } = await supabase
        .from('consultation_settings')
        .select('default_template_id')
        .eq('company_id', companyId)
        .limit(1)
        .single();
      resolvedTemplateId = settings?.default_template_id;
    }

    if (!resolvedTemplateId) {
      const { data: defaultTpl } = await supabase
        .from('estimate_page_templates')
        .select('id')
        .eq('company_id', companyId)
        .eq('is_default', true)
        .limit(1)
        .single();
      resolvedTemplateId = defaultTpl?.id;
    }

    if (!resolvedTemplateId) {
      return NextResponse.json({ error: 'No template available' }, { status: 400 });
    }

    // Load template sections
    const { data: template } = await supabase
      .from('estimate_page_templates')
      .select('id, name, sections, design_theme')
      .eq('id', resolvedTemplateId)
      .eq('company_id', companyId)
      .limit(1)
      .single();

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const sections = (template.sections || []) as Array<{ type: string; content: Record<string, unknown> }>;
    const fillable = getAIFillableSections(sections);

    if (fillable.length === 0) {
      // No AI-fillable sections, store template as-is
      const admin = createAdminClient();
      await admin.from('estimate_video_calls')
        .update({ ai_page_content: { sections: template.sections, designTheme: template.design_theme }, updated_at: new Date().toISOString() })
        .eq('id', videoCall.id);
      await admin.from('consultations')
        .update({ pipeline_status: 'ready', pipeline_error: null })
        .eq('id', consultationId);
      return NextResponse.json({ data: { sections: template.sections, designTheme: template.design_theme } });
    }

    // Get company info for prompt context
    const [companyRes, customerRes] = await Promise.all([
      supabase.from('companies').select('name').eq('id', companyId).limit(1).single(),
      consultation.customer_id
        ? supabase.from('customers').select('name').eq('id', consultation.customer_id).limit(1).single()
        : Promise.resolve({ data: null }),
    ]);

    const aiEstimate = videoCall.ai_estimate_output as Record<string, unknown> | null;

    const prompt = buildPagePrompt({
      transcript: videoCall.transcript,
      templateSections: sections,
      customerName: customerRes.data?.name || null,
      serviceType: (aiEstimate?.serviceType as string) || null,
      companyName: companyRes.data?.name || null,
    });

    const response = await callClaude(
      'You are a professional page content writer. Output ONLY valid JSON.',
      [{ role: 'user', content: prompt }],
    );

    const aiContent = extractJSON<AIPageContent>(response);
    const mergedSections = mergeTemplateContent(sections as never[], aiContent);

    // Store merged result
    const admin = createAdminClient();
    const pageData = { sections: mergedSections, designTheme: template.design_theme };

    await admin.from('estimate_video_calls')
      .update({ ai_page_content: pageData, updated_at: new Date().toISOString() })
      .eq('id', videoCall.id);

    await admin.from('consultations')
      .update({ pipeline_status: 'ready', pipeline_error: null })
      .eq('id', consultationId);

    return NextResponse.json({ data: pageData });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Page generation failed' }, { status: 500 });
  }
}
