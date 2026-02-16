"use client";

import { useState } from "react";
import { Plus, UsersRound, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCrews } from "../hooks/useCrews";
import { CrewCard } from "./CrewCard";
import { CrewDialog } from "./CrewDialog";
import type { Crew } from "../types";

interface Props {
  initialCrews: Crew[];
  teamMembers?: { id: string; name: string; role: string }[];
}

export function CrewsManager({ initialCrews, teamMembers = [] }: Props) {
  const crewsHook = useCrews(initialCrews);
  const { crews } = crewsHook;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrew, setEditingCrew] = useState<Crew | null>(null);

  const assignedMemberIds = new Set(crews.flatMap((c) => c.members.map((m) => m.teamMemberId)));
  const unassigned = teamMembers.filter((tm) => !assignedMemberIds.has(tm.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Crews</h1>
          <p className="text-muted-foreground mt-1">Create crews and assign team members</p>
        </div>
        <Button onClick={() => { setEditingCrew(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Crew
        </Button>
      </div>

      <div className="flex gap-3 p-4 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
          <p className="font-medium">How Crews Work</p>
          <ul className="list-disc pl-4 space-y-1 text-blue-800 dark:text-blue-200">
            <li>Members added here are the <strong>permanent crew</strong> and automatically appear on today&apos;s and future schedules.</li>
            <li>On the dispatch board, you can remove a no-show or add a fill-in for <strong>that day only</strong> — it won&apos;t change the permanent crew.</li>
            <li>Any changes you make to the permanent crew here will take effect on <strong>future days</strong>, not on days that already have a roster set.</li>
            <li>Each day starts fresh with the permanent members unless you&apos;ve customized that day&apos;s roster.</li>
            <li>Past days are <strong>never backfilled</strong> — only the roster that was actually set for that day is shown.</li>
          </ul>
        </div>
      </div>

      {crews.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <UsersRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No crews created yet</p>
          <Button variant="outline" onClick={() => { setEditingCrew(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Crew
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {crews.map((crew) => (
            <CrewCard
              key={crew.id}
              crew={crew}
              teamMembers={teamMembers}
              onEdit={() => { setEditingCrew(crew); setIsDialogOpen(true); }}
              onDelete={() => crewsHook.deleteCrew(crew.id)}
              onAddMember={(tmId) => crewsHook.addMember(crew.id, tmId)}
              onRemoveMember={(tmId) => crewsHook.removeMember(crew.id, tmId)}
              onSetLead={(tmId) => crewsHook.updateCrew(crew.id, { leadMemberId: tmId })}
            />
          ))}
        </div>
      )}

      {unassigned.length > 0 && (
        <div className="border border-dashed rounded-lg p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Unassigned Members ({unassigned.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((tm) => (
              <span key={tm.id} className="text-sm bg-muted px-3 py-1 rounded-full">
                {tm.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <CrewDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingCrew={editingCrew}
        onSave={async (input) => {
          if (editingCrew) {
            await crewsHook.updateCrew(editingCrew.id, input);
          } else {
            await crewsHook.createCrew(input as { name: string; color: string });
          }
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
