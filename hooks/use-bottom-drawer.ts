"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  type SnapPosition,
  type DrawerConfig,
  DEFAULT_CONFIG,
  getFullHeight,
  clampHeight,
  snapToNearest,
} from "./drawer-snap-helpers";

export function useBottomDrawer(config: Partial<DrawerConfig> & { initialCollapsed?: boolean } = {}) {
  const { initialCollapsed = true, ...rest } = config;
  const cfg = { ...DEFAULT_CONFIG, ...rest };

  // Store config in ref to keep setSnap stable
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;

  const [height, setHeight] = useState(initialCollapsed ? cfg.collapsed : cfg.half);
  const [snapPosition, setSnapPosition] = useState<SnapPosition>(initialCollapsed ? "collapsed" : "half");
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startY: 0, startHeight: 0 });
  const containerRef = useRef<HTMLElement | null>(null);

  const setSnap = useCallback((position: "collapsed" | "half" | "full") => {
    const c = cfgRef.current;
    const heights = {
      collapsed: c.collapsed,
      half: c.half,
      full: getFullHeight(containerRef.current, c.fullRatio),
    };
    setHeight(heights[position]);
    setSnapPosition(position);
  }, []);

  const handleDragStart = useCallback((clientY: number) => {
    dragRef.current = { startY: clientY, startHeight: height };
    setIsDragging(true);
  }, [height]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const dy = dragRef.current.startY - clientY;
    setHeight(clampHeight(dragRef.current.startHeight + dy, cfg.collapsed, containerRef.current, cfg.maxRatio));
  }, [isDragging, cfg.collapsed, cfg.maxRatio]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const result = snapToNearest(height, cfg, containerRef.current);
    setHeight(result.height);
    setSnapPosition(result.position);
  }, [height, cfg]);

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => { handleDragStart(e.clientY); e.preventDefault(); },
    onTouchStart: (e: React.TouchEvent) => { handleDragStart(e.touches[0].clientY); },
    onDoubleClick: () => { setSnap(snapPosition === "collapsed" ? "half" : "collapsed"); },
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientY);
    const onEnd = () => handleDragEnd();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return { height, snapPosition, isDragging, handlers, setSnap, containerRef };
}
