import { geocodeAddress } from "@/lib/geocode";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fire-and-forget: geocode an address and store lat/lng on the job row.
 * Called after job create/update — does NOT block the API response.
 */
export async function geocodeAndStoreCoords(
  supabase: SupabaseClient,
  jobId: string,
  address: string,
): Promise<void> {
  try {
    const coords = await geocodeAddress(address);
    if (coords) {
      await supabase
        .from("jobs")
        .update({ latitude: coords.lat, longitude: coords.lng })
        .eq("id", jobId);
    }
  } catch {
    // Geocoding failure is non-critical — coords stay null
  }
}
