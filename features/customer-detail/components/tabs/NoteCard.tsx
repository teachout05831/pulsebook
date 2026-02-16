"use client";

import { Pin, Edit2, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CustomerNote } from "@/features/customer-notes";

interface NoteCardProps {
  note: CustomerNote;
  onTogglePin: (noteId: string) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  isDeleting?: boolean;
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NoteCard({ note, onTogglePin, onDelete, isDeleting }: NoteCardProps) {
  return (
    <Card className={note.isPinned ? "border-amber-200 bg-amber-50" : ""}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
              {note.authorInitials || "?"}
            </div>
            <div>
              <div className="font-medium text-sm">{note.authorName || "Unknown"}</div>
              <div className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onTogglePin(note.id)}
              title={note.isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin className={`h-4 w-4 ${note.isPinned ? "text-amber-600 fill-amber-600" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => onDelete(note.id)}
              disabled={isDeleting}
              title="Delete note"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-sm whitespace-pre-wrap">{note.content}</div>
      </CardContent>
    </Card>
  );
}
