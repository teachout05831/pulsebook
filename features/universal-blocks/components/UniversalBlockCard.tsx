"use client";

import { MoreHorizontal, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SECTION_LABELS } from "@/features/estimate-pages/types";
import type { UniversalBlock } from "../types";

interface Props {
  block: UniversalBlock;
  onEdit: () => void;
  onDelete: () => void;
}

export function UniversalBlockCard({ block, onEdit, onDelete }: Props) {
  const label = SECTION_LABELS[block.sectionType] || block.sectionType;

  return (
    <div className="border rounded-lg bg-white overflow-hidden hover:shadow-sm transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <Link2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="font-semibold truncate">{block.name}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit Name</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {block.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{block.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {label}
          </span>
          {block.category && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{block.category}</span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {block.usageCount} {block.usageCount === 1 ? "use" : "uses"}
          </span>
        </div>
      </div>
    </div>
  );
}
