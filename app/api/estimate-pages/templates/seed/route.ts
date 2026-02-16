import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { EXECUTIVE_TEMPLATE } from "@/features/estimate-pages/constants/executiveTemplate";
import { FULL_LANDING_PAGE_TEMPLATE } from "@/features/estimate-pages/constants/fullLandingPageTemplate";
import { FRESH_CLEAN_TEMPLATE } from "@/features/estimate-pages/constants/cleaningTemplate";

// Stock photos from Unsplash CDN — users replace with their own uploads
const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const IMG = {
  // Heroes
  heroHome:    u("photo-1581578731548-c64695cc6952", 1400, 700),
  heroCorp:    u("photo-1497366216548-37526070297c", 1400, 700),  // Modern office building
  heroPremium: u("photo-1600585154340-be6161a56a0c", 1400, 800),
  // About / team
  about:        u("photo-1522071820081-009f0129c71c", 800, 600),  // Team meeting
  aboutCorp:    u("photo-1521737711867-e3b97375f902", 800, 600),     // Professional team
  aboutPremium: u("photo-1600585154340-be6161a56a0c", 800, 600),
  // Gallery — corporate / commercial
  corpGal1: u("photo-1497366811353-6870744d04b2", 800, 600),      // Modern office space
  corpGal2: u("photo-1497215728101-856f4ea42174", 800, 600),      // Office interior
  corpGal3: u("photo-1504384308090-c894fdcc538d", 800, 600),      // Business workspace
  corpGal4: u("photo-1497215842964-222b430dc094", 800, 600),      // Conference room
  // Gallery — residential
  kitchen:  u("photo-1556909114-f6e7ad7d3136", 800, 600),
  exterior: u("photo-1600596542815-ffad4c1539a9", 800, 600),
  living:   u("photo-1600210492486-724fe5c67fb0", 800, 600),
  gallery4: u("photo-1552321554-5fefe8c9ef14", 800, 600),
  gallery5: u("photo-1484154218962-a197022b5858", 800, 600),
  gallery6: u("photo-1615529328331-f8917597711f", 800, 600),
  // Before / after
  before: u("photo-1534430480872-3498386e7856", 800, 600),
  after:  u("photo-1600585154340-be6161a56a0c", 800, 600),
};

