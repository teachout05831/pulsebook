import { NextRequest, NextResponse } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { validateApiKey } from './validate-api-key'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ApiContext {
  userId: string
  companyId: string
  supabase: SupabaseClient
  request: NextRequest
}

export async function withApiAuth(
  request: NextRequest,
  handler: (ctx: ApiContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const auth = await validateApiKey(request)

  if (!auth) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    )
  }

  const supabase = createAdminClient()

  return handler({
    userId: auth.userId,
    companyId: auth.companyId,
    supabase,
    request,
  })
}
