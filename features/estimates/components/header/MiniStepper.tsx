"use client";

import { Check } from "lucide-react";
import { computeLifecycleSteps } from "./lifecycleUtils";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
}

export function MiniStepper({ estimate }: Props) {
  const steps = computeLifecycleSteps(estimate);

  return (
    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-1.5 py-1 gap-0">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center">
          {/* Dot */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
              step.state === "done"
                ? "bg-green-500 text-white"
                : step.state === "active"
                  ? "bg-blue-500 text-white shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                  : "bg-slate-200 text-slate-400"
            }`}
          >
            {step.state === "done" ? (
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            ) : (
              i + 1
            )}
          </div>
          {/* Label */}
          <span
            className={`text-[10px] font-medium mx-1.5 whitespace-nowrap ${
              step.state === "done"
                ? "text-green-700"
                : step.state === "active"
                  ? "text-blue-600"
                  : "text-slate-400"
            }`}
          >
            {step.label}
          </span>
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className={`w-3.5 h-0.5 ${
                step.state === "done" && steps[i + 1].state === "done"
                  ? "bg-green-300"
                  : step.state === "done"
                    ? "bg-gradient-to-r from-green-300 to-slate-200"
                    : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
