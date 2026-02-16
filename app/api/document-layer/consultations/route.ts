import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import { getConsultationEstimates } from '@/features/document-layer/queries/getConsultationEstimates';

// GET /api/document-layer/consultations - List consultations with pipeline activity
export async function GET(request: NextRequest) {
  try {
    const { companyId } = await getAuthCompany();
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 20, 50);

    const result = await getConsultationEstimates(companyId, page, limit);

    // snake_case → camelCase
    const items = result.data.map((row: Record<string, unknown>) => ({
      id: row.id,
      title: row.title,
      customerName: row.customer_name,
      hostName: row.host_name,
      status: row.status,
      pipelineStatus: row.pipeline_status,
      pipelineError: row.pipeline_error,
      estimateId: row.estimate_id,
      durationSeconds: row.duration_seconds,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ data: items, total: result.total }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
