/**
 * Fresh & Clean Template — based on the 02-fresh-clean-template.html mockup.
 * Uses custom_html sections with editable block fields for the unique visual
 * elements, and standard React sections for interactive features
 * (gallery, testimonials, calendar, contact).
 *
 * Every custom_html section has blockId + blockValues so users can
 * edit content via form fields in the right panel.
 */

import { CLEANING_BLOCKS } from "../types/htmlBlocks/blocks-cleaning";
import { replaceVariables } from "../utils/blockHelpers";

function makeBlock(blockId: string, values: Record<string, string>) {
  const block = CLEANING_BLOCKS.find((b) => b.id === blockId);
  if (!block) throw new Error(`Block ${blockId} not found`);
  return {
    html: replaceVariables(block.html, values),
    css: replaceVariables(block.css, values),
    blockId,
    blockValues: values,
  };
}

export const FRESH_CLEAN_TEMPLATE = {
  name: "Fresh & Clean",
  description:
    "Bright, modern cleaning estimate with expandable room checklists, pricing card, upsell banner, photo gallery, testimonials, and calendar picker. Mint green aesthetic with soft shadows.",
  category: "Cleaning",
  sections: [
    // 1. Hero — native section (brand logo + tagline)
    {
      id: "fc-hero",
      type: "hero",
      order: 0,
      visible: true,
      settings: { variant: "clean" },
      content: {},
    },

    // 2. Personal Greeting — custom HTML (editable)
    {
      id: "fc-greeting",
      type: "custom_html",
      order: 1,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-greeting", {
        customerName: "Sarah",
        introLine:
          "Thanks for inviting us into your home! We stopped by",
        address: "123 Oak Street",
        bodyText:
          "and loved the layout of your 3-bedroom home. Here's a custom cleaning plan put together just for you — covering every room from top to bottom so your space feels fresh, bright, and truly relaxing.",
      }),
    },

    // 3. Section heading — "What's Included"
    {
      id: "fc-scope-heading",
      type: "custom_html",
      order: 2,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-scope-heading", {
        headingIcon: "✅",
        heading: "What's Included",
        subtitle: "Tap any room to see the full checklist",
      }),
    },

    // 4. Kitchen Room Card
    {
      id: "fc-room-kitchen",
      type: "custom_html",
      order: 3,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-room-card", {
        roomEmoji: "🍳",
        roomName: "Kitchen",
        roomMeta: "4 tasks included",
        task1: "Deep clean countertops, backsplash & sink basin",
        task2: "Degrease stovetop, range hood & oven exterior",
        task3: "Clean & sanitize appliance exteriors (fridge, dishwasher, microwave)",
        task4: "Mop & sanitize tile floors, clean baseboards",
      }),
    },

    // 5. Bathrooms Room Card
    {
      id: "fc-room-bathrooms",
      type: "custom_html",
      order: 4,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-room-card", {
        roomEmoji: "🛁",
        roomName: "Bathrooms ×2",
        roomMeta: "4 tasks per bathroom",
        task1: "Scrub & disinfect toilet, tub & shower walls",
        task2: "Polish mirrors, fixtures & chrome hardware",
        task3: "Clean vanity, countertops & cabinets",
        task4: "Mop floors, clean grout lines & sanitize trash cans",
      }),
    },

    // 6. Living Areas Room Card
    {
      id: "fc-room-living",
      type: "custom_html",
      order: 5,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-room-card", {
        roomEmoji: "🛋️",
        roomName: "Living Areas",
        roomMeta: "4 tasks included",
        task1: "Dust all surfaces, shelves, lamps & ceiling fans",
        task2: "Vacuum carpets, rugs & upholstered furniture",
        task3: "Wipe baseboards, window sills & light switches",
        task4: "Clean and polish glass surfaces & mirrors",
      }),
    },

    // 7. Bedrooms Room Card
    {
      id: "fc-room-bedrooms",
      type: "custom_html",
      order: 6,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-room-card", {
        roomEmoji: "🛏️",
        roomName: "Bedrooms ×3",
        roomMeta: "4 tasks per bedroom",
        task1: "Dust nightstands, dressers & all furniture surfaces",
        task2: "Vacuum floors, under beds & closet floors",
        task3: "Make beds, fluff pillows & organize visible items",
        task4: "Clean mirrors, light fixtures & door handles",
      }),
    },

    // 8. Pricing Card
    {
      id: "fc-pricing",
      type: "custom_html",
      order: 7,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-pricing-card", {
        pricingTitle: "Custom Cleaning Plan for 123 Oak Street",
        pricingSubtitle: "3 bed • 2 bath • ~1,600 sq ft",
        item1Name: "Deep Clean",
        item1Badge: "One-Time",
        item1Price: "$230",
        item2Name: "Pet Odor Treatment",
        item2Badge: "Add-on",
        item2Price: "+$45",
        totalAmount: "$275",
      }),
    },

    // 9. Upsell Banner
    {
      id: "fc-upsell",
      type: "custom_html",
      order: 8,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-upsell-banner", {
        upsellTitle: "Save 15% with weekly service!",
        upsellDescription:
          "Lock in a recurring clean and save every week. Cancel anytime.",
        upsellPrice: "$195",
        upsellPeriod: "week",
      }),
    },

    // 10. Photo Gallery — native section
    {
      id: "fc-gallery",
      type: "gallery",
      order: 9,
      visible: true,
      settings: { variant: "grid" },
      content: {
        title: "Our Recent Work",
        photos: [],
      },
    },

    // 11. Testimonials — native section
    {
      id: "fc-testimonials",
      type: "testimonials",
      order: 10,
      visible: true,
      settings: { variant: "cards" },
      content: {
        title: "What Our Clients Say",
        showGoogleRating: true,
        testimonials: [
          {
            name: "Jessica M.",
            text: "I've tried 3 different cleaning services and Sparkle is hands-down the best. They pay attention to every detail — my kitchen has never looked this good. Honestly felt like I walked into a model home!",
            rating: 5,
          },
          {
            name: "David R.",
            text: "The team was professional, punctual, and incredibly thorough. They cleaned spots I didn't even know existed. My wife and I were blown away. Booking them monthly now!",
            rating: 5,
          },
          {
            name: "Amanda T.",
            text: "Best cleaning service we've ever used. The attention to detail is unmatched — they even folded our towels into decorative shapes. Highly recommend to anyone looking for top-tier cleaning.",
            rating: 5,
          },
        ],
      },
    },

    // 12. Calendar — native section
    {
      id: "fc-calendar",
      type: "calendar",
      order: 11,
      visible: true,
      settings: { variant: "embedded" },
      content: {
        title: "Pick a Date",
        description: "Choose a day that works best for your cleaning.",
        bookingUrl: "",
      },
    },

    // 13. CTA Buttons
    {
      id: "fc-cta",
      type: "custom_html",
      order: 12,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-cta-buttons", {
        mainButtonLabel: "Book This Cleaning",
        secondaryButtonLabel: "Text Us a Question",
        linkLabel: "Start a Video Chat",
      }),
    },

    // 14. Guarantee Badge
    {
      id: "fc-guarantee",
      type: "custom_html",
      order: 13,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-guarantee", {
        guaranteeTitle: "100% Satisfaction Guaranteed",
        guaranteeDescription:
          "Not happy? We'll re-clean for free within 24 hours. No questions asked.",
      }),
    },

    // 15. Estimate Note
    {
      id: "fc-note",
      type: "custom_html",
      order: 14,
      visible: true,
      settings: {},
      content: makeBlock("cleaning-estimate-note", {
        validDays: "30",
        estimateNumber: "SC-2026-0847",
        preparedDate: "Feb 6, 2026",
      }),
    },

    // 16. Contact Footer — native section
    {
      id: "fc-contact",
      type: "contact",
      order: 15,
      visible: true,
      settings: { variant: "detailed" },
      content: {
        phone: "(555) 123-4567",
        email: "hello@sparklehome.com",
        address: "Sparkle Home Cleaning, LLC",
        hours: "Mon-Fri: 7am-6pm\nSat: 8am-2pm",
      },
    },
  ],
  design_theme: {
    activePresetId: "fresh-clean",
    headingFont: "Poppins",
    bodyFont: "Nunito",
    headingWeight: "700",
    headingCase: "normal" as const,
    borderRadius: "large" as const,
    cardStyle: "soft-shadow" as const,
    buttonStyle: "pill" as const,
    sectionSpacing: "generous" as const,
    contentWidth: "narrow" as const,
    headerStyle: "transparent" as const,
    backgroundPattern: "gradient-fade" as const,
    accentPlacement: "none" as const,
    dividerStyle: "none" as const,
    animations: "subtle-fade" as const,
    hoverEffects: "lift" as const,
  },
};
