/**
 * Executive Template — based on the 01-executive-template.html mockup.
 * Uses custom_html sections for pixel-perfect visual areas and
 * standard React sections for interactive features (pricing, approval).
 *
 * Split into sub-files for maintainability:
 *  - executiveTemplate-1: Hero HTML/CSS + Scope/Trust HTML
 *  - executiveTemplate-2: Scope/Trust CSS + CTA HTML/CSS
 */

import { heroHtml, heroCss, scopeTrustHtml } from "./executiveTemplate-1";
import { scopeTrustCss, ctaHtml, ctaCss } from "./executiveTemplate-2";

export const EXECUTIVE_TEMPLATE = {
  name: "Executive",
  description: "Premium executive layout inspired by high-end service proposals. Gradient hero, two-column scope + trust sidebar, polished pricing tiers, and conversion-optimized CTA banners.",
  category: "General",
  sections: [
    // 1. Hero — custom HTML
    { id: "ex1", type: "custom_html", order: 0, visible: true, settings: {},
      content: { html: heroHtml, css: heroCss } },
    // 2. Scope + Trust sidebar — custom HTML two-column
    { id: "ex2", type: "custom_html", order: 1, visible: true, settings: {},
      content: { html: scopeTrustHtml, css: scopeTrustCss } },
    // 3. Pricing tiers — standard React component (interactive)
    { id: "ex3", type: "pricing", order: 2, visible: true, settings: { variant: "packages" },
      content: { title: "Choose the Right Option", packages: [
        { name: "Essential Service", price: 4200, tierLabel: "GOOD", priceNote: "Complete installed price", features: ["Professional installation included", "Standard equipment & materials", "1-year parts & labor warranty", "City permit & inspection", "Post-project cleanup"], recommended: false },
        { name: "Premium Service", price: 5800, tierLabel: "BETTER", priceNote: "Complete installed price", savingsNote: "Most Popular", features: ["Everything in Essential, plus:", "High-efficiency equipment upgrade", "3-year parts & labor warranty", "Smart thermostat included", "Priority scheduling", "Annual maintenance check"], recommended: true },
        { name: "Elite Service", price: 7500, tierLabel: "BEST", priceNote: "Complete installed price", savingsNote: "Best Long-Term Value", features: ["Everything in Premium, plus:", "Top-tier equipment", "5-year comprehensive warranty", "Air quality system included", "Same-day scheduling", "Lifetime maintenance plan", "100% satisfaction guarantee"], recommended: false },
      ] } },
    // 4. Testimonials — standard React component
    { id: "ex4", type: "testimonials", order: 3, visible: true, settings: { variant: "cards" },
      content: { title: "What Our Customers Say", showGoogleRating: true, testimonials: [
        { name: "Robert & Maria Johnson", text: "They were incredibly professional from start to finish. The crew arrived on time, explained everything clearly, and the work was flawless. We noticed the difference immediately. Worth every penny.", rating: 5 },
        { name: "Dr. Sarah Chen", text: "I've hired many contractors over the years and this team stands head and shoulders above. Fair pricing, transparent communication, and outstanding workmanship. Already recommended them to three neighbors.", rating: 5 },
        { name: "Mark Thompson", text: "Had an emergency situation on a weekend and they responded within an hour. Not only did they fix the immediate problem, they identified a potential future issue and addressed it on the spot. True professionals.", rating: 5 },
      ] } },
    // 5. Questions CTA — custom HTML
    { id: "ex5", type: "custom_html", order: 4, visible: true, settings: {},
      content: { html: ctaHtml, css: ctaCss } },
    // 6. Timeline — standard React component
    { id: "ex6", type: "timeline", order: 5, visible: true, settings: {},
      content: { title: "What Happens After You Approve", steps: [
        { title: "Confirmation & Scheduling", description: "We'll confirm your approval and schedule the project within 24 hours. You'll receive a detailed timeline via email." },
        { title: "Pre-Project Preparation", description: "Our team prepares all materials and equipment. We'll send a reminder the day before with arrival time and crew details." },
        { title: "Project Day", description: "Our certified technicians arrive on time with everything needed. We protect your property, complete the work, and clean up thoroughly." },
        { title: "Final Walkthrough", description: "We walk through the completed project together. You don't pay the remaining balance until you're 100% satisfied with every detail." },
      ] } },
    // 7. Approval — standard React component (interactive)
    { id: "ex7", type: "approval", order: 6, visible: true, settings: { variant: "detailed" },
      content: { title: "Ready to Move Forward?", subtitle: "Review the details above and approve to lock in your pricing and schedule." } },
    // 8. Contact footer — standard React component
    { id: "ex8", type: "contact", order: 7, visible: true, settings: { variant: "detailed" },
      content: { phone: "(555) 123-4567", email: "hello@yourcompany.com", address: "123 Main Street, Your City, ST 12345", hours: "Mon-Fri: 7am-6pm\nSat: 8am-2pm" } },
  ],
  design_theme: {
    activePresetId: "clean-corporate",
    headingFont: "Montserrat",
    bodyFont: "Inter",
    headingWeight: "700",
    headingCase: "normal",
    borderRadius: "medium",
    cardStyle: "soft-shadow",
    buttonStyle: "rounded",
    sectionSpacing: "generous",
    contentWidth: "wide",
    headerStyle: "dark-filled",
    backgroundPattern: "solid",
    accentPlacement: "none",
    dividerStyle: "none",
    animations: "subtle-fade",
    hoverEffects: "lift",
  },
  incentive_config: {
    enabled: true,
    tiers: [
      { id: "t1", label: "Quick Response", deadlineMode: "relative", relativeHours: 48, absoluteDeadline: null, deadline: null, discountType: "percentage", discountValue: 10, message: "Approve within 48 hours to save 10%" },
    ],
    expiredMessage: "Special pricing has ended",
    showCountdown: true,
    showSavings: true,
    baseRateLabel: "Standard Rate",
  },
};
