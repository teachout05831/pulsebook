"use client";

import { Pencil, Columns2, Eye } from "lucide-react";

export type EstimateMode = "editor" | "split" | "preview";

interface ModeToggleProps {
  mode: EstimateMode;
  onModeChange: (mode: EstimateMode) => void;
}

const MODES: { key: EstimateMode; label: string; Icon: typeof Pencil }[] = [
  { key: "editor", label: "Editor", Icon: Pencil },
  { key: "split", label: "Split", Icon: Columns2 },
  { key: "preview", label: "Preview", Icon: Eye },
];

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex bg-slate-100 rounded-md p-0.5 gap-0.5">
      {MODES.map((m) => (
        <button
          key={m.key}
          onClick={() => onModeChange(m.key)}
          className={`flex items-center gap-1.5 px-3 py-[5px] text-xs font-medium rounded transition-all ${
            mode === m.key
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <m.Icon className="w-3.5 h-3.5" />
          {m.label}
        </button>
      ))}
    </div>
  );
}
