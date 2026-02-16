export type InteractionType = 'call' | 'text' | 'email' | 'meeting' | 'note';
export type InteractionDirection = 'inbound' | 'outbound';
export type InteractionOutcome = 'positive' | 'neutral' | 'no_answer' | 'follow_up_needed';

export interface Interaction {
  id: string;
  companyId: string;
  customerId: string;
  type: InteractionType;
  direction: InteractionDirection | null;
  subject: string | null;
  details: string | null;
  outcome: InteractionOutcome | null;
  durationSeconds: number | null;
  performedBy: string | null;
  performedByName: string | null;
  createdAt: string;
}

export interface CreateInteractionInput {
  customerId: string;
  type: InteractionType;
  direction?: InteractionDirection;
  subject?: string;
  details?: string;
  outcome?: InteractionOutcome;
  durationSeconds?: number;
}

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  call: 'Phone Call',
  text: 'Text Message',
  email: 'Email',
  meeting: 'Meeting',
  note: 'Note',
};

export const OUTCOME_LABELS: Record<InteractionOutcome, string> = {
  positive: 'Positive',
  neutral: 'Neutral',
  no_answer: 'No Answer',
  follow_up_needed: 'Needs Follow-up',
};
