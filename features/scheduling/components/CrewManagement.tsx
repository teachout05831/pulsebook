"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useCrews } from "../hooks/useCrews";

export function CrewManagement() {
  const { crews, isLoading, createCrew, updateCrew, deleteCrew } = useCrews();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [maxHours, setMaxHours] = useState(8);
  const [maxJobs, setMaxJobs] = useState(6);
  const [specs, setSpecs] = useState("");

  const openDialog = (crew?: typeof crews[0]) => {
    setEditId(crew?.id ?? null);
    setName(crew?.name ?? "");
    setColor(crew?.color ?? "#3b82f6");
    setMaxHours(crew?.maxHoursPerDay ?? 8);
    setMaxJobs(crew?.maxJobsPerDay ?? 6);
    setSpecs(crew?.specializations?.join(", ") ?? "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    const input = { name, color, maxHoursPerDay: maxHours, maxJobsPerDay: maxJobs, specializations: specs.split(",").map(s => s.trim()).filter(Boolean) };
    const result = editId ? await updateCrew(editId, input) : await createCrew(input);
    if (result.error) toast.error(result.error);
    else { toast.success(editId ? "Crew updated" : "Crew created"); setDialogOpen(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteCrew(deleteId);
    if (result.error) toast.error(result.error);
    else { toast.success("Crew deleted"); setDeleteId(null); }
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Loading crews...</div>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Crews</CardTitle><CardDescription>Manage your scheduling crews</CardDescription></div>
          <Button size="sm" onClick={() => openDialog()}><Plus className="h-4 w-4 mr-1" />Add Crew</Button>
        </CardHeader>
        <CardContent>
          {crews.length === 0 ? (
            <p className="text-center py-6 text-sm text-muted-foreground">No crews yet. Add one to get started.</p>
          ) : (
            <div className="space-y-2">
              {crews.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-8 rounded" style={{ backgroundColor: c.color }} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{c.name}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Max {c.maxJobsPerDay} jobs/day</span>
                      <span>Max {c.maxHoursPerDay}h</span>
                      {c.specializations?.length > 0 && c.specializations.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDialog(c)}><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteId(c.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Crew</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Pacific Crew" /></div>
              <div><Label>Color</Label><Input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Max hours/day</Label><Input type="number" value={maxHours} onChange={e => setMaxHours(+e.target.value)} min={1} max={24} /></div>
              <div><Label>Max jobs/day</Label><Input type="number" value={maxJobs} onChange={e => setMaxJobs(+e.target.value)} min={1} max={30} /></div>
            </div>
            <div><Label>Specializations</Label><Input value={specs} onChange={e => setSpecs(e.target.value)} placeholder="deep_clean, move_out (comma-separated)" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Crew?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
