"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { ServiceZone } from "../types";

export function ZoneManagement() {
  const [zones, setZones] = useState<ServiceZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [zipCodes, setZipCodes] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scheduling/zones");
      if (res.ok) { const json = await res.json(); setZones(json.data || []); }
    } catch { /* silent */ } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const openDialog = (zone?: ServiceZone) => {
    setEditId(zone?.id ?? null);
    setName(zone?.name ?? "");
    setColor(zone?.color ?? "#3b82f6");
    setZipCodes(zone?.zipCodes?.join(", ") ?? "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    const input = { name, color, zipCodes: zipCodes.split(",").map(s => s.trim()).filter(Boolean) };
    const url = editId ? `/api/scheduling/zones/${editId}` : "/api/scheduling/zones";
    const res = await fetch(url, { method: editId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    if (!res.ok) { toast.error("Failed to save"); return; }
    toast.success(editId ? "Zone updated" : "Zone created");
    setDialogOpen(false);
    refresh();
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Loading zones...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Service Zones</CardTitle><CardDescription>Define geographic zones for location-based routing</CardDescription></div>
          <Button size="sm" onClick={() => openDialog()}><Plus className="h-4 w-4 mr-1" />Add Zone</Button>
        </CardHeader>
        <CardContent>
          {zones.length === 0 ? (
            <p className="text-center py-6 text-sm text-muted-foreground">No zones yet. Add one to get started.</p>
          ) : (
            <div className="space-y-2">
              {zones.map(z => (
                <div key={z.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-8 rounded" style={{ backgroundColor: z.color }} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{z.name}</p>
                    <div className="flex gap-1 flex-wrap">
                      {z.zipCodes?.length > 0 ? z.zipCodes.map(zip => <Badge key={zip} variant="outline" className="text-xs">{zip}</Badge>) : <span className="text-xs text-muted-foreground">No zip codes assigned</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDialog(z)}><Pencil className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Zone</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Downtown" /></div>
              <div><Label>Color</Label><Input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9" /></div>
            </div>
            <div><Label>Zip Codes</Label><Input value={zipCodes} onChange={e => setZipCodes(e.target.value)} placeholder="33101, 33109, 33125 (comma-separated)" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
