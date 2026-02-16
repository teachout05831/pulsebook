export type TeamMemberRole = "admin" | "technician" | "office";

export interface TeamMember {
  id: string;
  companyId: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  role: TeamMemberRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  phone?: string;
  role: TeamMemberRole;
}

export interface UpdateTeamMemberInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: TeamMemberRole;
  isActive?: boolean;
}
