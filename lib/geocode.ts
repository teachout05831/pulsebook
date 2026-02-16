// Server-side geocoding with Google Maps primary + Nominatim fallback
// Nominatim (OpenStreetMap) is free, no API key needed

const geocodeCache = new Map<string, { lat: number; lng: number } | null>();
let lastNominatimCall = 0;

async function nominatimGeocode(address: string): Promise<{ lat: number; lng: number } | null> {
  // Nominatim rate limit: max 1 request per second
  const now = Date.now();
  const elapsed = now - lastNominatimCall;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastNominatimCall = Date.now();

  try {
    const encoded = encodeURIComponent(address);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`,
      {
        headers: { "User-Agent": "ServicePro/1.0 (dispatch scheduling)" },
        next: { revalidate: 86400 },
      },
    );
    const data = await res.json();
    if (data?.[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Nominatim unavailable
  }
  return null;
}

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!address || address.trim().length < 5) return null;

  const cacheKey = address.trim().toLowerCase();
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey) || null;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Try Google Maps first if API key available
  if (apiKey) {
    try {
      const encoded = encodeURIComponent(address);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`,
        { next: { revalidate: 86400 } },
      );
      const data = await res.json();
      if (data.status === "OK" && data.results?.[0]) {
        const loc = data.results[0].geometry.location;
        const coords = { lat: loc.lat, lng: loc.lng };
        geocodeCache.set(cacheKey, coords);
        return coords;
      }
    } catch {
      // Google geocoding failed, fall through to Nominatim
    }
  }

  // Fallback: Nominatim (free, no API key needed)
  const coords = await nominatimGeocode(address);
  if (coords) {
    geocodeCache.set(cacheKey, coords);
    return coords;
  }

  geocodeCache.set(cacheKey, null);
  return null;
}

/**
 * Batch geocode addresses with concurrency control.
 * Uses sequential processing for Nominatim (rate limited)
 * or parallel batches for Google Maps.
 */
export async function batchGeocode(
  addresses: { id: string; address: string }[],
): Promise<Map<string, { lat: number; lng: number }>> {
  const results = new Map<string, { lat: number; lng: number }>();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Nominatim needs sequential (1 req/sec); Google can batch
  const BATCH_SIZE = apiKey ? 10 : 1;

  for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
    const batch = addresses.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async ({ id, address }) => {
      const coords = await geocodeAddress(address);
      if (coords) results.set(id, coords);
    });
    await Promise.all(promises);
  }

  return results;
}

/**
 * Returns cached coordinates instantly, then time-bounds any remaining geocoding.
 * Prevents geocoding from blocking page load for more than `timeoutMs`.
 */
export async function batchGeocodeWithTimeout(
  addresses: { id: string; address: string }[],
  timeoutMs: number,
): Promise<Map<string, { lat: number; lng: number }>> {
  const results = new Map<string, { lat: number; lng: number }>();
  const uncached: { id: string; address: string }[] = [];

  for (const { id, address } of addresses) {
    if (!address || address.trim().length < 5) continue;
    const cacheKey = address.trim().toLowerCase();
    if (geocodeCache.has(cacheKey)) {
      const cached = geocodeCache.get(cacheKey);
      if (cached) results.set(id, cached);
    } else {
      uncached.push({ id, address });
    }
  }

  if (uncached.length === 0) return results;

  try {
    const geocodePromise = batchGeocode(uncached).then(newCoords => {
      newCoords.forEach((coords, id) => results.set(id, coords));
    });
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
    await Promise.race([geocodePromise, timeout]);
  } catch {
    // Geocoding failed, return what we have
  }

  return results;
}
