"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { useServiceCatalog } from "../hooks/useServiceCatalog";
import { ServiceCatalogDialog } from "./ServiceCatalogDialog";
import type { ServiceCatalogItem } from "../types";

interface Props {
  initialItems: ServiceCatalogItem[];
}

const CATEGORY_LABELS: Record<string, string> = { primary: "Primary", additional: "Additional", trip_fee: "Trip Fee" };
const MODEL_LABELS: Record<string, string> = { flat: "Flat Rate", hourly: "Hourly", per_unit: "Per Unit" };

export function ServiceCatalogManager({ initialItems }: Props) {
  const { items, createItem, updateItem, deleteItem } = useServiceCatalog(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceCatalogItem | null>(null);

  const handleSave = async (data: Parameters<typeof createItem>[0]) => {
    if (editing) {
      return updateItem(editing.id, data);
    }
    return createItem(data);
  };

  const handleEdit = (item: ServiceCatalogItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: ServiceCatalogItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await deleteItem(item.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Service Catalog</h2>
          <p className="text-sm text-muted-foreground">Manage your service offerings and pricing</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-1.5 h-4 w-4" />Add Service
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Package className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No services yet. Add your first service to get started.</p>
          <Button size="sm" className="mt-3" onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" />Add Service
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Pricing</TableHead>
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
                  <TableCell><Badge variant="outline">{CATEGORY_LABELS[item.category] || item.category}</Badge></TableCell>
                  <TableCell className="text-sm">{MODEL_LABELS[item.pricingModel] || item.pricingModel}</TableCell>
                  <TableCell className="text-right font-medium">${item.defaultPrice.toFixed(2)}{item.unitLabel ? `/${item.unitLabel}` : ""}</TableCell>
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

      <ServiceCatalogDialog
        isOpen={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        editingItem={editing}
      />
    </div>
  );
}
