"use client";

import type { IncentiveTier } from "../../types";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface IncentiveCountdownProps {
  activeTier: IncentiveTier | null;
  savingsAmount: number;
  timeRemaining: TimeRemaining | null;
  showCountdown: boolean;
  showSavings: boolean;
  isExpired: boolean;
  expiredMessage: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const pad = (n: number) => String(n).padStart(2, "0");

function getUrgencyColor(tr: TimeRemaining | null): string {
  if (!tr) return "#dc2626";
  const totalHours = tr.days * 24 + tr.hours;
  if (totalHours < 6) return "#dc2626";
  if (totalHours < 24) return "#d97706";
  return "#16a34a";
}

const ClockSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const XSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export function IncentiveCountdown({
  activeTier, savingsAmount, timeRemaining, showCountdown, showSavings, isExpired, expiredMessage,
}: IncentiveCountdownProps) {
  if (isExpired) {
    return (
      <div className="bg-gray-600 py-3 text-center text-sm text-white">
        <span className="inline-flex items-center gap-2"><XSvg /> {expiredMessage || "Special pricing has ended"}</span>
      </div>
    );
  }

  if (!timeRemaining) return null;

  return (
    <div style={{ backgroundColor: getUrgencyColor(timeRemaining) }} className="py-3 text-center text-white transition-colors duration-500">
      <div className="flex items-center justify-center gap-3 flex-wrap px-4">
        {showSavings && savingsAmount > 0 && (
          <span className="font-semibold text-sm">Save {fmt(savingsAmount)}</span>
        )}
        {showSavings && savingsAmount > 0 && showCountdown && <span className="opacity-60">|</span>}
        {showCountdown && (
          <span className="text-sm font-medium inline-flex items-center gap-1.5">
            <ClockSvg />
            {timeRemaining.days > 0 && <span>{timeRemaining.days}d</span>}
            <span>{pad(timeRemaining.hours)}h</span>
            <span>{pad(timeRemaining.minutes)}m</span>
            <span>{pad(timeRemaining.seconds)}s</span>
            <span className="opacity-80">remaining</span>
          </span>
        )}
        {activeTier?.message && (
          <span className="text-xs opacity-90 hidden sm:inline">&mdash; {activeTier.message}</span>
        )}
      </div>
    </div>
  );
}
