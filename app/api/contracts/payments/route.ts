import { NextRequest, NextResponse } from 'next/server'
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany'

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany()

    const contractId = request.nextUrl.searchParams.get('contractId')
    if (!contractId) {
      return NextResponse.json({ error: 'contractId is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('contract_payments')
      .select('id, contract_id, amount, payment_type, payment_method, stripe_payment_id, status, collected_at, created_at')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 })

    const row = data?.[0]
    if (!row) return NextResponse.json({ payment: null })

    return NextResponse.json({
      payment: {
        id: row.id,
        contractId: row.contract_id,
        amount: row.amount,
        paymentType: row.payment_type,
        paymentMethod: row.payment_method,
        externalPaymentId: row.stripe_payment_id,
        status: row.status,
        collectedAt: row.collected_at,
        createdAt: row.created_at,
      },
    }, {
      headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=30' }
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany()

    const body = await request.json()
    if (!body.contractId) return NextResponse.json({ error: 'contractId is required' }, { status: 400 })
    if (!body.amount || body.amount <= 0) return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })

    // Ownership check
    const { data: contract } = await supabase
      .from('contract_instances')
      .select('company_id')
      .eq('id', body.contractId)
      .single()

    if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    if (contract.company_id !== companyId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Record payment (provider-agnostic -- works for manual, Stripe, Square, etc.)
    const { data: payment, error } = await supabase
      .from('contract_payments')
      .insert({
        contract_id: body.contractId,
        amount: body.amount,
        payment_type: body.paymentType || 'full',
        payment_method: body.paymentMethod || null,
        status: body.paymentMethod === 'card' ? 'pending' : 'succeeded',
        collected_at: body.paymentMethod !== 'card' ? new Date().toISOString() : null,
      })
      .select('id, contract_id, amount, payment_type, payment_method, status, collected_at, created_at')
      .single()

    if (error) return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })

    // If non-card payment, mark contract as paid
    if (payment.status === 'succeeded') {
      await supabase
        .from('contract_instances')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', body.contractId)
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        contractId: payment.contract_id,
        amount: payment.amount,
        paymentType: payment.payment_type,
        paymentMethod: payment.payment_method,
        status: payment.status,
        collectedAt: payment.collected_at,
        createdAt: payment.created_at,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
