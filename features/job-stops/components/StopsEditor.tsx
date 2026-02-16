"use client";

import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StopRow } from "./StopRow";
import type { CreateJobStopInput } from "../types";

interface Props {
  stops: CreateJobStopInput[];
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
  onUpdateStop: (index: number, field: "address" | "notes", value: string) => void;
  isLoading?: boolean;
}

export function StopsEditor({
  stops,
  onAddStop,
  onRemoveStop,
  onUpdateStop,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasMiddleStops = stops.some((s) => s.stopType === "stop");

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Route Stops</h4>
        <Button type="button" variant="outline" size="sm" onClick={onAddStop}>
          <Plus className="mr-1 h-3 w-3" />
          Add Stop
        </Button>
      </div>

      <div className="space-y-2">
        {stops.map((stop, index) => (
          <StopRow
            key={`stop-${index}`}
            index={index}
            address={stop.address}
            notes={stop.notes || null}
            stopType={stop.stopType || "stop"}
            canRemove={hasMiddleStops}
            onAddressChange={(v) => onUpdateStop(index, "address", v)}
            onNotesChange={(v) => onUpdateStop(index, "notes", v)}
            onRemove={() => onRemoveStop(index)}
          />
        ))}
      </div>
    </div>
  );
}
