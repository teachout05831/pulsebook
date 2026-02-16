'use client'

interface Props {
  totalHours: number
  billableHours: number
  breakHours: number
  hourlyRate?: number
}

function fmt(hours: number): string {
  return hours.toFixed(1)
}

export function TimeTrackingSummary({ totalHours, billableHours, breakHours, hourlyRate }: Props) {
  const laborCost = hourlyRate ? billableHours * hourlyRate : null

  return (
    <div className="flex items-center gap-6 px-4 py-3 bg-gray-50 rounded-b-lg border-t text-sm">
      <div>
        <span className="text-muted-foreground">Total: </span>
        <span className="font-medium">{fmt(totalHours)}h</span>
      </div>
      <div>
        <span className="text-muted-foreground">Billable: </span>
        <span className="font-medium text-green-700">{fmt(billableHours)}h</span>
      </div>
      <div>
        <span className="text-muted-foreground">Break: </span>
        <span className="font-medium">{fmt(breakHours)}h</span>
      </div>
      {laborCost !== null && (
        <div className="ml-auto">
          <span className="text-muted-foreground">Labor Cost: </span>
          <span className="font-semibold text-green-700">${laborCost.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}
