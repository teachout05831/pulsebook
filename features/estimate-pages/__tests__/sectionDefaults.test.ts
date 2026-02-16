import { describe, it, expect } from "vitest";
import { getDefaultContent } from "../constants/sectionDefaults";
import type { SectionType } from "../types";

const ALL_SECTION_TYPES: SectionType[] = [
  "hero", "about", "trust_badges", "scope", "pricing", "gallery",
  "testimonials", "faq", "timeline", "video", "video_call", "calendar",
  "approval", "payment", "contact", "chat", "before_after",
  "content_block", "custom_html", "service_picker", "scheduler", "booking_form",
];

describe("getDefaultContent", () => {
  it("returns an object for every known section type", () => {
    for (const type of ALL_SECTION_TYPES) {
      const content = getDefaultContent(type);
      expect(content).toBeDefined();
      expect(typeof content).toBe("object");
    }
  });

  it("returns empty object for hero", () => {
    expect(getDefaultContent("hero")).toEqual({});
  });

  it("returns title and description for about", () => {
    const content = getDefaultContent("about");
    expect(content.title).toBe("Why Choose Us");
    expect(typeof content.description).toBe("string");
  });

  it("returns packages array with 3 items for pricing", () => {
    const content = getDefaultContent("pricing");
    expect(Array.isArray(content.packages)).toBe(true);
    expect((content.packages as unknown[]).length).toBe(3);
  });

  it("returns phone, email, address, hours for contact", () => {
    const content = getDefaultContent("contact");
    expect(content.phone).toBeDefined();
    expect(content.email).toBeDefined();
    expect(content.address).toBeDefined();
    expect(content.hours).toBeDefined();
  });

  it("returns cells array for content_block", () => {
    const content = getDefaultContent("content_block");
    expect(content.columns).toBe(2);
    expect(Array.isArray(content.cells)).toBe(true);
    expect((content.cells as unknown[]).length).toBe(2);
  });

  it("returns html and css for custom_html", () => {
    const content = getDefaultContent("custom_html");
    expect(typeof content.html).toBe("string");
    expect(typeof content.css).toBe("string");
  });

  it("returns empty object for unknown section type", () => {
    expect(getDefaultContent("nonexistent" as SectionType)).toEqual({});
  });
});
