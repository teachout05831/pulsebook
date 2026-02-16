/**
 * Full Landing Page Template — Part 6: Sections 8-9 (pricing + testimonials).
 */

// Sections 8-9: Pricing, Testimonials
export const SECTIONS_PART_2A = [
  // 8. Pricing — 3 tiers
  {
    id: "flp8",
    type: "pricing",
    order: 7,
    visible: true,
    settings: { variant: "packages" },
    content: {
      title: "Choose Your Package",
      packages: [
        {
          name: "Essential",
          price: 32500,
          tierLabel: "TIER 1",
          priceNote: "Complete installed price",
          features: [
            "Stock cabinets",
            "Laminate countertops",
            "Standard appliances",
            "Basic backsplash",
            "Standard lighting",
          ],
          recommended: false,
        },
        {
          name: "Premium",
          price: 47800,
          tierLabel: "TIER 2",
          priceNote: "Complete installed price",
          savingsNote: "Most Popular",
          features: [
            "Semi-custom cabinets",
            "Quartz countertops",
            "Mid-range appliances",
            "Tile backsplash",
            "Recessed + pendant lighting",
            "Soft-close hardware",
          ],
          recommended: true,
        },
        {
          name: "Luxury",
          price: 68500,
          tierLabel: "TIER 3",
          priceNote: "Complete installed price",
          savingsNote: "Best Long-Term Value",
          features: [
            "Custom cabinets",
            "Natural stone countertops",
            "Premium appliances",
            "Designer backsplash",
            "Custom lighting design",
            "Smart home integration",
            "Extended warranty",
          ],
          recommended: false,
        },
      ],
    },
  },
  // 9. Customer Reviews
  {
    id: "flp9",
    type: "testimonials",
    order: 8,
    visible: true,
    settings: { variant: "cards" },
    content: {
      title: "What Our Customers Say",
      showGoogleRating: true,
      testimonials: [
        {
          name: "Sarah K.",
          text: "Our kitchen was stuck in the 90s and they completely transformed it. The quartz countertops are stunning, and the soft-close cabinets feel so luxurious. Came in on budget and two days early!",
          rating: 5,
        },
        {
          name: "James T.",
          text: "We interviewed five contractors and they were the only one who listened to what we actually wanted. The 3D rendering was almost identical to the final result. Zero regrets choosing the Premium package.",
          rating: 5,
        },
        {
          name: "Maria R.",
          text: "I was nervous about a major renovation with two toddlers in the house. The crew was incredibly respectful — plastic sheeting up every evening, cleaned up daily. The new kitchen is magazine-worthy.",
          rating: 5,
        },
      ],
    },
  },
];
