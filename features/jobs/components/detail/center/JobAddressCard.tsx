"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { AddressInput } from "@/components/shared/AddressInput";

const AddressMap = dynamic(() => import("@/components/shared/AddressMap").then((m) => ({ default: m.AddressMap })), { ssr: false });

interface Props {
  address: string | null;
  latitude?: number | null;
  longitude?: number | null;
  onUpdate: (address: string) => void;
}

export function JobAddressCard({ address, latitude, longitude, onUpdate }: Props) {
  const [local, setLocal] = useState(address || "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { setLocal(address || ""); }, [address]);
  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const handleChange = useCallback(
    (value: string) => {
      setLocal(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onUpdate(value), 1000);
    },
    [onUpdate]
  );

  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[13px] font-semibold">Address</span>
          </div>
          {mapsUrl && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" asChild>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />Maps
              </a>
            </Button>
          )}
        </div>
        <AddressInput
          value={local}
          onChange={handleChange}
          placeholder="Enter address..."
          className="text-[13px]"
        />
        {latitude != null && longitude != null && (
          <div className="mt-3">
            <AddressMap pins={[{ lat: latitude, lng: longitude, color: "#3b82f6" }]} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
