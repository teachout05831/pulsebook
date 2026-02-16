// Seed script: Creates complete test estimate for split view testing
// Run: node scripts/seed-estimate-split-view-test.mjs

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Get the first company in the database
async function getCompanyId() {
  const { data, error } = await supabase
    .from("companies")
    .select("id, name")
    .limit(1)
    .single();
  if (error) throw new Error(`No company found: ${error.message}`);
  console.log(`Using company: ${data.name} (${data.id})`);
  return data.id;
}

// Get next estimate number
async function getNextEstimateNumber(companyId) {
  const { data } = await supabase
    .from("estimates")
    .select("estimate_number")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return "EST-001";

  const lastNumber = data[0].estimate_number;
  const match = lastNumber.match(/EST-(\d+)/);
  if (!match) return "EST-001";

  const nextNum = parseInt(match[1]) + 1;
  return `EST-${String(nextNum).padStart(3, "0")}`;
}

async function seed() {
  try {
    const companyId = await getCompanyId();

    // Create customer
    const customer = {
      company_id: companyId,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(602) 555-9876",
      address: "3245 E Camelback Rd, Phoenix, AZ 85018",
      city: "Phoenix",
      state: "AZ",
      zip_code: "85018",
      status: "lead",
      tags: [],
      custom_fields: {},
    };

    const { data: insertedCustomer, error: custError } = await supabase
      .from("customers")
      .insert(customer)
      .select("id, name")
      .single();

    if (custError) throw new Error(`Customer insert failed: ${custError.message}`);
    console.log(`\nCreated customer: ${insertedCustomer.name} (${insertedCustomer.id})`);

    // Get next estimate number
    const estimateNumber = await getNextEstimateNumber(companyId);
    console.log(`Estimate number: ${estimateNumber}`);

    // Create estimate with full data
    const lineItems = [
      {
        id: crypto.randomUUID(),
        description: "Moving Service - Labor",
        quantity: 8,
        unitPrice: 75,
        total: 600,
        category: "primary_service",
      },
      {
        id: crypto.randomUUID(),
        description: "Packing Materials",
        quantity: 5,
        unitPrice: 25,
        total: 125,
        category: "materials",
      },
      {
        id: crypto.randomUUID(),
        description: "Furniture Disassembly",
        quantity: 4,
        unitPrice: 50,
        total: 200,
        category: "additional_services",
      },
    ];

    const resources = {
      trucks: 1,
      teamSize: 2,
      minHours: 4,
      maxHours: 6,
      estimatedHours: 5,
    };

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.086; // Phoenix 8.6%
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const estimate = {
      company_id: companyId,
      customer_id: insertedCustomer.id,
      estimate_number: estimateNumber,
      status: "draft",
      service_type: "Residential Move",
      source: "website",
      pricing_model: "hourly",
      tax_rate: taxRate,
      line_items: lineItems,
      resources: resources,
      applied_fees: [],
      custom_fields: {},
      internal_notes: "Test estimate for split view verification",
      customer_notes: "We'll handle your move with care and professionalism.",
      crew_notes: "Check for stairs at both locations. Customer has valuable antiques.",
      crew_feedback: "",
    };

    const { data: insertedEstimate, error: estError } = await supabase
      .from("estimates")
      .insert(estimate)
      .select("id, estimate_number, customer_id")
      .single();

    if (estError) throw new Error(`Estimate insert failed: ${estError.message}`);
    console.log(`\nCreated estimate: ${insertedEstimate.estimate_number} (${insertedEstimate.id})`);
    console.log(`  Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`  Tax (8.6%): $${taxAmount.toFixed(2)}`);
    console.log(`  Total: $${total.toFixed(2)}`);

    // Create locations
    const locations = [
      {
        estimate_id: insertedEstimate.id,
        company_id: companyId,
        location_type: "origin",
        address: "3245 E Camelback Rd, Phoenix, AZ 85018",
        city: "Phoenix",
        state: "AZ",
        zip: "85018",
        sort_order: 0,
      },
      {
        estimate_id: insertedEstimate.id,
        company_id: companyId,
        location_type: "destination",
        address: "1234 N Central Ave, Phoenix, AZ 85004",
        city: "Phoenix",
        state: "AZ",
        zip: "85004",
        sort_order: 1,
      },
    ];

    const { data: insertedLocations, error: locError } = await supabase
      .from("estimate_locations")
      .insert(locations)
      .select("id, location_type, address");

    if (locError) throw new Error(`Locations insert failed: ${locError.message}`);
    console.log(`\nCreated ${insertedLocations.length} locations:`);
    insertedLocations.forEach((loc) =>
      console.log(`  - ${loc.location_type}: ${loc.address}`)
    );

    // Create estimate page with sections
    const sections = [
      {
        id: crypto.randomUUID(),
        type: "hero",
        visible: true,
        order: 0,
        title: "Welcome",
        settings: {},
        content: { heading: "Your Moving Quote", subheading: "Professional moving services" },
      },
      {
        id: crypto.randomUUID(),
        type: "services",
        visible: true,
        order: 1,
        title: "Services",
        settings: {},
        content: { items: [] },
      },
      {
        id: crypto.randomUUID(),
        type: "pricing",
        visible: true,
        order: 2,
        title: "Pricing",
        settings: {},
        content: {},
      },
      {
        id: crypto.randomUUID(),
        type: "testimonials",
        visible: false,
        order: 3,
        title: "Testimonials",
        settings: {},
        content: { items: [] },
      },
    ];

    const estimatePage = {
      estimate_id: insertedEstimate.id,
      company_id: companyId,
      public_token: `EST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "draft",
      sections: sections,
    };

    const { data: insertedPage, error: pageError } = await supabase
      .from("estimate_pages")
      .insert(estimatePage)
      .select("id, public_token")
      .single();

    if (pageError) throw new Error(`Estimate page insert failed: ${pageError.message}`);
    console.log(`\nCreated estimate page: ${insertedPage.id}`);
    console.log(`  Public token: ${insertedPage.public_token}`);
    console.log(`  Sections: ${sections.length} total (3 visible, 1 hidden)`);

    // Final output
    console.log(`\n✅ Test data created successfully!`);
    console.log(`\nTo test split view:`);
    console.log(`1. Navigate to: http://localhost:4000/estimates/${insertedEstimate.id}`);
    console.log(`2. Click "Split View" mode toggle`);
    console.log(`3. Verify all features work:\n`);
    console.log(`   ✓ Totals show: Subtotal ($${subtotal.toFixed(2)}), Tax ($${taxAmount.toFixed(2)}), Total ($${total.toFixed(2)})`);
    console.log(`   ✓ Edit fields → preview updates in real-time`);
    console.log(`   ✓ Change resources → totals recalculate`);
    console.log(`   ✓ Delete required fields → red borders appear`);
    console.log(`   ✓ Fix errors → borders return to normal`);
    console.log(`   ✓ Toggle sections → preview updates`);
    console.log(`\nCustomer: ${insertedCustomer.name} (ID: ${insertedCustomer.id})`);
    console.log(`Estimate: ${insertedEstimate.estimate_number} (ID: ${insertedEstimate.id})`);
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
