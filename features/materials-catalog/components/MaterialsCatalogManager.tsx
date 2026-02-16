"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Boxes } from "lucide-react";
import { useMaterialsCatalog } from "../hooks/useMaterialsCatalog";
import { MaterialsCatalogDialog } from "./MaterialsCatalogDialog";
import type { MaterialsCatalogItem } from "../types";

interface Props {
  initialItems: MaterialsCatalogItem[];
}

export function MaterialsCatalogManager({ initialItems }: Props) {
  const { items, createItem, updateItem, deleteItem } = useMaterialsCatalog(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MaterialsCatalogItem | null>(null);

  const handleSave = async (data: Parameters<typeof createItem>[0]) => {
    if (editing) {
      return updateItem(editing.id, data);
    }
    return createItem(data);
  };

  const handleEdit = (item: MaterialsCatalogItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: MaterialsCatalogItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await deleteItem(item.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Materials Catalog</h2>
          <p className="text-sm text-muted-foreground">Manage materials and supplies for estimates</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-1.5 h-4 w-4" />Add Material
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Boxes className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No materials yet. Add your first material to get started.</p>
          <Button size="sm" className="mt-3" onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" />Add Material
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.sku || "—"}</TableCell>
                  <TableCell className="text-sm">{item.unitLabel}</TableCell>
                  <TableCell className="text-right font-medium">${item.unitPrice.toFixed(2)}</TableCell>
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

      <MaterialsCatalogDialog
        isOpen={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        editingItem={editing}
      />
    </div>
  );
}
