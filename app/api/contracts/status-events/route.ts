import { NextRequest, NextResponse } from 'next/server'
import { getStatusEvents } from '@/features/contracts/queries/getStatusEvents'
import { recordStatusEvent } from '@/features/contracts/actions/recordStatusEvent'

export async function GET(request: NextRequest) {
  const contractId = request.nextUrl.searchParams.get('contractId')
  if (!contractId) {
    return NextResponse.json({ error: 'contractId is required' }, { status: 400 })
  }

  try {
    const events = await getStatusEvents(contractId)
    const camelEvents = events.map(e => ({
      id: e.id,
      contractId: e.contract_id,
      stepLabel: e.step_label,
      stepIndex: e.step_index,
      recordedAt: e.recorded_at,
      recordedBy: e.recorded_by,
      gpsLatitude: e.gps_latitude,
      gpsLongitude: e.gps_longitude,
      notes: e.notes,
    }))
    return NextResponse.json({ data: camelEvents }, {
      headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=30' }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch'
    const status = message === 'Not authenticated' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = await recordStatusEvent({
    contractId: body.contractId,
    stepLabel: body.stepLabel,
    stepIndex: body.stepIndex,
    gpsLatitude: body.gpsLatitude ?? null,
    gpsLongitude: body.gpsLongitude ?? null,
    notes: body.notes ?? null,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const d = result.data
  return NextResponse.json({
    data: {
      id: d.id,
      contractId: d.contract_id,
      stepLabel: d.step_label,
      stepIndex: d.step_index,
      recordedAt: d.recorded_at,
      recordedBy: d.recorded_by,
      gpsLatitude: d.gps_latitude,
      gpsLongitude: d.gps_longitude,
      notes: d.notes,
    },
  })
}
