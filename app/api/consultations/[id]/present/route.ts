import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import { presentEstimate } from '@/features/consultations/actions/presentEstimate';

// POST /api/consultations/[id]/present - Present an estimate to the customer during call
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId } = await getAuthCompany();
    const { id } = await params;
    const { estimateId } = await request.json();

    if (!estimateId) {
      return NextResponse.json({ error: 'estimateId required' }, { status: 400 });
    }

    const result = await presentEstimate(id, estimateId, companyId);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
