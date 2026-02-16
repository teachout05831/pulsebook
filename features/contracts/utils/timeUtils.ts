export function formatTime(iso: string | undefined): string {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function calculateHours(
  startTime?: string,
  endTime?: string,
  breakMinutes = 0
): { totalHours: number; billableHours: number } | null {
  if (!startTime || !endTime) return null
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  if (end <= start) return null
  const totalHours = (end - start) / (1000 * 60 * 60)
  const billableHours = Math.max(0, totalHours - breakMinutes / 60)
  return { totalHours, billableHours }
}