const SEED_TEMPLATES = [
  // ── 1. Professional / Corporate ──────────────────────────────────
  {
    name: "Professional Corporate",
    description: "Clean, authoritative layout for consulting, commercial, and B2B services. Leads with scope and process clarity.",
    category: "General",
    sections: [
      { id: "s1", type: "hero", order: 0, visible: true, settings: { variant: "split" },
        content: { heroImageUrl: IMG.heroCorp } },
      { id: "s2", type: "trust_badges", order: 1, visible: true, settings: { variant: "minimal" },
        content: { showGoogleRating: true, showCertifications: true, showInsurance: true, badges: [
          { id: "b1", label: "BBB A+ Rated" },
          { id: "b2", label: "Industry Certified" },
          { id: "b3", label: "10+ Years Experience" },
        ] } },
      { id: "s3", type: "scope", order: 2, visible: true, settings: { variant: "detailed" },
        content: { title: "Scope of Work", narrative: "A clear breakdown of deliverables, timelines, and expectations for your project. Each line item has been carefully scoped to ensure we deliver exactly what was discussed." } },
      { id: "s4", type: "about", order: 3, visible: true, settings: { variant: "split" },
        content: { title: "Why Choose Us", imageUrl: IMG.aboutCorp, description: "We bring over a decade of industry expertise to every engagement. Our team of certified professionals delivers measurable results through proven methodologies and transparent communication.\n\nEvery project includes dedicated account management and a satisfaction guarantee." } },
      { id: "s4b", type: "custom_html", order: 4, visible: true, settings: {},
        content: {
          html: `<div class="ch-diff">
  <div class="ch-diff-inner">
    <p class="ch-label">WHY US</p>
    <h2 class="ch-heading">What Sets Us Apart</h2>
    <div class="ch-grid">
      <div class="ch-card">
        <div class="ch-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg></div>
        <h3 class="ch-card-title">Licensed & Insured</h3>
        <p class="ch-card-text">Full coverage general liability and workers comp. Certificates provided on request.</p>
      </div>
      <div class="ch-card">
        <div class="ch-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
        <h3 class="ch-card-title">On-Time Guarantee</h3>
        <p class="ch-card-text">We show up when we say we will. If we're late, your service call is on us.</p>
      </div>
      <div class="ch-card">
        <div class="ch-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg></div>
        <h3 class="ch-card-title">5-Star Rated</h3>
        <p class="ch-card-text">Hundreds of verified reviews. Our reputation is built one happy customer at a time.</p>
      </div>
      <div class="ch-card">
        <div class="ch-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg></div>
        <h3 class="ch-card-title">Transparent Pricing</h3>
        <p class="ch-card-text">No hidden fees, no surprise charges. The price you approve is the price you pay.</p>
      </div>
      <div class="ch-card">
        <div class="ch-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg></div>
        <h3 class="ch-card-title">Dedicated Manager</h3>
        <p class="ch-card-text">One point of contact from start to finish. No phone trees, no runaround.</p>
      </div>
      <div class="ch-card">
        <div class="ch-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg></div>
        <h3 class="ch-card-title">Satisfaction Guarantee</h3>
        <p class="ch-card-text">We're not done until you're thrilled. Full warranty on all parts and labor.</p>
      </div>
    </div>
  </div>
</div>`,
          css: `:scope .ch-diff { padding: 3.5rem 1rem; background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%); }
:scope .ch-diff-inner { max-width: 72rem; margin: 0 auto; }
:scope .ch-label { text-align: center; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary-color, #3b82f6); margin-bottom: 0.5rem; }
:scope .ch-heading { text-align: center; font-size: 1.75rem; font-weight: 700; color: #111827; margin: 0 0 2.5rem; }
:scope .ch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
@media (max-width: 768px) { :scope .ch-grid { grid-template-columns: 1fr; } }
:scope .ch-card { background: white; border-radius: 0.75rem; padding: 1.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04); transition: transform 0.2s, box-shadow 0.2s; border: 1px solid #f1f5f9; }
:scope .ch-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
:scope .ch-icon { width: 2.75rem; height: 2.75rem; border-radius: 0.625rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--secondary-color, #2563eb)); color: white; }
:scope .ch-icon svg { width: 1.25rem; height: 1.25rem; }
:scope .ch-card-title { font-size: 1rem; font-weight: 600; color: #111827; margin: 0 0 0.5rem; }
:scope .ch-card-text { font-size: 0.875rem; line-height: 1.6; color: #6b7280; margin: 0; }`,
        } },
      { id: "s4c", type: "gallery", order: 5, visible: true, settings: { variant: "grid" },
        content: { title: "Our Work", photos: [
          { url: IMG.corpGal1, caption: "Commercial Office Buildout" },
          { url: IMG.corpGal2, caption: "Corporate Interior Refresh" },
          { url: IMG.corpGal3, caption: "Modern Workspace Design" },
          { url: IMG.corpGal4, caption: "Executive Conference Suite" },
        ] } },
      { id: "s5", type: "timeline", order: 6, visible: true, settings: {},
        content: { title: "Project Timeline", steps: [
          { title: "Proposal Approved", description: "Once you approve, we finalize contracts and assign your dedicated project manager." },
          { title: "Kickoff & Planning", description: "We meet to align on goals, deliverables, and milestones. You'll receive a detailed project plan." },
          { title: "Execution Phase", description: "Our team gets to work. You'll receive regular progress updates and have direct access to your project lead." },
          { title: "Review & Delivery", description: "We present the completed work for your review, make any adjustments, and hand off all deliverables." },
        ] } },
      { id: "s6", type: "pricing", order: 7, visible: true, settings: { variant: "packages" },
        content: { title: "Choose Your Service Level", packages: [
          { name: "Standard Service", price: 4200, tierLabel: "GOOD", priceNote: "/project", features: ["Licensed & insured technicians", "Standard equipment", "1-year parts warranty", "Standard scheduling", "Email support"], recommended: false },
          { name: "Premium Service", price: 5800, tierLabel: "BETTER", priceNote: "/project", savingsNote: "Most Popular", features: ["Senior certified technicians", "High-efficiency equipment", "2-year parts & labor warranty", "Priority scheduling", "Direct phone support", "Post-service inspection"], recommended: true },
          { name: "Elite Service", price: 7500, tierLabel: "BEST", priceNote: "/project", savingsNote: "Best Value", features: ["Master-level technicians", "Top-tier equipment", "5-year comprehensive warranty", "Same-day scheduling", "24/7 dedicated support", "Annual maintenance included", "100% satisfaction guarantee"], recommended: false },
        ] } },
      { id: "s7", type: "testimonials", order: 8, visible: true, settings: { variant: "minimal" },
        content: { title: "Client Results", showGoogleRating: true, testimonials: [
          { name: "Sarah Mitchell", text: "Professional from start to finish. They delivered exactly what they promised, on time and on budget. Our team was thoroughly impressed.", rating: 5, company: "Mitchell & Associates" },
          { name: "David Chen", text: "The attention to detail was outstanding. They took the time to understand our needs and exceeded our expectations.", rating: 5, company: "Chen Industries" },
          { name: "Rebecca Torres", text: "Clear communication throughout the entire project. No surprises, no hidden costs. Exactly the kind of partner we were looking for.", rating: 5, company: "Torres Group" },
        ] } },
      { id: "s8", type: "faq", order: 9, visible: true, settings: { variant: "two-column" },
        content: { title: "Common Questions", items: [
          { question: "What is your payment structure?", answer: "We typically require a 50% deposit to begin, with the balance due upon completion. Milestone-based billing is available for larger projects." },
          { question: "Do you carry insurance?", answer: "Yes, we maintain comprehensive general liability and professional liability coverage. Certificates of insurance are available upon request." },
          { question: "What if the scope changes mid-project?", answer: "Change orders are documented and priced before any additional work begins. You always approve changes before we proceed." },
          { question: "How do we communicate during the project?", answer: "You'll have a dedicated point of contact and receive weekly progress updates. We're also available by phone and email for any questions." },
        ] } },
      { id: "s9", type: "approval", order: 10, visible: true, settings: { variant: "detailed" },
        content: { title: "Ready to Proceed?", subtitle: "Review and approve this estimate to lock in your pricing and timeline." } },
      { id: "s10", type: "contact", order: 11, visible: true, settings: { variant: "detailed" },
        content: { phone: "(555) 123-4567", email: "hello@yourcompany.com", address: "123 Main Street, Your City, ST 12345", hours: "Mon-Fri: 8am-5pm" } },
    ],
    design_theme: {
      activePresetId: "clean-corporate",
      headingFont: "Roboto", bodyFont: "Open Sans", headingWeight: "600", headingCase: "normal",
      borderRadius: "small", cardStyle: "flat", buttonStyle: "rounded",
      sectionSpacing: "normal", contentWidth: "normal", headerStyle: "dark-filled",
      backgroundPattern: "alternating", accentPlacement: "left-border", dividerStyle: "line",
      animations: "subtle-fade", hoverEffects: "lift",
    },
    incentive_config: {
      enabled: true,
      tiers: [
        { id: "t1", label: "Quick Response", deadlineMode: "relative", relativeHours: 48, absoluteDeadline: null, deadline: null, discountType: "percentage", discountValue: 10, message: "Accept within 48 hours to save 10%" },
      ],
      expiredMessage: "Special pricing has ended",
      showCountdown: true, showSavings: true, baseRateLabel: "Standard Rate",
    },
  },

  // ── 2. Home Services ─────────────────────────────────────────────
  {
    name: "Home Services",
    description: "Warm, trustworthy layout for residential service companies. Leads with trust signals and visual proof of work.",
    category: "General",
    sections: [
      { id: "s1", type: "hero", order: 0, visible: true, settings: { variant: "photo" },
        content: { heroImageUrl: IMG.heroHome } },
      { id: "s2", type: "trust_badges", order: 1, visible: true, settings: { variant: "horizontal" },
        content: { showGoogleRating: true, showCertifications: true, showInsurance: true, badges: [
          { id: "b1", label: "Satisfaction Guaranteed" },
          { id: "b2", label: "Locally Owned & Operated" },
          { id: "b3", label: "Background-Checked Techs" },
        ] } },
      { id: "s3", type: "about", order: 2, visible: true, settings: { variant: "split" },
        content: { title: "Your Local Pros", imageUrl: IMG.about, description: "We're a family-owned company that's been serving this community for over 15 years. Every technician is background-checked, licensed, and insured.\n\nWe treat your home like our own — booties on, clean up after, and always on time. That's not a slogan, it's how we've built our reputation one happy homeowner at a time." } },
      { id: "s4", type: "scope", order: 3, visible: true, settings: { variant: "checklist" },
        content: { title: "What's Included", narrative: "Everything you need to know about what we'll do, the materials we'll use, and what's covered under our service guarantee." } },
      { id: "s5", type: "gallery", order: 4, visible: true, settings: { variant: "grid" },
        content: { title: "Recent Projects", photos: [
          { url: IMG.kitchen, caption: "Kitchen Renovation — Maple Heights" },
          { url: IMG.exterior, caption: "Full Exterior Remodel" },
          { url: IMG.living, caption: "Open Concept Living Room" },
          { url: IMG.gallery4, caption: "Master Bathroom Remodel" },
          { url: IMG.gallery5, caption: "Backyard Patio & Landscaping" },
          { url: IMG.gallery6, caption: "Custom Built-in Shelving" },
        ] } },
      { id: "s6", type: "before_after", order: 5, visible: true, settings: { variant: "slider" },
        content: { title: "See the Difference", beforeLabel: "Before", afterLabel: "After", beforeImage: IMG.before, afterImage: IMG.after } },
      { id: "s7", type: "testimonials", order: 6, visible: true, settings: { variant: "cards" },
        content: { title: "What Your Neighbors Say", showGoogleRating: true, testimonials: [
          { name: "Jennifer Walsh", text: "They showed up on time, wore booties inside, and left my kitchen cleaner than they found it. The work was flawless. Best contractor experience I've ever had!", rating: 5 },
          { name: "Mike & Lisa Chen", text: "We've used them three times now and they never disappoint. Fair pricing, honest communication, and top-quality work every single time.", rating: 5 },
          { name: "Robert Garcia", text: "Had an emergency leak on a Saturday and they were at my door within an hour. Fixed the problem fast and the price was exactly what they quoted. Highly recommend.", rating: 5 },
        ] } },
      { id: "s8", type: "timeline", order: 7, visible: true, settings: {},
        content: { title: "How It Works", steps: [
          { title: "Approve Your Estimate", description: "Review the details on this page and click approve when you're ready. We'll confirm everything within the hour." },
          { title: "We Schedule the Work", description: "We'll reach out to pick a date that works for your schedule. Most projects start within 3-5 business days." },
          { title: "Project Day", description: "Our team arrives on time with everything needed. We protect your home, do the work, and clean up completely." },
          { title: "Final Walkthrough", description: "We walk through the finished project together. You don't pay the balance until you're 100% satisfied." },
        ] } },
      { id: "s9", type: "pricing", order: 8, visible: true, settings: { variant: "simple" },
        content: { title: "Transparent Pricing" } },
      { id: "s10", type: "faq", order: 9, visible: true, settings: { variant: "accordion" },
        content: { title: "Frequently Asked Questions", items: [
          { question: "Are you licensed and insured?", answer: "Absolutely. We carry full general liability insurance and all required state and local licenses. We're happy to provide documentation." },
          { question: "Do you offer a warranty?", answer: "Yes! All our work comes with a satisfaction guarantee and manufacturer warranties on parts and materials." },
          { question: "How quickly can you start?", answer: "We can typically begin within 3-5 business days of approval. Emergency services are available for urgent situations." },
          { question: "What if I'm not satisfied?", answer: "Your satisfaction is our priority. We'll come back and make it right at no additional cost." },
          { question: "Do I need to be home during the work?", answer: "Not necessarily. Many of our customers give us a key or garage code. We'll keep you updated with photos throughout the day." },
        ] } },
      { id: "s11", type: "approval", order: 10, visible: true, settings: {},
        content: { title: "Ready to Get Started?", subtitle: "Approve your estimate below to lock in your pricing and get on our schedule." } },
      { id: "s12", type: "contact", order: 11, visible: true, settings: { variant: "standard" },
        content: { phone: "(555) 123-4567", email: "hello@yourcompany.com", address: "123 Main Street, Your City, ST 12345", hours: "Mon-Fri: 7am-6pm\nSat: 8am-2pm" } },
    ],
    design_theme: {
      activePresetId: "warm-inviting",
      headingFont: "Lora", bodyFont: "Source Sans Pro", headingWeight: "700", headingCase: "normal",
      borderRadius: "large", cardStyle: "soft-shadow", buttonStyle: "pill",
      sectionSpacing: "generous", contentWidth: "normal", headerStyle: "transparent",
      backgroundPattern: "solid", accentPlacement: "none", dividerStyle: "wave",
      animations: "subtle-fade", hoverEffects: "lift",
    },
    incentive_config: {
      enabled: true,
      tiers: [
        { id: "t1", label: "Early Bird", deadlineMode: "relative", relativeHours: 48, absoluteDeadline: null, deadline: null, discountType: "percentage", discountValue: 10, message: "Best price — approve within 48 hours to save 10%" },
        { id: "t2", label: "This Week", deadlineMode: "relative", relativeHours: 168, absoluteDeadline: null, deadline: null, discountType: "percentage", discountValue: 5, message: "Approve within 7 days to save 5%" },
      ],
      expiredMessage: "Special pricing has ended — standard rates apply",
      showCountdown: true, showSavings: true, baseRateLabel: "Standard Rate",
    },
  },

  // ── 3. Premium / Luxury ──────────────────────────────────────────
  {
    name: "Premium Showcase",
    description: "High-end, visual-heavy layout for luxury services. Portfolio-first design that lets your work speak for itself.",
    category: "General",
    sections: [
      { id: "s1", type: "hero", order: 0, visible: true, settings: { variant: "photo" },
        content: { heroImageUrl: IMG.heroPremium } },
      { id: "s2", type: "gallery", order: 1, visible: true, settings: { variant: "masonry" },
        content: { title: "Our Portfolio", photos: [
          { url: IMG.kitchen, caption: "Custom Kitchen Remodel" },
          { url: IMG.exterior, caption: "Outdoor Living Space" },
          { url: IMG.living, caption: "Master Suite Renovation" },
          { url: IMG.gallery4, caption: "Spa-Inspired Bathroom" },
          { url: IMG.gallery5, caption: "Landscape Design" },
          { url: IMG.gallery6, caption: "Modern Interior" },
        ] } },
      { id: "s3", type: "about", order: 2, visible: true, settings: { variant: "centered" },
        content: { title: "Craftsmanship & Vision", imageUrl: IMG.aboutPremium, description: "Every project begins with listening. We take the time to understand your lifestyle, your aesthetic, and your goals — then we bring them to life with meticulous attention to detail.\n\nOur award-winning team combines decades of experience with an eye for design that transforms spaces into something extraordinary." } },
      { id: "s4", type: "video", order: 3, visible: true, settings: { variant: "fullwidth" },
        content: { title: "Experience Our Process", description: "A behind-the-scenes look at how we bring your vision to life." } },
      { id: "s5", type: "scope", order: 4, visible: true, settings: { variant: "narrative" },
        content: { title: "Your Design Plan", narrative: "This proposal outlines a carefully curated approach tailored specifically to your space. Every material, finish, and detail has been selected to create a cohesive result that exceeds expectations." } },
      { id: "s6", type: "before_after", order: 5, visible: true, settings: { variant: "slider" },
        content: { title: "Transformations", beforeLabel: "Before", afterLabel: "After", beforeImage: IMG.before, afterImage: IMG.after } },
      { id: "s7", type: "timeline", order: 6, visible: true, settings: {},
        content: { title: "Project Phases", steps: [
          { title: "Design Consultation", description: "We meet at your home to discuss your vision, review the space, and align on materials, finishes, and budget." },
          { title: "Design Development", description: "Our team creates detailed plans, 3D renderings, and material selections for your review and approval." },
          { title: "Construction", description: "Expert craftsmen bring the design to life. You'll receive weekly photo updates and have direct access to your project manager." },
          { title: "Final Reveal", description: "We walk through every detail together, ensure everything meets your standards, and hand over your transformed space." },
        ] } },
      { id: "s8", type: "testimonials", order: 7, visible: true, settings: { variant: "minimal" },
        content: { title: "Client Stories", showGoogleRating: true, testimonials: [
          { name: "Catherine & James Harrington", text: "They transformed our outdated kitchen into a space we genuinely love spending time in. The attention to detail was remarkable — every tile, every fixture, thoughtfully chosen. Worth every penny.", rating: 5 },
          { name: "Dr. Michael Okafor", text: "From the initial consultation to the final walkthrough, the experience was exceptional. They managed every detail so we didn't have to. Our backyard is now our favorite room.", rating: 5 },
          { name: "Amanda & Ryan Patel", text: "We interviewed five contractors and chose them for their portfolio and professionalism. They exceeded our already-high expectations. The master suite is absolutely stunning.", rating: 5 },
        ] } },
      { id: "s9", type: "pricing", order: 8, visible: true, settings: { variant: "detailed" },
        content: { title: "Your Investment" } },
      { id: "s10", type: "approval", order: 9, visible: true, settings: { variant: "detailed" },
        content: { title: "Begin Your Project", subtitle: "Review the details above and approve to get started." } },
      { id: "s11", type: "contact", order: 10, visible: true, settings: { variant: "detailed" },
        content: { phone: "(555) 123-4567", email: "hello@yourcompany.com", address: "123 Main Street, Your City, ST 12345", hours: "Mon-Fri: 9am-5pm\nBy appointment" } },
    ],
    design_theme: {
      activePresetId: "classic-elegant",
      headingFont: "Playfair Display", bodyFont: "Lora", headingWeight: "700", headingCase: "normal",
      borderRadius: "small", cardStyle: "bordered", buttonStyle: "outline",
      sectionSpacing: "generous", contentWidth: "narrow", headerStyle: "dark-filled",
      backgroundPattern: "solid", accentPlacement: "underline", dividerStyle: "line",
      animations: "subtle-fade", hoverEffects: "none",
    },
  },

  // ── 4. Quick & Clean ─────────────────────────────────────────────
  {
    name: "Quick & Clean",
    description: "Streamlined 5-section template for straightforward service calls and repairs. Get to the point fast.",
    category: "General",
    sections: [
      { id: "s1", type: "hero", order: 0, visible: true, settings: { variant: "clean" }, content: {} },
      { id: "s2", type: "scope", order: 1, visible: true, settings: { variant: "checklist" },
        content: { title: "What We'll Do", narrative: "Here's exactly what's included in your service." } },
      { id: "s3", type: "pricing", order: 2, visible: true, settings: { variant: "simple" },
        content: { title: "Pricing" } },
      { id: "s4", type: "approval", order: 3, visible: true, settings: {},
        content: { title: "Approve & Schedule", subtitle: "Approve below to lock in your price and get on the calendar." } },
      { id: "s5", type: "contact", order: 4, visible: true, settings: { variant: "minimal" },
        content: { phone: "(555) 123-4567", email: "hello@yourcompany.com", address: "123 Main Street, Your City, ST 12345", hours: "Mon-Fri: 8am-5pm" } },
    ],
    design_theme: {
      activePresetId: "modern-minimal",
      headingFont: "Inter", bodyFont: "Inter", headingWeight: "600", headingCase: "normal",
      borderRadius: "medium", cardStyle: "bordered", buttonStyle: "rounded",
      sectionSpacing: "generous", contentWidth: "narrow", headerStyle: "transparent",
      backgroundPattern: "solid", accentPlacement: "underline", dividerStyle: "line",
      animations: "subtle-fade", hoverEffects: "lift",
    },
  },

  // ── 5. Full Interactive ──────────────────────────────────────────
  {
    name: "Full Interactive",
    description: "Maximum engagement template with video, live chat, scheduling, and payment. Every interactive feature enabled.",
    category: "General",
    sections: [
      { id: "s1", type: "hero", order: 0, visible: true, settings: { variant: "gradient" }, content: {} },
      { id: "s2", type: "trust_badges", order: 1, visible: true, settings: { variant: "banner" },
        content: { showGoogleRating: true, showCertifications: true, showInsurance: true, badges: [
          { id: "b1", label: "5-Star Rated" },
          { id: "b2", label: "Satisfaction Guaranteed" },
        ] } },
      { id: "s3", type: "about", order: 2, visible: true, settings: { variant: "cards" },
        content: { title: "Why We're Different", imageUrl: IMG.living, description: "We combine cutting-edge technology with old-fashioned craftsmanship. From your first video consultation to the final walkthrough, every step is designed around your convenience.\n\nTransparent pricing. Real-time updates. A dedicated project manager who answers the phone." } },
      { id: "s4", type: "scope", order: 3, visible: true, settings: { variant: "checklist" },
        content: { title: "Project Scope", narrative: "Everything included in your project, laid out clearly so there are no surprises." } },
      { id: "s5", type: "pricing", order: 4, visible: true, settings: { variant: "detailed" },
        content: { title: "Your Investment" } },
      { id: "s6", type: "video", order: 5, visible: true, settings: { variant: "standard" },
        content: { title: "See How We Work", description: "Watch a quick overview of our process and what to expect." } },
      { id: "s7", type: "video_call", order: 6, visible: true, settings: { variant: "split" },
        content: { title: "Let's Walk Through It Together", description: "Schedule a quick video call so we can review every detail and answer your questions live." } },
      { id: "s8", type: "calendar", order: 7, visible: true, settings: { variant: "button" },
        content: { title: "Book Your Appointment", description: "Pick a date and time that works for you.", bookingUrl: "" } },
      { id: "s9", type: "chat", order: 8, visible: true, settings: { variant: "standard" },
        content: { welcomeMessage: "Have questions about this estimate? We're here to help!", responseEmail: "" } },
      { id: "s10", type: "payment", order: 9, visible: true, settings: { variant: "standard" },
        content: { title: "Secure Your Project", depositType: "percentage", depositAmount: 50 } },
      { id: "s11", type: "approval", order: 10, visible: true, settings: {},
        content: { title: "Ready to Get Started?", subtitle: "Review everything above and approve when you're ready." } },
      { id: "s12", type: "contact", order: 11, visible: true, settings: { variant: "standard" },
        content: { phone: "(555) 123-4567", email: "hello@yourcompany.com", address: "123 Main Street, Your City, ST 12345", hours: "Mon-Fri: 8am-6pm\nSat: 9am-1pm" } },
    ],
    design_theme: {
      activePresetId: "vibrant-creative",
      headingFont: "Poppins", bodyFont: "Raleway", headingWeight: "800", headingCase: "normal",
      borderRadius: "large", cardStyle: "soft-shadow", buttonStyle: "pill",
      sectionSpacing: "generous", contentWidth: "wide", headerStyle: "gradient",
      backgroundPattern: "gradient-fade", accentPlacement: "highlight", dividerStyle: "wave",
      animations: "expressive", hoverEffects: "scale",
    },
    incentive_config: {
      enabled: true,
      tiers: [
        { id: "t1", label: "Early Bird", deadlineMode: "relative", relativeHours: 48, absoluteDeadline: null, deadline: null, discountType: "percentage", discountValue: 10, message: "Best price — approve within 48 hours to save 10%" },
        { id: "t2", label: "This Week", deadlineMode: "relative", relativeHours: 168, absoluteDeadline: null, deadline: null, discountType: "percentage", discountValue: 5, message: "Approve within 7 days to save 5%" },
      ],
      expiredMessage: "Special pricing has ended — standard rates apply",
      showCountdown: true, showSavings: true, baseRateLabel: "Standard Rate",
    },
  },

  // ── 6. Executive ─────────────────────────────────────────────
  EXECUTIVE_TEMPLATE,

  // ── 7. Full Landing Page ────────────────────────────────────
  FULL_LANDING_PAGE_TEMPLATE,

  // ── 8. Fresh & Clean (Cleaning Template) ───────────────────
  FRESH_CLEAN_TEMPLATE,
];

