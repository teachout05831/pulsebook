"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { DispatchJob } from "@/types/dispatch";
import { MapHoverCard } from "./MapHoverCard";

interface HoverData {
  job: DispatchJob;
  color: string;
  groupLabel: string;
  num: number;
}

interface MapPopupOverlayProps {
  data: HoverData | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CARD_W = 300;
const PIN_OFFSET = 34;

export type { HoverData };

export function MapPopupOverlay({ data, onMouseEnter, onMouseLeave }: MapPopupOverlayProps) {
  const map = useMap();
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Cache the map container once
  useEffect(() => {
    containerRef.current = map.getContainer();
  }, [map]);

  // Reposition the card directly via DOM — no React state, no re-renders
  const reposition = useCallback(() => {
    const el = cardRef.current;
    const job = data?.job;
    if (!el || !job?.latitude || !job?.longitude) return;

    const pt = map.latLngToContainerPoint([job.latitude, job.longitude]);
    const cw = map.getContainer().offsetWidth;
    const cardH = el.offsetHeight;

    let left = pt.x - CARD_W / 2;
    if (left < 8) left = 8;
    if (left + CARD_W > cw - 8) left = cw - CARD_W - 8;
    const top = Math.max(5, pt.y - cardH - PIN_OFFSET);

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [map, data]);

  // Show/hide + position whenever data changes
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (data) {
      el.style.opacity = "1";
      el.style.pointerEvents = "all";
      // Position synchronously — card is already in DOM with content rendered
      requestAnimationFrame(reposition);
    } else {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    }
  }, [data, reposition]);

  // Track map move/zoom
  useEffect(() => {
    if (!data) return;
    map.on("move", reposition);
    map.on("zoom", reposition);
    return () => { map.off("move", reposition); map.off("zoom", reposition); };
  }, [map, data, reposition]);

  // Block map events from passing through card
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
  }, []);

  if (!containerRef.current) return null;

  return createPortal(
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1100,
        width: CARD_W,
        opacity: 0,
        pointerEvents: "none",
        transition: "opacity 0.12s ease",
      }}
    >
      <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {data && (
          <MapHoverCard
            job={data.job}
            color={data.color}
            groupLabel={data.groupLabel}
            number={data.num}
          />
        )}
      </div>
      {/* Arrow pointing down to pin */}
      <div style={{ width: 0, height: 0, margin: "-1px auto 0", borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "9px solid #fff", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.08))" }} />
    </div>,
    containerRef.current,
  );
}
