"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NoteFormProps {
  onCreate: (content: string, isPinned: boolean) => Promise<{ success?: boolean }>;
}

export function NoteForm({ onCreate }: NoteFormProps) {
  const [newNote, setNewNote] = useState("");
  const [pinNewNote, setPinNewNote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!newNote.trim() || isSaving) return;
    setIsSaving(true);
    const result = await onCreate(newNote.trim(), pinNewNote);
    if (result.success) {
      setNewNote("");
      setPinNewNote(false);
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <Textarea
          placeholder="Write a note about this customer..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <div className="flex items-center justify-end gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={pinNewNote}
              onChange={(e) => setPinNewNote(e.target.checked)}
              className="rounded"
            />
            Pin note
          </label>
          <Button size="sm" onClick={handleSave} disabled={!newNote.trim() || isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
