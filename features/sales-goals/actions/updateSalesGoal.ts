'use server'

import { createClient } from '@/lib/supabase/server'
import type { UpdateSalesGoalInput, SalesGoalActionResult } from '../types'

export async function updateSalesGoal(
  goalId: string,
  input: UpdateSalesGoalInput
): Promise<SalesGoalActionResult> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Validate input
  if (!goalId) return { error: 'Goal ID is required' }
  if (input.revenueTarget !== undefined && input.revenueTarget < 0) {
    return { error: 'Revenue target must be positive' }
  }

  // Build update object
  const updates: Record<string, unknown> = {}
  if (input.revenueTarget !== undefined) updates.revenue_target = input.revenueTarget
  if (input.bookingsTarget !== undefined) updates.bookings_target = input.bookingsTarget
  if (input.estimatesTarget !== undefined) updates.estimates_target = input.estimatesTarget
  if (input.callsTarget !== undefined) updates.calls_target = input.callsTarget
  if (input.isActive !== undefined) updates.is_active = input.isActive

  if (Object.keys(updates).length === 0) {
    return { error: 'No updates provided' }
  }

  // Update
  const { data, error } = await supabase
    .from('sales_goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update sales goal:', error)
    return { error: 'Failed to update sales goal' }
  }

  return {
    success: true,
    data: {
      id: data.id,
      companyId: data.company_id,
      teamMemberId: data.team_member_id,
      year: data.year,
      month: data.month,
      revenueTarget: parseFloat(data.revenue_target),
      bookingsTarget: data.bookings_target ?? 0,
      estimatesTarget: data.estimates_target ?? 0,
      callsTarget: data.calls_target ?? 0,
      bookingRateTarget: parseFloat(data.booking_rate_target || '0'),
      sentEstimateRateTarget: parseFloat(data.sent_estimate_rate_target || '0'),
      closedRateTarget: parseFloat(data.closed_rate_target || '0'),
      isActive: data.is_active,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    },
  }
}
