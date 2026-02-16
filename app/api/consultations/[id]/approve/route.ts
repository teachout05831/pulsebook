import { NextRequest, NextResponse } from 'next/server';
import { approveEstimate } from '@/features/consultations/actions/approveEstimate';

// POST /api/consultations/[id]/approve - Approve presented estimate (public, no auth)
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await approveEstimate(id);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
