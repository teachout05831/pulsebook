import { NextResponse } from 'next/server';
import { updateCompanyProfile } from '@/features/company-profile/actions/updateCompanyProfile';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const result = await updateCompanyProfile(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update company profile' },
      { status: 500 }
    );
  }
}
