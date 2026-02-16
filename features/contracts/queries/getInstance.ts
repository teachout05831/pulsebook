import { getAuthCompany } from '@/lib/auth/getAuthCompany'
import type { ContractInstance } from '../types'

export async function getInstance(id: string): Promise<ContractInstance | null> {
  const { supabase, companyId } = await getAuthCompany()

  const { data, error } = await supabase
    .from('contract_instances')
    .select('id, company_id, template_id, job_id, customer_id, status, filled_blocks, template_snapshot, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at')
    .eq('id', id)
    .eq('company_id', companyId)
    .limit(1)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    companyId: data.company_id,
    templateId: data.template_id,
    jobId: data.job_id,
    customerId: data.customer_id,
    status: data.status as ContractInstance['status'],
    filledBlocks: data.filled_blocks as ContractInstance['filledBlocks'],
    templateSnapshot: data.template_snapshot as ContractInstance['templateSnapshot'],
    signingToken: data.signing_token,
    sentAt: data.sent_at,
    viewedAt: data.viewed_at,
    signedAt: data.signed_at,
    paidAt: data.paid_at,
    completedAt: data.completed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
