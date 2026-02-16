import { NextRequest, NextResponse } from 'next/server';
import { getPresentedEstimate } from '@/features/consultations/queries/getPresentedEstimate';

// GET /api/consultations/[id]/estimate - Get presented estimate (public, no auth)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await getPresentedEstimate(id);

    // snake_case → camelCase conversion
    return NextResponse.json({
      data: {
        lineItems: data.line_items,
        subtotal: data.subtotal,
        taxRate: data.tax_rate,
        taxAmount: data.tax_amount,
        total: data.total,
        notes: data.notes,
        companyName: data.company_name,
      },
    }, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
