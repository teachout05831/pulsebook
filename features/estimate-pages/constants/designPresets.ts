import type { DesignTheme, SectionType } from "../types";

import { PRESETS_PART_1 } from "./designPresets-1";
import { PRESETS_PART_2 } from "./designPresets-2";

export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  theme: DesignTheme;
  sectionDefaults: Partial<Record<SectionType, { variant: string }>>;
}

export const DESIGN_PRESETS: DesignPreset[] = [
  ...PRESETS_PART_1,
  ...PRESETS_PART_2,
];

export function getPresetById(id: string): DesignPreset | undefined {
  return DESIGN_PRESETS.find((p) => p.id === id);
}

export function getPresetSectionDefaults(
  presetId: string | undefined,
  sectionType: SectionType,
): Record<string, unknown> {
  if (!presetId) return {};
  const preset = getPresetById(presetId);
  return preset?.sectionDefaults[sectionType] ?? {};
}
