"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import type { FC } from "react";

interface EngagementScoreProps {
  score: number;
  pageViews: number;
  totalTimeMs: number;
  hasApproved: boolean;
  hasDeclined: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function getRingColor(score: number): string {
  if (score <= 30) return "stroke-red-500";
  if (score <= 60) return "stroke-amber-500";
  return "stroke-green-500";
}

function getScoreTextColor(score: number): string {
  if (score <= 30) return "text-red-500";
  if (score <= 60) return "text-amber-500";
  return "text-green-500";
}

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const EngagementScore: FC<EngagementScoreProps> = ({
  score,
  pageViews,
  totalTimeMs,
  hasApproved,
  hasDeclined,
}) => {
  const clampedScore = useMemo(
    () => Math.max(0, Math.min(100, Math.round(score))),
    [score]
  );

  const dashOffset = useMemo(
    () => RING_CIRCUMFERENCE - (clampedScore / 100) * RING_CIRCUMFERENCE,
    [clampedScore]
  );

  const statusBadge = useMemo(() => {
    if (hasApproved)
      return {
        label: "Approved",
        className: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      };
    if (hasDeclined)
      return {
        label: "Declined",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
      };
    return {
      label: "Pending",
      className: "bg-gray-100 text-gray-600 border-gray-200",
      icon: Clock,
    };
  }, [hasApproved, hasDeclined]);

  const StatusIcon = statusBadge.icon;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        {/* Circular progress ring */}
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="8"
              className="stroke-muted"
            />
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={getRingColor(clampedScore)}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreTextColor(clampedScore)}`}>
              {clampedScore}
            </span>
          </div>
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          Engagement Score
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1">
            <Eye className="h-3.5 w-3.5" />
            {pageViews} {pageViews === 1 ? "view" : "views"}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(totalTimeMs)}
          </Badge>
          <Badge variant="outline" className={`gap-1.5 px-3 py-1 ${statusBadge.className}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {statusBadge.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
