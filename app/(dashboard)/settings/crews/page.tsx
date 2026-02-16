import { getCrews } from "@/features/crews/queries/getCrews";
import { getTeamMembers } from "@/features/team-members/queries/getTeamMembers";
import { CrewsManager } from "@/features/crews";

export default async function CrewsPage() {
  const [{ crews, members: crewMembers }, teamMembers] = await Promise.all([
    getCrews(),
    getTeamMembers(),
  ]);

  // Build crew objects with members attached (snake→camel for server render)
  const crewsData = crews.map((c) => {
    const mems = crewMembers
      .filter((m) => m.crew_id === c.id)
      .map((m) => {
        const tm = (m as Record<string, unknown>).team_members as Record<string, string> | null;
        return {
          id: m.id,
          crewId: m.crew_id,
          teamMemberId: m.team_member_id,
          memberName: tm?.name || "Unknown",
          memberRole: tm?.role || "technician",
          isDefault: m.is_default,
        };
      });
    const lead = mems.find((m) => m.teamMemberId === c.lead_member_id);
    return {
      id: c.id, companyId: c.company_id, name: c.name, color: c.color,
      vehicleName: c.vehicle_name, leadMemberId: c.lead_member_id,
      leadMemberName: lead?.memberName || null, isActive: c.is_active,
      sortOrder: c.sort_order, members: mems, createdAt: c.created_at,
      updatedAt: c.updated_at,
    };
  });

  const tmList = teamMembers.map((tm) => ({
    id: tm.id, name: tm.name, role: tm.role,
  }));

  return <CrewsManager initialCrews={crewsData} teamMembers={tmList} />;
}
