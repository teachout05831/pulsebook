"use client";

import { useState } from "react";
import { Edit2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomerNotes } from "@/features/customer-notes";
import { NoteForm, NotesList } from "./notes";

interface NotesTabProps {
  customerId: string;
}

type FilterType = "all" | "pinned";

export function NotesTab({ customerId }: NotesTabProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const {
    notes, pinnedNotes, unpinnedNotes,
    isLoading, handleCreate, handleTogglePin, handleDelete,
  } = useCustomerNotes(customerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="text-sm text-muted-foreground">{notes.length} notes - {pinnedNotes.length} pinned</p>
        </div>
      </div>

      <NoteForm onCreate={handleCreate} />

      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All ({notes.length})
        </Button>
        <Button variant={filter === "pinned" ? "default" : "outline"} size="sm" onClick={() => setFilter("pinned")}>
          Pinned ({pinnedNotes.length})
        </Button>
      </div>

      <NotesList
        notes={notes} pinnedNotes={pinnedNotes} unpinnedNotes={unpinnedNotes}
        filter={filter} onTogglePin={handleTogglePin} onDelete={handleDelete}
      />

      {notes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Edit2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notes yet</p>
            <p className="text-sm">Add notes to keep track of important customer information</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