// GET also works so you can seed by visiting the URL in a browser
export async function GET(request: NextRequest) {
  return POST(request);
}

// POST /api/estimate-pages/templates/seed - Create or refresh sample templates
// Use ?refresh=true to update existing templates with latest seed data
export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";

    if (refresh) {
      const { data: existing } = await supabase
        .from("estimate_page_templates")
        .select("id, name")
        .eq("company_id", companyId)
        .limit(20);

      const nameMap = new Map((existing || []).map((t) => [t.name, t.id]));
      const updated: string[] = [];
      const created: string[] = [];

      for (const t of SEED_TEMPLATES) {
        const existingId = nameMap.get(t.name);
        if (existingId) {
          await supabase
            .from("estimate_page_templates")
            .update({
              sections: t.sections,
              design_theme: t.design_theme,
              description: t.description,
              incentive_config: (t as Record<string, unknown>).incentive_config || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingId);
          updated.push(t.name);
        } else {
          await supabase.from("estimate_page_templates").insert({
            company_id: companyId,
            name: t.name,
            description: t.description,
            category: t.category,
            sections: t.sections,
            design_theme: t.design_theme,
            incentive_config: (t as Record<string, unknown>).incentive_config || null,
            is_system: false,
            created_by: user.id,
          });
          created.push(t.name);
        }
      }

      return NextResponse.json({ message: "Refreshed templates", updated, created });
    }

    // Normal mode: only seed if none exist
    const { count } = await supabase
      .from("estimate_page_templates")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId);

    if (count && count > 0) {
      return NextResponse.json({ message: "Templates already exist", count });
    }

    const rows = SEED_TEMPLATES.map((t) => ({
      company_id: companyId,
      name: t.name,
      description: t.description,
      category: t.category,
      sections: t.sections,
      design_theme: t.design_theme,
      incentive_config: (t as Record<string, unknown>).incentive_config || null,
      is_system: false,
      created_by: user.id,
    }));

    const { data, error } = await supabase
      .from("estimate_page_templates")
      .insert(rows)
      .select("id, name");

    if (error) {
      return NextResponse.json({ error: "Failed to seed templates" }, { status: 500 });
    }

    return NextResponse.json({ message: "Seeded templates", templates: data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
