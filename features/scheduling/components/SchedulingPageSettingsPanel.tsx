"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { SchedulingPageSettings, BusinessHours } from "../types";
import { DEFAULT_SCHEDULING_SETTINGS } from "../types";

interface Props {
  pageId: string;
  initialSettings: SchedulingPageSettings;
}

const DAYS: (keyof BusinessHours)[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

export function SchedulingPageSettingsPanel({ pageId, initialSettings }: Props) {
  const [settings, setSettings] = useState<SchedulingPageSettings>({
    ...DEFAULT_SCHEDULING_SETTINGS,
    ...initialSettings,
  });
  const [isSaving, setIsSaving] = useState(false);

  const update = (patch: Partial<SchedulingPageSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const updateHours = (day: keyof BusinessHours, patch: Partial<BusinessHours[keyof BusinessHours]>) =>
    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day], ...patch },
      },
    }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/scheduling/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Page Settings</h3>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Approval */}
      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <Label className="font-medium">Require Approval</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manually approve bookings before confirming
          </p>
        </div>
        <Switch checked={settings.requireApproval} onCheckedChange={(v) => update({ requireApproval: v })} />
      </div>

      {/* Team members */}
      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <Label className="font-medium">Show Team Members</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Let customers pick a team member
          </p>
        </div>
        <Switch checked={settings.showTeamMembers} onCheckedChange={(v) => update({ showTeamMembers: v })} />
      </div>

      {/* Success message */}
      <div className="space-y-2">
        <Label className="font-medium">Success Message</Label>
        <Textarea
          value={settings.successMessage}
          onChange={(e) => update({ successMessage: e.target.value })}
          rows={2}
          placeholder="Thank you! We'll confirm your appointment shortly."
        />
      </div>

      {/* Business hours */}
      <div className="space-y-3">
        <Label className="font-medium">Business Hours</Label>
        <div className="space-y-2">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3 text-sm">
              <Switch
                checked={settings.businessHours[day].enabled}
                onCheckedChange={(v) => updateHours(day, { enabled: v })}
              />
              <span className="w-24 capitalize">{day}</span>
              {settings.businessHours[day].enabled ? (
                <>
                  <Input
                    type="time"
                    value={settings.businessHours[day].start}
                    onChange={(e) => updateHours(day, { start: e.target.value })}
                    className="w-28 h-8 text-xs"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={settings.businessHours[day].end}
                    onChange={(e) => updateHours(day, { end: e.target.value })}
                    className="w-28 h-8 text-xs"
                  />
                </>
              ) : (
                <span className="text-muted-foreground text-xs">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
