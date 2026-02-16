"use client";
import { useRef, useCallback, useEffect } from "react";

interface UseSectionTrackingProps {
  pageId: string;
  enabled: boolean;
}

type QueuedEvent = { eventType: "section_view" | "section_scroll"; eventData: { sectionId: string; duration?: number } };
export function useSectionTracking({ pageId, enabled }: UseSectionTrackingProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const viewedRef = useRef(new Set<string>());
  const timersRef = useRef(new Map<string, number>());
  const queueRef = useRef<QueuedEvent[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elementsRef = useRef(new Map<string, HTMLDivElement>());
  const controllerRef = useRef<AbortController | null>(null);

  const flush = useCallback(() => {
    const batch = queueRef.current.splice(0); if (batch.length === 0) return;
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    fetch(`/api/estimate-pages/${pageId}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
      signal: controllerRef.current.signal,
    }).catch(() => {});
  }, [pageId]);

  const enqueue = useCallback(
    (event: QueuedEvent) => {
      queueRef.current.push(event);
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      flushTimerRef.current = setTimeout(flush, 2000);
    },
    [flush]
  );

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const sectionId = entry.target.getAttribute("data-section-id");
        if (!sectionId) continue;
        if (entry.isIntersecting) {
          if (!viewedRef.current.has(sectionId)) {
            viewedRef.current.add(sectionId);
            enqueue({ eventType: "section_view", eventData: { sectionId } });
          }
          timersRef.current.set(sectionId, Date.now());
        } else {
          const start = timersRef.current.get(sectionId);
          timersRef.current.delete(sectionId);
          if (start && Date.now() - start >= 1000) {
            enqueue({
              eventType: "section_scroll",
              eventData: { sectionId, duration: Math.round(Date.now() - start) },
            });
          }
        }
      }
    },
    [enqueue]
  );

  useEffect(() => {
    if (!enabled) return;
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    elementsRef.current.forEach((el) => observerRef.current?.observe(el));
    return () => {
      observerRef.current?.disconnect();
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      controllerRef.current?.abort();
      flush();
    };
  }, [enabled, handleIntersection, flush]);

  const trackRef = useCallback(
    (sectionId: string) => {
      if (!enabled) return () => {};
      return (el: HTMLDivElement | null) => {
        const prev = elementsRef.current.get(sectionId);
        if (prev && observerRef.current) observerRef.current.unobserve(prev);
        if (el) {
          el.setAttribute("data-section-id", sectionId);
          elementsRef.current.set(sectionId, el);
          if (observerRef.current) observerRef.current.observe(el);
        } else {
          elementsRef.current.delete(sectionId);
        }
      };
    },
    [enabled]
  );

  return { trackRef };
}
