"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { DispatchTechnician } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface TechnicianAvatarProps {
  technician: DispatchTechnician;
  size?: "xs" | "sm" | "md" | "lg";
  showStatus?: boolean;
}

const sizeClasses = {
  xs: "w-5 h-5 text-[8px]",
  sm: "w-6 h-6 text-[9px]",
  md: "w-8 h-8 text-[10px]",
  lg: "w-10 h-10 text-xs",
};

export const TechnicianAvatar = memo(function TechnicianAvatar({
  technician,
  size = "md",
  showStatus = false,
}: TechnicianAvatarProps) {
  const initials = useMemo(() => technician.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2), [technician.name]);

  return (
    <div className="relative inline-flex">
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-semibold",
          sizeClasses[size]
        )}
        style={{ backgroundColor: technician.color }}
        title={technician.name}
      >
        {technician.avatarUrl ? (
          <Image
            src={technician.avatarUrl}
            alt={technician.name}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
      {showStatus && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
            technician.isAvailable ? "bg-green-500" : "bg-yellow-500"
          )}
        />
      )}
    </div>
  );
});
