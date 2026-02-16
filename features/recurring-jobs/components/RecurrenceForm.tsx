"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { RecurrenceConfig, RecurrenceFrequency } from "@/types";
import { FREQUENCY_LABELS, DAY_LABELS } from "../types";
import type { EndCondition } from "../types";

interface Props {
  isRecurring: boolean;
  onIsRecurringChange: (value: boolean) => void;
  config: RecurrenceConfig;
  onFrequencyChange: (freq: RecurrenceFrequency) => void;
  onToggleDay: (day: number) => void;
  onFieldChange: <K extends keyof RecurrenceConfig>(
    key: K,
    value: RecurrenceConfig[K]
  ) => void;
}

function getEndCondition(config: RecurrenceConfig): EndCondition {
  if (config.endDate) return "date";
  if (config.occurrences) return "occurrences";
  return "never";
}

const showDays = (freq: RecurrenceFrequency) =>
  freq === "weekly" || freq === "biweekly";

export function RecurrenceForm({
  isRecurring,
  onIsRecurringChange,
  config,
  onFrequencyChange,
  onToggleDay,
  onFieldChange,
}: Props) {
  const endCondition = getEndCondition(config);

  const handleEndConditionChange = (value: EndCondition) => {
    if (value === "date") {
      onFieldChange("occurrences", null);
      onFieldChange("endDate", config.endDate || "");
    } else if (value === "occurrences") {
      onFieldChange("endDate", null);
      onFieldChange("occurrences", config.occurrences || 10);
    } else {
      onFieldChange("endDate", null);
      onFieldChange("occurrences", null);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="is-recurring"
          checked={isRecurring}
          onCheckedChange={(checked) => onIsRecurringChange(checked === true)}
        />
        <Label htmlFor="is-recurring" className="font-medium">
          Make this a recurring job
        </Label>
      </div>

      {isRecurring && (
        <div className="space-y-4 pl-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={config.frequency} onValueChange={(v) => onFrequencyChange(v as RecurrenceFrequency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={config.startDate}
                onChange={(e) => onFieldChange("startDate", e.target.value)}
              />
            </div>
          </div>

          {showDays(config.frequency) && (
            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="flex gap-1">
                {DAY_LABELS.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={config.daysOfWeek.includes(value) ? "default" : "outline"}
                    className="h-8 w-10 px-0"
                    onClick={() => onToggleDay(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Ends</Label>
              <Select value={endCondition} onValueChange={(v) => handleEndConditionChange(v as EndCondition)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="date">On Date</SelectItem>
                  <SelectItem value="occurrences">After # Jobs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {endCondition === "date" && (
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={config.endDate || ""}
                  onChange={(e) => onFieldChange("endDate", e.target.value || null)}
                />
              </div>
            )}

            {endCondition === "occurrences" && (
              <div className="space-y-2">
                <Label>Number of Jobs</Label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={config.occurrences || ""}
                  onChange={(e) => onFieldChange("occurrences", parseInt(e.target.value, 10) || null)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
