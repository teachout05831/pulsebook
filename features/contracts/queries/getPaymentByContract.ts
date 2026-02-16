import { createClient } from '@/lib/supabase/server'

export async function getPaymentByContract(contractId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) throw new Error('No active company')

  // Verify the contract belongs to this company
  const { data: contract } = await supabase
    .from('contract_instances')
    .select('id, company_id')
    .eq('id', contractId)
    .single()

  if (!contract) throw new Error('Contract not found')
  if (contract.company_id !== profile.active_company_id) {
    throw new Error('Not authorized')
  }

  const { data, error } = await supabase
    .from('contract_payments')
    .select('id, contract_id, amount, payment_type, payment_method, stripe_payment_id, status, collected_at, created_at')
    .eq('contract_id', contractId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}
