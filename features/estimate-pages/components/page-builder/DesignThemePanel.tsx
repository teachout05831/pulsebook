"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paintbrush } from "lucide-react";
import type { DesignTheme } from "../../types";
import { FONT_OPTIONS, THEME_SELECTS } from "./designThemeConfig";
import { PresetPicker } from "./PresetPicker";

interface DesignThemePanelProps {
  theme: DesignTheme;
  primaryColor: string;
  secondaryColor: string;
  onUpdate: (updates: Partial<DesignTheme>) => void;
  onSelectPreset: (presetId: string) => void;
}

export function DesignThemePanel({ theme, primaryColor, secondaryColor, onUpdate, onSelectPreset }: DesignThemePanelProps) {
  return (
    <div className="flex flex-col gap-5 p-4 overflow-y-auto">
      {/* Preset picker */}
      <PresetPicker
        activePresetId={theme.activePresetId}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onSelectPreset={onSelectPreset}
      />

      <hr className="border-t" />

      {/* Fine-tune controls */}
      <div className="flex items-center gap-2">
        <Paintbrush className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Customize</h3>
      </div>

      {/* Font selectors */}
      <div className="space-y-1.5">
        <Label className="text-xs">Heading Font</Label>
        <Select
          value={theme.headingFont || "Inter"}
          onValueChange={(v) => onUpdate({ headingFont: v })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((f) => (
              <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Body Font</Label>
        <Select
          value={theme.bodyFont || "Inter"}
          onValueChange={(v) => onUpdate({ bodyFont: v })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((f) => (
              <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic theme selects */}
      {THEME_SELECTS.map(({ key, label, options }) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-xs">{label}</Label>
          <Select
            value={(theme[key as keyof DesignTheme] as string) || options[0].value}
            onValueChange={(v) => onUpdate({ [key]: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
