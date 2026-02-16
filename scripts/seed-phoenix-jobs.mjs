// Seed script: Creates test customers and jobs in Phoenix, AZ
// Run: node scripts/seed-phoenix-jobs.mjs

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

// Get team member IDs for job assignment
async function getTeamMembers(companyId) {
  const { data } = await supabase
    .from("team_members")
    .select("id, name")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .limit(5);
  return data || [];
}

const today = new Date().toISOString().split("T")[0]; // 2026-02-08

const customers = [
  {
    name: "Adam Richardson",
    email: "adam.richardson@email.com",
    phone: "(480) 555-0101",
    address: "4521 E Cactus Rd, Scottsdale, AZ 85254",
    city: "Scottsdale",
    state: "AZ",
    zip_code: "85254",
    status: "active",
  },
  {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "(602) 555-0202",
    address: "1220 N Central Ave, Phoenix, AZ 85004",
    city: "Phoenix",
    state: "AZ",
    zip_code: "85004",
    status: "active",
  },
  {
    name: "David Chen",
    email: "david.chen@email.com",
    phone: "(480) 555-0303",
    address: "7135 E Camelback Rd, Scottsdale, AZ 85251",
    city: "Scottsdale",
    state: "AZ",
    zip_code: "85251",
    status: "active",
  },
  {
    name: "Maria Gonzalez",
    email: "maria.gonzalez@email.com",
    phone: "(623) 555-0404",
    address: "9630 W Thunderbird Rd, Peoria, AZ 85381",
    city: "Peoria",
    state: "AZ",
    zip_code: "85381",
    status: "active",
  },
  {
    name: "James Thompson",
    email: "james.thompson@email.com",
    phone: "(480) 555-0505",
    address: "2000 E Rio Salado Pkwy, Tempe, AZ 85281",
    city: "Tempe",
    state: "AZ",
    zip_code: "85281",
    status: "active",
  },
  {
    name: "Lisa Park",
    email: "lisa.park@email.com",
    phone: "(480) 555-0606",
    address: "1949 E Camelback Rd, Phoenix, AZ 85016",
    city: "Phoenix",
    state: "AZ",
    zip_code: "85016",
    status: "active",
  },
];

const jobTemplates = [
  { title: "AC Unit Repair", description: "Central AC not cooling properly. Customer reports warm air.", time: "08:00", duration: 90, status: "scheduled", priority: "high" },
  { title: "Plumbing Inspection", description: "Annual plumbing inspection. Check all fixtures and pipes.", time: "09:30", duration: 60, status: "scheduled", priority: "normal" },
  { title: "Electrical Panel Upgrade", description: "Upgrade 100A panel to 200A. Customer adding solar.", time: "10:00", duration: 180, status: "in_progress", priority: "high" },
  { title: "Water Heater Install", description: "Replace 40-gallon tank with tankless unit.", time: "11:00", duration: 120, status: "scheduled", priority: "normal" },
  { title: "HVAC Maintenance", description: "Quarterly HVAC maintenance. Filter replacement and coil cleaning.", time: "13:00", duration: 60, status: "scheduled", priority: "low" },
  { title: "Kitchen Faucet Replacement", description: "Install new kitchen faucet. Customer has fixture.", time: "14:30", duration: 45, status: "unassigned", priority: "normal" },
];

async function seed() {
  try {
    const companyId = await getCompanyId();
    const teamMembers = await getTeamMembers(companyId);

    console.log(`Found ${teamMembers.length} team members`);
    teamMembers.forEach((m) => console.log(`  - ${m.name} (${m.id})`));

    // Insert customers
    const customerInserts = customers.map((c) => ({
      ...c,
      company_id: companyId,
      tags: [],
      custom_fields: {},
    }));

    const { data: insertedCustomers, error: custError } = await supabase
      .from("customers")
      .insert(customerInserts)
      .select("id, name");

    if (custError) throw new Error(`Customer insert failed: ${custError.message}`);
    console.log(`\nCreated ${insertedCustomers.length} customers:`);
    insertedCustomers.forEach((c) => console.log(`  - ${c.name} (${c.id})`));

    // Insert jobs - one per customer
    const jobInserts = insertedCustomers.map((cust, i) => {
      const template = jobTemplates[i];
      const techIdx = i % Math.max(teamMembers.length, 1);
      const assignedTo = template.status !== "unassigned" && teamMembers[techIdx]
        ? teamMembers[techIdx].id
        : null;

      return {
        company_id: companyId,
        customer_id: cust.id,
        title: template.title,
        description: template.description,
        status: template.status === "unassigned" ? "pending" : template.status,
        priority: template.priority,
        scheduled_date: today,
        scheduled_time: template.time,
        estimated_duration: template.duration,
        address: customers[i].address,
        assigned_to: assignedTo,
        notes: `Test job for ${cust.name}`,
        tags: [],
        custom_fields: {},
      };
    });

    const { data: insertedJobs, error: jobError } = await supabase
      .from("jobs")
      .insert(jobInserts)
      .select("id, title, address, status, scheduled_time");

    if (jobError) throw new Error(`Job insert failed: ${jobError.message}`);
    console.log(`\nCreated ${insertedJobs.length} jobs for today (${today}):`);
    insertedJobs.forEach((j) =>
      console.log(`  - [${j.scheduled_time}] ${j.title} @ ${j.address} (${j.status})`)
    );

    console.log("\nDone! Refresh your dispatch view to see the jobs on the map.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
