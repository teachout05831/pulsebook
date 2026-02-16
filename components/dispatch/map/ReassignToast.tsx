"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ReassignToastProps {
  message: string | null;
  onDone: () => void;
}

export function ReassignToast({ message, onDone }: ReassignToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1100] transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)` }}
    >
      <div className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        {message}
      </div>
    </div>
  );
}
