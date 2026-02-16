import { NextResponse } from 'next/server'
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany'
import { renderToBuffer } from '@react-pdf/renderer'
import { ContractPDF } from '@/features/contracts/components/ContractPDF'

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const { companyId, supabase } = await getAuthCompany()

    const { data: row } = await supabase
      .from('contract_instances')
      .select('id, company_id, template_id, job_id, customer_id, status, filled_blocks, template_snapshot, signing_token, sent_at, viewed_at, signed_at, paid_at, completed_at, created_at, updated_at')
      .eq('id', id)
      .single()

    if (!row) return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    if (row.company_id !== companyId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const instance = {
      id: row.id, companyId: row.company_id, templateId: row.template_id,
      jobId: row.job_id, customerId: row.customer_id, status: row.status,
      filledBlocks: row.filled_blocks, templateSnapshot: row.template_snapshot,
      signingToken: row.signing_token, sentAt: row.sent_at, viewedAt: row.viewed_at,
      signedAt: row.signed_at, paidAt: row.paid_at, completedAt: row.completed_at,
      createdAt: row.created_at, updatedAt: row.updated_at,
    }

    // Fetch signatures for this contract
    const { data: sigs } = await supabase
      .from('contract_signatures')
      .select('block_id, signature_data')
      .eq('contract_id', id)
      .limit(20)

    const sigMap: Record<string, string> = {}
    for (const sig of sigs || []) {
      sigMap[sig.block_id] = sig.signature_data
    }

    const buffer = await renderToBuffer(ContractPDF({ instance, signatures: sigMap }))
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="contract-${id.slice(0, 8)}.pdf"`,
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
