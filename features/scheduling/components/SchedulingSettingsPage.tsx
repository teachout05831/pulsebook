"use client";

import { useState, useEffect } from "react";
import { Settings, MapPin, Users, Scale, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSchedulingConfig } from "../hooks/useSchedulingConfig";
import { BusinessHoursEditor } from "./BusinessHoursEditor";
import type { PriorityMode } from "../types";
import { DEFAULT_BUSINESS_HOURS, type BusinessHours } from "../types";

const MODE_META: Record<PriorityMode, { icon: typeof MapPin; label: string; weights: { crew: number; location: number; workload: number } }> = {
  location_first: { icon: MapPin, label: "Location First", weights: { crew: 0.15, location: 0.60, workload: 0.25 } },
  crew_first: { icon: Users, label: "Crew Focused", weights: { crew: 0.55, location: 0.25, workload: 0.20 } },
  balanced: { icon: Scale, label: "Balanced", weights: { crew: 0.40, location: 0.35, workload: 0.25 } },
};

export function SchedulingSettingsPage() {
  const { config, isLoading, updateConfig } = useSchedulingConfig();
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<PriorityMode>("balanced");
  const [crewsPerDay, setCrewsPerDay] = useState(3);
  const [maxJobsPerCrew, setMaxJobsPerCrew] = useState(6);
  const [bufferMinutes, setBufferMinutes] = useState(30);
  const [defaultDurationMin, setDefaultDurationMin] = useState(60);
  const [minNoticeHours, setMinNoticeHours] = useState(24);
  const [bookingWindowDays, setBookingWindowDays] = useState(28);
  const [timeSlotMode, setTimeSlotMode] = useState("exact");
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [waitlistEnabled, setWaitlistEnabled] = useState(true);
  const [crewOverrideEnabled, setCrewOverrideEnabled] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(DEFAULT_BUSINESS_HOURS);

  useEffect(() => {
    if (!config) return;
    setMode(config.priorityMode);
    setCrewsPerDay(config.crewsPerDay);
    setMaxJobsPerCrew(config.maxJobsPerCrew);
    setBufferMinutes(config.bufferMinutes);
    setDefaultDurationMin(config.defaultDurationMin);
    setMinNoticeHours(config.minNoticeHours);
    setBookingWindowDays(config.bookingWindowDays);
    setTimeSlotMode(config.timeSlotMode);
    setAutoConfirm(config.autoConfirm);
    setWaitlistEnabled(config.waitlistEnabled);
    setCrewOverrideEnabled(config.crewOverrideEnabled);
    if (config.businessHours) setBusinessHours(config.businessHours);
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    const weights = MODE_META[mode].weights;
    const result = await updateConfig({ priorityMode: mode, priorityWeights: weights, crewsPerDay, maxJobsPerCrew, bufferMinutes, defaultDurationMin, minNoticeHours, bookingWindowDays, timeSlotMode: timeSlotMode as "exact" | "window", autoConfirm, waitlistEnabled, crewOverrideEnabled, businessHours });
    if (result.error) toast.error(result.error);
    else toast.success("Settings saved");
    setSaving(false);
  };

  if (isLoading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  const weights = MODE_META[mode].weights;
  const capacity = crewsPerDay * maxJobsPerCrew;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold flex items-center gap-2"><Settings className="h-5 w-5" />Scheduling Settings</h2>
          <p className="text-sm text-muted-foreground">Configure how the scheduling engine assigns crews and calculates availability.</p></div>
        <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" />{saving ? "Saving..." : "Save Changes"}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Priority Mode</CardTitle><CardDescription>How should the engine rank crew assignments?</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(Object.entries(MODE_META) as [PriorityMode, typeof MODE_META["balanced"]][]).map(([id, m]) => (
              <button key={id} onClick={() => setMode(id)} className={`p-3 rounded-lg border-2 text-left transition-all ${mode === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <div className="flex items-center gap-2"><m.icon className="h-4 w-4" /><span className="font-semibold text-sm">{m.label}</span></div>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {[{ label: "Crew Match", value: weights.crew, color: "bg-green-500" }, { label: "Location", value: weights.location, color: "bg-blue-500" }, { label: "Workload", value: weights.workload, color: "bg-amber-500" }].map(w => (
              <div key={w.label} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20">{w.label}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.value * 100}%` }} /></div>
                <span className="text-xs font-bold w-10 text-right">{Math.round(w.value * 100)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Capacity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Crews per day</Label><Input type="number" value={crewsPerDay} onChange={e => setCrewsPerDay(+e.target.value || 1)} min={1} /></div>
            <div><Label>Max jobs per crew</Label><Input type="number" value={maxJobsPerCrew} onChange={e => setMaxJobsPerCrew(+e.target.value || 1)} min={1} /></div>
            <Badge variant="outline" className="text-xs">Daily capacity: {capacity} jobs</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Booking Rules</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Buffer between jobs</Label>
              <Select value={String(bufferMinutes)} onValueChange={v => setBufferMinutes(+v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="15">15 min</SelectItem><SelectItem value="30">30 min</SelectItem><SelectItem value="45">45 min</SelectItem><SelectItem value="60">1 hour</SelectItem></SelectContent></Select></div>
            <div><Label>Default duration</Label>
              <Select value={String(defaultDurationMin)} onValueChange={v => setDefaultDurationMin(+v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="30">30 min</SelectItem><SelectItem value="60">1 hour</SelectItem><SelectItem value="90">90 min</SelectItem><SelectItem value="120">2 hours</SelectItem></SelectContent></Select></div>
            <div><Label>Minimum notice</Label>
              <Select value={String(minNoticeHours)} onValueChange={v => setMinNoticeHours(+v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="0">Same day</SelectItem><SelectItem value="24">24 hours</SelectItem><SelectItem value="48">48 hours</SelectItem><SelectItem value="72">72 hours</SelectItem></SelectContent></Select></div>
            <div><Label>Booking window</Label>
              <Select value={String(bookingWindowDays)} onValueChange={v => setBookingWindowDays(+v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="14">2 weeks</SelectItem><SelectItem value="28">4 weeks</SelectItem><SelectItem value="56">8 weeks</SelectItem><SelectItem value="90">3 months</SelectItem></SelectContent></Select></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Toggles</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between"><div><Label>Auto-confirm bookings</Label><p className="text-xs text-muted-foreground">Instantly confirm, or require office review?</p></div><Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} /></div>
          <div className="flex items-center justify-between"><div><Label>Enable waitlist</Label><p className="text-xs text-muted-foreground">Let customers request full dates</p></div><Switch checked={waitlistEnabled} onCheckedChange={setWaitlistEnabled} /></div>
          <div className="flex items-center justify-between"><div><Label>Crew override</Label><p className="text-xs text-muted-foreground">Bypass scoring when preferred crew is set</p></div><Switch checked={crewOverrideEnabled} onCheckedChange={setCrewOverrideEnabled} /></div>
          <div className="flex items-center justify-between"><div><Label>Time slot mode</Label><p className="text-xs text-muted-foreground">Exact times or broad windows</p></div>
            <Select value={timeSlotMode} onValueChange={setTimeSlotMode}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="exact">Exact times</SelectItem><SelectItem value="window">Time windows</SelectItem></SelectContent></Select></div>
        </CardContent>
      </Card>

      <BusinessHoursEditor hours={businessHours} onChange={setBusinessHours} />
    </div>
  );
}
