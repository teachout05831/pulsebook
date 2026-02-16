'use server'

import { randomBytes, createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import type { CreateApiKeyInput } from '../types'

export async function createApiKey(input: CreateApiKeyInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.active_company_id) return { error: 'No active company' }

  if (!input.name || input.name.trim().length < 2) {
    return { error: 'Name must be at least 2 characters' }
  }

  // Generate key: sb_live_ + 40 hex chars
  const rawKey = randomBytes(20).toString('hex')
  const fullKey = `sb_live_${rawKey}`
  const keyPrefix = fullKey.slice(0, 12)
  const keyHash = createHash('sha256').update(fullKey).digest('hex')

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      company_id: profile.active_company_id,
      user_id: user.id,
      name: input.name.trim(),
      key_prefix: keyPrefix,
      key_hash: keyHash,
      expires_at: input.expiresAt || null,
    })
    .select('id')
    .single()

  if (error) return { error: 'Failed to create API key' }

  return { success: true, data: { id: data.id, key: fullKey } }
}
