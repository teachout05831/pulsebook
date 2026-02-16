export function FlatRatePricingView() {
  return (
    <div className="space-y-3">
      {/* Line Items Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2 font-medium">Description</th>
              <th className="text-right p-2 font-medium w-16">Qty</th>
              <th className="text-right p-2 font-medium w-24">Rate</th>
              <th className="text-right p-2 font-medium w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">Long distance move - 1BR apartment</td>
              <td className="text-right p-2">1</td>
              <td className="text-right p-2">$1,200.00</td>
              <td className="text-right p-2">$1,200.00</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">Packing materials</td>
              <td className="text-right p-2">1</td>
              <td className="text-right p-2">$150.00</td>
              <td className="text-right p-2">$150.00</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">Storage stop (drop-off)</td>
              <td className="text-right p-2">1</td>
              <td className="text-right p-2">$75.00</td>
              <td className="text-right p-2">$75.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="rounded-md border p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>$1,425.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>$114.00</span>
        </div>
        <div className="border-t pt-2 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold text-lg">$1,539.00</span>
        </div>
      </div>
    </div>
  )
}
