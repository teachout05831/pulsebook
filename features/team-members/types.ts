import type { TeamMember, TeamMemberRole } from '@/types';

export type { TeamMember, TeamMemberRole };

export interface TeamMemberFormData {
  name: string;
  email: string;
  phone: string;
  role: TeamMemberRole;
}

export interface CreateTeamMemberInput extends TeamMemberFormData {}

export interface UpdateTeamMemberInput extends Partial<TeamMemberFormData> {}
