"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";
import { useSalesGoalsManager } from "../hooks/useSalesGoalsManager";
import { MonthPicker } from "./MonthPicker";
import { GoalRow } from "./GoalRow";

interface Props {
  teamMembers: { id: string; name: string; role: string }[];
}

export function SalesGoalsManager({ teamMembers }: Props) {
  const h = useSalesGoalsManager(teamMembers);

  const rows = teamMembers.map((tm) => {
    const goal = h.goals.find((g) => g.teamMemberId === tm.id);
    return { teamMember: tm, goal };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />Sales Goals
        </h2>
        <p className="text-sm text-muted-foreground">Set monthly number targets for each team member</p>
      </div>

      <MonthPicker year={h.year} month={h.month} onNavigate={h.navigateMonth} />

      {h.isLoading ? (
        <TableSkeleton rows={teamMembers.length || 3} />
      ) : teamMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Target className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No active team members found. Add team members in Settings first.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Team Member</TableHead>
                <TableHead className="text-right">Revenue Target</TableHead>
                <TableHead className="text-center">Bookings</TableHead>
                <TableHead className="text-center">Estimates</TableHead>
                <TableHead className="text-center">Calls</TableHead>
                <TableHead className="w-[90px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ teamMember, goal }) => (
                <GoalRow key={teamMember.id} teamMember={teamMember} goal={goal} isSaving={h.isSaving} onSave={h.saveGoal} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="rounded-md border">
      <div className="border-b p-3 flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 flex-1" />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b last:border-0 p-3 flex gap-4">
          {Array.from({ length: 6 }).map((_, j) => <Skeleton key={j} className="h-8 flex-1" />)}
        </div>
      ))}
    </div>
  );
}
