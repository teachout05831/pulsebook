"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EstimateLocation } from "@/types/estimate";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Partial<EstimateLocation>) => Promise<{ error?: string } | { success: boolean }>;
}

const TYPES = [
  { value: "origin", label: "Pickup / Origin" },
  { value: "destination", label: "Delivery / Destination" },
  { value: "stop", label: "Stop" },
  { value: "service_location", label: "Service Location" },
] as const;

export function AddLocationDialog({ open, onClose, onAdd }: Props) {
  const [locationType, setLocationType] = useState("service_location");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => { setLocationType("service_location"); setAddress(""); setCity(""); setState(""); setZip(""); };

  const handleSubmit = async () => {
    if (!address.trim()) return;
    setSaving(true);
    await onAdd({ locationType: locationType as EstimateLocation["locationType"], address, city, state, zip });
    setSaving(false);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Address</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Type</Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
            <div><Label>State</Label><Input value={state} onChange={(e) => setState(e.target.value)} /></div>
            <div><Label>ZIP</Label><Input value={zip} onChange={(e) => setZip(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!address.trim() || saving}>{saving ? "Adding..." : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
