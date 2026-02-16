import type { BusinessHours, BusinessHourSlot } from '../types';
import type { TimeSlot } from '../types/booking';

interface AvailabilityInput {
  date: string;
  businessHours: BusinessHours;
  existingBookings: Array<{ time: string; durationMinutes: number }>;
  bufferMinutes: number;
  slotIntervalMinutes: number;
  defaultDurationMinutes: number;
}

const DAY_MAP: Record<number, keyof BusinessHours> = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday',
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getAvailableSlots(input: AvailabilityInput): TimeSlot[] {
  const { date, businessHours, existingBookings, bufferMinutes, slotIntervalMinutes, defaultDurationMinutes } = input;

  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  const hours: BusinessHourSlot = businessHours[DAY_MAP[dayOfWeek]];
  if (!hours?.enabled) return [];

  const startMin = timeToMinutes(hours.start);
  const endMin = timeToMinutes(hours.end);

  const blocked = existingBookings.map(b => {
    const bStart = timeToMinutes(b.time);
    return { start: bStart - bufferMinutes, end: bStart + b.durationMinutes + bufferMinutes };
  });

  const slots: TimeSlot[] = [];
  for (let min = startMin; min + defaultDurationMinutes <= endMin; min += slotIntervalMinutes) {
    const slotEnd = min + defaultDurationMinutes;
    const isBlocked = blocked.some(b => min < b.end && slotEnd > b.start);
    const time = minutesToTime(min);
    const h = Math.floor(min / 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push({ time, label: `${dh}:${String(min % 60).padStart(2, '0')} ${ampm}`, available: !isBlocked });
  }

  return slots;
}
