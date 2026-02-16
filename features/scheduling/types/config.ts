import type { BusinessHours } from '../types';

export type PriorityMode = 'location_first' | 'crew_first' | 'balanced';
export type TeamMode = 'crew_based' | 'technician_based';
export type TimeSlotMode = 'exact' | 'window';
export type ZoneEnforcement = 'soft' | 'strict' | 'off';

export interface PriorityWeights {
  crew: number;
  location: number;
  workload: number;
}

export interface SchedulingConfig {
  id: string;
  companyId: string;
  priorityMode: PriorityMode;
  priorityWeights: PriorityWeights;
  teamMode: TeamMode;
  crewsPerDay: number;
  maxJobsPerCrew: number;
  bufferMinutes: number;
  defaultDurationMin: number;
  bookingWindowDays: number;
  minNoticeHours: number;
  timeSlotMode: TimeSlotMode;
  autoConfirm: boolean;
  waitlistEnabled: boolean;
  crewOverrideEnabled: boolean;
  zoneEnforcement: ZoneEnforcement;
  paymentRequired: boolean;
  paymentType: 'deposit_flat' | 'deposit_pct' | 'full';
  depositAmount: number;
  cancellationHours: number;
  businessHours: BusinessHours;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSchedulingConfigInput {
  priorityMode?: PriorityMode;
  priorityWeights?: PriorityWeights;
  teamMode?: TeamMode;
  crewsPerDay?: number;
  maxJobsPerCrew?: number;
  bufferMinutes?: number;
  defaultDurationMin?: number;
  bookingWindowDays?: number;
  minNoticeHours?: number;
  timeSlotMode?: TimeSlotMode;
  autoConfirm?: boolean;
  waitlistEnabled?: boolean;
  crewOverrideEnabled?: boolean;
  zoneEnforcement?: ZoneEnforcement;
  paymentRequired?: boolean;
  paymentType?: 'deposit_flat' | 'deposit_pct' | 'full';
  depositAmount?: number;
  cancellationHours?: number;
  businessHours?: BusinessHours;
}
