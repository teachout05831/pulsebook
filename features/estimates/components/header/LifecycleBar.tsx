"use client";

import { Check } from "lucide-react";
import { computeLifecycleSteps, type LifecycleStep } from "./lifecycleUtils";
import type { EstimateDetail } from "@/types/estimate";

interface Props {
  estimate: EstimateDetail;
}

function StepDot({ step, index }: { step: LifecycleStep; index: number }) {
  if (step.state === "done") {
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (step.state === "active") {
    return (
      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_0_4px_rgba(59,130,246,0.15)]">
        <span className="text-xs font-bold text-white">{index + 1}</span>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
      <span className="text-xs font-medium text-slate-400">{index + 1}</span>
    </div>
  );
}

function Connector({ from, to }: { from: LifecycleStep; to: LifecycleStep }) {
  const color = from.state === "done" && to.state === "done"
    ? "bg-green-400"
    : from.state === "done" && to.state === "active"
      ? "bg-blue-300"
      : "bg-slate-200";
  return <div className={`flex-1 h-0.5 ${color}`} />;
}

export function LifecycleBar({ estimate }: Props) {
  const steps = computeLifecycleSteps(estimate);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : undefined }}>
          <div className="flex flex-col items-center">
            <StepDot step={step} index={i} />
            <span className={`text-[11px] mt-1 whitespace-nowrap ${
              step.state === "done" ? "text-green-700 font-medium" :
              step.state === "active" ? "text-blue-600 font-medium" :
              "text-slate-400"
            }`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && <Connector from={step} to={steps[i + 1]} />}
        </div>
      ))}
    </div>
  );
}
