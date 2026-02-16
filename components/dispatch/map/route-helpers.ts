import type { RouteResult } from "./route-types";

export function formatTotal(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

export function formatMiles(meters: number): string {
  return `${(meters / 1609.344).toFixed(1)} mi`;
}

export function buildGoogleMapsUrl(legs: RouteResult["legs"]): string {
  if (legs.length === 0) return "https://maps.google.com";
  const waypoints = [legs[0].from, ...legs.map((l) => l.to)];
  const origin = encodeURIComponent(waypoints[0]);
  const dest = encodeURIComponent(waypoints[waypoints.length - 1]);
  const mid = waypoints.slice(1, -1).map(encodeURIComponent).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${mid ? `&waypoints=${mid}` : ""}`;
}
