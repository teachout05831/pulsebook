// Crew Management Types
// All camelCase — snake_case↔camelCase conversion happens in API routes only

export interface Crew {
  id: string;
  companyId: string;
  name: string;
  color: string;
  vehicleName: string | null;
  leadMemberId: string | null;
  leadMemberName: string | null;
  isActive: boolean;
  sortOrder: number;
  members: CrewMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CrewMember {
  id: string;
  crewId: string;
  teamMemberId: string;
  memberName: string;
  memberRole: string;
  isDefault: boolean;
}

export interface DailyRosterEntry {
  id: string;
  crewId: string;
  rosterDate: string;
  teamMemberId: string;
  memberName: string;
  isPresent: boolean;
  isFillIn: boolean;
}

export interface DispatchLog {
  id: string;
  companyId: string;
  dispatchDate: string;
  dispatchedAt: string;
  dispatchedBy: string;
  notes: string | null;
}

export interface CrewManagementSettings {
  assignmentMode: "individual" | "crew" | "both";
  rosterType: "flexible" | "fixed";
  autoSyncMembers: boolean;
  showDailyRosterPrompt: boolean;
  allowMultiCrewMembers: boolean;
  requireCrewLead: boolean;
}

export const defaultCrewManagementSettings: CrewManagementSettings = {
  assignmentMode: "individual",
  rosterType: "fixed",
  autoSyncMembers: true,
  showDailyRosterPrompt: true,
  allowMultiCrewMembers: true,
  requireCrewLead: false,
};

export interface CreateCrewInput {
  name: string;
  color?: string;
  vehicleName?: string;
  leadMemberId?: string;
}

export interface UpdateCrewInput {
  name?: string;
  color?: string;
  vehicleName?: string;
  leadMemberId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}
