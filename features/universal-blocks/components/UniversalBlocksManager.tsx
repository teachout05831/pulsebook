"use client";

import { useState } from "react";
import { Layers, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useUniversalBlocks } from "../hooks/useUniversalBlocks";
import { UniversalBlockCard } from "./UniversalBlockCard";
import { BLOCK_CATEGORIES } from "../types";
import type { UniversalBlock } from "../types";

export function UniversalBlocksManager() {
  const { blocks, isLoading, create, update, remove } = useUniversalBlocks();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editBlock, setEditBlock] = useState<UniversalBlock | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const filtered = categoryFilter === "all"
    ? blocks
    : blocks.filter((b) => b.category === categoryFilter);

  const openEdit = (block: UniversalBlock) => {
    setEditBlock(block);
    setEditName(block.name);
    setEditDesc(block.description || "");
    setEditCategory(block.category || "");
  };

  const handleSaveEdit = async () => {
    if (!editBlock) return;
    await update(editBlock.id, {
      name: editName,
      description: editDesc || undefined,
      category: editCategory || undefined,
    });
    setEditBlock(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading blocks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Universal Blocks</h1>
          <p className="text-muted-foreground mt-1">
            Reusable sections synced across all your pages
          </p>
        </div>
      </div>

      {blocks.length > 0 && (
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {BLOCK_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "block" : "blocks"}
          </span>
        </div>
      )}

      {blocks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium mb-1">No universal blocks yet</p>
          <p className="text-muted-foreground text-sm mb-4">
            Save any section from the Page Builder as a universal block to reuse it across pages.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((block) => (
            <UniversalBlockCard
              key={block.id}
              block={block}
              onEdit={() => openEdit(block)}
              onDelete={() => remove(block.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editBlock} onOpenChange={(open) => !open && setEditBlock(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Edit Block
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={editCategory || "none"} onValueChange={(v) => setEditCategory(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {BLOCK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBlock(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
