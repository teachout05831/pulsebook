import { describe, it, expect } from "vitest";
import {
  getFieldLabel,
  isLongText,
  replaceVariables,
  regenerateBlockHtml,
} from "../utils/blockHelpers";

describe("getFieldLabel", () => {
  it("converts camelCase to spaced label", () => {
    expect(getFieldLabel("heroHeadline")).toBe("Hero Headline");
  });

  it("capitalises a single word", () => {
    expect(getFieldLabel("title")).toBe("Title");
  });

  it("handles multi-hump camelCase", () => {
    expect(getFieldLabel("ctaButtonText")).toBe("Cta Button Text");
  });

  it("returns empty string for empty input", () => {
    expect(getFieldLabel("")).toBe("");
  });
});

describe("isLongText", () => {
  it("returns true for description keyword", () => {
    expect(isLongText("featureDescription")).toBe(true);
  });

  it("returns true for text keyword", () => {
    expect(isLongText("heroText")).toBe(true);
  });

  it("returns true for answer keyword", () => {
    expect(isLongText("faqAnswer")).toBe(true);
  });

  it("returns true for content keyword", () => {
    expect(isLongText("mainContent")).toBe(true);
  });

  it("returns false when no keyword matches", () => {
    expect(isLongText("title")).toBe(false);
    expect(isLongText("heroHeadline")).toBe(false);
    expect(isLongText("price")).toBe(false);
  });
});

describe("replaceVariables", () => {
  it("substitutes a simple variable", () => {
    expect(replaceVariables("Hello {{name}}", { name: "World" })).toBe("Hello World");
  });

  it("substitutes multiple variables", () => {
    expect(replaceVariables("{{a}} and {{b}}", { a: "1", b: "2" })).toBe("1 and 2");
  });

  it("leaves missing variables unchanged", () => {
    expect(replaceVariables("{{missing}}", {})).toBe("{{missing}}");
  });

  it("handles whitespace inside braces", () => {
    expect(replaceVariables("{{ name }}", { name: "X" })).toBe("X");
  });

  it("handles dotted keys", () => {
    expect(replaceVariables("{{brand.primaryColor}}", { "brand.primaryColor": "#fff" })).toBe("#fff");
  });

  it("returns plain text unchanged", () => {
    expect(replaceVariables("no variables here", { foo: "bar" })).toBe("no variables here");
  });

  it("preserves empty string values (bug #7 regression)", () => {
    expect(replaceVariables("{{title}}", { title: "" })).toBe("");
  });

  it('preserves "0" values (bug #7 regression)', () => {
    expect(replaceVariables("{{count}}", { count: "0" })).toBe("0");
  });
});

describe("regenerateBlockHtml", () => {
  it("applies replaceVariables to both html and css", () => {
    const result = regenerateBlockHtml(
      "<h1>{{title}}</h1>",
      ".h1 { color: {{brand.primaryColor}}; }",
      { title: "Hi", "brand.primaryColor": "red" },
    );
    expect(result.html).toBe("<h1>Hi</h1>");
    expect(result.css).toBe(".h1 { color: red; }");
  });

  it("preserves unreplaced variables", () => {
    const result = regenerateBlockHtml("{{a}}", "{{b}}", {});
    expect(result.html).toBe("{{a}}");
    expect(result.css).toBe("{{b}}");
  });
});
