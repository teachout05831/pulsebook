"use client";

import { useState, useCallback } from "react";
import type { RouteWaypoint, RouteLeg, RouteResult } from "@/components/dispatch/map/route-types";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

async function fetchRoute(waypoints: RouteWaypoint[]): Promise<RouteResult> {
  const coords = waypoints.map((w) => `${w.longitude},${w.latitude}`).join(";");
  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Route calculation failed");
  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new Error("No route found");
  }

  const route = data.routes[0];

  // OSRM returns GeoJSON [lng, lat] — convert to Leaflet [lat, lng]
  const geometry: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
  );

  const legs: RouteLeg[] = route.legs.map(
    (leg: { duration: number; distance: number }, i: number) => ({
      from: waypoints[i].label,
      to: waypoints[i + 1].label,
      duration: leg.duration,
      distance: leg.distance,
      midpoint: [
        (waypoints[i].latitude + waypoints[i + 1].latitude) / 2,
        (waypoints[i].longitude + waypoints[i + 1].longitude) / 2,
      ] as [number, number],
    }),
  );

  return {
    legs,
    totalDuration: route.duration,
    totalDistance: route.distance,
    geometry,
  };
}

export function useMapRouting() {
  const [routes, setRoutes] = useState<Map<string, RouteResult>>(new Map());
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRoute = useCallback(
    async (groupKey: string, waypoints: RouteWaypoint[]) => {
      if (waypoints.length < 2) return;
      setIsCalculating(true);
      try {
        const result = await fetchRoute(waypoints);
        setRoutes((prev) => new Map(prev).set(groupKey, result));
      } catch {
        // Route unavailable — silently skip
      } finally {
        setIsCalculating(false);
      }
    },
    [],
  );

  const clearRoute = useCallback((groupKey: string) => {
    setRoutes((prev) => {
      const next = new Map(prev);
      next.delete(groupKey);
      return next;
    });
  }, []);

  const clearAllRoutes = useCallback(() => {
    setRoutes(new Map());
  }, []);

  return { routes, isCalculating, calculateRoute, clearRoute, clearAllRoutes };
}
