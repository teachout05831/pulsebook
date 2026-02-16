"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, FileText, Check, X } from "lucide-react";
import { DispatchJob } from "@/types/dispatch";
import { useDispatch } from "../dispatch-provider";
import { cn } from "@/lib/utils";

interface InlineNotesEditProps {
  job: DispatchJob;
}

export function InlineNotesEdit({ job }: InlineNotesEditProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(job.notes || "");
  const [flash, setFlash] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateJob } = useDispatch();

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setValue(job.notes || "");
  }, [job.notes]);

  const save = async () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed === (job.notes || "")) return;
    try {
      await updateJob(job.id, { notes: trimmed || null } as Record<string, unknown>);
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    } catch {
      // Reverts on refetch
    }
  };

  if (editing) {
    return (
      <div className="py-0.5">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 mt-1.5 text-gray-400 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              className="w-full text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Add notes..."
            />
            <div className="flex gap-1 mt-1">
              <button onClick={save} className="text-xs text-green-600 hover:text-green-700 flex items-center gap-0.5">
                <Check className="h-3 w-3" /> Save
              </button>
              <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:text-gray-600 flex items-center gap-0.5">
                <X className="h-3 w-3" /> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("cursor-pointer group rounded py-0.5 px-0.5 -mx-0.5 hover:bg-gray-100", flash && "animate-save-flash")}
      onClick={() => setEditing(true)}
    >
      <div className="flex items-start gap-2 text-xs text-gray-600">
        <FileText className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
        <p className="flex-1 leading-relaxed">{job.notes || "Add notes..."}</p>
        <span className="flex items-center gap-0.5 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5">
          <Pencil className="h-2.5 w-2.5" /> edit
        </span>
      </div>
    </div>
  );
}
