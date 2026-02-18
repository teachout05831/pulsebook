export interface GhlIntegrationSettings {
  id?: string;
  ghlEnabled: boolean;
  ghlApiToken: string;
  ghlLocationId: string;
  ghlSyncNewLeads: boolean;
  ghlSyncJobBooked: boolean;
  ghlSyncLeadLost: boolean;
  ghlSyncStatusChanges: boolean;
  ghlDefaultTags: string[];
}

export const DEFAULT_GHL_SETTINGS: GhlIntegrationSettings = {
  ghlEnabled: false,
  ghlApiToken: "",
  ghlLocationId: "",
  ghlSyncNewLeads: true,
  ghlSyncJobBooked: false,
  ghlSyncLeadLost: false,
  ghlSyncStatusChanges: false,
  ghlDefaultTags: [],
};

export type GhlSyncEvent =
  | "lead_created"
  | "job_booked"
  | "lead_lost"
  | "status_changed";

export interface GhlCreateContactPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  locationId: string;
  source?: string;
  tags?: string[];
}

export interface GhlUpdateContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
}

export interface GhlContactResponse {
  contact: {
    id: string;
    locationId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}
