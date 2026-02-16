"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface Props {
  value: string;
  onChange: (address: string) => void;
  onCoordinates?: (lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  state?: string;
  postcode?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
}

interface Suggestion {
  label: string;     // Clean: "1517 E Bluebird Ct, Gilbert, AZ 85297"
  secondary: string; // City, State for context
  lat: string;
  lon: string;
}

// prettier-ignore
const STATE_ABBR: Record<string, string> = { Alabama:"AL",Alaska:"AK",Arizona:"AZ",Arkansas:"AR",California:"CA",Colorado:"CO",Connecticut:"CT",Delaware:"DE",Florida:"FL",Georgia:"GA",Hawaii:"HI",Idaho:"ID",Illinois:"IL",Indiana:"IN",Iowa:"IA",Kansas:"KS",Kentucky:"KY",Louisiana:"LA",Maine:"ME",Maryland:"MD",Massachusetts:"MA",Michigan:"MI",Minnesota:"MN",Mississippi:"MS",Missouri:"MO",Montana:"MT",Nebraska:"NE",Nevada:"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",Ohio:"OH",Oklahoma:"OK",Oregon:"OR",Pennsylvania:"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD",Tennessee:"TN",Texas:"TX",Utah:"UT",Vermont:"VT",Virginia:"VA",Washington:"WA","West Virginia":"WV",Wisconsin:"WI",Wyoming:"WY" };

function formatAddress(addr: NominatimAddress): { label: string; secondary: string } {
  const num = addr.house_number || "";
  const street = addr.road || "";
  const city = addr.city || addr.town || addr.village || addr.hamlet || "";
  const state = addr.state ? (STATE_ABBR[addr.state] || addr.state) : "";
  const zip = addr.postcode || "";

  const streetPart = [num, street].filter(Boolean).join(" ");
  const cityStateZip = [city, [state, zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const label = [streetPart, cityStateZip].filter(Boolean).join(", ");
  return { label: label || "Unknown address", secondary: [city, state].filter(Boolean).join(", ") };
}

export function AddressInput({ value, onChange, onCoordinates, placeholder, className }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ignoreBlur = useRef(false);

  const search = useCallback((query: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (query.length < 3) { setSuggestions([]); setShowDropdown(false); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=us`;
        const res = await fetch(url, { headers: { "User-Agent": "ServicePro/1.0" } });
        const data: NominatimResult[] = await res.json();
        const formatted = data.map((r) => {
          const { label, secondary } = formatAddress(r.address);
          return { label, secondary, lat: r.lat, lon: r.lon };
        });
        setSuggestions(formatted);
        setShowDropdown(formatted.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      }
    }, 350);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    search(e.target.value);
  }, [onChange, search]);

  const handleSelect = useCallback((s: Suggestion) => {
    onChange(s.label);
    if (onCoordinates) onCoordinates(parseFloat(s.lat), parseFloat(s.lon));
    setSuggestions([]);
    setShowDropdown(false);
  }, [onChange, onCoordinates]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1)); }
    else if (e.key === "Enter" && activeIndex >= 0) { e.preventDefault(); handleSelect(suggestions[activeIndex]); }
    else if (e.key === "Escape") { setShowDropdown(false); }
  }, [showDropdown, suggestions, activeIndex, handleSelect]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { return () => { if (searchTimer.current) clearTimeout(searchTimer.current); }; }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
        onBlur={() => { if (!ignoreBlur.current) setTimeout(() => setShowDropdown(false), 150); }}
        placeholder={placeholder || "Enter address..."}
        className={className}
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-[240px] overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 ${i === activeIndex ? "bg-slate-50" : ""}`}
              onMouseDown={() => { ignoreBlur.current = true; }}
              onClick={() => { handleSelect(s); ignoreBlur.current = false; }}
            >
              <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-slate-800 truncate">{s.label}</div>
                {s.secondary && <div className="text-[11px] text-slate-400">{s.secondary}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
