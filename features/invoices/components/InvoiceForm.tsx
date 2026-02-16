"use client";

import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInvoiceForm } from "../hooks/useInvoiceForm";

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function InvoiceForm() {
  const {
    formData, lineItems, errors, customers, isLoadingCustomers, isCreating,
    filteredJobs, subtotal, taxAmount, total, calculateLineTotal,
    handleChange, handleCustomerChange, handleJobChange,
    addLineItem, removeLineItem, updateLineItem, setTaxRate,
    handleSubmit, handleCancel,
  } = useInvoiceForm();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Invoice</h1>
          <p className="text-muted-foreground">Create a new invoice for a customer</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Line Items</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
                </div>
                {errors.lineItems && <p className="text-sm text-destructive">{errors.lineItems}</p>}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead className="w-[15%]">Qty</TableHead>
                      <TableHead className="w-[20%]">Unit Price</TableHead>
                      <TableHead className="w-[15%] text-right">Total</TableHead>
                      <TableHead className="w-[10%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.description} onChange={(e) => updateLineItem(item.id, "description", e.target.value)} placeholder="Service description" /></TableCell>
                        <TableCell><Input type="number" min="1" value={item.quantity} onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value, 10) || 0)} /></TableCell>
                        <TableCell><Input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} placeholder="0.00" /></TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(calculateLineTotal(item))}</TableCell>
                        <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} disabled={lineItems.length === 1}><Trash2 className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground items-center">
                    <span className="flex items-center gap-2">Tax (<Input type="number" min="0" step="0.1" value={formData.taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-16 h-6 text-center" />%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>{formatCurrency(total)}</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Notes & Terms</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Notes"><Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes for this invoice..." rows={3} /></FormField>
                <FormField label="Payment Terms"><Textarea name="terms" value={formData.terms} onChange={handleChange} placeholder="Payment terms..." rows={3} /></FormField>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Customer *" error={errors.customerId}>
                  <Select value={formData.customerId} onValueChange={handleCustomerChange} disabled={isLoadingCustomers}>
                    <SelectTrigger><SelectValue placeholder={isLoadingCustomers ? "Loading..." : "Select a customer"} /></SelectTrigger>
                    <SelectContent>{customers.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                  </Select>
                </FormField>
                <FormField label="Related Job">
                  <Select value={formData.jobId} onValueChange={handleJobChange}>
                    <SelectTrigger><SelectValue placeholder="Select a job (optional)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {filteredJobs.map((j) => (<SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Issue Date"><Input name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} /></FormField>
                <FormField label="Due Date"><Input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} /></FormField>
                <FormField label="Billing Address"><Input name="address" value={formData.address} onChange={handleChange} placeholder="Billing address" /></FormField>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={isCreating}>{isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Invoice</Button>
                  <Button type="button" variant="outline" className="w-full" onClick={handleCancel}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
