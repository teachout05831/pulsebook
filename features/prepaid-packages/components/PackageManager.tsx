"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Ticket } from "lucide-react";
import { useServicePackages } from "../hooks/useServicePackages";
import { PackageDialog } from "./PackageDialog";
import type { ServicePackage } from "../types";

interface Props {
  initialItems: ServicePackage[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function PackageManager({ initialItems }: Props) {
  const { packages, createPackage, updatePackage, deletePackage } = useServicePackages(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServicePackage | null>(null);

  const handleSave = async (data: { name: string; visitCount: number; totalPrice: number; perVisitPrice: number; discountPercent: number }) => {
    if (editing) return updatePackage(editing.id, data);
    return createPackage(data);
  };

  const handleEdit = (item: ServicePackage) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: ServicePackage) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await deletePackage(item.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Prepaid Packages</h2>
          <p className="text-sm text-muted-foreground">Define visit packages customers can purchase upfront</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-1.5 h-4 w-4" />Add Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Ticket className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No packages yet. Create your first prepaid package.</p>
          <Button size="sm" className="mt-3" onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" />Add Package
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Visits</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-right">Per Visit</TableHead>
                <TableHead className="text-center">Discount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.visitCount}</TableCell>
                  <TableCell className="text-right">{fmt(item.totalPrice)}</TableCell>
                  <TableCell className="text-right">{fmt(item.perVisitPrice)}</TableCell>
                  <TableCell className="text-center">{item.discountPercent > 0 ? `${item.discountPercent}%` : "\u2014"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={item.isActive ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PackageDialog
        isOpen={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        editingItem={editing}
      />
    </div>
  );
}
