"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Loader2 } from "lucide-react";
import type { CreateWeeklyGoalInput, WeeklyGoal } from "../types/weekly";
import type { SalesGoal } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekStart: string;
  weekEnd: string;
  existingGoal: WeeklyGoal | null;
  monthlyGoal: SalesGoal | null;
  isSaving: boolean;
  onSave: (input: CreateWeeklyGoalInput) => Promise<{ success?: boolean; error?: string }>;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

export function WeeklyGoalSetter({ open, onOpenChange, weekStart, weekEnd, existingGoal, monthlyGoal, isSaving, onSave }: Props) {
  const defaults = existingGoal ?? {
    bookingsTarget: monthlyGoal ? Math.ceil(monthlyGoal.bookingsTarget / 4) : 0,
    estimatesTarget: monthlyGoal ? Math.ceil(monthlyGoal.estimatesTarget / 4) : 0,
    callsTarget: monthlyGoal ? Math.ceil(monthlyGoal.callsTarget / 4) : 0,
    revenueTarget: monthlyGoal ? Math.round(monthlyGoal.revenueTarget / 4) : 0,
  };

  const [bookings, setBookings] = useState(defaults.bookingsTarget);
  const [estimates, setEstimates] = useState(defaults.estimatesTarget);
  const [calls, setCalls] = useState(defaults.callsTarget);
  const [revenue, setRevenue] = useState(defaults.revenueTarget);
  const [notes, setNotes] = useState(existingGoal?.notes || "");

  const handleSave = async () => {
    const result = await onSave({ weekStart, bookingsTarget: bookings, estimatesTarget: estimates, callsTarget: calls, revenueTarget: revenue, notes: notes || undefined });
    if (result.success) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {existingGoal ? "Update Weekly Goals" : "Set Your Goals for This Week"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{formatDateRange(weekStart, weekEnd)}</p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Bookings Target</Label>
              <Input type="number" min={0} value={bookings || ""} onChange={(e) => setBookings(Number(e.target.value) || 0)} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Estimates to Send</Label>
              <Input type="number" min={0} value={estimates || ""} onChange={(e) => setEstimates(Number(e.target.value) || 0)} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Calls to Make</Label>
              <Input type="number" min={0} value={calls || ""} onChange={(e) => setCalls(Number(e.target.value) || 0)} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Revenue Target</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" min={0} value={revenue || ""} onChange={(e) => setRevenue(Number(e.target.value) || 0)} className="pl-7" />
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm">Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Focus areas for this week..." className="mt-1 h-16 resize-none" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-1">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {existingGoal ? "Update Goals" : "Set Goals"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
