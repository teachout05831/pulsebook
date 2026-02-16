/**
 * One-time script: backfill latitude/longitude for existing jobs.
 * Run manually: npx tsx scripts/backfill-job-coords.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const BATCH_SIZE = 50;
const NOMINATIM_DELAY = 1100; // ms between Nominatim requests

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
      );
      const data = await res.json();
      if (data.status === "OK" && data.results?.[0]) {
        const loc = data.results[0].geometry.location;
        return { lat: loc.lat, lng: loc.lng };
      }
    } catch { /* fall through */ }
  }

  // Nominatim fallback
  await new Promise((r) => setTimeout(r, NOMINATIM_DELAY));
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { "User-Agent": "ServicePro/1.0 (backfill)" } },
    );
    const data = await res.json();
    if (data?.[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch { /* skip */ }

  return null;
}

async function main() {
  console.log("Fetching jobs with missing coordinates...");

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, address")
    .is("latitude", null)
    .not("address", "is", null)
    .neq("address", "")
    .limit(500);

  if (error) {
    console.error("Query failed:", error.message);
    process.exit(1);
  }

  console.log(`Found ${jobs.length} jobs to geocode.`);
  let success = 0;
  let failed = 0;

  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);

    for (const job of batch) {
      const coords = await geocode(job.address);
      if (coords) {
        const { error: updateErr } = await supabase
          .from("jobs")
          .update({ latitude: coords.lat, longitude: coords.lng })
          .eq("id", job.id);

        if (updateErr) {
          console.error(`  Failed to update job ${job.id}:`, updateErr.message);
          failed++;
        } else {
          success++;
        }
      } else {
        console.warn(`  Could not geocode: "${job.address}" (job ${job.id})`);
        failed++;
      }
    }

    console.log(`  Progress: ${Math.min(i + BATCH_SIZE, jobs.length)}/${jobs.length} (${success} ok, ${failed} failed)`);
  }

  console.log(`\nDone. ${success} geocoded, ${failed} failed out of ${jobs.length} total.`);
}

main();
