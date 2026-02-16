import type { EstimateDetail } from "@/types/estimate";

export interface ValidationErrors {
  serviceType?: string;
  source?: string;
  locations?: string;
  lineItems?: string;
  resources?: string;
}

export function validateEstimate(estimate: EstimateDetail): ValidationErrors {
  const errors: ValidationErrors = {};

  // Service Type validation
  if (!estimate.serviceType?.trim()) {
    errors.serviceType = "Service type is required";
  }

  // Source validation
  if (!estimate.source) {
    errors.source = "Source is required";
  }

  // Locations validation (need origin + destination)
  const origins = estimate.locations.filter((l) => l.locationType === "origin");
  const destinations = estimate.locations.filter((l) => l.locationType === "destination");
  if (origins.length === 0 || destinations.length === 0) {
    errors.locations = "Must have origin and destination";
  }

  // Line Items validation
  if (!estimate.lineItems || estimate.lineItems.length === 0) {
    errors.lineItems = "At least one line item required";
  }

  // Resources validation
  const res = estimate.resources || {};
  if (!res.trucks || res.trucks === 0 || !res.teamSize || res.teamSize === 0) {
    errors.resources = "Trucks and team size required";
  }

  return errors;
}
