"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import type { EstimateBuilderSettings, AutoFeesSettings, AutoFeeDefinition } from "@/types/company";
import { defaultAutoFeesSettings } from "@/types/company";

interface Props {
  settings: EstimateBuilderSettings;
  onUpdate: <K extends keyof EstimateBuilderSettings>(key: K, value: EstimateBuilderSettings[K]) => void;
}

export function AutoFeesConfig({ settings, onUpdate }: Props) {
  const autoFees = settings.autoFees || defaultAutoFeesSettings;
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newRate, setNewRate] = useState("");

  const update = (updated: AutoFeesSettings) => onUpdate("autoFees", updated);

  const toggleEnabled = (enabled: boolean) => update({ ...autoFees, enabled });

  const toggleFee = (id: string, key: "enabled" | "autoApply") => {
    const fees = autoFees.fees.map((f) => (f.id === id ? { ...f, [key]: !f[key] } : f));
    update({ ...autoFees, fees });
  };

  const removeFee = (id: string) => {
    update({ ...autoFees, fees: autoFees.fees.filter((f) => f.id !== id) });
  };

  const addFee = () => {
    if (!newName.trim() || !newRate) return;
    const fee: AutoFeeDefinition = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      type: newType,
      rate: parseFloat(newRate) || 0,
      enabled: true,
      autoApply: true,
    };
    update({ ...autoFees, fees: [...autoFees.fees, fee] });
    setNewName("");
    setNewRate("");
    setAdding(false);
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Switch checked={autoFees.enabled} onCheckedChange={toggleEnabled} />
        <h3 className="font-medium">Auto-Fees</h3>
      </div>

      {autoFees.enabled && (
        <div className="space-y-3 pl-1">
          <p className="text-sm text-muted-foreground">
            Define fees that can be applied to estimates (e.g., supply fee, trip fee).
          </p>

          {autoFees.fees.length > 0 && (
            <div className="space-y-2">
              {autoFees.fees.map((fee) => (
                <div key={fee.id} className="flex items-center gap-3 rounded-md border px-3 py-2">
                  <Switch checked={fee.enabled} onCheckedChange={() => toggleFee(fee.id, "enabled")} />
                  <span className="font-medium text-sm flex-1">{fee.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {fee.type === "percentage" ? `${fee.rate}%` : `$${fee.rate}`}
                  </Badge>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={fee.autoApply}
                      onChange={() => toggleFee(fee.id, "autoApply")}
                      className="h-3.5 w-3.5 rounded"
                    />
                    Auto
                  </label>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFee(fee.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {adding ? (
            <div className="flex items-end gap-2 rounded-md border p-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium">Name</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Supply Fee" className="h-8" />
              </div>
              <div className="w-[130px] space-y-1">
                <label className="text-xs font-medium">Type</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as "percentage" | "fixed")}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percent (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[80px] space-y-1">
                <label className="text-xs font-medium">Rate</label>
                <Input type="number" min="0" step="0.01" value={newRate} onChange={(e) => setNewRate(e.target.value)} placeholder="10" className="h-8" />
              </div>
              <Button size="sm" className="h-8" onClick={addFee} disabled={!newName.trim() || !newRate}>Save</Button>
              <Button size="sm" variant="ghost" className="h-8" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />Add Fee
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
