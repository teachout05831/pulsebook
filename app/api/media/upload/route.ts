import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import { uploadMedia } from '@/features/media/actions/uploadMedia';
import type { MediaContext, FileCategory } from '@/features/media/types';

const VALID_CONTEXTS: MediaContext[] = ['customer', 'job', 'brand-kit', 'estimate-page'];
const VALID_CATEGORIES: FileCategory[] = ['photo', 'document', 'contract'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  try {
    const { user, companyId } = await getAuthCompany();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const context = formData.get('context') as MediaContext | null;
    const category = formData.get('category') as FileCategory | null;
    const customerId = formData.get('customerId') as string | null;
    const jobId = formData.get('jobId') as string | null;
    const description = formData.get('description') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!context || !VALID_CONTEXTS.includes(context)) {
      return NextResponse.json({ error: 'Invalid context' }, { status: 400 });
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 25MB)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadMedia({
      buffer, fileName: file.name, fileType: file.type, fileSize: file.size,
      companyId, userId: user.id, context, category,
      customerId: customerId || undefined, jobId: jobId || undefined,
      description: description || undefined,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
