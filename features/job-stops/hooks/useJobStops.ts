"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { JobStop, CreateJobStopInput } from "../types";

const EMPTY_START: CreateJobStopInput = { address: "", stopType: "start", stopOrder: 0 };
const EMPTY_END: CreateJobStopInput = { address: "", stopType: "end", stopOrder: 1 };

export function useJobStops(jobId?: string) {
  const [stops, setStops] = useState<CreateJobStopInput[]>([
    { ...EMPTY_START },
    { ...EMPTY_END },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const stopsRef = useRef(stops);
  stopsRef.current = stops;

  useEffect(() => {
    if (!jobId) return;
    setIsLoading(true);
    fetch(`/api/jobs/${jobId}/stops`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setStops(
            json.data.map((s: JobStop) => ({
              address: s.address,
              notes: s.notes,
              stopType: s.stopType,
              stopOrder: s.stopOrder,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [jobId]);

  const addStop = useCallback(() => {
    setStops((prev) => {
      const newStops = [...prev];
      const endIdx = newStops.findIndex((s) => s.stopType === "end");
      const newStop: CreateJobStopInput = {
        address: "",
        stopType: "stop",
        stopOrder: endIdx >= 0 ? endIdx : newStops.length - 1,
      };
      if (endIdx >= 0) {
        newStops.splice(endIdx, 0, newStop);
      } else {
        newStops.push(newStop);
      }
      return reorder(newStops);
    });
  }, []);

  const removeStop = useCallback((index: number) => {
    setStops((prev) => {
      if (prev.length <= 2) return prev;
      const newStops = prev.filter((_, i) => i !== index);
      return reorder(newStops);
    });
  }, []);

  const updateStop = useCallback((index: number, field: "address" | "notes", value: string) => {
    setStops((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }, []);

  // Use ref to always save the latest stops — avoids stale closure with debounced timers
  const save = useCallback(
    async (targetJobId: string) => {
      const res = await fetch(`/api/jobs/${targetJobId}/stops`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stops: stopsRef.current }),
      });
      return res.json();
    },
    []
  );

  return { stops, addStop, removeStop, updateStop, save, isLoading };
}

function reorder(stops: CreateJobStopInput[]): CreateJobStopInput[] {
  return stops.map((s, i) => ({ ...s, stopOrder: i }));
}
