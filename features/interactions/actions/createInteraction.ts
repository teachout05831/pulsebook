'use server';

import { createClient } from '@/lib/supabase/server';
import type { CreateInteractionInput } from '../types';

const VALID_TYPES = ['call', 'text', 'email', 'meeting', 'note'];
const VALID_DIRECTIONS = ['inbound', 'outbound'];
const VALID_OUTCOMES = ['positive', 'neutral', 'no_answer', 'follow_up_needed'];
const CONTACT_TYPES = ['call', 'text', 'email', 'meeting'];

interface CreateResult {
  success?: boolean;
  error?: string;
  id?: string;
}

export async function createInteraction(input: CreateInteractionInput): Promise<CreateResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id, full_name')
    .eq('id', user.id)
    .single();

  if (!userData?.active_company_id) return { error: 'No active company' };

  if (!input.customerId) return { error: 'Customer is required' };
  if (!input.type || !VALID_TYPES.includes(input.type)) return { error: 'Valid type is required' };
  if (input.direction && !VALID_DIRECTIONS.includes(input.direction)) return { error: 'Invalid direction' };
  if (input.outcome && !VALID_OUTCOMES.includes(input.outcome)) return { error: 'Invalid outcome' };

  const { data, error } = await supabase
    .from('interactions')
    .insert({
      company_id: userData.active_company_id,
      customer_id: input.customerId,
      type: input.type,
      direction: input.direction || null,
      subject: input.subject || null,
      details: input.details || null,
      outcome: input.outcome || null,
      duration_seconds: input.durationSeconds || null,
      performed_by: user.id,
      performed_by_name: userData.full_name || user.email || 'Unknown',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating interaction:', error);
    return { error: 'Failed to create interaction' };
  }

  // Update last_contact_date for communication types
  if (CONTACT_TYPES.includes(input.type)) {
    await supabase
      .from('customers')
      .update({ last_contact_date: new Date().toISOString() })
      .eq('id', input.customerId)
      .eq('company_id', userData.active_company_id);
  }

  return { success: true, id: data.id };
}
