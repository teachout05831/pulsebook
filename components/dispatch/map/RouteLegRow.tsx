import { memo } from "react";
import { ArrowRight } from "lucide-react";

interface RouteLegRowProps {
  from: string;
  to: string;
  duration: number; // seconds
  distance: number; // meters
  index: number;
  color?: string;
}

function formatMins(s: number): string {
  const m = Math.round(s / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function formatMiles(m: number): string {
  return `${(m / 1609.344).toFixed(1)} mi`;
}

export const RouteLegRow = memo(function RouteLegRow({ from, to, duration, distance, index, color = "#3b82f6" }: RouteLegRowProps) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2 border-b border-gray-100 last:border-b-0">
      <div
        className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-xs font-medium text-gray-900 truncate">
          <span className="truncate">{from}</span>
          <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
          <span className="truncate">{to}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[13px] font-bold text-gray-900">{formatMins(duration)}</div>
        <div className="text-[10px] text-gray-400">{formatMiles(distance)}</div>
      </div>
    </div>
  );
});
