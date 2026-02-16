// Components
export { SalespersonGoalsView, CircularProgress, RateCard, NoGoalState, SalesGoalsManager, GoalRow, MonthPicker, WeeklyGoalSetter, WeeklyProgressCard } from './components'

// Hooks
export { useSalespersonGoals } from './hooks/useSalespersonGoals'
export { useSalesGoalsManager } from './hooks/useSalesGoalsManager'
export { useWeeklyGoals } from './hooks/useWeeklyGoals'

// Actions
export { createSalesGoal, updateSalesGoal } from './actions'

// Queries
export {
  getSalespersonGoal,
  getGoalProgress,
  getTodayStats,
  getRecentWins,
  getCurrentSalesperson,
  getWeekStats,
} from './queries'

// Types
export type {
  SalesGoal,
  GoalProgress,
  NumberProgress,
  TodayStats,
  RecentWin,
  SalespersonGoalView,
  SalespersonInfo,
  CreateSalesGoalInput,
  UpdateSalesGoalInput,
  SalesGoalActionResult,
} from './types'

// Weekly Types
export type { WeeklyGoal, CreateWeeklyGoalInput, UpdateWeeklyGoalInput, WeeklyProgress } from './types/weekly'
