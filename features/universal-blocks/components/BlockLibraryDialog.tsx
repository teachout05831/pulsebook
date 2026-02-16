"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, Copy, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { SECTION_LABELS } from "@/features/estimate-pages/types";
import { BLOCK_CATEGORIES } from "../types";
import type { UniversalBlock } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onInsertConnected: (block: UniversalBlock) => void;
  onInsertCopy: (block: UniversalBlock) => void;
}

export function BlockLibraryDialog({ open, onClose, onInsertConnected, onInsertCopy }: Props) {
  const [blocks, setBlocks] = useState<UniversalBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/universal-blocks");
      if (res.ok) {
        const json = await res.json();
        setBlocks(json.data || []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchBlocks();
  }, [open, fetchBlocks]);

  const filtered = blocks.filter((b) => {
    if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Universal Blocks Library
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {BLOCK_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-[350px] overflow-y-auto space-y-2 py-1">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {blocks.length === 0 ? "No universal blocks saved yet." : "No blocks match your search."}
              </p>
            </div>
          ) : (
            filtered.map((block) => (
              <div key={block.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Link2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{block.name}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded ml-auto flex-shrink-0">
                    {SECTION_LABELS[block.sectionType] || block.sectionType}
                  </span>
                </div>
                {block.description && (
                  <p className="text-xs text-muted-foreground mb-2 ml-5.5 line-clamp-1">{block.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="h-7 text-xs"
                    onClick={() => { onInsertConnected(block); onClose(); }}
                  >
                    <Link2 className="h-3 w-3 mr-1" />
                    Insert Connected
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => { onInsertCopy(block); onClose(); }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Insert Copy
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
