"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

type NoteKey = "notes" | "customerNotes" | "crewNotes" | "crewFeedback";

interface NotesState {
  notes: string;
  customerNotes: string;
  crewNotes: string;
  crewFeedback: string;
}

export function useJobNotes(jobId: string, initial: NotesState) {
  const [notes, setNotes] = useState<NotesState>(initial);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveNote = useCallback(
    async (key: NoteKey, value: string) => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        });
        if (!res.ok) toast.error("Failed to save note");
      } catch {
        toast.error("Failed to save note");
      }
    },
    [jobId]
  );

  const updateNote = useCallback(
    (key: NoteKey, value: string) => {
      setNotes((prev) => ({ ...prev, [key]: value }));
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => saveNote(key, value), 1000);
    },
    [saveNote]
  );

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return { notes, updateNote };
}
