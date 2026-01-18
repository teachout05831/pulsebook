"use client";

import { useState } from "react";
import { useOne, useUpdate, useDelete } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2, Send, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Estimate, EstimateStatus } from "@/types";
import { ESTIMATE_STATUS_LABELS, ESTIMATE_STATUS_COLORS } from "@/types";

// Status badge component
function StatusBadge({ status }: { status: EstimateStatus }) {
  return (
    <Badge variant="secondary" className={ESTIMATE_STATUS_COLORS[status]}>
      {ESTIMATE_STATUS_LABELS[status]}
    </Badge>
  );
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format date
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

// Loading skeleton
function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-20" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

const STATUS_OPTIONS: { value: EstimateStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
  { value: "expired", label: "Expired" },
];

export default function EstimateDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  // Fetch estimate
  const { query } = useOne<Estimate>({
    resource: "estimates",
    id,
  });

  const { data: estimateData, isLoading, isError } = query;
  const estimate = estimateData?.data;

  // Update mutation
  const { mutate: updateEstimate, mutation } = useUpdate<Estimate>();
  const isUpdating = mutation.isPending;

  // Delete mutation
  const { mutate: deleteEstimate, mutation: deleteMutation } = useDelete<Estimate>();
  const isDeleting = deleteMutation.isPending;

  // Local state for editable fields
  const [notes, setNotes] = useState<string | null>(null);
  const [terms, setTerms] = useState<string | null>(null);

  // Initialize local state when estimate loads
  if (estimate && notes === null) {
    setNotes(estimate.notes || "");
  }
  if (estimate && terms === null) {
    setTerms(estimate.terms || "");
  }

  const handleStatusChange = (newStatus: EstimateStatus) => {
    if (!estimate) return;

    updateEstimate(
      {
        resource: "estimates",
        id: estimate.id,
        values: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${ESTIMATE_STATUS_LABELS[newStatus]}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update status");
        },
      }
    );
  };

  const handleSaveNotes = () => {
    if (!estimate) return;

    updateEstimate(
      {
        resource: "estimates",
        id: estimate.id,
        values: { notes, terms },
      },
      {
        onSuccess: () => {
          toast.success("Notes updated successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update notes");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!estimate) return;

    deleteEstimate(
      {
        resource: "estimates",
        id: estimate.id,
      },
      {
        onSuccess: () => {
          toast.success("Estimate deleted successfully");
          router.push("/estimates");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete estimate");
        },
      }
    );
  };

  const handleConvertToJob = () => {
    if (!estimate) return;
    // Navigate to new job page with estimate data pre-filled
    router.push(`/jobs/new?customerId=${estimate.customerId}&fromEstimate=${estimate.id}`);
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !estimate) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/estimates")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              Estimate not found or failed to load.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/estimates")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{estimate.estimateNumber}</h1>
              <StatusBadge status={estimate.status} />
            </div>
            <p className="text-muted-foreground">{estimate.customerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {estimate.status === "approved" && (
            <Button onClick={handleConvertToJob}>
              <Briefcase className="mr-2 h-4 w-4" />
              Convert to Job
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete estimate {estimate.estimateNumber}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimate.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(estimate.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax ({estimate.taxRate}%)</span>
                  <span>{formatCurrency(estimate.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(estimate.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Notes & Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes || ""}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this estimate..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={terms || ""}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Payment terms, conditions, etc..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveNotes} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={estimate.status}
                onValueChange={(value) => handleStatusChange(value as EstimateStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quick status actions */}
              <div className="grid grid-cols-2 gap-2">
                {estimate.status === "draft" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("sent")}
                    disabled={isUpdating}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Mark Sent
                  </Button>
                )}
                {estimate.status === "sent" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("approved")}
                      disabled={isUpdating}
                      className="text-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("declined")}
                      disabled={isUpdating}
                      className="text-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">Customer</Label>
                <p className="font-medium">{estimate.customerName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Issue Date</Label>
                <p>{formatDate(estimate.issueDate)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Expiry Date</Label>
                <p>{formatDate(estimate.expiryDate)}</p>
              </div>
              {estimate.address && (
                <div>
                  <Label className="text-muted-foreground text-xs">Service Address</Label>
                  <p>{estimate.address}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
