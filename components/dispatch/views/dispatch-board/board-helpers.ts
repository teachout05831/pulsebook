import React from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";

export const statusConfig: Record<DispatchJob["status"], { icon: React.ReactNode; color: string; bgColor: string }> = {
  unassigned: { icon: React.createElement(AlertTriangle, { className: "w-4 h-4" }), color: "text-red-600", bgColor: "bg-red-50" },
  scheduled: { icon: React.createElement(Clock, { className: "w-4 h-4" }), color: "text-blue-600", bgColor: "bg-blue-50" },
  in_progress: { icon: React.createElement(PlayCircle, { className: "w-4 h-4" }), color: "text-yellow-600", bgColor: "bg-yellow-50" },
  completed: { icon: React.createElement(CheckCircle2, { className: "w-4 h-4" }), color: "text-green-600", bgColor: "bg-green-50" },
  cancelled: { icon: React.createElement(PauseCircle, { className: "w-4 h-4" }), color: "text-gray-500", bgColor: "bg-gray-50" },
};

export const techStatusConfig: Record<DispatchTechnician["status"], { label: string; color: string; indicator: string }> = {
  available: { label: "Available", color: "text-green-600", indicator: "bg-green-500" },
  busy: { label: "On Job", color: "text-yellow-600", indicator: "bg-yellow-500" },
  offline: { label: "Offline", color: "text-gray-500", indicator: "bg-gray-400" },
  break: { label: "On Break", color: "text-orange-500", indicator: "bg-orange-500" },
};
