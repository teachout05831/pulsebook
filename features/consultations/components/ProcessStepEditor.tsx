"use client";

import { Plus, Trash2, ArrowUp, ArrowDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProcessStep } from "./CallWidgetBar";

interface ProcessStepEditorProps {
  steps: ProcessStep[];
  onChange: (steps: ProcessStep[]) => void;
}

const MAX_STEPS = 10;

export function ProcessStepEditor({ steps, onChange }: ProcessStepEditorProps) {
  const handleAdd = () => {
    if (steps.length >= MAX_STEPS) return;
    onChange([...steps, { title: "", description: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof ProcessStep, value: string) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: value || undefined };
    onChange(next);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Process Steps</Label>
        <span className="text-xs text-muted-foreground">{steps.length}/{MAX_STEPS}</span>
      </div>

      {steps.length === 0 && (
        <p className="text-xs text-muted-foreground py-4 text-center">No steps yet. Add your first step below.</p>
      )}

      {steps.map((step, i) => (
        <div key={`step-${i}`} className="rounded-lg border p-3 space-y-2 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground shrink-0 w-5 text-center">{i + 1}</span>
            <Input
              value={step.title}
              onChange={(e) => handleUpdate(i, "title", e.target.value)}
              placeholder="Step title"
              className="h-8 text-sm"
            />
            <div className="flex items-center gap-0.5 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(i, -1)} disabled={i === 0}>
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(i, 1)} disabled={i === steps.length - 1}>
                <ArrowDown className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemove(i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Textarea
            value={step.description}
            onChange={(e) => handleUpdate(i, "description", e.target.value)}
            placeholder="Describe this step..."
            className="text-sm min-h-[60px] resize-none"
            rows={2}
          />
          <div className="flex items-center gap-2">
            <ImageIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Input
              value={step.imageUrl || ""}
              onChange={(e) => handleUpdate(i, "imageUrl", e.target.value)}
              placeholder="Image URL (optional)"
              className="h-7 text-xs"
            />
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full" onClick={handleAdd} disabled={steps.length >= MAX_STEPS}>
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Step
      </Button>
    </div>
  );
}
