import { describe, it, expect } from "vitest";
import {
  getPresetById,
  getPresetSectionDefaults,
  DESIGN_PRESETS,
} from "../constants/designPresets";
import type { SectionType } from "../types";

describe("getPresetById", () => {
  it("returns preset for known id", () => {
    const preset = getPresetById("modern-minimal");
    expect(preset).toBeDefined();
    expect(preset!.name).toBe("Modern Minimal");
  });

  it("returns undefined for unknown id", () => {
    expect(getPresetById("nonexistent")).toBeUndefined();
  });

  it("can find all defined presets", () => {
    for (const preset of DESIGN_PRESETS) {
      expect(getPresetById(preset.id)).toBe(preset);
    }
  });
});

describe("getPresetSectionDefaults", () => {
  it("returns section defaults for valid preset and section", () => {
    const defaults = getPresetSectionDefaults("modern-minimal", "hero" as SectionType);
    expect(defaults).toEqual({ variant: "clean" });
  });

  it("returns empty object for valid preset but unknown section", () => {
    const defaults = getPresetSectionDefaults("modern-minimal", "chat" as SectionType);
    expect(defaults).toEqual({});
  });

  it("returns empty object when presetId is undefined", () => {
    expect(getPresetSectionDefaults(undefined, "hero" as SectionType)).toEqual({});
  });

  it("returns empty object when presetId is unknown", () => {
    expect(getPresetSectionDefaults("nope", "hero" as SectionType)).toEqual({});
  });
});
