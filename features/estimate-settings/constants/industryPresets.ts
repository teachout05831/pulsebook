import type { EstimateBuilderSettings } from "@/types/company";

export interface IndustryPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<EstimateBuilderSettings>;
}

const baseResourceFields = [
  { key: "trucks", label: "Trucks / Vehicles", type: "number" as const, enabled: true, isBuiltIn: true },
  { key: "teamSize", label: "Team Size", type: "number" as const, enabled: true, isBuiltIn: true },
  { key: "estimatedHours", label: "Estimated Hours", type: "number" as const, enabled: true, isBuiltIn: true },
  { key: "hourlyRate", label: "Hourly Rate", type: "number" as const, enabled: true, isBuiltIn: true },
];

export const industryPresets: IndustryPreset[] = [
  {
    id: "moving",
    name: "Moving Company",
    description: "Hourly-based with truck counts, team size, and valuation coverage",
    settings: {
      defaultPricingModel: "hourly",
      resourceFields: [
        ...baseResourceFields,
        { key: "truckSize", label: "Truck Size", type: "select" as const, options: ["16ft", "20ft", "26ft"], enabled: true, isBuiltIn: false },
        { key: "flights", label: "Flights of Stairs", type: "number" as const, enabled: true, isBuiltIn: false },
      ],
      pricingCategories: [
        { key: "labor", label: "Labor", enabled: true, isRequired: true },
        { key: "travel_time", label: "Travel Time", enabled: true, isRequired: false },
        { key: "packing", label: "Packing Materials", enabled: true, isRequired: false },
        { key: "valuation", label: "Valuation Coverage", enabled: true, isRequired: false },
        { key: "storage", label: "Storage", enabled: false, isRequired: false },
        { key: "discount", label: "Discounts", enabled: true, isRequired: false },
      ],
    },
  },
  {
    id: "house_cleaning",
    name: "House Cleaning",
    description: "Flat-rate per visit with room counts and frequency options",
    settings: {
      defaultPricingModel: "flat",
      resourceFields: [
        { key: "teamSize", label: "Team Size", type: "number" as const, enabled: true, isBuiltIn: true },
        { key: "estimatedHours", label: "Estimated Hours", type: "number" as const, enabled: true, isBuiltIn: true },
        { key: "hourlyRate", label: "Hourly Rate", type: "number" as const, enabled: false, isBuiltIn: true },
        { key: "trucks", label: "Vehicles", type: "number" as const, enabled: false, isBuiltIn: true },
        { key: "bedrooms", label: "Bedrooms", type: "number" as const, enabled: true, isBuiltIn: false },
        { key: "bathrooms", label: "Bathrooms", type: "number" as const, enabled: true, isBuiltIn: false },
        { key: "sqft", label: "Square Footage", type: "number" as const, enabled: true, isBuiltIn: false },
      ],
      pricingCategories: [
        { key: "standard_clean", label: "Standard Cleaning", enabled: true, isRequired: true },
        { key: "deep_clean", label: "Deep Cleaning", enabled: true, isRequired: false },
        { key: "add_ons", label: "Add-on Services", enabled: true, isRequired: false },
        { key: "supplies", label: "Supplies Fee", enabled: true, isRequired: false },
        { key: "discount", label: "Discounts", enabled: true, isRequired: false },
      ],
    },
  },
  {
    id: "carpet_cleaning",
    name: "Carpet Cleaning",
    description: "Per-service pricing by room or area with stain treatments",
    settings: {
      defaultPricingModel: "per_service",
      resourceFields: [
        { key: "teamSize", label: "Technicians", type: "number" as const, enabled: true, isBuiltIn: true },
        { key: "estimatedHours", label: "Estimated Hours", type: "number" as const, enabled: true, isBuiltIn: true },
        { key: "trucks", label: "Trucks / Vehicles", type: "number" as const, enabled: false, isBuiltIn: true },
        { key: "hourlyRate", label: "Hourly Rate", type: "number" as const, enabled: false, isBuiltIn: true },
        { key: "rooms", label: "Number of Rooms", type: "number" as const, enabled: true, isBuiltIn: false },
        { key: "sqft", label: "Total Sq. Ft.", type: "number" as const, enabled: true, isBuiltIn: false },
      ],
      pricingCategories: [
        { key: "room_cleaning", label: "Room Cleaning", enabled: true, isRequired: true },
        { key: "stain_treatment", label: "Stain Treatment", enabled: true, isRequired: false },
        { key: "protectant", label: "Carpet Protectant", enabled: true, isRequired: false },
        { key: "upholstery", label: "Upholstery Cleaning", enabled: true, isRequired: false },
        { key: "discount", label: "Discounts", enabled: true, isRequired: false },
      ],
    },
  },
  {
    id: "pool_service",
    name: "Pool Service",
    description: "Per-service model with pool dimensions and chemical testing",
    settings: {
      defaultPricingModel: "per_service",
      resourceFields: [
        { key: "teamSize", label: "Technicians", type: "number" as const, enabled: true, isBuiltIn: true },
        { key: "estimatedHours", label: "Estimated Hours", type: "number" as const, enabled: true, isBuiltIn: true },
        { key: "trucks", label: "Trucks / Vehicles", type: "number" as const, enabled: false, isBuiltIn: true },
        { key: "hourlyRate", label: "Hourly Rate", type: "number" as const, enabled: false, isBuiltIn: true },
        { key: "poolType", label: "Pool Type", type: "select" as const, options: ["In-Ground", "Above-Ground", "Spa/Hot Tub"], enabled: true, isBuiltIn: false },
        { key: "poolSize", label: "Pool Size (gallons)", type: "number" as const, enabled: true, isBuiltIn: false },
      ],
      pricingCategories: [
        { key: "maintenance", label: "Regular Maintenance", enabled: true, isRequired: true },
        { key: "chemicals", label: "Chemicals & Balancing", enabled: true, isRequired: false },
        { key: "equipment", label: "Equipment Repair", enabled: true, isRequired: false },
        { key: "opening_closing", label: "Opening / Closing", enabled: false, isRequired: false },
        { key: "discount", label: "Discounts", enabled: true, isRequired: false },
      ],
    },
  },
  {
    id: "landscaping",
    name: "Landscaping",
    description: "Flat or hourly pricing with lot size and seasonal services",
    settings: {
      defaultPricingModel: "flat",
      resourceFields: [
        ...baseResourceFields,
        { key: "lotSize", label: "Lot Size (acres)", type: "number" as const, enabled: true, isBuiltIn: false },
      ],
      pricingCategories: [
        { key: "lawn_care", label: "Lawn Care", enabled: true, isRequired: true },
        { key: "hardscaping", label: "Hardscaping", enabled: true, isRequired: false },
        { key: "planting", label: "Planting & Mulch", enabled: true, isRequired: false },
        { key: "irrigation", label: "Irrigation", enabled: true, isRequired: false },
        { key: "materials", label: "Materials", enabled: true, isRequired: false },
        { key: "discount", label: "Discounts", enabled: true, isRequired: false },
      ],
    },
  },
  {
    id: "painting",
    name: "Painting",
    description: "Per-service pricing with room count and surface areas",
    settings: {
      defaultPricingModel: "per_service",
      resourceFields: [
        ...baseResourceFields,
        { key: "rooms", label: "Number of Rooms", type: "number" as const, enabled: true, isBuiltIn: false },
        { key: "sqft", label: "Wall Sq. Ft.", type: "number" as const, enabled: true, isBuiltIn: false },
      ],
      pricingCategories: [
        { key: "interior", label: "Interior Painting", enabled: true, isRequired: true },
        { key: "exterior", label: "Exterior Painting", enabled: true, isRequired: false },
        { key: "prep_work", label: "Prep Work", enabled: true, isRequired: false },
        { key: "materials", label: "Paint & Materials", enabled: true, isRequired: false },
        { key: "trim_detail", label: "Trim & Detail", enabled: true, isRequired: false },
        { key: "discount", label: "Discounts", enabled: true, isRequired: false },
      ],
    },
  },
  {
    id: "general",
    name: "General Service",
    description: "Balanced setup for any service business",
    settings: {
      defaultPricingModel: "flat",
      resourceFields: baseResourceFields,
      pricingCategories: [
        { key: "primary_service", label: "Primary Service", enabled: true, isRequired: true },
        { key: "additional_service", label: "Additional Services", enabled: true, isRequired: false },
        { key: "materials", label: "Materials", enabled: true, isRequired: false },
        { key: "trip_fee", label: "Trip / Travel Fee", enabled: true, isRequired: false },
        { key: "discount", label: "Discounts", enabled: true, isRequired: false },
      ],
    },
  },
];
