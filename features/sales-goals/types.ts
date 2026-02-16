// ============================================
// SALES GOALS TYPES
// ============================================

export interface SalesGoal {
  id: string
  companyId: string
  teamMemberId: string
  year: number
  month: number
  revenueTarget: number
  bookingsTarget: number
  estimatesTarget: number
  callsTarget: number
  bookingRateTarget: number
  sentEstimateRateTarget: number
  closedRateTarget: number
  isActive: boolean
  createdBy: string | null
  createdAt: Date
  updatedAt: Date
  teamMemberName?: string
}

export interface CreateSalesGoalInput {
  teamMemberId: string
  year: number
  month: number
  revenueTarget: number
  bookingsTarget?: number
  estimatesTarget?: number
  callsTarget?: number
}

export interface UpdateSalesGoalInput {
  revenueTarget?: number
  bookingsTarget?: number
  estimatesTarget?: number
  callsTarget?: number
  isActive?: boolean
}

// ============================================
// GOAL PROGRESS (computed from actuals)
// ============================================

export interface NumberProgress {
  target: number
  achieved: number
  percentComplete: number
}

export interface GoalProgress {
  year: number
  month: number
  daysElapsed: number
  daysRemaining: number
  totalDays: number

  revenue: {
    target: number
    achieved: number
    dailyTarget: number
    todayAchieved: number
    percentComplete: number
  }

  bookings: NumberProgress
  estimates: NumberProgress
  calls: NumberProgress

  bookingRate: { target: number; actual: number }
  sentEstimateRate: { target: number; actual: number }
  closedRate: { target: number; actual: number }

  isOnTrack: boolean
  pacePerDay: number
  neededPerDay: number
}

export interface TodayStats {
  callsMade: number
  estimatesSent: number
  bookings: number
  revenueToday: number
}

export interface RecentWin {
  id: string
  customerName: string
  amount: number
  date: string
}

export interface SalespersonInfo {
  id: string
  name: string
  avatar: string
  rank: number
  totalSalespeople: number
  streak: number
}

export interface SalespersonGoalView {
  salesperson: SalespersonInfo
  goal: SalesGoal | null
  progress: GoalProgress | null
  todayStats: TodayStats
  recentWins: RecentWin[]
}

export interface SalesGoalActionResult {
  success?: boolean
  error?: string
  data?: SalesGoal
}
