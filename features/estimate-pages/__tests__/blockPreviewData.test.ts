import { describe, it, expect } from "vitest";
import { generatePreviewData } from "../utils/blockPreviewData";

describe("generatePreviewData", () => {
  it("returns mapped value for known variable", () => {
    const result = generatePreviewData(["brand.primaryColor"]);
    expect(result["brand.primaryColor"]).toBe("#2563eb");
  });

  it("returns fallback for unknown variable", () => {
    const result = generatePreviewData(["unknownVar"]);
    expect(result.unknownVar).toBe("Sample unknownVar");
  });

  it("returns empty object for empty array", () => {
    expect(generatePreviewData([])).toEqual({});
  });

  it("handles mix of known and unknown variables", () => {
    const result = generatePreviewData(["title", "xyzNotReal"]);
    expect(result.title).toBe("24/7 Emergency Service Available");
    expect(result.xyzNotReal).toBe("Sample xyzNotReal");
  });

  it("returns all requested keys", () => {
    const vars = ["stat1Number", "stat1Label", "missing"];
    const result = generatePreviewData(vars);
    expect(Object.keys(result)).toHaveLength(3);
    expect(result.stat1Number).toBe("500+");
    expect(result.stat1Label).toBe("Projects Completed");
  });
});
