"use client";

import { Copy, Check, Loader2, Shield, Link } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useInviteCustomer } from "../hooks/useInviteCustomer";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
  customerEmail: string;
  onSuccess?: () => void;
}

export function InviteCustomerModal({
  open, onOpenChange, customerId, customerName, customerEmail, onSuccess,
}: Props) {
  const {
    isLoading, tempPassword, copied, linkCopied, linkLoading,
    handleInvite, handleCopy, handleCopyLink, reset,
  } = useInviteCustomer(customerId, onSuccess);

  const handleClose = () => { reset(); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enable Portal Access
          </DialogTitle>
          <DialogDescription>
            Create a login for {customerName} to access the customer portal.
          </DialogDescription>
        </DialogHeader>

        {!tempPassword ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-3 space-y-1">
              <p className="text-sm font-medium">{customerName}</p>
              <p className="text-sm text-muted-foreground">{customerEmail}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              This will create a login account using their email. You will
              receive a temporary password to share with them.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleInvite} disabled={isLoading}>
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
                Share these credentials with {customerName}:
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-mono">{customerEmail}</span>
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Password:</span>{" "}
                  <span className="font-mono">{tempPassword}</span>
                </p>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-muted-foreground mb-2">
                Or send them a direct login link:
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={handleCopyLink} disabled={linkLoading}>
                {linkLoading ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : linkCopied ? (
                  <Check className="mr-2 h-3.5 w-3.5" />
                ) : (
                  <Link className="mr-2 h-3.5 w-3.5" />
                )}
                {linkCopied ? "Link Copied!" : "Copy Portal Link"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This password is shown only once. The customer can reset it via magic link.
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
