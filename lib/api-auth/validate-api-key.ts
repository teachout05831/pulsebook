import { NextRequest } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ApiKeyAuth {
  userId: string
  companyId: string
}

function extractApiKey(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  return request.headers.get('x-api-key')
}

function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export async function validateApiKey(request: NextRequest): Promise<ApiKeyAuth | null> {
  const key = extractApiKey(request)
  if (!key || !key.startsWith('sb_live_')) return null

  const keyHash = hashKey(key)
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, user_id, company_id, expires_at, is_active, key_hash')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .limit(1)
    .single()

  if (error || !data) return null

  // Defense-in-depth: constant-time hash verification
  const computedHash = Buffer.from(keyHash, 'hex')
  const storedHash = Buffer.from(data.key_hash || '', 'hex')
  if (computedHash.length !== storedHash.length || !timingSafeEqual(computedHash, storedHash)) {
    return null
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  // Update last_used_at (fire-and-forget)
  supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
    .then(() => {})

  return {
    userId: data.user_id,
    companyId: data.company_id,
  }
}
