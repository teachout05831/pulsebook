export interface Crew {
  id: string;
  companyId: string;
  name: string;
  color: string;
  leaderId: string | null;
  memberIds: string[];
  zoneId: string | null;
  specializations: string[];
  maxHoursPerDay: number;
  maxJobsPerDay: number;
  vehicleName: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceZone {
  id: string;
  companyId: string;
  name: string;
  color: string;
  zipCodes: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ZoneTravelTime {
  id: string;
  companyId: string;
  fromZoneId: string;
  toZoneId: string;
  travelMinutes: number;
}

export interface TechAvailability {
  id: string;
  companyId: string;
  teamMemberId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxJobs: number;
}
