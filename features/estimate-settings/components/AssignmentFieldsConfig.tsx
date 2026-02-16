"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { EstimateBuilderSettings, EstimateAssignmentField } from "@/types/company";
import { defaultEstimateBuilderSettings } from "@/types/company";

interface Props {
  settings: EstimateBuilderSettings;
  onUpdate: (key: "assignmentFields", value: EstimateAssignmentField[]) => void;
}

export function AssignmentFieldsConfig({ settings, onUpdate }: Props) {
  const fields = settings.assignmentFields || defaultEstimateBuilderSettings.assignmentFields!;

  const toggle = (index: number) => {
    const updated = fields.map((f, i) => (i === index ? { ...f, enabled: !f.enabled } : f));
    onUpdate("assignmentFields", updated);
  };

  const rename = (index: number, label: string) => {
    const updated = fields.map((f, i) => (i === index ? { ...f, label } : f));
    onUpdate("assignmentFields", updated);
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <h3 className="font-medium">Assignment Fields</h3>
      <p className="text-sm text-muted-foreground">
        Toggle and rename the assignment fields shown on estimates
      </p>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div key={field.key} className="flex items-center gap-3 py-1.5">
            <Switch checked={field.enabled} onCheckedChange={() => toggle(i)} />
            <Input
              value={field.label}
              onChange={(e) => rename(i, e.target.value)}
              className="max-w-[180px] h-8 text-sm"
            />
            <span className="text-xs text-muted-foreground">({field.key})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
