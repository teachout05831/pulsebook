import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
    } else {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
}

export function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => { map.invalidateSize(); });
    observer.observe(container);
    // Fire after the 300ms drawer animation completes
    const timer = setTimeout(() => map.invalidateSize(), 350);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [map]);
  return null;
}
