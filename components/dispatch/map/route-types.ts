// Route types for map navigation

export interface RouteWaypoint {
  jobId: string;
  latitude: number;
  longitude: number;
  label: string;
}

export interface RouteLeg {
  from: string;
  to: string;
  duration: number; // seconds
  distance: number; // meters
  midpoint: [number, number]; // lat/lng for drive time label
}

export interface RouteResult {
  legs: RouteLeg[];
  totalDuration: number; // seconds
  totalDistance: number; // meters
  geometry: [number, number][]; // lat/lng pairs for polyline
}
