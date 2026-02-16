"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Crew } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingCrew: Crew | null;
  onSave: (input: Record<string, unknown>) => Promise<void>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899", "#06b6d4"];

export function CrewDialog({ isOpen, onClose, editingCrew, onSave }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [vehicleName, setVehicleName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingCrew) {
      setName(editingCrew.name);
      setColor(editingCrew.color);
      setVehicleName(editingCrew.vehicleName || "");
    } else {
      setName("");
      setColor("#3b82f6");
      setVehicleName("");
    }
  }, [editingCrew, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), color, vehicleName: vehicleName || null });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCrew ? "Edit Crew" : "Create New Crew"}</DialogTitle>
          <DialogDescription>
            {editingCrew ? "Update crew details" : "Set up a new crew with a name, vehicle, and color"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Crew Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Truck 1, Alpha Team" />
          </div>
          <div className="space-y-2">
            <Label>Vehicle (optional)</Label>
            <Input value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} placeholder="e.g., Ford F-150 #101" />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="w-8 h-8 rounded-lg transition-all"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? "3px solid #1e293b" : "none",
                    outlineOffset: "2px",
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving ? "Saving..." : editingCrew ? "Update" : "Create Crew"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
