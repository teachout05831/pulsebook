"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import type { CustomerNote } from "@/features/customer-notes";
import { NoteCard } from "../NoteCard";

interface NotesListProps {
  notes: CustomerNote[];
  pinnedNotes: CustomerNote[];
  unpinnedNotes: CustomerNote[];
  filter: "all" | "pinned";
  onTogglePin: (noteId: string) => Promise<unknown>;
  onDelete: (noteId: string) => Promise<unknown>;
}

export function NotesList({ pinnedNotes, unpinnedNotes, filter, onTogglePin, onDelete }: NotesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleTogglePin = async (noteId: string) => {
    await onTogglePin(noteId);
  };

  const handleDelete = async (noteId: string) => {
    setDeletingId(noteId);
    await onDelete(noteId);
    setDeletingId(null);
  };

  const displayNotes = filter === "pinned" ? pinnedNotes : unpinnedNotes;

  return (
    <>
      {filter === "all" && pinnedNotes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Pin className="h-4 w-4" />Pinned
          </h3>
          <div className="space-y-3">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id} note={note}
                onTogglePin={handleTogglePin} onDelete={handleDelete}
                isDeleting={deletingId === note.id}
              />
            ))}
          </div>
        </div>
      )}

      {displayNotes.length > 0 && (
        <div>
          {filter === "all" && (
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">All Notes</h3>
          )}
          <div className="space-y-3">
            {displayNotes.map((note) => (
              <NoteCard
                key={note.id} note={note}
                onTogglePin={handleTogglePin} onDelete={handleDelete}
                isDeleting={deletingId === note.id}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
