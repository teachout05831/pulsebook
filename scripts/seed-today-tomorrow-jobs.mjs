// Seed script: Creates jobs for today and tomorrow
// Run: node scripts/seed-today-tomorrow-jobs.mjs

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

// Get existing customers
async function getCustomers(companyId) {
  const { data } = await supabase
    .from("customers")
    .select("id, name, address")
    .eq("company_id", companyId)
    .limit(10);
  return data || [];
}

// Get team members for job assignment
async function getTeamMembers(companyId) {
  const { data } = await supabase
    .from("team_members")
    .select("id, name")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .limit(5);
  return data || [];
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayStr = formatDate(today);
const tomorrowStr = formatDate(tomorrow);

console.log(`Creating jobs for ${todayStr} (today) and ${tomorrowStr} (tomorrow)`);

const todayJobs = [
  { title: "HVAC System Check", description: "Annual maintenance and filter replacement", time: "08:00", duration: 60, status: "scheduled" },
  { title: "Water Heater Repair", description: "Customer reports no hot water since morning", time: "09:30", duration: 90, status: "scheduled" },
  { title: "Electrical Panel Inspection", description: "Pre-sale home inspection - electrical only", time: "11:00", duration: 45, status: "in_progress" },
  { title: "Kitchen Sink Clog", description: "Drain running slow, possible grease buildup", time: "13:00", duration: 45, status: "scheduled" },
  { title: "Smart Thermostat Install", description: "Install Ecobee thermostat, customer has unit", time: "14:30", duration: 60, status: "scheduled" },
  { title: "Ceiling Fan Repair", description: "Fan wobbling and making noise", time: "16:00", duration: 30, status: "scheduled" },
];

const tomorrowJobs = [
  { title: "Bathroom Remodel - Rough In", description: "Plumbing rough-in for bathroom addition", time: "07:30", duration: 240, status: "scheduled" },
  { title: "AC Tune-Up", description: "Seasonal AC maintenance before summer", time: "09:00", duration: 60, status: "scheduled" },
  { title: "Garbage Disposal Replace", description: "Install new InSinkErator, customer purchased", time: "10:30", duration: 45, status: "scheduled" },
  { title: "Outdoor Lighting Install", description: "Install 6 pathway lights, front yard", time: "12:00", duration: 120, status: "scheduled" },
  { title: "Toilet Replacement", description: "Replace old toilet with dual-flush model", time: "14:00", duration: 60, status: "scheduled" },
  { title: "Circuit Breaker Trip Issue", description: "Kitchen circuit keeps tripping, investigate cause", time: "15:30", duration: 60, status: "scheduled" },
];

async function seed() {
  try {
    const companyId = await getCompanyId();
    const customers = await getCustomers(companyId);
    const teamMembers = await getTeamMembers(companyId);

    console.log(`Found ${customers.length} customers`);
    console.log(`Found ${teamMembers.length} team members`);

    if (customers.length === 0) {
      console.error("No customers found. Create some customers first.");
      process.exit(1);
    }

    // Build job inserts for today
    const todayInserts = todayJobs.map((job, i) => {
      const customer = customers[i % customers.length];
      const tech = teamMembers[i % Math.max(teamMembers.length, 1)];
      return {
        company_id: companyId,
        customer_id: customer.id,
        title: job.title,
        description: job.description,
        status: job.status,
        scheduled_date: todayStr,
        scheduled_time: job.time,
        estimated_duration: job.duration,
        address: customer.address || "123 Main St",
        assigned_to: tech?.id || null,
        notes: `Test job for ${customer.name}`,
        tags: [],
        custom_fields: {},
      };
    });

    // Build job inserts for tomorrow
    const tomorrowInserts = tomorrowJobs.map((job, i) => {
      const customer = customers[(i + 3) % customers.length]; // offset to vary customers
      const tech = teamMembers[(i + 1) % Math.max(teamMembers.length, 1)];
      return {
        company_id: companyId,
        customer_id: customer.id,
        title: job.title,
        description: job.description,
        status: job.status,
        scheduled_date: tomorrowStr,
        scheduled_time: job.time,
        estimated_duration: job.duration,
        address: customer.address || "456 Oak Ave",
        assigned_to: tech?.id || null,
        notes: `Test job for ${customer.name}`,
        tags: [],
        custom_fields: {},
      };
    });

    // Insert today's jobs
    const { data: todayResults, error: todayError } = await supabase
      .from("jobs")
      .insert(todayInserts)
      .select("id, title, scheduled_time, status");

    if (todayError) throw new Error(`Today job insert failed: ${todayError.message}`);
    console.log(`\nCreated ${todayResults.length} jobs for TODAY (${todayStr}):`);
    todayResults.forEach((j) => console.log(`  [${j.scheduled_time}] ${j.title} (${j.status})`));

    // Insert tomorrow's jobs
    const { data: tomorrowResults, error: tomorrowError } = await supabase
      .from("jobs")
      .insert(tomorrowInserts)
      .select("id, title, scheduled_time, status");

    if (tomorrowError) throw new Error(`Tomorrow job insert failed: ${tomorrowError.message}`);
    console.log(`\nCreated ${tomorrowResults.length} jobs for TOMORROW (${tomorrowStr}):`);
    tomorrowResults.forEach((j) => console.log(`  [${j.scheduled_time}] ${j.title} (${j.status})`));

    console.log("\nDone! Refresh your schedule or dispatch view to see the new jobs.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
