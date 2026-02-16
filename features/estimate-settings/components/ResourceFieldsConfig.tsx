"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import type { EstimateBuilderSettings, EstimateResourceField } from "@/types/company";

interface Props {
  settings: EstimateBuilderSettings;
  onUpdate: (key: "resourceFields", value: EstimateResourceField[]) => void;
}

export function ResourceFieldsConfig({ settings, onUpdate }: Props) {
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const toggleField = (index: number) => {
    const updated = settings.resourceFields.map((f, i) =>
      i === index ? { ...f, enabled: !f.enabled } : f
    );
    onUpdate("resourceFields", updated);
  };

  const addCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const key = newFieldLabel.trim().toLowerCase().replace(/\s+/g, "_");
    const exists = settings.resourceFields.some((f) => f.key === key);
    if (exists) return;
    const newField: EstimateResourceField = {
      key,
      label: newFieldLabel.trim(),
      type: "number",
      enabled: true,
      isBuiltIn: false,
    };
    onUpdate("resourceFields", [...settings.resourceFields, newField]);
    setNewFieldLabel("");
  };

  const removeField = (index: number) => {
    const field = settings.resourceFields[index];
    if (field.isBuiltIn) return;
    onUpdate("resourceFields", settings.resourceFields.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <h3 className="font-medium">Resource Fields</h3>
      <p className="text-sm text-muted-foreground">Choose which resource fields appear on estimates</p>
      <div className="space-y-2">
        {settings.resourceFields.map((field, i) => (
          <div key={field.key} className="flex items-center gap-3 py-1.5">
            <Switch checked={field.enabled} onCheckedChange={() => toggleField(i)} />
            <span className="flex-1 text-sm">{field.label}</span>
            {!field.isBuiltIn && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => removeField(i)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Custom field name..."
          value={newFieldLabel}
          onChange={(e) => setNewFieldLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomField()}
          className="max-w-xs"
        />
        <Button variant="outline" size="sm" onClick={addCustomField} disabled={!newFieldLabel.trim()}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />Add
        </Button>
      </div>
    </div>
  );
}
