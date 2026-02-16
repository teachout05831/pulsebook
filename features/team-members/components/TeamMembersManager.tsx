'use client';

import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { TeamMembersTable } from './TeamMembersTable';
import { TeamMemberDialog } from './TeamMemberDialog';
import { TeamMemberDeleteDialog } from './TeamMemberDeleteDialog';
import type { TeamMember } from '../types';

interface Props {
  initialMembers: TeamMember[];
}

export function TeamMembersManager({ initialMembers }: Props) {
  const teamMembersHook = useTeamMembers(initialMembers);
  const { members, handleOpenAdd } = teamMembersHook;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage your team and assign roles</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No team members added yet</p>
          <Button variant="outline" onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Team Member
          </Button>
        </div>
      ) : (
        <TeamMembersTable {...teamMembersHook} />
      )}

      <TeamMemberDialog {...teamMembersHook} />
      <TeamMemberDeleteDialog {...teamMembersHook} />
    </div>
  );
}
