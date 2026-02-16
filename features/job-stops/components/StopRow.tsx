"use client";

import { MapPin, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddressInput } from "@/components/shared/AddressInput";
import { Badge } from "@/components/ui/badge";

interface Props {
  index: number;
  address: string;
  notes: string | null;
  stopType: string;
  canRemove: boolean;
  onAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onRemove: () => void;
}

function getLabel(stopType: string, index: number): string {
  if (stopType === "start") return "Starting Address";
  if (stopType === "end") return "End Address";
  return `Stop ${index}`;
}

export function StopRow({
  index,
  address,
  notes,
  stopType,
  canRemove,
  onAddressChange,
  onNotesChange,
  onRemove,
}: Props) {
  const label = getLabel(stopType, index);

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div className="mt-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {label}
          </Badge>
        </div>
        <AddressInput
          value={address}
          onChange={onAddressChange}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
        {stopType === "stop" && (
          <Input
            value={notes || ""}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Notes (optional)"
            className="text-sm"
          />
        )}
      </div>
      {canRemove && stopType === "stop" && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
