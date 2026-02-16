/**
 * Full Landing Page Template — Part 8: Sections 13-15 + design_theme + incentive_config.
 */

import { footerHtml, footerCss } from "./fullLandingPageTemplate-4";

// Sections 13-15: Approval, Timeline, Contact Footer
export const SECTIONS_PART_3 = [
  // 13. Approval + Payment
  {
    id: "flp13",
    type: "approval",
    order: 12,
    visible: true,
    settings: { variant: "detailed" },
    content: {
      title: "Ready to Transform Your Space?",
      subtitle:
        "Review your selection, choose a payment plan, and let's get started.",
    },
  },
  // 14. Timeline / Next Steps
  {
    id: "flp14",
    type: "timeline",
    order: 13,
    visible: true,
    settings: {},
    content: {
      title: "What Happens Next",
      steps: [
        {
          title: "Estimate Sent",
          description:
            "You're reviewing it right now — take your time exploring every detail.",
        },
        {
          title: "Estimate Approved + Deposit",
          description:
            "Approve above and we begin planning your project immediately.",
        },
        {
          title: "Design Finalization",
          description:
            "3D renderings, material selections, and final project plan.",
        },
        {
          title: "Materials Ordered",
          description:
            "Cabinets, countertops, and appliances secured for your project.",
        },
        {
          title: "Construction Begins",
          description:
            "4-6 weeks of expert craftsmanship with daily progress updates.",
        },
        {
          title: "Final Walkthrough + Payment",
          description:
            "Inspect, approve, and enjoy your newly transformed space.",
        },
      ],
    },
  },
  // 15. Contact Footer — custom HTML (rich dark footer)
  {
    id: "flp15",
    type: "custom_html",
    order: 14,
    visible: true,
    settings: {},
    content: { html: footerHtml, css: footerCss },
  },
];

export const FLP_DESIGN_THEME = {
  activePresetId: "bold-professional",
  headingFont: "Instrument Sans",
  bodyFont: "Inter",
  headingWeight: "700",
  headingCase: "normal" as const,
  borderRadius: "large" as const,
  cardStyle: "soft-shadow" as const,
  buttonStyle: "rounded" as const,
  sectionSpacing: "generous" as const,
  contentWidth: "wide" as const,
  headerStyle: "gradient" as const,
  backgroundPattern: "alternating" as const,
  accentPlacement: "none" as const,
  dividerStyle: "none" as const,
  animations: "subtle-fade" as const,
  hoverEffects: "lift" as const,
};

export const FLP_INCENTIVE_CONFIG = {
  enabled: true,
  tiers: [
    {
      id: "t1",
      label: "Early Bird",
      deadlineMode: "relative",
      relativeHours: 48,
      absoluteDeadline: null,
      deadline: null,
      discountType: "percentage",
      discountValue: 10,
      message: "Approve within 48 hours to save 10%",
    },
    {
      id: "t2",
      label: "This Week",
      deadlineMode: "relative",
      relativeHours: 168,
      absoluteDeadline: null,
      deadline: null,
      discountType: "percentage",
      discountValue: 5,
      message: "Approve within 7 days to save 5%",
    },
  ],
  expiredMessage: "Special pricing has ended — standard rates apply",
  showCountdown: true,
  showSavings: true,
  baseRateLabel: "Standard Rate",
};
