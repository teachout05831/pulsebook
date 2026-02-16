import { NextResponse } from 'next/server';
import { updateBillingSettings } from '@/features/billing-settings/actions/updateBillingSettings';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await updateBillingSettings(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update billing settings' }, { status: 500 });
  }
}
