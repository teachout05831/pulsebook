"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { WIDGET_ICONS, WIDGET_META } from "./CallWidgetBar";
import { WidgetEditDialog } from "./WidgetEditDialog";
import type { CallWidget, WidgetType, PresetWidgetType } from "../types";

const PRESET_TYPES: PresetWidgetType[] = ["reviews", "portfolio", "process", "faq", "video", "custom_link"];
const EDITABLE_TYPES: PresetWidgetType[] = ["process", "faq", "video", "custom_link"];

interface ConsultationWidgetSettingsProps {
  widgets: CallWidget[];
  onChange: (widgets: CallWidget[]) => void;
}

export function ConsultationWidgetSettings({ widgets, onChange }: ConsultationWidgetSettingsProps) {
  const router = useRouter();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const getWidget = (type: PresetWidgetType) => widgets.find((w) => w.type === type);
  const isEnabled = (type: PresetWidgetType) => widgets.some((w) => w.type === type);

  // Custom widgets = any widget not in PRESET_TYPES
  const customWidgets = widgets.filter((w) => !(PRESET_TYPES as string[]).includes(w.type));

  const handleToggle = (type: PresetWidgetType, enabled: boolean) => {
    if (enabled) {
      const meta = WIDGET_META[type];
      const widget: CallWidget = { id: crypto.randomUUID(), type, label: meta.label };
      const newWidgets = [...widgets, widget];
      onChange(newWidgets);
      if (EDITABLE_TYPES.includes(type)) setEditIndex(newWidgets.length - 1);
    } else {
      onChange(widgets.filter((w) => w.type !== type));
    }
  };

  const handleEdit = (type: PresetWidgetType) => {
    const index = widgets.findIndex((w) => w.type === type);
    if (index !== -1) setEditIndex(index);
  };

  const handleEditById = (id: string) => {
    const index = widgets.findIndex((w) => w.id === id);
    if (index !== -1) setEditIndex(index);
  };

  const handleAddCustom = () => {
    const id = crypto.randomUUID();
    const widget: CallWidget = { id, type: `custom_${id.slice(0, 8)}` as WidgetType, label: "New Widget" };
    const newWidgets = [...widgets, widget];
    onChange(newWidgets);
    // Navigate to builder for this new widget
    router.push(`/settings/consultations/widget-builder?type=${widget.type}`);
  };

  const handleRemoveCustom = (id: string) => {
    onChange(widgets.filter((w) => w.id !== id));
  };

  const handleWidgetUpdate = (updated: CallWidget) => {
    if (editIndex === null) return;
    const next = [...widgets];
    next[editIndex] = updated;
    onChange(next);
  };

  const editWidget = editIndex !== null ? widgets[editIndex] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Default Widgets</CardTitle>
          <CardDescription>
            Toggle which buttons appear during consultations. Customers tap these to view content without leaving the call.
            <span className="ml-1 font-medium">{widgets.length} active</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {PRESET_TYPES.map((type) => {
            const Icon = WIDGET_ICONS[type];
            const meta = WIDGET_META[type];
            const enabled = isEnabled(type);
            const widget = getWidget(type);
            return (
              <div key={type} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${enabled ? "bg-card hover:bg-accent/50" : "bg-muted/30"}`}>
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: enabled ? meta.color + "15" : undefined }}>
                  <Icon className="h-4 w-4" style={{ color: enabled ? meta.color : "var(--muted-foreground)" }} />
                </div>
                <div className={`flex-1 min-w-0 ${enabled ? "cursor-pointer" : ""}`} onClick={() => enabled && handleEdit(type)}>
                  <p className={`text-sm font-medium ${enabled ? "" : "text-muted-foreground"}`}>
                    {widget?.label || meta.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{meta.description}</p>
                </div>
                <Switch checked={enabled} onCheckedChange={(v) => handleToggle(type, v)} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Widgets</CardTitle>
              <CardDescription>Create your own widgets and design them in the builder</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleAddCustom}>
              <Plus className="h-4 w-4 mr-1" />Add Widget
            </Button>
          </div>
        </CardHeader>
        {customWidgets.length > 0 && (
          <CardContent className="space-y-2">
            {customWidgets.map((widget) => (
              <div key={widget.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                  <LayoutGrid className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleEditById(widget.id)}>
                  <p className="text-sm font-medium">{widget.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {widget.sections?.length ? `${widget.sections.length} sections` : "Not designed yet — click to edit"}
                  </p>
                </div>
                <button onClick={() => handleRemoveCustom(widget.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      <WidgetEditDialog widget={editWidget} open={editIndex !== null} onClose={() => setEditIndex(null)} onUpdate={handleWidgetUpdate} />
    </div>
  );
}
