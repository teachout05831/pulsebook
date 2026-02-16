// Hooks
export { useInteractions } from './hooks/useInteractions';

// Actions
export { createInteraction } from './actions/createInteraction';

// Types
export type {
  Interaction,
  InteractionType,
  InteractionDirection,
  InteractionOutcome,
  CreateInteractionInput,
} from './types';
export { INTERACTION_TYPE_LABELS, OUTCOME_LABELS } from './types';
