'use server';

import { createClient } from '@/lib/supabase/server';

interface RescheduleResult {
  success?: boolean;
  error?: string;
}

export async function rescheduleFollowUp(
  followUpId: string,
  newDueDate: string
): Promise<RescheduleResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Validate inputs
  if (!followUpId) return { error: 'Follow-up ID is required' };
  if (!newDueDate) return { error: 'New due date is required' };

  // Validate date format
  const date = new Date(newDueDate);
  if (isNaN(date.getTime())) {
    return { error: 'Invalid date format' };
  }

  // Update follow-up
  const { error } = await supabase
    .from('follow_ups')
    .update({ due_date: newDueDate })
    .eq('id', followUpId);

  if (error) {
    console.error('Error rescheduling follow-up:', error);
    return { error: 'Failed to reschedule follow-up' };
  }

  return { success: true };
}
