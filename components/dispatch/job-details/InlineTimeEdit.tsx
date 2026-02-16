"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Clock } from "lucide-react";
import { DispatchJob } from "@/types/dispatch";
import { useDispatch } from "../dispatch-provider";
import { cn } from "@/lib/utils";

interface InlineTimeEditProps {
  job: DispatchJob;
}

export function InlineTimeEdit({ job }: InlineTimeEditProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(job.scheduledTime || "");
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateJob, optimisticRescheduleJob } = useDispatch();

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setValue(job.scheduledTime || "");
  }, [job.scheduledTime]);

  const save = async () => {
    setEditing(false);
    if (value === (job.scheduledTime || "")) return;
    optimisticRescheduleJob(job.id, job.scheduledDate, value || null);
    try {
      await updateJob(job.id, { scheduledTime: value || null } as Record<string, unknown>);
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    } catch {
      // Reverts on refetch
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <input
          ref={inputRef}
          type="time"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="text-sm border border-blue-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-xs text-gray-600 group cursor-pointer rounded py-0.5 px-0.5 -mx-0.5 hover:bg-gray-100", flash && "animate-save-flash")}
      onClick={() => setEditing(true)}
    >
      <Clock className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
      <span>{job.scheduledTime || "No time set"}</span>
      <span className="ml-auto flex items-center gap-0.5 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100">
        <Pencil className="h-2.5 w-2.5" /> edit
      </span>
    </div>
  );
}
