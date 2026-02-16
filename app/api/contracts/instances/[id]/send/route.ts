import { NextRequest, NextResponse } from 'next/server'
import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany'

interface RouteParams { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { companyId, supabase } = await getAuthCompany()

    const { data: instance } = await supabase
      .from('contract_instances')
      .select('id, company_id, signing_token, customer_id, status')
      .eq('id', id)
      .single()

    if (!instance) return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    if (instance.company_id !== companyId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const body = await request.json()
    const method = body.method || 'email' // 'email' | 'sms'

    // Build signing URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'
    const signingUrl = `${baseUrl}/sign/${instance.signing_token}`

    // TODO: Integrate with email/SMS provider (SendGrid, Twilio, etc.)
    // For now, update status and return the signing URL
    await supabase
      .from('contract_instances')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.json({
      success: true,
      signingUrl,
      method,
      message: `Contract ready to send via ${method}. Signing URL: ${signingUrl}`,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
