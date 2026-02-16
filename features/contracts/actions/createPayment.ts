'use server'

import { createClient } from '@/lib/supabase/server'

interface CreatePaymentInput {
  contractId: string
  amount: number
  paymentType: string
  paymentMethod?: string
  externalPaymentId?: string
}

export async function createPayment(input: CreatePaymentInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }

  if (!input.contractId) return { error: 'Contract ID is required' }
  if (!input.amount || input.amount <= 0) return { error: 'Valid amount is required' }
  if (!input.paymentType) return { error: 'Payment type is required' }

  // Ownership check
  const { data: contract } = await supabase
    .from('contract_instances')
    .select('company_id')
    .eq('id', input.contractId)
    .single()

  if (!contract) return { error: 'Contract not found' }
  if (contract.company_id !== profile.active_company_id) return { error: 'Not authorized' }

  const isManual = input.paymentMethod !== 'card'

  const { data, error } = await supabase
    .from('contract_payments')
    .insert({
      contract_id: input.contractId,
      amount: input.amount,
      payment_type: input.paymentType,
      payment_method: input.paymentMethod || null,
      stripe_payment_id: input.externalPaymentId || null,
      status: isManual ? 'succeeded' : 'pending',
      collected_at: isManual ? new Date().toISOString() : null,
    })
    .select('id, contract_id, amount, payment_type, payment_method, status, collected_at, created_at')
    .single()

  if (error) return { error: 'Failed to create payment' }
  return { success: true, data }
}
