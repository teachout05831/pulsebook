export type FollowUpType = 'call' | 'email' | 'meeting';
export type FollowUpStatus = 'pending' | 'completed' | 'cancelled';
export type FollowUpUrgency = 'overdue' | 'today' | 'upcoming';

export interface FollowUp {
  id: string;
  companyId: string;
  customerId: string;
  type: FollowUpType;
  details: string | null;
  dueDate: Date;
  status: FollowUpStatus;
  assignedTo: string | null;
  completedAt: Date | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Joined fields
  customerName?: string;
  lastContactDate?: string;
}

export interface CreateFollowUpInput {
  customerId: string;
  type: FollowUpType;
  details?: string;
  dueDate: string; // ISO date string
  assignedTo?: string;
}

export interface UpdateFollowUpInput {
  type?: FollowUpType;
  details?: string;
  dueDate?: string;
  assignedTo?: string;
}

// Get date-only string in local timezone (avoids UTC midnight shift)
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Calculate urgency based on due date
export function getFollowUpUrgency(dueDate: Date): FollowUpUrgency {
  const todayStr = toDateStr(new Date());
  // Use UTC parts for the stored date to avoid timezone day-shift
  const due = new Date(dueDate);
  const dueStr = `${due.getUTCFullYear()}-${String(due.getUTCMonth() + 1).padStart(2, '0')}-${String(due.getUTCDate()).padStart(2, '0')}`;

  if (dueStr < todayStr) return 'overdue';
  if (dueStr === todayStr) return 'today';
  return 'upcoming';
}

// Calculate days overdue
export function getDaysOverdue(dueDate: Date): number {
  const today = new Date();
  const todayMs = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const due = new Date(dueDate);
  const dueMs = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());

  return Math.floor((todayMs - dueMs) / (1000 * 60 * 60 * 24));
}

/**
 * Parse a follow-up due date, handling midnight-UTC (date-only) values.
 * Midnight UTC shifts to wrong day in US timezones — this corrects it.
 */
export function parseFollowUpDueDate(dueDate: string | Date) {
  const d = new Date(dueDate);
  const isDateOnly = d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0;

  if (isDateOnly) {
    const corrected = new Date(d);
    corrected.setUTCHours(12);
    return {
      displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      displayTime: null as string | null,
      correctedTimestamp: corrected.toISOString(),
    };
  }

  return {
    displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    displayTime: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    correctedTimestamp: typeof dueDate === "string" ? dueDate : d.toISOString(),
  };
}
