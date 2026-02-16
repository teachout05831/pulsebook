"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { BusinessHours, BusinessHourSlot } from "../types";

const DAYS: { key: keyof BusinessHours; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

interface Props {
  hours: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}

export function BusinessHoursEditor({ hours, onChange }: Props) {
  const updateDay = (day: keyof BusinessHours, patch: Partial<BusinessHourSlot>) => {
    onChange({ ...hours, [day]: { ...hours[day], ...patch } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Business Hours</CardTitle>
        <CardDescription>Set your available hours for each day of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-[80px_40px_1fr_auto_1fr] gap-2 items-center text-xs font-medium text-muted-foreground px-1">
            <span>Day</span><span></span><span>Opens</span><span>to</span><span>Closes</span>
          </div>
          {DAYS.map(({ key, short }) => {
            const slot = hours[key];
            return (
              <div key={key} className="grid grid-cols-[80px_40px_1fr_auto_1fr] gap-2 items-center">
                <span className={`text-sm font-medium ${slot.enabled ? "" : "text-muted-foreground"}`}>{short}</span>
                <Switch checked={slot.enabled} onCheckedChange={v => updateDay(key, { enabled: v })} className="scale-75" />
                {slot.enabled ? (
                  <>
                    <Input type="time" value={slot.start} onChange={e => updateDay(key, { start: e.target.value })} className="h-8 text-sm" />
                    <span className="text-xs text-muted-foreground text-center">to</span>
                    <Input type="time" value={slot.end} onChange={e => updateDay(key, { end: e.target.value })} className="h-8 text-sm" />
                  </>
                ) : (
                  <span className="col-span-3 text-sm text-muted-foreground italic pl-2">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
