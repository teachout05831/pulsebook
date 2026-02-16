"use client";

import { useState } from "react";
import { MapPin, Users, Scale, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { BusinessHours } from "../types";
import type { PriorityMode, TeamMode, UpdateSchedulingConfigInput } from "../types";

const MODES: Array<{ id: PriorityMode; icon: typeof MapPin; label: string; desc: string; tag: string }> = [
  { id: "location_first", icon: MapPin, label: "Location First", desc: "Minimize drive time. Best for HVAC, plumbing, pest control.", tag: "Most popular" },
  { id: "crew_first", icon: Users, label: "Crew Focused", desc: "Prioritize crew relationships. Best for cleaning, lawn care.", tag: "" },
  { id: "balanced", icon: Scale, label: "Balanced", desc: "Equal weight to location and crew. Best for handyman, general.", tag: "Advanced" },
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

interface Props { onComplete: (input: UpdateSchedulingConfigInput) => Promise<void> }

export function SchedulingSetupWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<PriorityMode>("balanced");
  const [teamMode, setTeamMode] = useState<TeamMode>("crew_based");
  const [crewsPerDay, setCrewsPerDay] = useState(3);
  const [maxJobsPerCrew, setMaxJobsPerCrew] = useState(6);
  const [businessHours] = useState<BusinessHours>({
    monday: { enabled: true, start: "08:00", end: "17:00" }, tuesday: { enabled: true, start: "08:00", end: "17:00" },
    wednesday: { enabled: true, start: "08:00", end: "17:00" }, thursday: { enabled: true, start: "08:00", end: "17:00" },
    friday: { enabled: true, start: "08:00", end: "17:00" }, saturday: { enabled: true, start: "09:00", end: "13:00" },
    sunday: { enabled: false, start: "09:00", end: "13:00" },
  });
  const [bufferMinutes, setBufferMinutes] = useState(30);
  const [minNoticeHours, setMinNoticeHours] = useState(24);
  const [bookingWindowDays, setBookingWindowDays] = useState(28);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [saving, setSaving] = useState(false);
  const capacity = crewsPerDay * maxJobsPerCrew;

  const finish = async () => {
    setSaving(true);
    try {
      await onComplete({ priorityMode: mode, teamMode, crewsPerDay, maxJobsPerCrew, bufferMinutes, minNoticeHours, bookingWindowDays, autoConfirm, businessHours });
      toast.success("Scheduling configured!");
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center gap-4 mb-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? "text-primary" : "text-muted-foreground"}`}>
                {["Priority Mode", "Capacity", "Hours & Rules"][i]}
              </span>
              {i < 2 && <div className={`w-10 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
        <CardTitle>{["How should we schedule your jobs?", "How does your team work?", "Set your availability rules"][step]}</CardTitle>
        <CardDescription>{["Pick the mode that matches your business.", "This determines daily capacity.", "When can customers book?"][step]}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="grid grid-cols-3 gap-3">
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} className={`p-4 rounded-lg border-2 text-center transition-all ${mode === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <m.icon className={`h-8 w-8 mx-auto mb-2 ${mode === m.id ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-semibold text-sm">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
              </button>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setTeamMode("crew_based")} className={`p-4 rounded-lg border-2 text-center ${teamMode === "crew_based" ? "border-primary bg-primary/5" : "border-border"}`}>
                <p className="font-semibold">Crew-Based</p>
                <p className="text-xs text-muted-foreground mt-1">Set crews run each day</p>
              </button>
              <button onClick={() => setTeamMode("technician_based")} className={`p-4 rounded-lg border-2 text-center ${teamMode === "technician_based" ? "border-primary bg-primary/5" : "border-border"}`}>
                <p className="font-semibold">Technician-Based</p>
                <p className="text-xs text-muted-foreground mt-1">Individual tech schedules</p>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Crews per day</Label><Input type="number" value={crewsPerDay} onChange={e => setCrewsPerDay(+e.target.value || 1)} min={1} max={20} /></div>
              <div><Label>Max jobs per crew</Label><Input type="number" value={maxJobsPerCrew} onChange={e => setMaxJobsPerCrew(+e.target.value || 1)} min={1} max={20} /></div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <p className="text-sm font-semibold text-green-800">Daily Capacity: {crewsPerDay} crews x {maxJobsPerCrew} jobs = <strong>{capacity} jobs/day</strong></p>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Minimum notice</Label>
                <Select value={String(minNoticeHours)} onValueChange={v => setMinNoticeHours(+v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="0">Same day</SelectItem><SelectItem value="24">24 hours</SelectItem><SelectItem value="48">48 hours</SelectItem></SelectContent>
                </Select></div>
              <div><Label>Booking window</Label>
                <Select value={String(bookingWindowDays)} onValueChange={v => setBookingWindowDays(+v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="14">2 weeks</SelectItem><SelectItem value="28">4 weeks</SelectItem><SelectItem value="56">8 weeks</SelectItem></SelectContent>
                </Select></div>
              <div><Label>Buffer between jobs</Label>
                <Select value={String(bufferMinutes)} onValueChange={v => setBufferMinutes(+v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="15">15 min</SelectItem><SelectItem value="30">30 min</SelectItem><SelectItem value="45">45 min</SelectItem><SelectItem value="60">1 hour</SelectItem></SelectContent>
                </Select></div>
              <div className="flex items-center justify-between gap-2 pt-5">
                <Label>Auto-confirm bookings</Label><Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}><ChevronLeft className="h-4 w-4 mr-1" />Back</Button>
          {step < 2 ? (
            <Button onClick={() => setStep(s => s + 1)}>Continue<ChevronRight className="h-4 w-4 ml-1" /></Button>
          ) : (
            <Button onClick={finish} disabled={saving}><Check className="h-4 w-4 mr-1" />{saving ? "Saving..." : "Finish Setup"}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
