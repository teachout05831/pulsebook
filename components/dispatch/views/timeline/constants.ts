import { DispatchJob } from "@/types/dispatch";

// Timeline configuration
export const START_HOUR = 6; // 6 AM
export const END_HOUR = 20; // 8 PM
export const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

export const CELL_WIDTH = 100; // pixels per hour
export const SLOT_WIDTH = CELL_WIDTH / 4; // 25px per 15-minute slot

// Generate 15-minute time slots for drop zones
export const TIME_SLOTS: { hour: number; minute: number }[] = [];
for (let h = START_HOUR; h < END_HOUR; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_SLOTS.push({ hour: h, minute: m });
  }
}

export function formatHour(hour: number): string {
  const ampm = hour >= 12 ? "pm" : "am";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}${ampm}`;
}

export function formatTimeSlot(hour: number, minute: number): string {
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? "p" : "a";
  return minute === 0 ? `${h}${ampm}` : `${h}:${minute.toString().padStart(2, "0")}`;
}

export function parseTime(time: string | null): { hours: number; minutes: number } {
  if (!time) return { hours: 8, minutes: 0 }; // Default to 8 AM
  const [hours, minutes] = time.split(":").map(Number);
  return { hours: hours || 8, minutes: minutes || 0 };
}

export function getJobPosition(
  job: DispatchJob,
  cellWidth: number
): { left: number; width: number } {
  const { hours, minutes } = parseTime(job.scheduledTime);
  const startDecimal = hours + minutes / 60;
  const durationHours = (job.estimatedDuration || 60) / 60;

  const left = (startDecimal - START_HOUR) * cellWidth;
  const width = durationHours * cellWidth;

  return { left: Math.max(0, left), width: Math.max(cellWidth * 0.5, width) };
}

export const statusStyles: Record<DispatchJob["status"], string> = {
  unassigned: "bg-gradient-to-br from-red-50 to-red-100 border-l-red-500",
  scheduled: "bg-gradient-to-br from-blue-50 to-blue-100 border-l-blue-500",
  in_progress: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-yellow-500",
  completed: "bg-gradient-to-br from-green-50 to-green-100 border-l-green-500",
  cancelled: "bg-gradient-to-br from-gray-50 to-gray-100 border-l-gray-400",
};
