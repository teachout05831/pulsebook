"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { BookingCalendar } from "./sections/BookingCalendar";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { useAvailability } from "../hooks/useAvailability";
import { useScheduleJob } from "../hooks/useScheduleJob";
import type { TeamMemberOption } from "@/features/estimates/queries/getTeamMemberOptions";

export interface CrewOption { id: string; name: string }

interface Props {
  open: boolean;
  onClose: () => void;
  jobId: string;
  currentDate?: string;
  currentTime?: string | null;
  currentAssignedTo?: string | null;
  currentAssignedCrewId?: string | null;
  teamMembers: TeamMemberOption[];
  crews?: CrewOption[];
  onScheduled: (data: { scheduledDate: string; scheduledTime: string; assignedTo: string | null; assignedCrewId: string | null }) => void;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toAssignee(assignedTo?: string | null, crewId?: string | null): string {
  if (crewId) return `crew:${crewId}`;
  if (assignedTo) return `member:${assignedTo}`;
  return "";
}

export function ScheduleModal({ open, onClose, jobId, currentDate, currentTime, currentAssignedTo, currentAssignedCrewId, teamMembers, crews, onScheduled }: Props) {
  const [selectedDate, setSelectedDate] = useState(currentDate || todayStr());
  const [selectedTime, setSelectedTime] = useState<string | null>(currentTime || null);
  const [assignee, setAssignee] = useState(() => toAssignee(currentAssignedTo, currentAssignedCrewId));
  const { data, isLoading, fetchSlots } = useAvailability();
  const { isScheduling, scheduleJob } = useScheduleJob();

  useEffect(() => {
    if (open) {
      setSelectedDate(currentDate || todayStr());
      setSelectedTime(currentTime || null);
      setAssignee(toAssignee(currentAssignedTo, currentAssignedCrewId));
    }
  }, [open, currentDate, currentTime, currentAssignedTo, currentAssignedCrewId]);

  useEffect(() => { if (open && selectedDate) fetchSlots(selectedDate); }, [open, selectedDate, fetchSlots]);

  const handleDateSelect = useCallback((date: string) => { setSelectedDate(date); setSelectedTime(null); }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedDate || !selectedTime) return;
    const isCrew = assignee.startsWith("crew:");
    const assignedTo = isCrew ? null : (assignee.replace("member:", "") || null);
    const assignedCrewId = isCrew ? assignee.replace("crew:", "") : null;
    const result = await scheduleJob(jobId, { scheduledDate: selectedDate, scheduledTime: selectedTime, assignedTo, assignedCrewId });
    if ("success" in result) {
      onScheduled({ scheduledDate: selectedDate, scheduledTime: selectedTime, assignedTo, assignedCrewId });
      onClose();
    }
  }, [jobId, selectedDate, selectedTime, assignee, scheduleJob, onScheduled, onClose]);

  const hasCrews = crews && crews.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Schedule Job</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[220px_1fr] gap-4 min-h-[300px]">
          <div><BookingCalendar selectedDate={selectedDate} onSelectDate={handleDateSelect} /></div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Available Times</label>
              <TimeSlotPicker slots={data?.slots || []} selectedTime={selectedTime} onSelect={setSelectedTime} isLoading={isLoading} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Assign To</label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select crew or team member..." /></SelectTrigger>
                <SelectContent>
                  {hasCrews && (
                    <SelectGroup>
                      <SelectLabel>Crews</SelectLabel>
                      {crews.map((c) => <SelectItem key={c.id} value={`crew:${c.id}`}>{c.name}</SelectItem>)}
                    </SelectGroup>
                  )}
                  <SelectGroup>
                    <SelectLabel>Team Members</SelectLabel>
                    {teamMembers.map((m) => <SelectItem key={m.id} value={`member:${m.id}`}>{m.name}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {data?.capacity && (
              <p className="text-xs text-muted-foreground">
                Capacity: {data.capacity.used}/{data.capacity.total} booked
                <span className={`ml-2 inline-block w-2 h-2 rounded-full ${data.capacity.status === "green" ? "bg-green-500" : data.capacity.status === "yellow" ? "bg-yellow-500" : "bg-red-500"}`} />
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedDate || !selectedTime || isScheduling}>
            {isScheduling ? "Scheduling..." : "Confirm Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
