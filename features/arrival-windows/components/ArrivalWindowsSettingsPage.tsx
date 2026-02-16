"use client";

import { Plus, Trash2, Save, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useArrivalWindowsSettings } from "../hooks/useArrivalWindowsSettings";
import type { ArrivalWindow } from "@/types/company";

interface Props {
  initialWindows: ArrivalWindow[];
}

export function ArrivalWindowsSettingsPage({ initialWindows }: Props) {
  const { windows, isSaving, addWindow, updateWindow, removeWindow, save, reset } =
    useArrivalWindowsSettings(initialWindows);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Arrival Windows</h1>
          <p className="text-muted-foreground text-sm">
            Define time windows customers can choose for service arrival.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset} disabled={isSaving}>
            <RotateCcw className="mr-1.5 h-4 w-4" />Reset
          </Button>
          <Button size="sm" onClick={save} disabled={isSaving}>
            <Save className="mr-1.5 h-4 w-4" />{isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Time Windows</CardTitle>
          <Button variant="outline" size="sm" onClick={addWindow}>
            <Plus className="mr-1.5 h-4 w-4" />Add Window
          </Button>
        </CardHeader>
        <CardContent>
          {windows.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No arrival windows defined. Click &quot;Add Window&quot; to create one.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_120px_120px_40px] gap-3 px-1">
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Label className="text-xs text-muted-foreground">Start Time</Label>
                <Label className="text-xs text-muted-foreground">End Time</Label>
                <span />
              </div>
              {windows.map((w) => (
                <div key={w.id} className="grid grid-cols-[1fr_120px_120px_40px] gap-3 items-center">
                  <Input
                    value={w.label}
                    onChange={(e) => updateWindow(w.id, "label", e.target.value)}
                    placeholder="e.g., Morning"
                  />
                  <Input
                    type="time"
                    value={w.startTime}
                    onChange={(e) => updateWindow(w.id, "startTime", e.target.value)}
                  />
                  <Input
                    type="time"
                    value={w.endTime}
                    onChange={(e) => updateWindow(w.id, "endTime", e.target.value)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeWindow(w.id)} className="h-9 w-9 text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
