"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Loader2 } from "lucide-react";

interface GoalData {
  id: string;
  revenueTarget: number;
  bookingsTarget: number;
  estimatesTarget: number;
  callsTarget: number;
}

interface GoalFields {
  revenueTarget: number;
  bookingsTarget: number;
  estimatesTarget: number;
  callsTarget: number;
}

interface Props {
  teamMember: { id: string; name: string; role: string };
  goal: GoalData | undefined;
  isSaving: boolean;
  onSave: (teamMemberId: string, goalId: string | undefined, data: GoalFields) => Promise<{ success?: boolean; error?: string }>;
}

const DEFAULTS = { revenueTarget: 0, bookingsTarget: 0, estimatesTarget: 0, callsTarget: 0 };
const ROLE_LABELS: Record<string, string> = { admin: "Admin", office: "Office", technician: "Tech", sales: "Sales" };

export function GoalRow({ teamMember, goal, isSaving, onSave }: Props) {
  const init = goal ?? DEFAULTS;
  const [revenue, setRevenue] = useState(init.revenueTarget);
  const [bookings, setBookings] = useState(init.bookingsTarget);
  const [estimates, setEstimates] = useState(init.estimatesTarget);
  const [calls, setCalls] = useState(init.callsTarget);

  const isDirty = useMemo(() => {
    if (!goal) return revenue > 0 || bookings > 0 || estimates > 0 || calls > 0;
    return revenue !== goal.revenueTarget || bookings !== goal.bookingsTarget || estimates !== goal.estimatesTarget || calls !== goal.callsTarget;
  }, [goal, revenue, bookings, estimates, calls]);

  const handleSave = async () => {
    await onSave(teamMember.id, goal?.id, { revenueTarget: revenue, bookingsTarget: bookings, estimatesTarget: estimates, callsTarget: calls });
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{teamMember.name}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{ROLE_LABELS[teamMember.role] || teamMember.role}</Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 justify-end">
          <span className="text-sm text-muted-foreground">$</span>
          <Input type="number" min={0} value={revenue || ""} onChange={(e) => setRevenue(Number(e.target.value) || 0)} className="w-24 text-right h-8 text-sm" placeholder="0" />
        </div>
      </TableCell>
      <TableCell>
        <Input type="number" min={0} value={bookings || ""} onChange={(e) => setBookings(Number(e.target.value) || 0)} className="w-16 text-center h-8 text-sm mx-auto" placeholder="0" />
      </TableCell>
      <TableCell>
        <Input type="number" min={0} value={estimates || ""} onChange={(e) => setEstimates(Number(e.target.value) || 0)} className="w-16 text-center h-8 text-sm mx-auto" placeholder="0" />
      </TableCell>
      <TableCell>
        <Input type="number" min={0} value={calls || ""} onChange={(e) => setCalls(Number(e.target.value) || 0)} className="w-16 text-center h-8 text-sm mx-auto" placeholder="0" />
      </TableCell>
      <TableCell>
        <Button size="sm" variant={goal ? "outline" : "default"} disabled={!isDirty || isSaving} onClick={handleSave} className="gap-1 h-8">
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : goal ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {goal ? "Save" : "Set"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
