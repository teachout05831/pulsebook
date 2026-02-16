'use server';

import { createClient } from '@/lib/supabase/server';
import type { CreateFollowUpInput } from '../types';

interface CreateResult {
  success?: boolean;
  error?: string;
  id?: string;
}

export async function createFollowUp(input: CreateFollowUpInput): Promise<CreateResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single();

  if (!userData?.active_company_id) return { error: 'No active company' };

  // Validate inputs
  if (!input.customerId) return { error: 'Customer is required' };
  if (!input.type) return { error: 'Type is required' };
  if (!input.dueDate) return { error: 'Due date is required' };

  // Insert follow-up
  const { data, error } = await supabase
    .from('follow_ups')
    .insert({
      company_id: userData.active_company_id,
      customer_id: input.customerId,
      type: input.type,
      details: input.details || null,
      due_date: input.dueDate.includes('T') ? input.dueDate : `${input.dueDate}T12:00:00`,
      assigned_to: input.assignedTo || null,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating follow-up:', error);
    return { error: 'Failed to create follow-up' };
  }

  return { success: true, id: data.id };
}
