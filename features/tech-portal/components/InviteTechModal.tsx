"use client";

import { useState } from "react";
import { Copy, Check, Loader2, Shield, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMemberId: string;
  teamMemberName: string;
  teamMemberEmail: string;
  onSuccess?: () => void;
}

export function InviteTechModal({
  open,
  onOpenChange,
  teamMemberId,
  teamMemberName,
  teamMemberEmail,
  onSuccess,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customPassword, setCustomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInvite = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tech-portal/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamMemberId, password: customPassword || undefined }),
      });
      const json = await res.json();
      if (json.error) {
        toast.error(json.error);
        return;
      }
      setTempPassword(json.tempPassword);
      toast.success("Portal access enabled");
      onSuccess?.();
    } catch {
      toast.error("Failed to enable portal access");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!tempPassword) return;
    await navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setTempPassword(null);
    setCopied(false);
    setCustomPassword("");
    setShowPassword(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enable Portal Access
          </DialogTitle>
          <DialogDescription>
            Create a login for {teamMemberName} to access the tech portal.
          </DialogDescription>
        </DialogHeader>

        {!tempPassword ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-3 space-y-1">
              <p className="text-sm font-medium">{teamMemberName}</p>
              <p className="text-sm text-muted-foreground">
                {teamMemberEmail}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-password">Password (optional)</Label>
              <div className="relative">
                <Input
                  id="tech-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to auto-generate"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {customPassword && customPassword.length < 8 && (
                <p className="text-xs text-destructive">
                  Password must be at least 8 characters
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Set a password or leave blank to auto-generate one.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={isLoading || (customPassword.length > 0 && customPassword.length < 8)}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enable Access
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-green-800 mb-2">
                Portal access enabled!
              </p>
              <p className="text-xs text-green-700">
                Share these credentials with {teamMemberName}:
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-mono">{teamMemberEmail}</span>
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Password:</span>{" "}
                  <span className="font-mono">{tempPassword}</span>
                </p>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This password is shown only once. The tech should change it after
              first login.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
