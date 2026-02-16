import type { DispatchJob } from "@/types/dispatch";

export const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

export const statusColors: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-500",
  scheduled: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
};

export function formatHour(hour: number): string {
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour} ${ampm}`;
}

export function getWeekDays(selectedDate: Date): Date[] {
  const days: Date[] = [];
  const startOfWeek = new Date(selectedDate);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
}

export function formatDayHeader(date: Date): { day: string; date: string; isToday: boolean } {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.getDate().toString(),
    isToday,
  };
}

export function getJobPosition(job: DispatchJob): { top: number; height: number } {
  const time = job.scheduledTime || "08:00";
  const [hours, minutes] = time.split(":").map(Number);
  const duration = job.estimatedDuration || 60;

  const startHour = hours - 7 + minutes / 60;
  const durationHours = duration / 60;

  const hourHeight = 60;
  const top = Math.max(0, startHour * hourHeight);
  const height = Math.max(30, durationHours * hourHeight);

  return { top, height };
}
