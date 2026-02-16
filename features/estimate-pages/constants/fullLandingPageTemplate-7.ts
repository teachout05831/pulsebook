/**
 * Full Landing Page Template — Part 7: Sections 10-12 (video CTA, calendar, FAQ).
 */

import { videoCtaHtml, videoCtaCss } from "./fullLandingPageTemplate-4";

// Sections 10-12: Video Call CTA, Calendar, FAQ
export const SECTIONS_PART_2B = [
  // 10. Video Call CTA — custom HTML (dark gradient centered)
  {
    id: "flp10",
    type: "custom_html",
    order: 9,
    visible: true,
    settings: {},
    content: { html: videoCtaHtml, css: videoCtaCss },
  },
  // 11. Calendar / Scheduling
  {
    id: "flp11",
    type: "calendar",
    order: 10,
    visible: true,
    settings: { variant: "inline" },
    content: {
      title: "Pick Your Preferred Start Date",
      description:
        "Select a date that works for you and we'll confirm within 24 hours.",
      bookingUrl: "",
    },
  },
  // 12. FAQ
  {
    id: "flp12",
    type: "faq",
    order: 11,
    visible: true,
    settings: { variant: "accordion" },
    content: {
      title: "Common Questions",
      items: [
        {
          question: "How long will the renovation take?",
          answer:
            "A typical renovation takes 4-6 weeks from demolition to final walkthrough. Premium and Luxury packages may require additional time for custom fabrication. We'll provide a detailed day-by-day schedule once you approve.",
        },
        {
          question: "Do we need to move out during construction?",
          answer:
            "No! Most families stay in their homes. We set up dust barriers, protect adjacent rooms, and clean up daily. We'll help set up a temporary station with essentials.",
        },
        {
          question: "What's included in the warranty?",
          answer:
            "Every project includes a 2-year craftsmanship warranty covering all labor and installation. If anything we installed develops an issue, we come back and fix it at no cost. The Luxury package includes an extended 5-year warranty.",
        },
        {
          question: "How does the payment schedule work?",
          answer:
            "We offer flexible payment options. The standard schedule is a 10% deposit upon approval, with the remaining balance split across project milestones. No hidden fees, no surprise charges.",
        },
        {
          question: "Can we make changes after approving?",
          answer:
            "Absolutely. Minor changes like paint colors or hardware swaps can often be accommodated at no extra cost. Larger changes will be documented as a change order with a clear price adjustment before any work is done.",
        },
      ],
    },
  },
];
