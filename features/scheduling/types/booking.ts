export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'waitlisted'
  | 'declined'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface Booking {
  id: string;
  companyId: string;
  schedulingPageId: string | null;
  customerId: string | null;
  jobId: string | null;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  serviceTypeId: string | null;
  preferredDate: string;
  preferredTime: string;
  dateFlexibility: 'must_have' | 'flexible';
  preferredCrewId: string | null;
  assignedCrewId: string | null;
  assignedTeamMemberId: string | null;
  status: BookingStatus;
  confirmedDate: string | null;
  confirmedTime: string | null;
  durationMinutes: number;
  score: number | null;
  scoringExplanation: ScoringExplanation | null;
  paymentStatus: 'none' | 'pending' | 'paid' | 'refunded';
  paymentAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  serviceTypeId?: string;
  preferredDate: string;
  preferredTime: string;
  dateFlexibility?: 'must_have' | 'flexible';
  preferredCrewId?: string;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export interface BookingFlowState {
  step: 'service' | 'schedule' | 'form' | 'success';
  selectedServiceId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
}

export interface ScoringExplanation {
  mode: string;
  weights: { crew: number; location: number; workload: number };
  crewOverride: boolean;
  results: Array<{
    crewId: string;
    crewName: string;
    eligible: boolean;
    failReason?: string;
    crewPrefScore?: number;
    locationScore?: number;
    workloadScore?: number;
    totalScore?: number;
    rank?: number;
  }>;
  winnerId: string | null;
  winnerName: string | null;
  explanation: string;
}
