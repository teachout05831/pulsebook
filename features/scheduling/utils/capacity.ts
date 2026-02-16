export type CapacityStatus = 'green' | 'yellow' | 'red';

export interface CapacityResult {
  total: number;
  used: number;
  remaining: number;
  percentage: number;
  status: CapacityStatus;
}

export function getDailyCapacity(totalSlots: number, usedSlots: number): CapacityResult {
  const remaining = Math.max(0, totalSlots - usedSlots);
  const percentage = totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;
  const status: CapacityStatus = percentage >= 90 ? 'red' : percentage >= 60 ? 'yellow' : 'green';
  return { total: totalSlots, used: usedSlots, remaining, percentage, status };
}
