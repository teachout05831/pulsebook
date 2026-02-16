"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SavedListView } from "@/types/list-view";
import { SaveViewDialog } from "./SaveViewDialog";
import { cn } from "@/lib/utils";

interface SavedViewsBarProps {
  views: SavedListView[];
  activeViewId: string | null;
  onSwitchView: (id: string | null) => void;
  onSaveView: (view: SavedListView) => void;
  onDeleteView: (id: string) => void;
  currentColumnIds: string[];
  currentSortField: string | null;
  currentSortOrder: "asc" | "desc";
  currentFilters: SavedListView["filters"];
}

export function SavedViewsBar({
  views, activeViewId, onSwitchView, onSaveView, onDeleteView,
  currentColumnIds, currentSortField, currentSortOrder, currentFilters,
}: SavedViewsBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [renameView, setRenameView] = useState<SavedListView | null>(null);

  const handleCreate = (name: string) => {
    const id = `view-${Date.now()}`;
    onSaveView({
      id, name, columnIds: [...currentColumnIds],
      sortField: currentSortField, sortOrder: currentSortOrder,
      filters: { ...currentFilters },
      isDefault: views.length === 0,
    });
  };

  const handleRename = (name: string) => {
    if (!renameView) return;
    onSaveView({ ...renameView, name });
    setRenameView(null);
  };

  const handleUpdateCurrent = (view: SavedListView) => {
    onSaveView({
      ...view, columnIds: [...currentColumnIds],
      sortField: currentSortField, sortOrder: currentSortOrder,
      filters: { ...currentFilters },
    });
  };

  return (
    <div className="flex items-center gap-1 min-h-[32px]">
      {/* "All" default tab */}
      <button
        onClick={() => onSwitchView(null)}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-md transition-colors",
          !activeViewId ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100",
        )}
      >
        All Jobs
      </button>

      {/* Saved view tabs */}
      {views.map((view) => (
        <div key={view.id} className="flex items-center group">
          <button
            onClick={() => onSwitchView(view.id)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-l-md transition-colors",
              view.id === activeViewId ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100",
            )}
          >
            {view.name}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "px-1 py-1 rounded-r-md text-gray-400 hover:text-gray-600 transition-colors",
                view.id === activeViewId ? "bg-blue-100" : "hover:bg-gray-100",
              )}>
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleUpdateCurrent(view)}>Update with current columns</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRenameView(view)}>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onDeleteView(view.id)}>
                <X className="h-3 w-3 mr-1" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      {/* Add new view */}
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400" onClick={() => setSaveDialogOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
      </Button>

      <SaveViewDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen} onSave={handleCreate} />
      <SaveViewDialog
        open={!!renameView}
        onOpenChange={(open) => !open && setRenameView(null)}
        initialName={renameView?.name || ""}
        onSave={handleRename}
      />
    </div>
  );
}
