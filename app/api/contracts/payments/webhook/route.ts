import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Generic payment webhook — provider adapters call this to update payment status.
// When a card processor (Stripe, Square, custom) confirms a payment,
// it POSTs here with { paymentId, status, paymentMethod? }.
// Each provider adapter handles signature verification before calling this endpoint.

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.paymentId) {
    return NextResponse.json({ error: 'paymentId is required' }, { status: 400 })
  }
  if (!body.status) {
    return NextResponse.json({ error: 'status is required' }, { status: 400 })
  }

  const validStatuses = ['pending', 'succeeded', 'failed', 'refunded']
  if (!validStatuses.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = await createClient()

  const updateData: Record<string, unknown> = { status: body.status }
  if (body.paymentMethod) updateData.payment_method = body.paymentMethod
  if (body.status === 'succeeded') updateData.collected_at = new Date().toISOString()

  const { data: payment, error } = await supabase
    .from('contract_payments')
    .update(updateData)
    .eq('id', body.paymentId)
    .select('id, contract_id, status')
    .single()

  if (error || !payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  // Update contract instance status when payment succeeds
  if (body.status === 'succeeded') {
    await supabase
      .from('contract_instances')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', payment.contract_id)
  }

  return NextResponse.json({ received: true })
}
