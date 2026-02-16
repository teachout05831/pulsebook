import type { SectionType } from "../types";

/**
 * Returns realistic sample content for each section type.
 * Used when adding a new section so it renders immediately with
 * plug-and-play content the user can swap out.
 */
export function getDefaultContent(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {};

    case "about":
      return {
        title: "Why Choose Us",
        description:
          "We've been proudly serving our community for over a decade. Our team of certified professionals is dedicated to delivering exceptional quality, transparent pricing, and outstanding customer service on every project.\n\nWe stand behind our work with a satisfaction guarantee because your trust means everything to us.",
      };

    case "trust_badges":
      return { showGoogleRating: true, showCertifications: true, showInsurance: true, badges: [] };

    case "scope":
      return {
        title: "Scope of Work",
        narrative: "Here's a detailed breakdown of everything included in your project. Each item has been carefully considered to ensure we deliver exactly what you need.",
      };

    case "pricing":
      return {
        title: "Your Investment",
        packages: [
          { name: "Basic Service", price: 2500, features: ["Standard service", "Basic materials", "30-day warranty"], tierLabel: "GOOD", priceNote: "/project" },
          { name: "Premium Service", price: 4200, features: ["Enhanced service", "Premium materials", "90-day warranty", "Priority scheduling"], recommended: true, tierLabel: "BETTER", priceNote: "/project", savingsNote: "Most Popular" },
          { name: "Elite Service", price: 6500, features: ["Full-service package", "Top-tier materials", "1-year warranty", "Priority scheduling", "Dedicated project manager"], tierLabel: "BEST", priceNote: "/project", savingsNote: "Best Value" },
        ],
      };

    case "gallery":
      return { title: "Our Work", photos: [] };

    case "testimonials":
      return { title: "What Our Customers Say", showGoogleRating: true, testimonials: [] };

    case "faq":
      return { title: "Frequently Asked Questions" };

    case "timeline":
      return { title: "What Happens Next" };

    case "video":
      return { title: "See Our Work in Action", description: "Watch how we approach projects like yours." };

    case "video_call":
      return {
        title: "Let's Talk Through Your Project",
        description: "Schedule a quick video call so we can walk through every detail together.",
      };

    case "calendar":
      return {
        title: "Book Your Appointment",
        description: "Pick a time that works for you and we'll handle the rest.",
        bookingUrl: "",
      };

    case "approval":
      return { title: "Ready to Get Started?", subtitle: "Review and approve your estimate below." };

    case "payment":
      return { title: "Secure Your Project", depositType: "percentage", depositAmount: 50 };

    case "contact":
      return {
        phone: "(555) 123-4567",
        email: "hello@yourcompany.com",
        address: "123 Main Street, Your City, ST 12345",
        hours: "Mon-Fri: 8am-5pm\nSat: 9am-1pm",
      };

    case "chat":
      return { welcomeMessage: "Have questions about this estimate? We're here to help!", responseEmail: "" };

    case "before_after":
      return { title: "See the Difference", beforeLabel: "Before", afterLabel: "After" };

    case "content_block":
      return {
        columns: 2,
        gap: "md",
        cells: [
          { id: crypto.randomUUID(), type: "text", content: { text: "Add your content here." } },
          { id: crypto.randomUUID(), type: "text", content: { text: "Add your content here." } },
        ],
      };

    case "custom_html":
      return {
        html: '<div style="padding: 3rem 1rem; text-align: center;">\n  <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">Custom Section</h2>\n  <p style="color: #6b7280;">Edit the HTML to build any design you want.</p>\n</div>',
        css: "",
      };

    case "service_picker":
      return {
        heading: "Select a Service",
        description: "Choose the service you'd like to book",
        layout: "grid",
        showPrices: true,
        showDurations: true,
      };

    case "scheduler":
      return {
        heading: "Pick a Date & Time",
        description: "Choose your preferred appointment time",
        calendarStyle: "inline",
        timeSlotInterval: 30,
        advanceBookingDays: 30,
        minimumNoticeHours: 24,
      };

    case "booking_form":
      return {
        heading: "Your Information",
        description: "Please provide your contact details to confirm your booking",
        requirePhone: true,
        requireEmail: true,
        requireAddress: false,
        customFields: [],
      };

    default:
      return {};
  }
}
