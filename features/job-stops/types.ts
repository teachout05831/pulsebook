export type StopType = "start" | "stop" | "end";

export interface JobStop {
  id: string;
  jobId: string;
  stopOrder: number;
  address: string;
  notes: string | null;
  stopType: StopType;
}

export interface CreateJobStopInput {
  address: string;
  notes?: string;
  stopType?: StopType;
  stopOrder: number;
}
