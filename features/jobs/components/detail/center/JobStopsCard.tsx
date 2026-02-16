"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route, Map } from "lucide-react";
import { StopsEditor, useJobStops } from "@/features/job-stops";
import { RoutePreviewDialog } from "@/components/shared/RoutePreviewDialog";
import { toast } from "sonner";

const AddressMap = dynamic(() => import("@/components/shared/AddressMap").then((m) => ({ default: m.AddressMap })), { ssr: false });

interface Props {
  jobId: string;
  address: string | null;
  latitude?: number | null;
  longitude?: number | null;
  onAddressUpdate: (address: string) => void;
}

export function JobStopsCard({ jobId, address, latitude, longitude, onAddressUpdate }: Props) {
  const { stops, addStop, removeStop, updateStop, save, isLoading } = useJobStops(jobId);
  const [showRoute, setShowRoute] = useState(false);
  const didPrefill = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopsRef = useRef(stops);
  stopsRef.current = stops;
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    if (didPrefill.current || isLoading || !address) return;
    const startStop = stops.find((s) => s.stopType === "start");
    if (startStop && !startStop.address) {
      updateStop(0, "address", address);
      didPrefill.current = true;
    }
  }, [isLoading, stops, address, updateStop]);

  useEffect(() => { return () => { if (saveTimer.current) clearTimeout(saveTimer.current); }; }, []);

  const triggerAutoSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const hasContent = stopsRef.current.some((s) => s.address.trim());
      if (!hasContent) return;
      const result = await saveRef.current(jobId);
      if (result?.error) toast.error(result.error);
    }, 2000);
  }, [jobId]);

  const handleStopUpdate = useCallback((index: number, field: "address" | "notes", value: string) => {
    updateStop(index, field, value);
    if (field === "address" && stopsRef.current[index]?.stopType === "start") onAddressUpdate(value);
    triggerAutoSave();
  }, [updateStop, onAddressUpdate, triggerAutoSave]);

  const handleAddStop = useCallback(() => { addStop(); triggerAutoSave(); }, [addStop, triggerAutoSave]);
  const handleRemoveStop = useCallback((i: number) => { removeStop(i); triggerAutoSave(); }, [removeStop, triggerAutoSave]);

  const filledStops = stops.filter((s) => s.address.trim());
  const canShowRoute = filledStops.length >= 2;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Route className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[13px] font-semibold">Route Stops</span>
          </div>
          {canShowRoute && (
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setShowRoute(true)}>
              <Map className="h-3 w-3" />View Route
            </Button>
          )}
        </div>
        {latitude != null && longitude != null && !canShowRoute && (
          <div className="mb-3">
            <AddressMap pins={[{ lat: latitude, lng: longitude, color: "#3b82f6" }]} />
          </div>
        )}
        <StopsEditor
          stops={stops}
          onAddStop={handleAddStop}
          onRemoveStop={handleRemoveStop}
          onUpdateStop={handleStopUpdate}
          isLoading={isLoading}
        />
      </CardContent>
      <RoutePreviewDialog
        open={showRoute}
        onClose={() => setShowRoute(false)}
        stops={filledStops.map((s) => ({ address: s.address, stopType: s.stopType || "stop" }))}
      />
    </Card>
  );
}
