'use server';

import { createClient } from '@/lib/supabase/server';

interface CompleteResult {
  success?: boolean;
  error?: string;
}

export async function completeFollowUp(followUpId: string): Promise<CompleteResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Validate input
  if (!followUpId) return { error: 'Follow-up ID is required' };

  // Update follow-up
  const { error } = await supabase
    .from('follow_ups')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', followUpId);

  if (error) {
    console.error('Error completing follow-up:', error);
    return { error: 'Failed to complete follow-up' };
  }

  return { success: true };
}

export async function cancelFollowUp(followUpId: string): Promise<CompleteResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (!followUpId) return { error: 'Follow-up ID is required' };

  const { error } = await supabase
    .from('follow_ups')
    .update({ status: 'cancelled' })
    .eq('id', followUpId);

  if (error) {
    console.error('Error cancelling follow-up:', error);
    return { error: 'Failed to cancel follow-up' };
  }

  return { success: true };
}
