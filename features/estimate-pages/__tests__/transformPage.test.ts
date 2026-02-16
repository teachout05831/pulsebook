import { describe, it, expect } from "vitest";
import { vi } from "vitest";

// Mock Supabase so the top-level import in getEstimatePages.ts doesn't fail
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { transformPage } from "../queries/getEstimatePages";

const fullRow = {
  id: "page-1",
  company_id: "comp-1",
  estimate_id: "est-1",
  template_id: "tpl-1",
  public_token: "abc123",
  is_active: true,
  expires_at: "2026-12-31T00:00:00Z",
  sections: [{ id: "s1", type: "hero", order: 1, visible: true, settings: {}, content: {} }],
  design_theme: { headingFont: "Inter" },
  brand_overrides: { primaryColor: "#ff0000" },
  allow_video_call: true,
  allow_scheduling: false,
  allow_chat: true,
  allow_instant_approval: true,
  require_deposit: true,
  deposit_amount: 500,
  deposit_type: "flat",
  payment_plans: [{ months: 3 }],
  incentive_config: { enabled: true },
  approved_incentive_tier: { name: "Tier 1" },
  status: "published",
  published_at: "2026-01-15T12:00:00Z",
  first_viewed_at: "2026-01-16T09:00:00Z",
  last_viewed_at: "2026-01-17T10:00:00Z",
  approved_at: null,
  declined_at: null,
  created_by: "user-1",
  created_at: "2026-01-10T00:00:00Z",
  updated_at: "2026-01-15T12:00:00Z",
};

describe("transformPage", () => {
  it("maps all snake_case fields to camelCase", () => {
    const result = transformPage(fullRow);

    expect(result.id).toBe("page-1");
    expect(result.companyId).toBe("comp-1");
    expect(result.estimateId).toBe("est-1");
    expect(result.templateId).toBe("tpl-1");
    expect(result.publicToken).toBe("abc123");
    expect(result.isActive).toBe(true);
    expect(result.expiresAt).toBe("2026-12-31T00:00:00Z");
    expect(result.sections).toHaveLength(1);
    expect(result.designTheme).toEqual({ headingFont: "Inter" });
    expect(result.brandOverrides).toEqual({ primaryColor: "#ff0000" });
    expect(result.allowVideoCall).toBe(true);
    expect(result.allowScheduling).toBe(false);
    expect(result.allowChat).toBe(true);
    expect(result.allowInstantApproval).toBe(true);
    expect(result.requireDeposit).toBe(true);
    expect(result.depositAmount).toBe(500);
    expect(result.depositType).toBe("flat");
    expect(result.paymentPlans).toEqual([{ months: 3 }]);
    expect(result.incentiveConfig).toEqual({ enabled: true });
    expect(result.approvedIncentiveTier).toEqual({ name: "Tier 1" });
    expect(result.status).toBe("published");
    expect(result.publishedAt).toBe("2026-01-15T12:00:00Z");
    expect(result.firstViewedAt).toBe("2026-01-16T09:00:00Z");
    expect(result.lastViewedAt).toBe("2026-01-17T10:00:00Z");
    expect(result.approvedAt).toBeNull();
    expect(result.declinedAt).toBeNull();
    expect(result.createdBy).toBe("user-1");
    expect(result.createdAt).toBe("2026-01-10T00:00:00Z");
    expect(result.updatedAt).toBe("2026-01-15T12:00:00Z");
  });

  it("defaults sections to empty array when null", () => {
    const result = transformPage({ ...fullRow, sections: null });
    expect(result.sections).toEqual([]);
  });

  it("defaults designTheme to empty object when null", () => {
    const result = transformPage({ ...fullRow, design_theme: null });
    expect(result.designTheme).toEqual({});
  });

  it("defaults depositType to flat when null", () => {
    const result = transformPage({ ...fullRow, deposit_type: null });
    expect(result.depositType).toBe("flat");
  });

  it("defaults templateId to null when empty string", () => {
    const result = transformPage({ ...fullRow, template_id: "" });
    expect(result.templateId).toBeNull();
  });
});
