import { createClient } from '@/lib/supabase/server'

interface RecordSignatureInput {
  contractId: string
  blockId: string
  signerRole: string
  signerName: string
  signerEmail?: string
  signatureData: string
  stage?: string
  ipAddress?: string
  userAgent?: string
  gpsLatitude?: number
  gpsLongitude?: number
}

export async function recordSignature(input: RecordSignatureInput) {
  const supabase = await createClient()

  if (!input.contractId) return { error: 'Contract ID is required' }
  if (!input.signerRole) return { error: 'Signer role is required' }
  if (!input.signerName) return { error: 'Signer name is required' }
  if (!input.signatureData) return { error: 'Signature data is required' }

  const { data: contract } = await supabase
    .from('contract_instances')
    .select('id, signing_token')
    .eq('id', input.contractId)
    .single()

  if (!contract) return { error: 'Contract not found' }
  if (!contract.signing_token) return { error: 'Contract is not available for signing' }

  const { error } = await supabase
    .from('contract_signatures')
    .insert({
      contract_id: input.contractId,
      block_id: input.blockId || null,
      signer_role: input.signerRole,
      signer_name: input.signerName,
      signer_email: input.signerEmail || null,
      signature_data: input.signatureData,
      stage: input.stage || 'neutral',
      ip_address: input.ipAddress || null,
      user_agent: input.userAgent || null,
      gps_latitude: input.gpsLatitude || null,
      gps_longitude: input.gpsLongitude || null,
    })

  if (error) return { error: 'Failed to record signature' }
  return { success: true }
}
