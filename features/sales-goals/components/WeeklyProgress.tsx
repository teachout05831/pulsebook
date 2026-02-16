"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, Target, FileText, Phone, DollarSign, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WeeklyGoal } from "../types/weekly";
import type { TodayStats } from "../types";

interface WeeklyActuals {
  bookings: number;
  estimates: number;
  calls: number;
  revenue: number;
}

interface Props {
  weeklyGoal: WeeklyGoal;
  weekStart: string;
  weekEnd: string;
  actuals: WeeklyActuals;
  onEdit: () => void;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}`;
}

function MiniProgress({ label, icon: Icon, achieved, target, color }: { label: string; icon: typeof Target; achieved: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min((achieved / target) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className={cn("h-3.5 w-3.5", color)} />{label}</span>
        <span className="font-medium">{achieved} / {target}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", pct >= 100 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-slate-300")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function WeeklyProgressCard({ weeklyGoal, weekStart, weekEnd, actuals, onEdit }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4" />This Week
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatDateRange(weekStart, weekEnd)}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}><Pencil className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <MiniProgress label="Bookings" icon={Target} achieved={actuals.bookings} target={weeklyGoal.bookingsTarget} color="text-green-600" />
        <MiniProgress label="Estimates" icon={FileText} achieved={actuals.estimates} target={weeklyGoal.estimatesTarget} color="text-purple-600" />
        <MiniProgress label="Calls" icon={Phone} achieved={actuals.calls} target={weeklyGoal.callsTarget} color="text-blue-600" />
        <MiniProgress label="Revenue" icon={DollarSign} achieved={actuals.revenue} target={weeklyGoal.revenueTarget} color="text-emerald-600" />
        {weeklyGoal.notes && (
          <p className="text-xs text-muted-foreground italic border-t pt-2">{weeklyGoal.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
