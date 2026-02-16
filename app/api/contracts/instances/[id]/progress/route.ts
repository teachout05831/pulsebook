import { NextRequest, NextResponse } from 'next/server'
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { companyId, supabase } = await getAuthCompany()

    // Verify ownership
    const { data: contract } = await supabase
      .from('contract_instances')
      .select('id, status')
      .eq('id', params.id)
      .eq('company_id', companyId)
      .single()

    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Fetch status events
    const { data: events } = await supabase
      .from('contract_status_events')
      .select('id, contract_id, step_label, step_index, recorded_at, recorded_by, gps_latitude, gps_longitude, notes')
      .eq('contract_id', params.id)
      .order('recorded_at', { ascending: true })
      .limit(100)

    // Fetch time entries
    const { data: timeEntries } = await supabase
      .from('contract_time_entries')
      .select('id, contract_id, event_type, reason, is_billable, recorded_at, notes')
      .eq('contract_id', params.id)
      .order('recorded_at', { ascending: true })
      .limit(200)

    const camelEvents = (events || []).map(e => ({
      id: e.id, contractId: e.contract_id, stepLabel: e.step_label,
      stepIndex: e.step_index, recordedAt: e.recorded_at, recordedBy: e.recorded_by,
      gpsLatitude: e.gps_latitude, gpsLongitude: e.gps_longitude, notes: e.notes,
    }))

    const camelEntries = (timeEntries || []).map(e => ({
      id: e.id, contractId: e.contract_id, eventType: e.event_type,
      reason: e.reason, isBillable: e.is_billable, recordedAt: e.recorded_at, notes: e.notes,
    }))

    return NextResponse.json({
      data: {
        statusEvents: camelEvents,
        timeEntries: camelEntries,
        currentStatus: contract.status,
      },
    }, {
      headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' }
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
