"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, Clock, Timer, Users, AlarmClock, UsersRound } from "lucide-react";
import type { JobDetail } from "@/types/job";
import type { TeamMemberOption } from "@/features/estimates/queries/getTeamMemberOptions";
import type { CrewOption } from "@/features/scheduling/components/ScheduleModal";
import { useArrivalWindows } from "@/features/arrival-windows";

interface Props {
  job: JobDetail;
  teamMembers: TeamMemberOption[];
  crews?: CrewOption[];
  onUpdate: (fields: Record<string, unknown>) => void;
}

function Row({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
      <span className="text-[11px] text-slate-400 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function JobInfoCard({ job, teamMembers, crews, onUpdate }: Props) {
  const { arrivalWindows } = useArrivalWindows();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[13px] font-semibold mb-2">Job Info</div>

        <Row icon={User} label="Customer">
          <Link href={`/customers/${job.customerId}`} className="text-[13px] text-blue-600 hover:underline truncate block">
            {job.customerName}
          </Link>
        </Row>

        <Row icon={Calendar} label="Date">
          <Input
            type="date"
            className="h-6 border-0 bg-transparent p-0 text-[13px] shadow-none"
            value={job.scheduledDate || ""}
            onChange={(e) => onUpdate({ scheduledDate: e.target.value })}
          />
        </Row>

        <Row icon={Clock} label="Time">
          <Input
            type="time"
            className="h-6 border-0 bg-transparent p-0 text-[13px] shadow-none"
            value={job.scheduledTime || ""}
            onChange={(e) => onUpdate({ scheduledTime: e.target.value })}
          />
        </Row>

        <Row icon={AlarmClock} label="Window">
          <Select value={job.arrivalWindow || "__none__"} onValueChange={(v) => onUpdate({ arrivalWindow: v === "__none__" ? null : v })}>
            <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-[13px] shadow-none w-full gap-1 [&>svg]:h-3 [&>svg]:w-3">
              <SelectValue placeholder="No window" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {arrivalWindows.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.label} ({w.startTime} - {w.endTime})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row icon={Timer} label="Duration">
          <div className="flex items-center gap-1">
            <Input
              type="number"
              className="h-6 w-16 border-0 bg-transparent p-0 text-[13px] shadow-none text-right"
              value={job.estimatedDuration || ""}
              onChange={(e) => onUpdate({ estimatedDuration: e.target.value ? parseInt(e.target.value, 10) : null })}
              placeholder="—"
            />
            <span className="text-[11px] text-slate-400">min</span>
          </div>
        </Row>

        {crews && crews.length > 0 && (
          <Row icon={UsersRound} label="Crew">
            <Select value={job.assignedCrewId || "__none__"} onValueChange={(v) => onUpdate({ assignedCrewId: v === "__none__" ? null : v })}>
              <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-[13px] shadow-none w-full gap-1 [&>svg]:h-3 [&>svg]:w-3">
                <SelectValue placeholder="No crew" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No crew</SelectItem>
                {crews.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
        )}

        <Row icon={Users} label="Assigned To">
          <Select value={job.assignedTo || "__none__"} onValueChange={(v) => onUpdate({ assignedTo: v === "__none__" ? null : v })}>
            <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-[13px] shadow-none w-full gap-1 [&>svg]:h-3 [&>svg]:w-3">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Unassigned</SelectItem>
              {teamMembers.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {job.tags.map((tag) => (
              <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
