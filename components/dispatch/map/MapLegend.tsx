"use client";

interface MapGroup {
  key: string;
  label: string;
  color: string;
  jobs: { id: string }[];
}

interface MapLegendProps {
  groups: MapGroup[];
}

export function MapLegend({ groups }: MapLegendProps) {
  if (groups.length === 0) return null;

  return (
    <div className="absolute bottom-3 left-3 z-[1050] bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md border border-gray-200 text-[11px]">
      <div className="font-medium text-gray-500 mb-1.5">Crews</div>
      <div className="space-y-1">
        {groups.map((g) => (
          <div key={g.key} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
            <span className="text-gray-700">{g.label}</span>
            <span className="text-gray-400 ml-auto">({g.jobs.length})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
