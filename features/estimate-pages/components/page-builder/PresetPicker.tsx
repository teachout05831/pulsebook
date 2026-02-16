"use client";

import { Palette } from "lucide-react";
import { DESIGN_PRESETS } from "../../constants";
import { PresetMiniPreview } from "./PresetMiniPreview";

interface PresetPickerProps {
  activePresetId?: string;
  primaryColor: string;
  secondaryColor: string;
  onSelectPreset: (presetId: string) => void;
}

export function PresetPicker({ activePresetId, primaryColor, secondaryColor, onSelectPreset }: PresetPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Design Style</h3>
        </div>
        {!activePresetId && (
          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Custom</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DESIGN_PRESETS.map((preset) => (
          <PresetMiniPreview
            key={preset.id}
            preset={preset}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            isActive={activePresetId === preset.id}
            onClick={() => onSelectPreset(preset.id)}
          />
        ))}
      </div>
    </div>
  );
}
