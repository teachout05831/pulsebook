"use client";

import { useState } from "react";
import { useOne, useUpdate, useDelete } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2, Send, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Invoice, InvoiceStatus, Payment } from "@/types";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, PAYMENT_METHOD_LABELS } from "@/types";

// Status badge component
function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge variant="secondary" className={INVOICE_STATUS_COLORS[status]}>
      {INVOICE_STATUS_LABELS[status]}
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

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_METHODS: { value: Payment["method"]; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  // Fetch invoice
  const { query } = useOne<Invoice>({
    resource: "invoices",
    id,
  });

  const { data: invoiceData, isLoading, isError } = query;
  const invoice = invoiceData?.data;

  // Update mutation
  const { mutate: updateInvoice, mutation } = useUpdate<Invoice>();
  const isUpdating = mutation.isPending;

  // Delete mutation
  const { mutate: deleteInvoice, mutation: deleteMutation } = useDelete<Invoice>();
  const isDeleting = deleteMutation.isPending;

  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Payment["method"]>("card");
  const [paymentNotes, setPaymentNotes] = useState("");

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    if (!invoice) return;

    updateInvoice(
      {
        resource: "invoices",
        id: invoice.id,
        values: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success(`Status updated to ${INVOICE_STATUS_LABELS[newStatus]}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update status");
        },
      }
    );
  };

  const handleRecordPayment = () => {
    if (!invoice) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    updateInvoice(
      {
        resource: "invoices",
        id: invoice.id,
        values: {
          newPayment: {
            amount,
            method: paymentMethod,
            notes: paymentNotes || null,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Payment recorded successfully");
          setPaymentDialogOpen(false);
          setPaymentAmount("");
          setPaymentNotes("");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to record payment");
        },
      }
    );
  };

  const handleMarkPaid = () => {
    if (!invoice) return;

    updateInvoice(
      {
        resource: "invoices",
        id: invoice.id,
        values: {
          newPayment: {
            amount: invoice.amountDue,
            method: "card",
            notes: "Marked as paid in full",
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Invoice marked as paid");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to mark as paid");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!invoice) return;

    deleteInvoice(
      {
        resource: "invoices",
        id: invoice.id,
      },
      {
        onSuccess: () => {
          toast.success("Invoice deleted successfully");
          router.push("/invoices");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete invoice");
        },
      }
    );
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !invoice) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/invoices")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              Invoice not found or failed to load.
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
          <Button variant="ghost" onClick={() => router.push("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-muted-foreground">{invoice.customerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <>
              <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                      Balance due: {formatCurrency(invoice.amountDue)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={invoice.amountDue}
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder={invoice.amountDue.toFixed(2)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as Payment["method"])}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Textarea
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        placeholder="Check number, reference, etc."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRecordPayment} disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Record Payment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleMarkPaid} disabled={isUpdating}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Paid
              </Button>
            </>
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
                <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete invoice {invoice.invoiceNumber}? This action cannot be undone.
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
                  {invoice.lineItems.map((item) => (
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
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Paid</span>
                    <span>-{formatCurrency(invoice.amountPaid)}</span>
                  </div>
                )}
                <div className={`flex justify-between font-bold text-lg pt-2 border-t ${invoice.amountDue > 0 ? "text-red-600" : "text-green-600"}`}>
                  <span>Balance Due</span>
                  <span>{formatCurrency(invoice.amountDue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {invoice.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{PAYMENT_METHOD_LABELS[payment.method]}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.notes || "-"}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {(invoice.notes || invoice.terms) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoice.notes && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Notes</Label>
                    <p className="whitespace-pre-wrap">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Terms</Label>
                    <p className="whitespace-pre-wrap">{invoice.terms}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                value={invoice.status}
                onValueChange={(value) => handleStatusChange(value as InvoiceStatus)}
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
              {invoice.status === "draft" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleStatusChange("sent")}
                  disabled={isUpdating}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent
                </Button>
              )}
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
                <p className="font-medium">{invoice.customerName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Issue Date</Label>
                <p>{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Due Date</Label>
                <p className={invoice.status === "overdue" ? "text-red-600 font-medium" : ""}>
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
              {invoice.address && (
                <div>
                  <Label className="text-muted-foreground text-xs">Billing Address</Label>
                  <p>{invoice.address}</p>
                </div>
              )}
              {invoice.jobId && (
                <div>
                  <Label className="text-muted-foreground text-xs">Related Job</Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push(`/jobs/${invoice.jobId}`)}
                  >
                    View Job
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
