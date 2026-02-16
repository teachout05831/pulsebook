import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import type { AIEstimateOutput } from '@/features/document-layer/types';

// POST /api/document-layer/accept
// Finalize: create estimate + page from AI output with user edits
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { consultationId, lineItems, resources, pricingModel, notes, pageContent } = await request.json();

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

    // Get AI output if no overrides provided
    const { data: videoCall } = await supabase
      .from('estimate_video_calls')
      .select('id, ai_estimate_output, ai_page_content')
      .eq('consultation_id', consultationId)
      .limit(1)
      .single();

    const aiEstimate = (videoCall?.ai_estimate_output || {}) as AIEstimateOutput;
    const finalLineItems = lineItems || aiEstimate.lineItems || [];
    const finalResources = resources || aiEstimate.resources || {};
    const finalPricingModel = pricingModel || aiEstimate.pricingModel || 'flat';

    // Calculate totals
    let subtotal = 0;
    const processedItems = finalLineItems.map((item: Record<string, unknown>, i: number) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.unitPrice) || 0;
      const total = qty * price;
      subtotal += item.category === 'discount' ? -total : total;
      return {
        id: crypto.randomUUID(),
        description: item.description,
        quantity: qty,
        unitPrice: price,
        total,
        category: item.category || 'primary_service',
        catalogItemId: item.catalogItemId || null,
        isTaxable: item.isTaxable !== false,
        unitLabel: item.unitLabel || null,
        sortOrder: i,
      };
    });

    const taxRate = 8;
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    // Generate estimate number
    const { count } = await supabase
      .from('estimates')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId);
    const estimateNumber = `EST-${String((count || 0) + 1).padStart(3, '0')}`;

    // Create estimate
    const { data: estimate, error: estError } = await supabase
      .from('estimates')
      .insert({
        company_id: companyId,
        customer_id: consultation.customer_id,
        estimate_number: estimateNumber,
        status: 'draft',
        pricing_model: finalPricingModel,
        binding_type: 'non_binding',
        source: 'ai_consultation',
        line_items: processedItems,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        notes: notes || aiEstimate.customerNotes || null,
        internal_notes: aiEstimate.internalNotes || null,
        resources: finalResources,
        service_type: aiEstimate.serviceType || null,
        issue_date: new Date().toISOString().split('T')[0],
      })
      .select('id')
      .single();

    if (estError || !estimate) {
      return NextResponse.json({ error: 'Failed to create estimate' }, { status: 500 });
    }

    // Link consultation to estimate
    await supabase.from('consultations')
      .update({ estimate_id: estimate.id })
      .eq('id', consultationId);

    // Create estimate page if AI page content exists
    let pageId: string | null = null;
    const finalPageContent = pageContent || videoCall?.ai_page_content;

    if (finalPageContent?.sections) {
      const { data: page } = await supabase
        .from('estimate_pages')
        .insert({
          company_id: companyId,
          estimate_id: estimate.id,
          public_token: crypto.randomUUID(),
          sections: finalPageContent.sections,
          design_theme: finalPageContent.designTheme || {},
          status: 'draft',
          is_active: false,
        })
        .select('id')
        .single();
      pageId = page?.id || null;
    }

    return NextResponse.json({ data: { estimateId: estimate.id, pageId } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
