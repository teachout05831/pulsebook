"use client";

import { useState } from "react";
import { Send, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DispatchStatus } from "@/types/dispatch";

interface Props {
  date: string;
  status: DispatchStatus;
  crewCount: number;
  memberCount: number;
  onDispatch: () => Promise<void>;
}

function formatTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function DispatchButton({ date, status, crewCount, memberCount, onDispatch }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      await onDispatch();
    } finally {
      setIsDispatching(false);
      setIsConfirming(false);
    }
  };

  // Determine button state
  if (status.isDispatched && !status.hasChangesAfterDispatch) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="text-green-700 border-green-300 bg-green-50" disabled>
          <Check className="mr-2 h-4 w-4" />
          Dispatched at {formatTime(status.dispatchedAt)}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsConfirming(true)}>
          Re-dispatch
        </Button>
        <ConfirmDialog
          isOpen={isConfirming}
          onClose={() => setIsConfirming(false)}
          onConfirm={handleDispatch}
          isLoading={isDispatching}
          crewCount={crewCount}
          memberCount={memberCount}
          isRedispatch
        />
      </div>
    );
  }

  if (status.isDispatched && status.hasChangesAfterDispatch) {
    return (
      <>
        <Button
          variant="outline"
          className="text-amber-700 border-amber-300 bg-amber-50"
          onClick={() => setIsConfirming(true)}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Schedule Changed — Re-dispatch
        </Button>
        <ConfirmDialog
          isOpen={isConfirming}
          onClose={() => setIsConfirming(false)}
          onConfirm={handleDispatch}
          isLoading={isDispatching}
          crewCount={crewCount}
          memberCount={memberCount}
          isRedispatch
        />
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setIsConfirming(true)}>
        <Send className="mr-2 h-4 w-4" />
        Dispatch Schedule
      </Button>
      <ConfirmDialog
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={handleDispatch}
        isLoading={isDispatching}
        crewCount={crewCount}
        memberCount={memberCount}
        isRedispatch={false}
      />
    </>
  );
}

function ConfirmDialog({
  isOpen, onClose, onConfirm, isLoading, crewCount, memberCount, isRedispatch,
}: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void;
  isLoading: boolean; crewCount: number; memberCount: number; isRedispatch: boolean;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRedispatch ? "Re-dispatch Schedule?" : "Dispatch Schedule?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRedispatch
              ? "This will update the schedule for your team. They'll see the changes immediately."
              : `Dispatch today's schedule to ${crewCount} crew${crewCount !== 1 ? "s" : ""} (${memberCount} team member${memberCount !== 1 ? "s" : ""}). They'll see their jobs immediately on the tech portal.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Dispatching..." : isRedispatch ? "Re-dispatch" : "Dispatch Now"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
