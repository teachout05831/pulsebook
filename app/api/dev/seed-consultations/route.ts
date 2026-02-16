import { NextResponse } from 'next/server';
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';

// DEV ONLY — seed test consultations for AI Consultations tab preview
export async function POST() {
  try {
    const { companyId, user, supabase } = await getAuthCompany();

    // Get user profile for host name
    const { data: profile } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .limit(1)
      .single();

    const hostName = profile?.full_name || 'Test Host';

    // Get a customer if one exists
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name')
      .eq('company_id', companyId)
      .limit(3);

    const samples = [
      {
        title: 'Kitchen Remodel Consultation',
        status: 'completed',
        pipeline_status: 'ready',
        customer_name: customers?.[0]?.name || 'Sarah Johnson',
        customer_id: customers?.[0]?.id || null,
        duration_seconds: 1845,
        purpose: 'discovery',
      },
      {
        title: 'Bathroom Renovation Estimate Review',
        status: 'completed',
        pipeline_status: 'generating',
        customer_name: customers?.[1]?.name || 'Mike Chen',
        customer_id: customers?.[1]?.id || null,
        duration_seconds: 1220,
        purpose: 'estimate_review',
      },
      {
        title: 'HVAC System Follow-Up',
        status: 'completed',
        pipeline_status: 'analyzing',
        customer_name: customers?.[2]?.name || 'Lisa Park',
        customer_id: customers?.[2]?.id || null,
        duration_seconds: 680,
        purpose: 'follow_up',
      },
      {
        title: 'Roof Inspection Discovery Call',
        status: 'active',
        pipeline_status: 'transcribing',
        customer_name: 'Walk-in Customer',
        customer_id: null,
        duration_seconds: null,
        purpose: 'discovery',
      },
    ];

    const inserted = [];
    for (const s of samples) {
      const { data, error } = await supabase
        .from('consultations')
        .insert({
          company_id: companyId,
          title: s.title,
          status: s.status,
          pipeline_status: s.pipeline_status,
          customer_name: s.customer_name,
          customer_id: s.customer_id,
          host_user_id: user.id,
          host_name: hostName,
          purpose: s.purpose,
          duration_seconds: s.duration_seconds,
          public_token: crypto.randomUUID().slice(0, 8),
          started_at: s.duration_seconds ? new Date(Date.now() - s.duration_seconds * 1000).toISOString() : null,
          ended_at: s.status === 'completed' ? new Date().toISOString() : null,
        })
        .select('id, title, pipeline_status')
        .single();

      if (data) inserted.push(data);
      if (error) inserted.push({ error: error.message, title: s.title });
    }

    return NextResponse.json({ data: inserted, count: inserted.length });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
