"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { WIDGET_ICONS, WIDGET_META } from "./CallWidgetBar";
import type { PresetWidgetType } from "./CallWidgetBar";

const WIDGET_TYPES = Object.keys(WIDGET_META) as PresetWidgetType[];

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  newType: PresetWidgetType;
  onTypeChange: (v: PresetWidgetType) => void;
  newLabel: string;
  onLabelChange: (v: string) => void;
  onAdd: () => void;
}

export function AddWidgetDialog({ open, onOpenChange, newType, onTypeChange, newLabel, onLabelChange, onAdd }: AddWidgetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Call Widget</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Widget Type</Label>
            <Select value={newType} onValueChange={(v) => onTypeChange(v as PresetWidgetType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WIDGET_TYPES.map((type) => {
                  const Icon = WIDGET_ICONS[type];
                  return (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {WIDGET_META[type].label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{WIDGET_META[newType]?.description}</p>
          </div>
          <div className="space-y-1.5">
            <Label>Button Label</Label>
            <Input value={newLabel} onChange={(e) => onLabelChange(e.target.value)} placeholder={WIDGET_META[newType]?.label} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAdd}>Add Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
