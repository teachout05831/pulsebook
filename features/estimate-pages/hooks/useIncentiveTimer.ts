"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { IncentiveConfig, IncentiveTier } from "../types";

interface UseIncentiveTimerProps {
  incentiveConfig: IncentiveConfig | null;
  estimateTotal: number;
  publishedAt?: string | null;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseIncentiveTimerReturn {
  activeTier: IncentiveTier | null;
  nextTier: IncentiveTier | null;
  discountedTotal: number;
  savingsAmount: number;
  timeRemaining: TimeRemaining | null;
  isExpired: boolean;
  isEnabled: boolean;
}

export function computeTimeRemaining(deadline: string): TimeRemaining | null {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export function getEffectiveDeadline(tier: IncentiveTier, publishedAt?: string | null): string | null {
  if (tier.deadline) return tier.deadline;
  if (tier.deadlineMode === "absolute" && tier.absoluteDeadline) return tier.absoluteDeadline;
  if (tier.deadlineMode === "relative" && tier.relativeHours && publishedAt) {
    return new Date(new Date(publishedAt).getTime() + tier.relativeHours * 3_600_000).toISOString();
  }
  return null;
}

const DEFAULTS: UseIncentiveTimerReturn = {
  activeTier: null,
  nextTier: null,
  discountedTotal: 0,
  savingsAmount: 0,
  timeRemaining: null,
  isExpired: false,
  isEnabled: false,
};

export function useIncentiveTimer({
  incentiveConfig,
  estimateTotal,
  publishedAt,
}: UseIncentiveTimerProps): UseIncentiveTimerReturn {
  const [isExpired, setIsExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const prevKeyRef = useRef("");

  const isEnabled = Boolean(incentiveConfig?.enabled);

  const tierData = useMemo(() => {
    if (!incentiveConfig || !isEnabled) return null;

    const resolved = incentiveConfig.tiers
      .map((t) => ({ ...t, deadline: getEffectiveDeadline(t, publishedAt) }))
      .filter((t) => t.deadline);

    if (resolved.length === 0) return null;

    return resolved.sort(
      (a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    );
  }, [incentiveConfig, isEnabled, publishedAt]);

  const tick = useCallback(() => {
    if (!tierData) return;
    const now = Date.now();
    const activeIdx = tierData.findIndex((t) => new Date(t.deadline!).getTime() > now);
    if (activeIdx < 0) {
      setIsExpired(true);
      setTimeRemaining(null);
      return;
    }
    const remaining = computeTimeRemaining(tierData[activeIdx].deadline!);
    const key = remaining
      ? `${remaining.days}:${remaining.hours}:${remaining.minutes}:${remaining.seconds}`
      : "null";
    if (key !== prevKeyRef.current) {
      prevKeyRef.current = key;
      setTimeRemaining(remaining);
      setIsExpired(false);
    }
  }, [tierData]);

  useEffect(() => {
    if (!isEnabled || !tierData) return;
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [isEnabled, tierData, tick]);

  return useMemo(() => {
    if (!tierData || !isEnabled) {
      return { ...DEFAULTS, discountedTotal: estimateTotal };
    }
    if (isExpired) {
      return { ...DEFAULTS, discountedTotal: estimateTotal, isEnabled: true, isExpired: true };
    }
    const now = Date.now();
    const activeIdx = tierData.findIndex((t) => new Date(t.deadline!).getTime() > now);
    const activeTier = activeIdx >= 0 ? tierData[activeIdx] : null;
    const nextTier = activeIdx >= 0 && activeIdx + 1 < tierData.length ? tierData[activeIdx + 1] : null;

    if (!activeTier) {
      return { ...DEFAULTS, discountedTotal: estimateTotal, isEnabled: true, isExpired: true };
    }

    const discountedTotal = Math.max(
      0,
      activeTier.discountType === "percentage"
        ? estimateTotal * (1 - activeTier.discountValue / 100)
        : estimateTotal - activeTier.discountValue
    );

    return {
      activeTier,
      nextTier,
      discountedTotal,
      savingsAmount: estimateTotal - discountedTotal,
      timeRemaining,
      isExpired: false,
      isEnabled: true,
    };
  }, [tierData, isEnabled, isExpired, estimateTotal, timeRemaining]);
}
