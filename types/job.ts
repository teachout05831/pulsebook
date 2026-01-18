export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Job {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string; // Denormalized for display
  title: string;
  description: string | null;
  status: JobStatus;
  scheduledDate: string; // ISO date string
  scheduledTime: string | null; // Time string like "09:00"
  estimatedDuration: number | null; // In minutes
  address: string | null;
  assignedTo: string | null; // Technician name/id
  notes: string | null;
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};
