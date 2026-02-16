import { getTeamMembers } from '@/features/team-members/queries/getTeamMembers';
import { TeamMembersManager } from '@/features/team-members';

export default async function TeamMembersPage() {
  const members = await getTeamMembers();

  return <TeamMembersManager initialMembers={members} />;
}
