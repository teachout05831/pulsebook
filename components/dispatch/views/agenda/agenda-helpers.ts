import type { DispatchJob } from "@/types/dispatch";

export const statusConfig: Record<DispatchJob["status"], { label: string; color: string; bgColor: string }> = {
  unassigned: { label: "Unassigned", color: "text-red-700", bgColor: "bg-red-100" },
  scheduled: { label: "Scheduled", color: "text-blue-700", bgColor: "bg-blue-100" },
  in_progress: { label: "In Progress", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  completed: { label: "Completed", color: "text-green-700", bgColor: "bg-green-100" },
  cancelled: { label: "Cancelled", color: "text-gray-600", bgColor: "bg-gray-100" },
};

export const priorityConfig: Record<DispatchJob["priority"], { label: string; color: string }> = {
  low: { label: "Low", color: "text-gray-500" },
  normal: { label: "Normal", color: "text-blue-600" },
  high: { label: "High", color: "text-orange-600" },
  urgent: { label: "Urgent", color: "text-red-600" },
};

export const TIME_BLOCKS = [
  { label: "Early Morning", start: 0, end: 8, icon: "🌅" },
  { label: "Morning", start: 8, end: 12, icon: "☀️" },
  { label: "Afternoon", start: 12, end: 17, icon: "🌤️" },
  { label: "Evening", start: 17, end: 24, icon: "🌙" },
];

export function getTimeBlock(time: string | null): string {
  if (!time) return "Morning";
  const hour = parseInt(time.split(":")[0], 10);
  const block = TIME_BLOCKS.find(b => hour >= b.start && hour < b.end);
  return block?.label || "Morning";
}

export function formatTime(time: string | null): string {
  if (!time) return "No time set";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
