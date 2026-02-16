import L from "leaflet";

/**
 * Creates a custom Leaflet DivIcon for dispatch map pins.
 * Pin is colored by crew/tech assignment with a sequential number label.
 */
export function createPinIcon(
  color: string,
  label: string,
  isSelected: boolean,
): L.DivIcon {
  const size = isSelected ? 36 : 30;
  const fontSize = isSelected ? 13 : 11;
  const border = isSelected
    ? "3px solid #fff"
    : "2px solid rgba(255,255,255,0.8)";
  const shadow = isSelected
    ? `0 2px 8px rgba(0,0,0,0.4), 0 0 0 2px ${color}`
    : "0 2px 4px rgba(0,0,0,0.3)";
  const zIndex = isSelected ? "1000" : "auto";

  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px; height:${size}px;
      background:${color};
      border:${border};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex; align-items:center; justify-content:center;
      box-shadow:${shadow};
      z-index:${zIndex};
      transition:all 0.15s ease;
    "><span style="
      transform:rotate(45deg);
      color:#fff;
      font-size:${fontSize}px;
      font-weight:700;
      font-family:system-ui,sans-serif;
      line-height:1;
    ">${label}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    tooltipAnchor: [0, -size],
  });
}
