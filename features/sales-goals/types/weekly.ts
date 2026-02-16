// ============================================
// WEEKLY GOALS TYPES
// ============================================

export interface WeeklyGoal {
  id: string
  companyId: string
  teamMemberId: string
  weekStart: string // ISO date string (always a Monday)
  bookingsTarget: number
  estimatesTarget: number
  callsTarget: number
  revenueTarget: number
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateWeeklyGoalInput {
  weekStart: string
  bookingsTarget: number
  estimatesTarget: number
  callsTarget: number
  revenueTarget: number
  notes?: string
}

export interface UpdateWeeklyGoalInput {
  bookingsTarget?: number
  estimatesTarget?: number
  callsTarget?: number
  revenueTarget?: number
  notes?: string
}

export interface WeeklyProgress {
  weekStart: string
  weekEnd: string
  bookings: { target: number; achieved: number; percentComplete: number }
  estimates: { target: number; achieved: number; percentComplete: number }
  calls: { target: number; achieved: number; percentComplete: number }
  revenue: { target: number; achieved: number; percentComplete: number }
}
