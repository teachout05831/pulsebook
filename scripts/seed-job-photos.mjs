// Seed script: Adds test photos to existing jobs for dispatch view testing
// Run: node scripts/seed-job-photos.mjs

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Service/trade photos from picsum (deterministic by seed number)
const photoSets = [
  // HVAC / AC photos
  [
    "https://picsum.photos/seed/hvac1/800/600",
    "https://picsum.photos/seed/hvac2/800/600",
    "https://picsum.photos/seed/hvac3/800/600",
  ],
  // Plumbing photos
  [
    "https://picsum.photos/seed/plumb1/800/600",
    "https://picsum.photos/seed/plumb2/800/600",
  ],
  // Electrical photos
  [
    "https://picsum.photos/seed/elec1/800/600",
    "https://picsum.photos/seed/elec2/800/600",
    "https://picsum.photos/seed/elec3/800/600",
    "https://picsum.photos/seed/elec4/800/600",
  ],
  // Water heater photos
  [
    "https://picsum.photos/seed/water1/800/600",
    "https://picsum.photos/seed/water2/800/600",
  ],
  // Maintenance photos
  [
    "https://picsum.photos/seed/maint1/800/600",
  ],
  // Kitchen photos
  [
    "https://picsum.photos/seed/kitchen1/800/600",
    "https://picsum.photos/seed/kitchen2/800/600",
    "https://picsum.photos/seed/kitchen3/800/600",
  ],
];

async function seed() {
  try {
    // Get company
    const { data: company, error: compErr } = await supabase
      .from("companies")
      .select("id, name")
      .limit(1)
      .single();
    if (compErr) throw new Error(`No company found: ${compErr.message}`);
    console.log(`Company: ${company.name} (${company.id})`);

    // Get today's jobs
    const today = new Date().toISOString().split("T")[0];
    const { data: jobs, error: jobErr } = await supabase
      .from("jobs")
      .select("id, title")
      .eq("company_id", company.id)
      .gte("scheduled_date", today)
      .order("scheduled_date")
      .limit(20);
    if (jobErr) throw new Error(`Failed to fetch jobs: ${jobErr.message}`);
    if (!jobs || jobs.length === 0) {
      console.log("No jobs found. Run seed-phoenix-jobs.mjs first.");
      return;
    }
    console.log(`Found ${jobs.length} jobs\n`);

    // Delete existing test photos first (avoid duplicates on re-run)
    const jobIds = jobs.map(j => j.id);
    const { count } = await supabase
      .from("file_uploads")
      .delete({ count: "exact" })
      .in("job_id", jobIds)
      .eq("category", "photo");
    if (count > 0) console.log(`Cleaned up ${count} existing test photos\n`);

    // Insert photos for each job
    let totalInserted = 0;
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const photos = photoSets[i % photoSets.length];
      const inserts = photos.map((url, idx) => ({
        company_id: company.id,
        job_id: job.id,
        file_name: `job-photo-${idx + 1}.jpg`,
        file_type: "image/jpeg",
        file_size: 150000,
        storage_path: url,
        category: "photo",
        description: `Test photo ${idx + 1} for ${job.title}`,
      }));

      const { error: insertErr } = await supabase
        .from("file_uploads")
        .insert(inserts);
      if (insertErr) {
        console.error(`  Failed for "${job.title}": ${insertErr.message}`);
      } else {
        console.log(`  ${job.title}: ${photos.length} photos added`);
        totalInserted += photos.length;
      }
    }

    console.log(`\nDone! Added ${totalInserted} photos across ${jobs.length} jobs.`);
    console.log("Refresh your dispatch view to see photos on pins and in the detail panel.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
