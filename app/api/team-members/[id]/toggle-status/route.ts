import { NextRequest, NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify ownership
    const { data: existing } = await supabase
      .from('team_members')
      .select('company_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();

    const { error } = await supabase
      .from('team_members')
      .update({ is_active: body.isActive })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
