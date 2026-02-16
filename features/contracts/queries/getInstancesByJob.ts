import { getAuthCompany } from '@/lib/auth/getAuthCompany'
import type { ContractInstance } from '../types'

export async function getInstancesByJob(jobId: string): Promise<ContractInstance[]> {
  const { supabase, companyId } = await getAuthCompany()

  const { data, error } = await supabase
    .from('contract_instances')
    .select('id, company_id, template_id, job_id, customer_id, status, filled_blocks, template_snapshot, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at')
    .eq('company_id', companyId)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    companyId: row.company_id,
    templateId: row.template_id,
    jobId: row.job_id,
    customerId: row.customer_id,
    status: row.status as ContractInstance['status'],
    filledBlocks: row.filled_blocks as ContractInstance['filledBlocks'],
    templateSnapshot: row.template_snapshot as ContractInstance['templateSnapshot'],
    signingToken: row.signing_token,
    sentAt: row.sent_at,
    viewedAt: row.viewed_at,
    signedAt: row.signed_at,
    paidAt: row.paid_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}
