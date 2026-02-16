"use client";

import { Save, Send, Loader2 } from "lucide-react";

interface Props {
  notes: string;
  onNotesChange: (v: string) => void;
  onSave: () => void;
  onPresent: () => void;
  isSaving: boolean;
  canPresent: boolean;
  primaryColor: string;
}

export function LiveEstimateActions({ notes, onNotesChange, onSave, onPresent, isSaving, canPresent, primaryColor }: Props) {
  return (
    <div className="space-y-3">
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Customer notes..."
        rows={2}
        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-white/20"
      />
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.08] text-white/80 hover:bg-white/[0.12] border border-white/10 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save Draft
        </button>
        <button
          onClick={onPresent}
          disabled={!canPresent || isSaving}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: canPresent ? primaryColor : undefined }}
        >
          <Send className="h-3.5 w-3.5" />
          Present to Customer
        </button>
      </div>
    </div>
  );
}
