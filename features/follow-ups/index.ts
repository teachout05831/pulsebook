// Components
export { ConfirmCompleteDialog } from './components/ConfirmCompleteDialog';

// Hooks
export { useFollowUps } from './hooks/useFollowUps';
export type { FollowUpWithUrgency } from './hooks/useFollowUps';

// Actions
export { createFollowUp } from './actions/createFollowUp';
export { completeFollowUp, cancelFollowUp } from './actions/completeFollowUp';
export { rescheduleFollowUp } from './actions/rescheduleFollowUp';

// Queries (server-only — import directly from ./queries/getFollowUps)

// Types
export type {
  FollowUp,
  FollowUpType,
  FollowUpStatus,
  FollowUpUrgency,
  CreateFollowUpInput,
} from './types';
export { getFollowUpUrgency, getDaysOverdue, parseFollowUpDueDate } from './types';
