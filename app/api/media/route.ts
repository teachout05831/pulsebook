import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import { getMediaFiles } from '@/features/media/queries/getMediaFiles';
import { deleteMedia } from '@/features/media/actions/deleteMedia';
import type { FileCategory } from '@/features/media/types';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = await getAuthCompany();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as FileCategory | null;
    const customerId = searchParams.get('customerId');
    const jobId = searchParams.get('jobId');

    const data = await getMediaFiles(companyId, {
      category: category || undefined,
      customerId: customerId || undefined,
      jobId: jobId || undefined,
    });

    // snake_case -> camelCase conversion
    const files = data.map((f) => ({
      id: f.id,
      companyId: f.company_id,
      customerId: f.customer_id,
      jobId: f.job_id,
      fileName: f.file_name,
      fileType: f.file_type,
      fileSize: f.file_size,
      storagePath: f.storage_path,
      category: f.category,
      description: f.description,
      createdBy: f.created_by,
      createdAt: f.created_at,
    }));

    return NextResponse.json({ data: files }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to load files' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { companyId } = await getAuthCompany();

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
    }

    const result = await deleteMedia(fileId, companyId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
